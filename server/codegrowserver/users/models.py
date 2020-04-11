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

    SEX_CHOICES = ((0, "女"), (1, "男"), (2, "未知"))

    age = models.PositiveIntegerField(blank=True, null=True, verbose_name="年龄")
    name = models.CharField(max_length=64, verbose_name="姓名")
    student_number = models.PositiveIntegerField(verbose_name="学工号", default=0)
    sex = models.SmallIntegerField(
        verbose_name="性别", default=2, choices=SEX_CHOICES
    )
    alias = models.CharField(
        max_length=64, blank=True, null=True, verbose_name="昵称"
    )
    avatar = models.CharField(
        max_length=64, blank=True, null=True, verbose_name="头像"
    )
    phone = models.CharField(
        max_length=11, null=True, blank=True, verbose_name="电话"
    )

    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "用户属性表"
        verbose_name_plural = verbose_name
        ordering = ["user_id"]
        db_table = "user_profile"


class GroupProfile(models.Model):
    group = models.OneToOneField(
        Group,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="组id",
    )
    parent_group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children_groups",
        verbose_name="父组id",
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
