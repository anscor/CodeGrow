#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-03-28 20:37:14
@LastEditors: Anscor
@LastEditTime: 2020-03-28 20:37:28
@Description: 自定义权限
"""
from graphene_django.types import ErrorType
from rest_framework.permissions import (
    IsAdminUser,
    IsAuthenticated,
    AllowAny,
    BasePermission,
)
from graphene_django_extras.mutation import DjangoSerializerMutation
from functools import update_wrapper
from django.contrib.auth.models import Group, AnonymousUser
from graphene_django_extras.utils import get_Object_or_None


def _check_permissions(info, permissions):
    if not permissions:
        return True

    if isinstance(permissions, tuple):
        permissions = list(permissions)

    if len(permissions) == 0:
        return True

    for permission in permissions:
        if not permission().has_permission(info.context, None):
            return False

    return True


def wrap_query_permission(permissions):
    def decorator(func):
        def wrapper(self, info, **kwargs):
            if not _check_permissions(info, permissions):
                return None
            return func(self, info, **kwargs)

        return update_wrapper(wrapper, func)

    return decorator


def wrap_mutate_permission(permissions):
    def decorator(func):
        def wrapper(cls, root, info, **kwargs):
            if not _check_permissions(info, permissions):
                return cls.get_errors(
                    [
                        ErrorType(
                            field="permission",
                            messages=["Permission Denied!"],
                        )
                    ]
                )
            return func(cls, root, info, **kwargs)

        return update_wrapper(wrapper, func)

    return decorator


def class_permission(permissions):
    def decorator(cls):
        old_create = cls.create
        old_update = cls.update
        old_delete = cls.delete

        @classmethod
        @wrap_mutate_permission(permissions)
        def new_create(cls, root, info, **kwargs):
            return old_create(root, info, **kwargs)

        @classmethod
        @wrap_mutate_permission(permissions)
        def new_update(cls, root, info, **kwargs):
            return old_update(root, info, **kwargs)

        @classmethod
        @wrap_mutate_permission(permissions)
        def new_delete(cls, root, info, **kwargs):
            return old_delete(root, info, **kwargs)

        cls.create = new_create
        cls.update = new_update
        cls.delete = new_delete
        return cls

    return decorator


class IsTeacherOrAdminUser(BasePermission):
    def has_permission(self, request, view):
        if not request.user:
            return False
        if isinstance(request.user, AnonymousUser):
            return False
        if request.user.is_staff:
            return True
        group = get_Object_or_None(Group, name="教师")
        if not group:
            return False
        if group in request.user.groups.all():
            return True
        return False
