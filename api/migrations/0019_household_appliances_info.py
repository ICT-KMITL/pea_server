# -*- coding: utf-8 -*-
# Generated by Django 1.10.4 on 2017-02-02 17:28
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_household_rules'),
    ]

    operations = [
        migrations.AddField(
            model_name='household',
            name='appliances_info',
            field=django.contrib.postgres.fields.jsonb.JSONField(default={}),
        ),
    ]
