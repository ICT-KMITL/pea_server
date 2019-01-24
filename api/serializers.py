from django.contrib.auth.models import User
from api.models import *

from rest_framework import serializers

from django.utils import timezone

class DateTimeFieldWihTZ(serializers.DateTimeField):
    def to_representation(self, value):
        value = timezone.localtime(value)
        return super(DateTimeFieldWihTZ, self).to_representation(value)

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'first_name', 'last_name', 'email')

class SettingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = ('url', 'id', 'name', 'value')
		
class SettingKVSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Setting
        fields = ('name', 'value')

class HouseholdListSerializer(serializers.HyperlinkedModelSerializer):
    last_updated = DateTimeFieldWihTZ(format='%d %b %Y %I:%M %p', read_only=True)
    
    class Meta:
        model = Household
        fields = ('url', 'id', 'name', 'package', 'mode', 'dr_allowed', 'last_updated')

class HouseholdSerializer(serializers.HyperlinkedModelSerializer):
    last_updated = DateTimeFieldWihTZ(format='%d %b %Y %I:%M %p', read_only=True)
    
    class Meta:
        model = Household
        fields = ('url', 'id', 'name', 'package', 'mode', 'dr_allowed', 'usage', 'appliances', 'rules', 'event_info', 'appliances_info', 'last_updated')

class NewsSerializer(serializers.HyperlinkedModelSerializer):
    last_updated = DateTimeFieldWihTZ(format='%d %b %Y %I:%M %p', read_only=True)
    
    class Meta:
        model = News
        fields = ('url', 'id', 'title', 'description', 'last_updated')

class FirmwareSerializer(serializers.HyperlinkedModelSerializer):
    last_updated = DateTimeFieldWihTZ(format='%d %b %Y %I:%M %p', read_only=True)
    
    class Meta:
        model = News
        fields = ('url', 'id', 'title', 'version', 'description', 'last_updated')
