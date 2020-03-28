#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-03-27 09:35:30
@LastEditors: Anscor
@LastEditTime: 2020-03-27 09:35:30
@Description: users模块相关serializer，仅用于添加、修改/更新操作
"""
from rest_framework import serializers

from django.contrib.auth.models import User, Group

from users.models import UserProfile, GroupProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["name", "age", "user"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get("username"),
            password=validated_data.get("password"),
        )
        email = validated_data.get("email", None)
        if email:
            user.email = email
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.get("password", None)
        email = validated_data.get("email", None)

        if password:
            instance.set_password(password)

        if email:
            instance.email = email

        instance.save()
        return instance
