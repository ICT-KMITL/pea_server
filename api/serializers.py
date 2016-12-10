from django.contrib.auth.models import User
from api.models import *

from rest_framework import serializers

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
    class Meta:
        model = Household
        fields = ('url', 'id', 'name', 'package', 'mode', 'last_update')

class HouseholdSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Household
        fields = ('url', 'id', 'name', 'package', 'mode', 'usage', 'appliances', 'last_update')