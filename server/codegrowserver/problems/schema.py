#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-08 18:40:19
@LastEditors: Anscor
@LastEditTime: 2020-04-08 18:46:06
@Description: problems模块schema
"""

from problems.models import Problem, ProblemSet
from problems.modeltypes import ProblemType, ProblemSetType

import graphene


class Query(object):
    problems = graphene.List(ProblemType, problem_set_id=graphene.Int())
    problem_sets = graphene.List(ProblemSetType, id=graphene.Int())

    def resolve_problems(self, info, **kwargs):
        return Problem.objects.filter(
            problem_set_id=kwargs.get("problem_set_id", 0)
        )
    
    def resolve_problem_sets(self, info, **kwargs):
        return ProblemSet.objects.all()
