# Generated by Django 3.0.4 on 2020-04-06 01:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_userprofile_name_pinyin'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='student_id',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='avatar',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='头像'),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='student_number',
            field=models.PositiveIntegerField(default=0, verbose_name='学工号'),
        ),
        migrations.AlterField(
            model_name='userprofile',
            name='sex',
            field=models.SmallIntegerField(choices=[(0, '女'), (1, '男'), (2, '未知')], default=2, verbose_name='性别'),
        ),
    ]
