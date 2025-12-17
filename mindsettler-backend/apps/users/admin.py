from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("Verification", {"fields": ("is_verified",)}),
    )
    list_display = ("username", "email", "is_verified", "is_staff", "is_active")
    list_filter = ("is_verified", "is_staff")