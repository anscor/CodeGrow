#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-03-27 17:14:16
@LastEditors: Anscor
@LastEditTime: 2020-03-27 17:14:17
@Description: users模块相关schema
"""
from django.contrib.auth.models import User, Group
from graphene_django_extras.mutation import DjangoSerializerMutation
from graphene_django_extras.utils import get_Object_or_None
from graphene_django.types import ErrorType

import graphene

from users.models import UserProfile, GroupProfile
from users.modeltypes import (
    UserType,
    GroupType,
)
from users.serializers import (
    UserSerializer,
    UserProfileSerializer,
    GroupProfileSerializer,
    GroupSerializer,
)
from users.permissions import (
    class_permission,
    wrap_query_permission,
    wrap_mutate_permission,
    IsAuthenticated,
    IsAdminUser,
    AllowAny,
)


class Query(object):
    """
    查询
    """

    all_user = graphene.List(UserType)
    all_group = graphene.List(GroupType)
    user = graphene.Field(UserType)

    @wrap_query_permission([IsAdminUser])
    def resolve_all_user(self, info, **kwargs):
        return User.objects.all()

    @wrap_query_permission([IsAuthenticated])
    def resolve_user(self, info, **kwargs):
        return info.context.user

    @wrap_query_permission([IsAdminUser])
    def resolve_all_group(sele, info, **kwargs):
        return Group.objects.all()


class UserMutation(DjangoSerializerMutation):
    class Meta:
        serializer_class = UserSerializer
        input_field_name = "input"
        output_field_name = "user"
        nested_fileds = ["profile"]

    @classmethod
    def create(cls, root, info, **kwargs):
        """
        @description: 创建用户
        @param {type} 
        @return: 
        """
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)

        user_ser = UserSerializer(data=data)
        ok, user = cls.save(user_ser, root, info)
        if not ok:
            return cls.get_errors(user)

        if not profile_data:
            return cls.perform_mutate(user, info)

        profile_data["user"] = user.id
        if info.context.user and (
            info.context.user.is_staff
            or info.context.user.groups.all().filter(name="教师").first()
        ):
            profile_data["creator"] = info.context.user.id
        profile_ser = UserProfileSerializer(data=profile_data)
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            user.delete()
            return cls.get_errors(profile)

        return cls.perform_mutate(user, info)

    @classmethod
    @wrap_mutate_permission([IsAuthenticated])
    def update(cls, root, info, **kwargs):
        """
        @description: 更新用户
        @param {type} 
        @return: 
        """
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)

        # 只有教师与管理员才可以修改其他用户的信息
        # 否则就算是传入了id也只能修改自己的信息
        pk = data.pop("id")
        user = info.context.user
        if user.is_staff or user.groups.all().filter(name="教师").first():
            user = get_Object_or_None(User, pk=pk)
            if not user:
                return cls.get_errors(
                    [
                        ErrorType(
                            field="id",
                            messages=[
                                "A {} obj with id: {} do not exist".format(
                                    "User", pk
                                )
                            ],
                        )
                    ]
                )
            if profile_data:
                profile_data["updater"] = user.id

        user_ser = UserSerializer(instance=user, data=data, partial=True)
        if not user_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in user_ser.errors.items()
            ]
            return cls.get_errors(errors)

        if not profile_data:
            user_ser.save()
            return cls.perform_mutate(user, info)

        profile = UserProfile.objects.filter(user_id=user.id).first()
        profile_ser = None
        if not profile:
            profile_ser = UserProfileSerializer(data=profile_data)
        else:
            profile_ser = UserProfileSerializer(
                instance=profile, data=profile_data, partial=True
            )
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            return cls.get_errors(profile)
        user_ser.save()
        return cls.perform_mutate(user, info)


@class_permission([IsAdminUser])
class GroupMutation(DjangoSerializerMutation):
    class Meta:
        serializer_class = GroupSerializer
        input_field_name = "input"
        output_field_name = "group"
        nested_fileds = ["profile"]

    @classmethod
    def create(cls, root, info, **kwargs):
        data = kwargs.get("input")
        profile_data = data.pop("profile", {})
        profile_data["creator"] = info.context.user.id

        group_ser = GroupSerializer(data=data)
        ok, group = cls.save(group_ser, root, info)
        if not ok:
            return cls.get_errors(group)

        profile_data["group"] = group.id
        profile_ser = GroupProfileSerializer(data=profile_data)
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            group.delete()
            return cls.get_errors(profile)

        return cls.perform_mutate(group, info)

    @classmethod
    def update(cls, root, info, **kwargs):
        data = kwargs.pop("input")
        profile_data = data.pop("profile", {})
        profile_data["updater"] = info.context.user.id

        pk = data.pop("id")
        group = get_Object_or_None(Group, pk=pk)
        if not group:
            return cls.get_errors(
                [
                    ErrorType(
                        field="id",
                        messages=[
                            "A {} obj with id: {} do not exist".format(
                                "Group", pk
                            )
                        ],
                    )
                ]
            )

        group_ser = GroupSerializer(instance=group, data=data, partial=True)
        if not group_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in group_ser.errors.items()
            ]
            return cls.get_errors(errors)

        profile = GroupProfile.objects.filter(group_id=group.id)
        profile_ser = GroupProfileSerializer(
            instance=profile, data=profile_data, partial=True
        )
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            return cls.get_errors(profile)

        group = group_ser.save()
        profile_ser.save()

        return cls.perform_mutate(group, info)


class Mutation(graphene.ObjectType):
    """
    更改
    """

    create_user = UserMutation.CreateField()
    update_user = UserMutation.UpdateField()
    create_group = GroupMutation.CreateField()
    update_group = GroupMutation.UpdateField()
