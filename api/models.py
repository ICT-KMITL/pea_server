from django.db import models
from django.contrib.postgres.fields import JSONField
from datetime import datetime

# Create your models here.

class Setting(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    value = models.TextField()
	
class Household(models.Model):
    name = models.TextField()
    package = models.TextField(default="")
    appliances = JSONField(default={})
    usage = JSONField(default={})
    mode = models.TextField(default="")
    last_update = models.DateTimeField(default=datetime.now)

    