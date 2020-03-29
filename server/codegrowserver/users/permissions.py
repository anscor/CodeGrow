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
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from graphene_django_extras.mutation import DjangoSerializerMutation
from functools import update_wrapper


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
