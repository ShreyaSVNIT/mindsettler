FROM python:3.10-slim

# ─────────────────────────
# Environment
# ─────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TRANSFORMERS_CACHE=/tmp/huggingface
ENV HF_HOME=/tmp/huggingface

WORKDIR /app

# ─────────────────────────
# System deps (required for torch)
# ─────────────────────────
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# ─────────────────────────
# Python deps (cached layer)
# ─────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────
# Copy project
# ─────────────────────────
COPY . .

EXPOSE 8000

# ─────────────────────────
# Gunicorn (OPTIMIZED, PRELOAD)
# ─────────────────────────
CMD ["gunicorn", "core.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "1", \
     "--threads", "1", \
     "--timeout", "120", \
     "--preload"]