#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-06 21:30:08
@LastEditors: Anscor
@LastEditTime: 2020-04-06 21:30:08
@Description: codes模块相关serializer，仅用于添加、修改/更新操作
"""

from rest_framework import serializers
from codes.models import Submission


class SubmissionSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        exclude = ["id"]
