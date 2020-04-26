#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-08 18:24:23
@LastEditors: Anscor
@LastEditTime: 2020-04-08 18:24:38
@Description: codes模块schema
"""

from rest_framework.permissions import IsAuthenticated
from clang.cindex import Index, Cursor, Config

from codes.models import Submission, CodeTextLineCmp
from codes.modeltypes import SubmissionType, CodeTextLineCmpType
from users.permissions import wrap_query_permission
from graphene_django.types import ObjectType

import graphene

class SyntaxTree:
    def __init__(self):
        self.__parent = None
        self.__children = []
        self.__cursor = None

    @classmethod
    def from_cursor(cls, root: Cursor, filename):
        assert root is not None and isinstance(root, Cursor)
        syntax_tree = SyntaxTree()
        syntax_tree.__cursor = root

        q = Queue()
        q.put(syntax_tree)
        while not q.empty():
            curr_node = q.get()
            for child in curr_node.cursor.get_children():
                if child is None:
                    continue
                f = child.location.file
                if not f or f.name != filename:
                    continue
                child_node = SyntaxTree()
                child_node.__cursor = child
                child_node.__parent = curr_node
                curr_node.__children.append(child_node)
                q.put(child_node)

        return syntax_tree

    @property
    def parent(self):
        return self.__parent

    @property
    def children(self):
        return self.__children

    @property
    def cursor(self):
        return self.__cursor

class Query(ObjectType):
    submissions = graphene.List(SubmissionType, problem_id=graphene.Int())
    code_text_cmp = graphene.List(
        CodeTextLineCmpType, submission_id=graphene.Int()
    )

    @wrap_query_permission([IsAuthenticated])
    def resolve_submissions(self, info, **kwargs):
        ss = Submission.objects.filter(user_id=info.context.user.id).order_by("-id")
        pid = kwargs.get("problem_id", None)
        if pid:
            ss = ss.filter(problem_id=pid)

        return ss

    @wrap_query_permission([IsAuthenticated])
    def resolve_code_text_cmp(self, info, **kwargs):
        # 要比较的提交id
        submission_id = kwargs.get("submission_id", None)
        if not submission_id:
            return None

        # 要比较的提交
        submission = Submission.objects.filter(
            id=submission_id, user_id=info.context.user.id
        ).first()
        if not submission:
            return None

        # 同一题目、同一用户的提交
        pre_submissions = Submission.objects.filter(
            user_id=info.context.user.id,
            id__lt=submission_id,
            problem_id=submission.problem_id,
        ).order_by("-id")

        # 现在的代码，按行分割
        new_lines = submission.code.replace("\r\n", "\n").split("\n")

        # 要返回的数据
        cmp_lines = []
        # 如果没有前一个提交则直接返回现在的代码
        if not pre_submissions:
            i = 1
            for line in new_lines:
                cmp_lines.append(
                    CodeTextLineCmp(
                        order=i,
                        new_line_number=i,
                        new_line=line,
                        new_symbol="a",
                    )
                )
                i += 1
            return cmp_lines

        pre_submission = pre_submissions.first()

        # 前一个提交的代码，按行分割
        old_lines = pre_submission.code.replace("\r\n", "\n").split("\n")

        # 通过LCS算法找出的相等行号对应
        eq_lines = Query.__lcs(old_lines, new_lines)

        # 按前一个提交行号进行排序
        eq_lines = sorted(eq_lines, key=lambda line: line["old"])

        # 旧代码、新代码上一次访问到的行数
        last_old, last_new = 0, 0
        # order计数
        i = 1

        # 依次遍历相等行
        for eq in eq_lines:
            now_old, now_new = eq["old"], eq["new"]
            # 上一次相等行与这一次相等行之间的部分
            # 先处理新旧代码都有的部分
            while last_old < now_old - 1 and last_new < now_new - 1:
                cmp_lines.append(
                    CodeTextLineCmp(
                        order=i,
                        old_line_number=last_old + 1,
                        old_line=old_lines[last_old],
                        old_symbol="d",
                        new_line_number=last_new + 1,
                        new_line=new_lines[last_new],
                        new_symbol="a",
                    )
                )
                last_old += 1
                last_new += 1
                i += 1

            # 旧代码有，新代码空白
            while last_old < now_old - 1:
                cmp_lines.append(
                    CodeTextLineCmp(
                        order=i,
                        old_line_number=last_old + 1,
                        old_line=old_lines[last_old],
                        old_symbol="d",
                    )
                )
                last_old += 1
                i += 1

            # 新代码有，旧代码空白
            while last_new < now_new - 1:
                cmp_lines.append(
                    CodeTextLineCmp(
                        order=i,
                        new_line_number=last_new + 1,
                        new_line=new_lines[last_new],
                        new_symbol="a",
                    )
                )
                last_new += 1
                i += 1

            # 添加相等行
            cmp_lines.append(
                CodeTextLineCmp(
                    order=i,
                    old_symbol="c",
                    old_line_number=last_old + 1,
                    old_line=old_lines[last_old],
                    new_symbol="c",
                    new_line_number=last_new + 1,
                    new_line=new_lines[last_new],
                )
            )
            last_old += 1
            last_new += 1
            i += 1
        
        while last_old < len(old_lines) and last_new < len(new_lines):
            cmp_lines.append(
                CodeTextLineCmp(
                    order=i,
                    old_line_number=last_old + 1,
                    old_line=old_lines[last_old],
                    old_symbol="d",
                    new_line_number=last_new + 1,
                    new_line=new_lines[last_new],
                    new_symbol="a",
                )
            )
            last_old += 1
            last_new += 1
            i += 1

        # 旧代码有，新代码空白
        while last_old < len(old_lines):
            cmp_lines.append(
                CodeTextLineCmp(
                    order=i,
                    old_line_number=last_old + 1,
                    old_line=old_lines[last_old],
                    old_symbol="d",
                )
            )
            last_old += 1
            i += 1

        # 新代码有，旧代码空白
        while last_new < len(new_lines):
            cmp_lines.append(
                CodeTextLineCmp(
                    order=i,
                    new_line_number=last_new + 1,
                    new_line=new_lines[last_new],
                    new_symbol="a",
                )
            )
            last_new += 1
            i += 1

        return cmp_lines

    def __lcs(old_lines, new_lines):
        """
        @description: LCS算法，寻找两个代码版本之间相等的部分
        @param {type} 
        @return: 
        """
        # 初始化数组
        c = []
        for i in range(0, len(old_lines) + 1):
            d = []
            for j in range(0, len(new_lines) + 1):
                d.append(0)
            c.append(d)

        # LCS动规
        for i in range(1, len(old_lines) + 1):
            for j in range(1, len(new_lines) + 1):
                if old_lines[i - 1] == new_lines[j - 1]:
                    c[i][j] = c[i - 1][j - 1] + 1
                elif c[i - 1][j] > c[i][j - 1]:
                    c[i][j] = c[i - 1][j]
                else:
                    c[i][j] = c[i][j - 1]

        # 行、列、最大长度
        i, j, l = len(old_lines), len(new_lines), c[-1][-1]
        # 相等行对应
        eq_lines = []
        # 从后向前遍历，找到相等行（即c中数据+1的部分）
        while i > 0 and j > 0:
            # 先减少列，找到最左边的、比现在长度小的列
            while j > 0 and c[i][j - 1] == l:
                j -= 1
            # 再减少行，找到最上面的、比现在长度小的行
            while i > 0 and c[i - 1][j] == l:
                i -= 1
            # 添加到结果中
            eq_lines.append({"old": i, "new": j})
            # 匹配长度为1时结束
            if c[i][j] == 1:
                break
            # 向左上方走一步
            l -= 1
            i -= 1
            j -= 1

        return eq_lines
