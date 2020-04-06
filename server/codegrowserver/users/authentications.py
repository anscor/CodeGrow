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
        if not username:
            username = ""
        email = kwargs.get("email", "")
        phone = kwargs.get("phone", "")
        student_number = kwargs.get("student_number", "-1")

        if (
            username == ""
            and password == ""
            and email == ""
            and phone == ""
            and student_number == "-1"
        ):
            return None

        user = (
            User.objects.select_related("profile")
            .filter(
                Q(username=username)
                | Q(email=email)
                | Q(profile__phone=phone)
                | Q(profile__student_number=int(student_number))
            )
            .first()
        )
        if not user:
            raise exceptions.AuthenticationFailed("未找到对应的用户！")

        if user.check_password(password):
            return user
    
        raise exceptions.AuthenticationFailed("认证失败！")
