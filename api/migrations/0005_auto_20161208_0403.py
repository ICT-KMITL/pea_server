# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-08 04:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20161208_0403'),
    ]

    operations = [
        migrations.AlterField(
            model_name='household',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
