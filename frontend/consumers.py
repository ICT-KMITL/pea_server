from django.http import HttpResponse
from channels.handler import AsgiHandler
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    groups = ["users"]

    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({'type': 'handshake'})

    def receive(self, text_data=None, bytes_data=None):
        async_to_sync(self.channel_layer.group_send)(
            "users",
            text_data
        )

    def disconnect(self, close_code):
        pass