# Generated by Django 3.0.4 on 2020-05-16 19:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0003_problem_label'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='problem',
            name='problem_id',
        ),
        migrations.RemoveField(
            model_name='problemset',
            name='problem_set_id',
        ),
    ]
