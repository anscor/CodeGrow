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

from codes.models import Submission, CodeTextLineCmp, CodeSyntaxLineCmp
from problems.modeltypes import ProblemType
from problems.models import Problem

import graphene


class SubmissionType(DjangoObjectType):

    problem = graphene.Field(ProblemType)

    def resolve_problem(self, info):
        return Problem.objects.filter(id=self.problem_id).first()

    class Meta:
        model = Submission
        exclude_fields = ["user"]


class CodeTextLineCmpType(DjangoObjectType):
    class Meta:
        model = CodeTextLineCmp
        exclude_fields = ["id"]


class CodeSyntaxLineCmp(DjangoObjectType):
    class Meta:
        model = CodeSyntaxLineCmp
        exclude_fields = ["id"]


class SubmissionStatisticsTotalType(graphene.ObjectType):
    result = graphene.String()
    count = graphene.Int()


class SubmissionStatisticsDaysType(graphene.ObjectType):
    day = graphene.String()
    accept = graphene.Int()
    total = graphene.Int()


class SubmissionStatisticsType(graphene.ObjectType):
    total = graphene.List(SubmissionStatisticsTotalType)
    days = graphene.List(SubmissionStatisticsDaysType)
