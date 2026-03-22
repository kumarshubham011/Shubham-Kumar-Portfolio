# =============================================================================
# DOCKERFILE
# =============================================================================
# Purpose: Container definition for deployment on Fly.io, Railway, etc.
#
# This creates a minimal Python container with:
# - Python 3.11 slim image (small footprint)
# - Only production dependencies
# - Non-root user for security
#
# To build locally:
#   docker build -t portfolio .
#   docker run -p 8000:8000 portfolio
# =============================================================================

# Use official Python slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

# Create non-root user for security
RUN useradd --create-home appuser

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE $PORT

# Start command
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
