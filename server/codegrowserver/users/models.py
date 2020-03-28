from django.db import models
from django.contrib.auth.models import User, Group


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="用户id",
    )
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_users",
        null=True,
        blank=True,
        verbose_name="创建者id",
    )
    updater = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="modified_users",
        null=True,
        blank=True,
        verbose_name="更新者id",
    )

    SEX_CHOICES = ((False, "女"), (True, "男"))

    age = models.PositiveIntegerField(blank=True, null=True, verbose_name="年龄")
    name = models.CharField(max_length=64, verbose_name="姓名")
    student_id = models.PositiveIntegerField(verbose_name="学号", default=0)
    sex = models.BooleanField(
        choices=SEX_CHOICES, verbose_name="性别", default=True
    )
    name_pinyin = models.CharField(max_length=64, verbose_name="姓名拼音")
    alias = models.CharField(
        max_length=64, blank=True, null=True, verbose_name="昵称"
    )

    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "用户属性表"
        verbose_name_plural = verbose_name
        ordering = ["user_id"]
        db_table = "user_profile"


class GroupProfile(models.Model):
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="profile"
    )
    creator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_groups",
        verbose_name="创建者id",
    )
    updater = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="modified_groups",
        null=True,
        blank=True,
        verbose_name="更新者id",
    )

    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "组属性表"
        verbose_name_plural = verbose_name
        ordering = ["group_id"]
        db_table = "group_profile"
