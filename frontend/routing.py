from channels.routing import route
from frontend.consumers import ChatConsumer
from django.conf.urls import url

channel_routing = [
    url(r"^chat/$", ChatConsumer),
]