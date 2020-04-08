from django.db import models
from django.contrib.auth.models import User
from problems.models import Problem


class Submission(models.Model):
    user = models.ForeignKey(
        User, models.DO_NOTHING, related_name="submit_codes"
    )
    problem = models.ForeignKey(
        Problem, models.DO_NOTHING, related_name="submissions"
    )

    # 提交代码在OJ上的运行id，用于数据迁移，成品时删除
    rid = models.IntegerField(verbose_name="运行id", null=True, blank=True)

    code = models.TextField(verbose_name="代码")
    result = models.CharField(verbose_name="结果", max_length=64)
    memory = models.IntegerField(verbose_name="使用内存")
    time = models.IntegerField(verbose_name="使用时间")
    language = models.CharField(max_length=16, verbose_name="语言")

    # 编译错误时编译器输出信息，仅在结果为Compile Error时有值
    compile_error_info = models.TextField(
        verbose_name="编译错误信息", null=True, blank=True
    )

    # 提交者ip地址
    ip = models.CharField(
        max_length=128, null=True, blank=True, verbose_name="ip地址"
    )

    submit_time = models.DateTimeField(verbose_name="提交时间", auto_now_add=True)

    class Meta:
        verbose_name = "提交"
        verbose_name_plural = verbose_name
        db_table = "submission"
