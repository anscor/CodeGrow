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
    # UserInputType,
    UserProfileType,
)
from users.serializers import UserSerializer, UserProfileSerializer


class Query(object):
    """
    @description: 查询
    @param {type} 
    @return: 
    """

    all_user = graphene.List(UserType)
    all_group = graphene.List(GroupType)

    def resolve_all_user(self, user, **kwargs):
        return User.objects.all()

    def resolve_all_group(sele, info, **kwargs):
        return Group.objects.all()


class UsersMutation(DjangoSerializerMutation):
    """
    @description: 创建用户
    @param {type} 
    @return: 
    """

    # user = graphene.Field(UserType)

    # class Arguments:
    #     input = graphene.Argument(UserInputType)

    class Meta:
        serializer_class = UserSerializer
        only_fields = ["id", "username", "password", "email", "profile"]
        input_field_name = "input"
        output_field_name = "user"
        nested_fileds = ["profile"]
        # only_fields = []

    @classmethod
    def create(cls, root, info, **kwargs):
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)

        user_ser = UserSerializer(data=data)
        ok, user = cls.save(user_ser, root, info)
        if not ok:
            return cls.get_errors(user)

        if not profile_data:
            return cls.perform_mutate(user, info)

        profile_data["user"] = user.id
        profile_ser = UserProfileSerializer(data=profile_data)
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            user.delete()
            return cls.get_errors(profile)

        return cls.perform_mutate(user, info)

    @classmethod
    def update(cls, root, info, **kwargs):
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)

        pk = data.pop("id")
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


class Mutation(graphene.ObjectType):
    """
    @description: 更改
    @param {type} 
    @return: 
    """

    create_user = UsersMutation.CreateField()
    update_user = UsersMutation.UpdateField()
    delete_user = UsersMutation.DeleteField()
    # create_user = CreateMutation.Field()
    # update_user = UpdateMutation.Field()
