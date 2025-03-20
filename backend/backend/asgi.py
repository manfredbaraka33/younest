import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack  # type: ignore # Optional, if you want fallback
from django.urls import path
from notification import consumers
from notification.middleware import TokenAuthMiddleware  # Import your custom middleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(  # Use your custom middleware here
        URLRouter(
            [
                path('ws/notifications/', consumers.NotificationConsumer.as_asgi()),
            ]
        )
    ),
})
