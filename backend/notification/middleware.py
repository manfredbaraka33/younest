from .auth import authenticate_token
from channels.auth import AuthMiddlewareStack # type: ignore

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        token = scope['query_string'].decode().split('=')[1]
        # Verify token or raise error if invalid
        user = await self.authenticate_token(token)
        scope['user'] = user
        return await self.inner(scope, receive, send)

    async def authenticate_token(self, token):
        user = authenticate_token(token)
        return user
