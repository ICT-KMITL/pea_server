from django.http import HttpResponse
from channels.handler import AsgiHandler
from channels import Group

def ws_add(message):
    Group("users").add(message.reply_channel)

def ws_message(message):
    # ASGI WebSocket packet-received and send-packet message types
    # both have a "text" key for their textual data.
    #message.reply_channel.send({
    #    "text": message.content['text'],
    #})
    Group("users").send({
         "text": message.content['text'],
    })

def ws_disconnect(message):
    Group("users").discard(message.reply_channel)