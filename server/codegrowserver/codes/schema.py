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
from clang.cindex import Index, Cursor, Config, Token
from django.conf import settings
from queue import Queue
from graphene_django.types import ObjectType
from graphene_django_extras.utils import get_Object_or_None

from codes.models import Submission, CodeTextLineCmp
from codes.modeltypes import (
    SubmissionType,
    CodeTextLineCmpType,
    CodeSyntaxLineCmp,
    SubmissionStatisticsType,
)
from users.permissions import wrap_query_permission
from users.models import User
from problems.models import Problem

import graphene
import operator
import re
import codecs


header_replace = """// C++ includes used for precompiling -*- C++ -*-

// Copyright (C) 2003-2015 Free Software Foundation, Inc.
//
// This file is part of the GNU ISO C++ Library.  This library is free
// software; you can redistribute it and/or modify it under the
// terms of the GNU General Public License as published by the
// Free Software Foundation; either version 3, or (at your option)
// any later version.

// This library is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// Under Section 7 of GPL version 3, you are granted additional
// permissions described in the GCC Runtime Library Exception, version
// 3.1, as published by the Free Software Foundation.

// You should have received a copy of the GNU General Public License and
// a copy of the GCC Runtime Library Exception along with this program;
// see the files COPYING3 and COPYING.RUNTIME respectively.  If not, see
// <http://www.gnu.org/licenses/>.

/** @file stdc++.h
 *  This is an implementation file for a precompiled header.
 */

// 17.4.1.2 Headers

// C
#ifndef _GLIBCXX_NO_ASSERT
#include <cassert>
#endif
#include <cctype>
#include <cerrno>
#include <cfloat>
#include <ciso646>
#include <climits>
#include <clocale>
#include <cmath>
#include <csetjmp>
#include <csignal>
#include <cstdarg>
#include <cstddef>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>

#if __cplusplus >= 201103L
#include <ccomplex>
#include <cfenv>
#include <cinttypes>
#include <cstdalign>
#include <cstdbool>
#include <cstdint>
#include <ctgmath>
#include <cwchar>
#include <cwctype>
#endif

// C++
#include <algorithm>
#include <bitset>
#include <complex>
#include <deque>
#include <exception>
#include <fstream>
#include <functional>
#include <iomanip>
#include <ios>
#include <iosfwd>
#include <iostream>
#include <istream>
#include <iterator>
#include <limits>
#include <list>
#include <locale>
#include <map>
#include <memory>
#include <new>
#include <numeric>
#include <ostream>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <streambuf>
#include <string>
#include <typeinfo>
#include <utility>
#include <valarray>
#include <vector>

#if __cplusplus >= 201103L
#include <array>
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <forward_list>
#include <future>
#include <initializer_list>
#include <mutex>
#include <random>
#include <ratio>
#include <regex>
#include <scoped_allocator>
#include <system_error>
#include <thread>
#include <tuple>
#include <type_traits>
#include <typeindex>
#include <unordered_map>
#include <unordered_set>
#endif
"""


class SyntaxTree:
    def __init__(self):
        self.__parent = None
        self.__children = []
        self.__cursor = None

    @classmethod
    def from_cursor(cls, root, filename="test.cpp"):
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

    def __is_in(self, token: Token):
        """
        判断token是否在self节点中
        """
        extent = self.__cursor.extent
        token_extent = token.extent
        if extent.start.line > token_extent.start.line:
            return False
        if extent.end.line < token_extent.end.line:
            return False

        # cursor与token都只有一行的情况下，再判断列关系
        if extent.start.line == extent.end.line:
            if extent.start.column > token_extent.start.column:
                return False
            if extent.end.column < token_extent.end.column:
                return False
        return True

    def find_node(self, token: Token):
        root = self.__cursor
        if not self.__is_in(token):
            return None
        for node in self.__children:
            if node.__is_in(token):
                res = node.find_node(token)
                if res is None:
                    return self
                else:
                    return res
        return self

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
    submissions = graphene.List(
        SubmissionType, user_id=graphene.Int(), problem_id=graphene.Int()
    )
    code_text_cmp = graphene.List(
        CodeTextLineCmpType,
        user_id=graphene.Int(),
        submission_id=graphene.Int(),
    )
    code_syntax_cmp = graphene.List(
        CodeSyntaxLineCmp, user_id=graphene.Int(), submission_id=graphene.Int()
    )
    submission_statistics = graphene.Field(
        SubmissionStatisticsType,
        query_users=graphene.List(graphene.Int),
        problem_id=graphene.Int(required=True),
    )

    @wrap_query_permission([IsAuthenticated])
    def resolve_submissions(self, info, **kwargs):
        user = info.context.user
        user_id = user.id
        if user.groups.all().filter(name="教师") or user.is_staff:
            user_id = kwargs.get("user_id", user_id)
        ss = Submission.objects.filter(user_id=user_id).order_by("-id")
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

        pre_submission, submission = Query.__get_submission(
            submission_id, info
        )
        if not pre_submission:
            return None

        # 现在的代码，按行分割
        new_lines = submission.code.replace("\r\n", "\n").split("\n")
        # 前一个提交的代码，按行分割
        old_lines = pre_submission.code.replace("\r\n", "\n").split("\n")

        # 要返回的数据
        cmp_lines = []
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

    @wrap_query_permission([IsAuthenticated])
    def resolve_code_syntax_cmp(self, info, **kwargs):
        # 要比较的提交id
        submission_id = kwargs.get("submission_id", None)
        if not submission_id:
            return None

        pre_submission, submission = Query.__get_submission(
            submission_id, info
        )
        # 提交不存在、两次提交中有编译错误不进行比较
        if (
            not pre_submission
            or pre_submission.result == "Compile Error"
            or submission.result == "Compile Error"
        ):
            return None

        if not Config.loaded:
            Config.set_library_file(settings.LIBCLANG_FILE)

        old_lines = pre_submission.code.replace("\r\n", "\n").split("\n")
        new_lines = submission.code.replace("\r\n", "\n").split("\n")

        old_nodes_lines, new_nodes_lines = (
            Query.__code_to_node_line(pre_submission.code),
            Query.__code_to_node_line(submission.code),
        )

        eq_lines = Query.__lcs(
            old_lines, new_lines, old_nodes_lines, new_nodes_lines
        )
        eq_lines = sorted(eq_lines, key=lambda line: line["old"])
        last_old, last_new = 0, 0
        i = 0
        cmp_lines = []
        for eq in eq_lines:
            now_old, now_new = eq["old"], eq["new"]
            while last_old < now_old - 1 and last_new < now_new - 1:
                cmp_lines.append(
                    CodeSyntaxLineCmp(
                        order=i,
                        old_line_number=last_old + 1,
                        old_line=old_lines[last_old],
                        new_line_number=last_new + 1,
                        new_line=new_lines[last_new],
                        is_same=False,
                    )
                )
                last_new += 1
                last_old += 1
                i += 1

            while last_old < now_old - 1:
                # 如果没有对应的语法节点链，则认为在语法成分上相等（主要为忽略{}）
                is_same = len(old_nodes_lines[last_old]) == 0
                cmp_lines.append(
                    CodeSyntaxLineCmp(
                        order=i,
                        old_line_number=last_old + 1,
                        old_line=old_lines[last_old],
                        is_same=is_same,
                    )
                )
                last_old += 1
                i += 1

            while last_new < now_new - 1:
                is_same = len(new_nodes_lines[last_new]) == 0
                cmp_lines.append(
                    CodeSyntaxLineCmp(
                        order=i,
                        new_line_number=last_new + 1,
                        new_line=new_lines[last_new],
                        is_same=is_same,
                    )
                )
                last_new += 1
                i += 1

            cmp_lines.append(
                CodeSyntaxLineCmp(
                    order=i,
                    old_line_number=last_old + 1,
                    old_line=old_lines[last_old],
                    new_line_number=last_new + 1,
                    new_line=new_lines[last_new],
                    is_same=True,
                )
            )
            last_old += 1
            last_new += 1
            i += 1

        while last_old < len(old_lines):
            is_same = len(old_nodes_lines[last_old]) == 0
            cmp_lines.append(
                CodeSyntaxLineCmp(
                    order=i,
                    old_line_number=last_old + 1,
                    old_line=old_lines[last_old],
                    is_same=is_same,
                )
            )
            last_old += 1
            i += 1

        while last_new < len(new_lines):
            is_same = len(new_nodes_lines[last_new]) == 0
            cmp_lines.append(
                CodeSyntaxLineCmp(
                    order=i,
                    new_line_number=last_new + 1,
                    new_line=new_lines[last_new],
                    is_same=is_same,
                )
            )
            last_new += 1
            i += 1
        return cmp_lines

    @wrap_query_permission([IsAuthenticated])
    def resolve_submission_statistics(self, info, **kwargs):
        user = info.context.user
        problem_id = kwargs.get("problem_id")
        query_users = kwargs.get("query_users", None)
        # 没有找到相应的题目
        if not get_Object_or_None(Problem, pk=problem_id):
            return None
        # 找出所有符合条件的提交
        submissions = Submission.objects.filter(problem_id=problem_id).only(
            "user_id", "result", "submit_time"
        )
        if not submissions:
            return None
        # 如果不是教师和管理员，则只能查看自己的提交
        if not user.groups.all().filter(name="教师") and not user.is_staff:
            submissions = submissions.filter(user_id=user.id)
        else:
            uids = set()
            # 传入了要查询的用户
            if query_users and len(query_users) > 0:
                uids = {
                    user.id
                    for user in User.objects.filter(
                        profile__student_number__in=query_users
                    )
                }
            else:
                uids = {user.id for user in User.objects.only("id")}

            # if not user.is_staff:
            #     us = {
            #         user.id
            #         for user in user.groups.all()
            #         .filter(name=user.profile.name)
            #         .user_set.all()
            #     }
            #     uids = uids.intersection(us)

            submissions = submissions.filter(user_id__in=uids)

        total = {}
        days = {}
        for submission in submissions:
            time = submission.submit_time.strftime("%Y-%m-%d")
            accept = int(submission.result == "Accepted")
            if time not in days.keys():
                days[time] = {"total": 1, "accept": accept}
            else:
                days[time]["total"] += 1
                days[time]["accept"] += accept

            if submission.result not in total.keys():
                total[submission.result] = 1
            else:
                total[submission.result] += 1

        total_list = [
            {"result": key, "count": value} for key, value in total.items()
        ]
        days_list = [
            {"day": key, "total": value["total"], "accept": value["accept"]}
            for key, value in days.items()
        ]

        return {"total": total_list, "days": days_list}

    def __get_submission(submission_id, info):
        user = info.context.user
        check_user = (
            not user.groups.all().filter(name="教师") and not user.is_staff
        )
        # 要比较的提交
        submission = Submission.objects.filter(id=submission_id).first()
        if not submission:
            return None, None
        
        if check_user and submission.user_id != user.id:
            return None, None

        # 同一题目、同一用户的前一个提交
        pre_submission = (
            Submission.objects.filter(
                user_id=submission.user_id,
                id__lt=submission_id,
                problem_id=submission.problem_id,
            )
            .order_by("-id")
            .first()
        )
        if not pre_submission:
            return None, None

        return pre_submission, submission

    def __code_to_node_line(code):
        def __node_lines(nodes, node_lines):
            if len(node_lines) == 0:
                return node_lines
            # 从下向上找出整个节点链
            for i in range(len(nodes)):
                node = nodes[i]
                line = node_lines[i]
                while node.parent is not None:
                    line.append(node)
                    node = node.parent

            if len(node_lines) == 1:
                return node_lines

            # 找到最近公共祖先，去除更高层次的节点
            while True:
                temp = node_lines[0]
                # 如果第1个节点只保存了1个节点（除去Token外），则跳过
                if len(temp) <= 2:
                    break
                # 假设最近公共祖先为第1个节点的最高层次节点
                temp = temp[-1]
                for line in node_lines:
                    if len(line) <= 2:
                        break
                    # 如果此节点链的当前最高层次节点类型与假设值不相等，则不能去除
                    if line[-1].cursor.kind.name != temp.cursor.kind.name:
                        break
                else:
                    # 去除每个节点链的当前最高层次节点
                    for line in node_lines:
                        line.pop()
                    continue
                # 只要有一个节点链不能去除，则退出
                break

            return node_lines

        index = Index.create()
        # 代码行
        lines = code.replace("\r\n", "\n").split("\n")
        # 替换#include<bits/stdc++.h>
        code = ""
        # 被替换的行号
        idx = 0
        for i in range(len(lines)):
            line = lines[i]
            if re.sub("\s", "", line) == "#include<bits/stdc++.h>":
                code += header_replace
                idx = i + 1
            else:
                code += line + "\n"
        # 翻译单元
        tu = index.parse("test.cpp", unsaved_files=[("test.cpp", code)])
        # 语法树
        syntax_tree = SyntaxTree.from_cursor(tu.cursor)
        # 跳过的Token
        skip_token = [c for c in ";(){}[],.:\"'"]

        nodes_lines = []

        for i in range(len(lines)):
            line = lines[i]
            # 替换后，导致行对应关系发生变化，在替换行之后的行，行号增加116
            if idx != 0 and i + 1 > idx:
                i += 116
            # 每行对应的Token
            tokens = tu.get_tokens(
                extent=tu.get_extent(
                    "test.cpp", ((i + 1, 1), (i + 1, len(line)))
                )
            )
            # Token对应的语法树节点
            nodes = []
            # Token对应的节点链
            node_lines = []
            for token in tokens:
                # 跳过
                if token.spelling in skip_token:
                    continue
                # 从语法树中找到Token对应的最底层的语法树节点
                node = syntax_tree.find_node(token)
                # 没有找到不添加
                if node is not None:
                    nodes.append(node)
                    node_lines.append([token])
            nodes_lines.append(__node_lines(nodes, node_lines))

        return nodes_lines

    def __line_eq(old_node_lines, new_node_lines):
        # 如果两条节点链长度不等，则不可能相等
        if len(old_node_lines) != len(new_node_lines):
            return False

        # 将节点链转化为字符串进行排序比较
        old_lines_str, new_lines_str = [], []
        for i in range(0, len(old_node_lines)):
            s = ""
            for j in range(1, len(old_node_lines[i])):
                s += old_node_lines[i][j].cursor.kind.name
            old_lines_str.append(s)
            s = ""
            for j in range(1, len(new_node_lines[i])):
                s += new_node_lines[i][j].cursor.kind.name
            new_lines_str.append(s)

        # 按字典序排序
        sorted(old_lines_str)
        sorted(new_lines_str)

        for i in range(0, len(old_lines_str)):
            # 如果其中某项不等，则整个节点链不相等
            if old_lines_str[i] != new_lines_str[i]:
                return False

        return True

    def __lcs(
        old_lines, new_lines, old_nodes_lines=None, new_nodes_lines=None
    ):
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
                is_eq = False
                # 纯文本对比
                if old_nodes_lines is None or new_nodes_lines is None:
                    is_eq = old_lines[i - 1] == new_lines[j - 1]
                # 语法成分对比
                else:
                    # 先尝试去除所有空白字符后的文本是否相等，不相等再进行语法成分对比
                    is_eq = re.sub("\s", "", old_lines[i - 1]) == re.sub(
                        "\s", "", new_lines[j - 1]
                    ) or Query.__line_eq(
                        old_nodes_lines[i - 1], new_nodes_lines[j - 1]
                    )
                if is_eq == True:
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
