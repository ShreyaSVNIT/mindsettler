from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import SessionRequest
from .serializers import SessionRequestSerializer
from .services import has_active_request


class MySessionRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = SessionRequest.objects.filter(user=request.user).order_by("-created_at")
        serializer = SessionRequestSerializer(qs, many=True)
        return Response(serializer.data)


class SessionRequestCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if has_active_request(request.user):
            raise ValidationError(
                "You already have an active session request."
            )

        serializer = SessionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)