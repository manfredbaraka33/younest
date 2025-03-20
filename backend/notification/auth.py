from asgiref.sync import sync_to_async
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
import jwt  # type: ignore # Assuming you're using JWT for token decoding
from django.conf import settings

# Token decoding function
def decode_token_and_get_user_id(token):
    print(f"Received token: {token}")  # Print token
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token")

# Function to fetch user synchronously with async
@sync_to_async
def authenticate_token_sync(token):
    try:
        # Decode the token to get user_id
        user_id = decode_token_and_get_user_id(token)
        
        # Dynamically get the user model
        UserModel = get_user_model()
        
        # Fetch user based on decoded user_id
        try:
            user = UserModel.objects.get(id=user_id)
        except UserModel.DoesNotExist:
            raise AuthenticationFailed("User not found.")
        
        return user
    
    except AuthenticationFailed as e:
        # Raise the exception with message if something fails
        raise e


# Async function to authenticate the token
async def authenticate_token(token):
    user = await authenticate_token_sync(token)
    return user
