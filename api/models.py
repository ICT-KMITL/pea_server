from django.db import models
from django.contrib.postgres.fields import JSONField

# Create your models here.

class Setting(models.Model):
    name = models.CharField(max_length=100, blank=False, default='')
    value = models.TextField()
	
class Household(models.Model):
    name = models.TextField()
    package = models.TextField()
    appliances = JSONField()
    usage = JSONField()
    mode = models.TextField()
    last_update = models.DateTimeField()

    