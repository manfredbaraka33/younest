import json
from channels.generic.websocket import AsyncWebsocketConsumer  # type: ignore

from .auth import authenticate_token  # Import the async authenticate_token function

class NotificationConsumer(AsyncWebsocketConsumer):
   
    async def connect(self):
        token = self.scope.get('token')  # Or wherever you get the token
        self.user = await authenticate_token(token)  # Await the token authentication
        
        # Now self.user should be a user object, not a coroutine
        self.room_group_name = f"notifications_{self.user.id}"

        # Join user's notification group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group on disconnect
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        from .models import Notification
        notification = Notification.objects.create(
            user=self.user,
            message=data['message'],
            notification_type=data['notification_type']
        )

        # Send notification to WebSocket
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_notification',
            'message': notification.message,
            'notification_type': notification.notification_type,
        })

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'notification_type': event['notification_type'],
        }))
