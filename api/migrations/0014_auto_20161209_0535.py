# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-08 22:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20161209_0515'),
    ]

    operations = [
        migrations.AlterField(
            model_name='household',
            name='last_update',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
