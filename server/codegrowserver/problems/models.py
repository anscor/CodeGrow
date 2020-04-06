from django.db import models
from django.contrib.auth.models import User


class ProblemSet(models.Model):
    creator = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name="created_problem_sets",
        verbose_name="创建者id",
    )

    # 数据导入过程中使用，成品中删除
    problem_set_id = models.CharField(
        max_length=64, null=True, blank=True, verbose_name="题目集id", unique=True
    )

    name = models.CharField(
        max_length=64, null=True, blank=True, verbose_name="题目集名称", unique=True
    )
    description = models.TextField(null=True, blank=True, verbose_name="题目集描述")

    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "题目集"
        verbose_name_plural = verbose_name
        db_table = "problem_set"


class Problem(models.Model):
    problem_set = models.ForeignKey(
        ProblemSet,
        on_delete=models.CASCADE,
        related_name="problems",
        verbose_name="题目集id",
    )

    creator = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name="created_problems",
        verbose_name="创建者id",
    )

    updater = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.DO_NOTHING,
        related_name="updated_problems",
        verbose_name="更新者id",
    )

    # 数据导入过程中使用，成品中删除
    problem_id = models.CharField(
        max_length=64, null=True, blank=True, verbose_name="题目id", unique=True
    )

    name = models.CharField(
        max_length=64, null=True, blank=True, verbose_name="题目名称"
    )
    label = models.CharField(
        max_length=16, null=True, blank=True, verbose_name="题目Label"
    )

    description = models.TextField(null=True, blank=True, verbose_name="题目描述")

    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    update_time = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "题目"
        verbose_name_plural = verbose_name
        db_table = "problem"
