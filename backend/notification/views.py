from rest_framework import viewsets 
from .models import Notification 
from .serializers import NotificationSerializer 
from rest_framework.permissions import IsAuthenticated 
from rest_framework import generics


class NotificationCreateListView(generics.ListCreateAPIView): 
    queryset = Notification.objects.all() 
    serializer_class = NotificationSerializer 
    permission_classes = [IsAuthenticated] 
    
    def get_queryset(self): 
        return self.queryset.filter(user=self.request.user).order_by('-created_at')
    
    
my_notifications=NotificationCreateListView.as_view()