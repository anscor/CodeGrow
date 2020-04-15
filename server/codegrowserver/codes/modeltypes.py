#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-08 18:26:23
@LastEditors: Anscor
@LastEditTime: 2020-04-08 18:26:23
@Description: codes模块model类型
"""

from graphene_django import DjangoObjectType

from codes.models import Submission, CodeTextLineCmp
from problems.modeltypes import ProblemType
from problems.models import Problem

import graphene


class SubmissionType(DjangoObjectType):

    problem = graphene.Field(ProblemType)

    def resolve_problem(self, info):
        return Problem.objects.filter(id=self.problem_id).first()

    class Meta:
        model = Submission
        exclude_fields = ["user", "rid"]


class CodeTextLineCmpType(DjangoObjectType):
    class Meta:
        model = CodeTextLineCmp
        exclude_fields = ["id"]