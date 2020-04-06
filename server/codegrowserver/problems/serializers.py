#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-06 19:29:31
@LastEditors: Anscor
@LastEditTime: 2020-04-06 19:29:31
@Description: problems模块相关serializers，仅用于添加、修改/更新操作
"""

from problems.models import Problem, ProblemSet
from django.contrib.auth.models import User
from rest_framework import serializers


class ProblemSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemSet
        exclude = ["id", "create_time", "update_time"]


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        exclude = ["id", "create_time", "update_time"]
