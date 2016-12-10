from django.conf.urls import url

from . import views

urlpatterns = [
#    url(r'^', views.index),
    url(r'^$', views.api_root),
	url(r'^users/$', views.UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='user-detail'),
	url(r'^households/$', views.HouseholdList.as_view(), name='household-list'),
    url(r'^households/(?P<pk>[0-9]+)/$', views.HouseholdDetail.as_view(), name='household-detail'),
	url(r'^settings/$', views.SettingList.as_view(), name='setting-list'),
    url(r'^settings/(?P<pk>[0-9]+)/$', views.SettingDetail.as_view(), name='setting-detail'),
	url(r'^settingsKV/$', views.SettingKV.as_view(), name='setting-kv'),
]