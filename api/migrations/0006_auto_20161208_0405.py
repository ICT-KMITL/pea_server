# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-08 04:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20161208_0403'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userpackage',
            name='household',
        ),
        migrations.RemoveField(
            model_name='household',
            name='abnormal_event',
        ),
        migrations.RemoveField(
            model_name='household',
            name='dsm_service',
        ),
        migrations.RemoveField(
            model_name='household',
            name='electricity_rate',
        ),
        migrations.AddField(
            model_name='household',
            name='package',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='UserPackage',
        ),
    ]
