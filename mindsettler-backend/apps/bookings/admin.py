from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import SessionRequest


@admin.register(SessionRequest)
class SessionRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "requested_slot", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("user__username",)