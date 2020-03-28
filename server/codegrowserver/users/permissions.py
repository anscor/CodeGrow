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
from functools import update_wrapper

from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny


def _check_permissions(info, permissions):
    if not permissions or len(permissions) == 0:
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


def wrap_mutate_permission(permissions, validated_permission=True):
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
