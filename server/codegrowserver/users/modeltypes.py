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
    用户属性类型
    """

    class Meta:
        model = UserProfile
        exclude_fields = ["id", "user", "creator", "updater"]


class UserProfileCreateType(DjangoInputObjectType):
    """
    用户属性创建类型
    """

    class Meta:
        model = UserProfile
        exclude_fields = [
            "id",
            "user",
            "creator",
            "updater",
            "create_time",
            "update_time",
        ]


class UserProfileUpdateType(DjangoInputObjectType):
    """
    用户属性更新类型
    """

    class Meta:
        model = UserProfile
        exclude_fields = [
            "id",
            "user",
            "creator",
            "updater",
            "create_time",
            "update_time",
        ]
        input_for = "update"


class UserType(DjangoObjectType):
    """
    用户类型
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
    """
    用户创建类型
    """

    profile = graphene.Field(UserProfileCreateType)

    class Meta:
        model = User
        only_fields = ["username", "email", "profile", "password"]


class UserUpdateType(DjangoInputObjectType):
    """
    用户更新类型
    """

    profile = graphene.Field(UserProfileUpdateType)

    class Meta:
        model = User
        only_fields = ["id", "username", "email", "profile", "password"]
        input_for = "update"


class GroupProfileType(DjangoObjectType):
    """
    组属性类型
    """

    class Meta:
        model = GroupProfile
        exclude_fields = ["creator", "updater", "id", "group"]


class GroupProfileCreateType(DjangoInputObjectType):
    """
    组属性创建类型
    """

    class Meta:
        model = GroupProfile
        exclude_fields = [
            "creator",
            "updater",
            "id",
            "group",
            "create_time",
            "update_time",
        ]


class GroupProfileUpdateType(DjangoInputObjectType):
    """
    组属性更新类型
    """

    class Meta:
        model = GroupProfile
        exclude_fields = [
            "creator",
            "updater",
            "id",
            "group",
            "create_time",
            "update_time",
        ]
        input_for = "update"


class GroupType(DjangoObjectType):
    """
    组类型
    """

    profile = graphene.Field(GroupProfileType)

    def resolve_profile(self, info):
        # 如果没有profile则返回None
        if not hasattr(self, "profile"):
            return None
        return self.profile

    class Meta:
        model = Group
        only_fields = ["id", "name", "profile"]


class GroupCreateType(DjangoInputObjectType):
    """
    组创建类型
    """

    profile = graphene.Field(GroupProfileCreateType)

    class Meta:
        model = Group
        only_fields = ["name", "profile"]


class GroupUpdateType(DjangoInputObjectType):
    """
    组更新类型
    """

    profile = graphene.Field(GroupProfileCreateType)

    class Meta:
        model = Group
        only_fields = ["id", "name", "profile"]
        input_for = "update"
