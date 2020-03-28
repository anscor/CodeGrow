#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-03-24 21:39:30
@LastEditors: Anscor
@LastEditTime: 2020-03-24 21:39:30
@Description: users模块GraphQL类型定义
"""
from graphene_django_extras.types import DjangoObjectType
from graphene_django_extras.types import DjangoInputObjectType

from users.models import UserProfile, GroupProfile
from django.contrib.auth.models import User, Group
import graphene


class UserProfileType(DjangoObjectType):
    """
    @description: 用户属性类型
    @param {type} 
    @return: 
    """

    class Meta:
        model = UserProfile
        exclude_fields = ["id", "user", "creator", "modifier"]


class UserProfileCreateType(DjangoInputObjectType):
    class Meta:
        model = UserProfile
        exclude_fields = [
            "id",
            "user",
            "creator",
            "modifier",
            "create_time",
            "update_time",
        ]


class UserProfileUpdateType(DjangoInputObjectType):
    class Meta:
        model = UserProfile
        exclude_fields = [
            "id",
            "user",
            "creator",
            "modifier",
            "create_time",
            "update_time",
        ]
        input_for = "update"


class UserType(DjangoObjectType):
    """
    @description: 用户类型
    @param {type} 
    @return: 
    """

    profile = graphene.Field(UserProfileType)

    def resolve_profile(self, info):
        # 如果没有profile则返回None
        if not hasattr(self, "profile"):
            return None
        return self.profile

    class Meta:
        model = User
        only_fields = ["id", "username", "email", "profile"]


class UserCreateType(DjangoInputObjectType):
    profile = graphene.Field(UserProfileCreateType)

    class Meta:
        model = User
        only_fields = ["username", "email", "profile", "password"]


class UserUpdateType(DjangoInputObjectType):
    profile = graphene.Field(UserProfileUpdateType)

    class Meta:
        model = User
        only_fields = ["id", "username", "email", "profile", "password"]
        input_for = "update"


class GroupProfileType(DjangoObjectType):
    """
    @description: 组属性类型
    @param {type} 
    @return: 
    """

    class Meta:
        model = GroupProfile
        exclude_fields = ["create_time", "update_time", "id", "group"]


class GroupType(DjangoObjectType):
    """
    @description: 组类型
    @param {type} 
    @return: 
    """

    profile = graphene.Field(GroupProfileType)

    def resolve_profile(self, info):
        return self.profile

    class Meta:
        model = Group
        only_fields = ["id", "name"]
