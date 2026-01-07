"""
Django settings for core project.
Production-safe configuration for Render deployment.
"""

from pathlib import Path
import os

# ─────────────────────────
# BASE DIR
# ─────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ─────────────────────────
# SECURITY
# ─────────────────────────
SECRET_KEY = os.environ.get(
    "SECRET_KEY",
    "unsafe-dev-secret-change-this"
)

DEBUG = False

ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    ".onrender.com",   # IMPORTANT for Render
]

# ─────────────────────────
# APPLICATIONS
# ─────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "corsheaders",

    # Local
    "api",
]

# ─────────────────────────
# MIDDLEWARE
# ─────────────────────────
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# ─────────────────────────
# CORS (Frontend-safe)
# ─────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

# ─────────────────────────
# URL / WSGI
# ─────────────────────────
ROOT_URLCONF = "core.urls"

WSGI_APPLICATION = "core.wsgi.application"

# ─────────────────────────
# TEMPLATES
# ─────────────────────────
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ─────────────────────────
# DATABASE (Not required for chatbot)
# ─────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ─────────────────────────
# PASSWORD VALIDATION
# ─────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ─────────────────────────
# INTERNATIONALIZATION
# ─────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ─────────────────────────
# STATIC FILES
# ─────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"