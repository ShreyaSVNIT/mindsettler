FROM python:3.10-slim

# ─────────────────────────
# Environment
# ─────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# HuggingFace / SentenceTransformers cache
ENV HF_HOME=/models
ENV TRANSFORMERS_CACHE=/models
ENV SENTENCE_TRANSFORMERS_HOME=/models

WORKDIR /app

# ─────────────────────────
# System deps (minimal & safe)
# ─────────────────────────
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# ─────────────────────────
# Install Python dependencies (cached layer)
# ─────────────────────────
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────
# Pre-download ML model (build-time)
# ─────────────────────────
RUN python - <<EOF
from sentence_transformers import SentenceTransformer
SentenceTransformer("all-MiniLM-L6-v2")
print("SentenceTransformer model cached successfully")
EOF

# ─────────────────────────
# Copy project files
# ─────────────────────────
COPY . .

EXPOSE 8000

# ─────────────────────────
# Gunicorn (PRODUCTION SAFE)
# ─────────────────────────
CMD ["gunicorn", "core.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "1", \
     "--threads", "1", \
     "--timeout", "120", \
     "--preload"]