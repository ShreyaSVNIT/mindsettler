FROM python:3.10-slim

# ─────────────────────────
# Environment
# ─────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TRANSFORMERS_CACHE=/app/.hf_cache
ENV HF_HOME=/app/.hf_cache

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
# Preload HuggingFace model (avoid cold download)
# ─────────────────────────
RUN python - <<EOF
from sentence_transformers import SentenceTransformer
SentenceTransformer("all-MiniLM-L6-v2")
print("HuggingFace model cached")
EOF

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