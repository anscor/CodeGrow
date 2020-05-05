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
    IsTeacherOrAdminUser,
    AllowAny,
)
from problems.models import Problem
from codes.models import Submission


def __fill_error(field, msg):
    return [ErrorType(field=field, messages=[msg],)]


class Query(object):
    """
    查询
    """

    all_user = graphene.List(
        UserType, user_id=graphene.Int(), problem_id=graphene.Int()
    )
    all_group = graphene.List(GroupType)
    user = graphene.Field(UserType)

    @wrap_query_permission([IsTeacherOrAdminUser])
    def resolve_all_user(self, info, **kwargs):
        problem_id = kwargs.get("problem_id", None)
        users = User.objects.all()
        user = info.context.user

        # 如果是教师，则根据此教师的组进行过滤
        if user.groups.all().filter(name="教师").first():
            if not hasattr(user, "profile"):
                return None
            g = get_Object_or_None(Group, name=user.profile.name)
            if not g:
                return None

            uids = {user.id for user in g.user_set.all()}
            users = users.filter(id__in=uids)

        if problem_id:
            problem = get_Object_or_None(Problem, id=problem_id)
            if not problem:
                return None
            uids = {
                submission.user_id for submission in problem.submissions.all()
            }
            users = users.filter(id__in=uids)

        return users

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
        profile_data = data.pop("profile", {})

        # 只有教师与管理员才可以修改其他用户的信息
        # 否则就算是传入了id也只能修改自己的信息
        pk = data.pop("id")
        user = info.context.user
        if user.is_staff or user.groups.all().filter(name="教师").first():
            user = get_Object_or_None(User, pk=pk)
            if not user:
                return cls.get_errors(__fill_error("id", "用户不存在！"))

            if user.groups.all().filter(name="教师").first():
                user = info.context.user

            profile_data["updater"] = user.id

        user_ser = UserSerializer(instance=user, data=data, partial=True)
        if not user_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in user_ser.errors.items()
            ]
            return cls.get_errors(errors)

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

    @classmethod
    @wrap_mutate_permission([IsAdminUser])
    def delete(cls, root, info, **kwargs):
        return super().delete(root, info, **kwargs)


@class_permission([IsAdminUser])
class TeacherMutation(DjangoSerializerMutation):
    class Meta:
        serializer_class = UserSerializer
        input_field_name = "input"
        output_field_name = "user"
        nested_fileds = ["profile"]

    @classmethod
    def create(cls, root, info, **kwargs):
        """
        @description: 创建教师
        @param {type} 
        @return: 
        """
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)
        if profile_data is None:
            return cls.get_errors("没有传入profile！")
        if profile_data.get("name", None) is None:
            return cls.get_errors("没有传入name！")
        tg = get_Object_or_None(Group, name="教师")
        if not tg:
            return cls.get_errors("没有教师组！")

        # 创建用户
        user_ser = UserSerializer(data=data)
        ok, user = cls.save(user_ser, root, info)
        if not ok:
            return cls.get_errors(user)

        profile_data["user"] = user.id
        profile_data["creator"] = info.context.user.id
        # 创建对应profile
        profile_ser = UserProfileSerializer(data=profile_data)
        ok, profile = cls.save(profile_ser, root, info)
        if not ok:
            user.delete()
            return cls.get_errors(profile)
        # 创建对应组
        group_ser = GroupSerializer(data={"name": profile_data.get("name")})
        ok, group = cls.save(group_ser, root, info)
        if not ok:
            profile.delete()
            user.delete()
            return cls.get_errors(group)

        # 创建对应组profile
        gp_ser = GroupProfileSerializer(
            data={
                "creator": info.context.user.id,
                "group": group.id,
                "parent_group": tg.id,
            }
        )
        ok, gp = cls.save(gp_ser, root, info)
        if not ok:
            profile.delete()
            user.delete()
            group.delete()
            return cls.get_errors(gp)

        user.groups.add(group)
        user.groups.add(tg)

        return cls.perform_mutate(user, info)

    @classmethod
    def update(cls, root, info, **kwargs):
        data = kwargs.get("input")
        profile_data = data.pop("profile", None)

        data = kwargs.get("input")
        profile_data = data.pop("profile", {})

        # 只有教师才可以修改其他用户的信息
        # 否则就算是传入了id也只能修改自己的信息
        pk = data.pop("id")
        user = info.context.user
        if user.is_staff:
            user = get_Object_or_None(User, pk=pk)
            if not user:
                return cls.get_errors(__fill_error("id", "用户不存在！"))

            if user.is_staff:
                user = info.context.user

            profile_data["updater"] = user.id

        # 如果更改了name属性，则先检查组内是否有同名组
        name = profile_data.get("name", None)
        if name:
            if get_Object_or_None(group, name=name):
                return cls.get_errors(__fill_error("name", "已经存在同名组：" + name))

        user_ser = UserSerializer(instance=user, data=data, partial=True)
        if not user_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in user_ser.errors.items()
            ]
            return cls.get_errors(errors)

        group = user.groups.all().filter(name=user.profile.name).first()
        group_ser = GroupSerializer(
            instance=group, data={"name": name}, partial=True
        )
        if not group_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in group_ser.errors.items()
            ]
            return cls.get_errors(errors)

        gp_ser = GroupProfileSerializer(
            instance=group.profile, data={}, partial=True
        )
        if not gp_ser.is_valid():
            errors = [
                ErrorType(field=key, messages=value)
                for key, value in gp_ser.errors.items()
            ]
            return cls.get_errors(errors)

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
        group_ser.save()
        gp_ser.save()
        return cls.perform_mutate(user, info)

    @classmethod
    def delete(cls, root, info, **kwargs):
        user = get_Object_or_None(User, pk=kwargs["id"])
        group = None
        if user:
            group = user.groups.all().filter(name=user.profile.name).first()
        result = super().delete(root, info, **kwargs)
        if not result.ok:
            return result
        if group:
            group.delete()

        return result


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
    delete_user = UserMutation.DeleteField()
    create_teacher = TeacherMutation.CreateField()
    update_teacher = TeacherMutation.UpdateField()
    delete_teacher = TeacherMutation.DeleteField()
    create_group = GroupMutation.CreateField()
    update_group = GroupMutation.UpdateField()
