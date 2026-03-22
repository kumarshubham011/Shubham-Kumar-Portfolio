# =============================================================================
# PROCFILE
# =============================================================================
# Purpose: Define process types for deployment platforms.
#
# Render, Heroku, and Railway use this file to know how to start your app.
# The "web" process type handles HTTP requests.
# =============================================================================

web: uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
