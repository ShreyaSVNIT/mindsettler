from django.urls import path
from .views import MindSettlerChat

urlpatterns = [
    path('chat/', MindSettlerChat.as_view(), name='chatbot_api'),
]