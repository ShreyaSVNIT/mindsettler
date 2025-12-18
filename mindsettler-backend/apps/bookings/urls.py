from django.urls import path
from .views import MySessionRequestsView, SessionRequestCreateView

urlpatterns = [
    path("my-requests/", MySessionRequestsView.as_view()),
    path("request/", SessionRequestCreateView.as_view()),
]