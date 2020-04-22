#!python3
# -*- coding: utf-8 -*-
"""
@Author: Anscor
@Date: 2020-04-22 20:52:52
@LastEditors: Anscor
@LastEditTime: 2020-04-22 20:53:13
@Description: file content
"""
from .default import *

DEBUG = False
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "graphene_django",
    # 跨域问题
    "corsheaders",
    "users.apps.UsersConfig",
    "problems.apps.ProblemsConfig",
    "codes.apps.CodesConfig",
]


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "OPTIONS": {"read_default_file": "conf/database.cnf",}
    }
}
