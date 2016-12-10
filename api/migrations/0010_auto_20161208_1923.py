# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-08 19:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20161208_1416'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='appliance',
            name='household',
        ),
        migrations.RemoveField(
            model_name='appliancelog',
            name='household',
        ),
        migrations.RemoveField(
            model_name='inverterlog',
            name='household',
        ),
        migrations.RemoveField(
            model_name='rule',
            name='household',
        ),
        migrations.DeleteModel(
            name='Appliance',
        ),
        migrations.DeleteModel(
            name='ApplianceLog',
        ),
        migrations.DeleteModel(
            name='InverterLog',
        ),
        migrations.DeleteModel(
            name='Rule',
        ),
    ]