# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2016-12-08 19:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_auto_20161208_1923'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Test',
        ),
    ]