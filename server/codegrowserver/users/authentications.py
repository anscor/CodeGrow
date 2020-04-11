#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-06 10:15:47
@LastEditors: Anscor
@LastEditTime: 2020-04-06 10:15:48
@Description: 验证类
"""

from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import exceptions


class UserModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email", None)
        phone = kwargs.get("phone", None)
        student_number = kwargs.get("student_number", None)

        if (
            not username and not email and not phone and not student_number
        ) or not password:
            return None

        users = User.objects.select_related("profile").all()

        if username:
            user = users.filter(username=username).first()
        elif student_number:
            user = users.filter(student_number=student_number).first()
        elif email:
            user = users.filter(email=email).first()
        else:
            user = users.filter(phone=phone).first()

        if not user:
            raise exceptions.AuthenticationFailed("未找到对应的用户！")

        if user.check_password(password):
            return user

        raise exceptions.AuthenticationFailed("认证失败！")
