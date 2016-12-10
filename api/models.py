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
    dr_allowed = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ('id',)

class News(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField(default="")
    mode = models.TextField(default="")
    last_updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ('id',)

