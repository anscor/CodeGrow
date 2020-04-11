#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-08 18:30:36
@LastEditors: Anscor
@LastEditTime: 2020-04-08 18:30:36
@Description: problems模块model类型
"""

from graphene_django import DjangoObjectType

from problems.models import Problem, ProblemSet

import graphene


class ProblemSetType(DjangoObjectType):
    class Meta:
        model = ProblemSet
        exclude_fields = ["creator", "problem_set_id"]


class ProblemType(DjangoObjectType):
    problem_set = graphene.Field(ProblemSetType)
    
    def resolve_problem_set(self, info):
        ps = ProblemSet.objects.filter(id=self.problem_set_id).first()
        if not ps:
            return None
        
        return ps

    class Meta:
        model = Problem
        exclude_fields = ["creator", "updater", "problem_id"]
