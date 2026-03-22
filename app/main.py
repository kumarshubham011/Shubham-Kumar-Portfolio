"""
=============================================================================
MAIN APPLICATION
=============================================================================
Purpose: FastAPI application entry point.

This is where everything comes together:
- FastAPI app is created and configured
- Routers are registered
- Templates and static files are set up
- Database is initialized

To run the application:
    uvicorn app.main:app --reload

For production:
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
=============================================================================
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.config import settings
from app.database import init_db
from app.routes import pages_router, auth_router, admin_router
from app.services.markdown import markdown_filter, estimate_reading_time


# =============================================================================
# PATHS
# =============================================================================

# Get the app directory (where this file lives)
APP_DIR = Path(__file__).parent

# Template and static directories
TEMPLATES_DIR = APP_DIR / "templates"
STATIC_DIR = APP_DIR / "static"


# =============================================================================
# LIFESPAN (STARTUP/SHUTDOWN)
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.

    This function runs:
    - Before the app starts accepting requests (startup)
    - After the app stops accepting requests (shutdown)

    We use it to:
    - Initialize the database
    - Set up any required resources
    """
    # -------------------------------------------------------------------------
    # STARTUP
    # -------------------------------------------------------------------------
    print("🚀 Starting Portfolio Application...")

    # Initialize database (creates tables if needed)
    init_db()

    # Set up Jinja2 templates
    templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

    # Add custom filters to Jinja2
    # Filters can be used in templates: {{ content | markdown }}
    templates.env.filters["markdown"] = markdown_filter
    templates.env.filters["reading_time"] = estimate_reading_time

    # Store templates in app state (accessible in routes)
    app.state.templates = templates

    print("✅ Application ready!")

    # Yield control to the application
    yield

    # -------------------------------------------------------------------------
    # SHUTDOWN
    # -------------------------------------------------------------------------
    print("👋 Shutting down...")


# =============================================================================
# CREATE APP
# =============================================================================

app = FastAPI(
    title="Portfolio",
    description="A minimalist personal portfolio website",
    version="1.0.0",
    lifespan=lifespan,
    # Disable docs in production (uncomment for security)
    # docs_url=None if not settings.DEBUG else "/docs",
    # redoc_url=None if not settings.DEBUG else "/redoc",
)


# =============================================================================
# STATIC FILES
# =============================================================================

# Mount static files directory
# This serves CSS, JS, images at /static/...
app.mount(
    "/static",
    StaticFiles(directory=str(STATIC_DIR)),
    name="static"
)


# =============================================================================
# ROUTERS
# =============================================================================

# Include all routers
# Each router handles a group of related routes

# Public pages (/, /about, /projects, /blog, /contact)
app.include_router(pages_router)

# Authentication (/auth/login, /auth/logout)
app.include_router(auth_router)

# Admin panel (/admin/...)
app.include_router(admin_router)


# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    """
    Custom 404 error page.

    Shows a friendly error message instead of plain text.
    """
    templates = request.app.state.templates
    return templates.TemplateResponse(
        "pages/404.html",
        {
            "request": request,
            "site_name": settings.SITE_NAME,
        },
        status_code=404
    )


@app.exception_handler(500)
async def server_error_handler(request: Request, exc):
    """
    Custom 500 error page.

    Shows a friendly error message for server errors.
    """
    templates = request.app.state.templates
    return templates.TemplateResponse(
        "pages/500.html",
        {
            "request": request,
            "site_name": settings.SITE_NAME,
        },
        status_code=500
    )


# =============================================================================
# HEALTH CHECK
# =============================================================================

@app.get("/health", include_in_schema=False)
async def health_check():
    """
    Health check endpoint for deployment platforms.

    Used by Render, Railway, etc. to verify the app is running.
    """
    return {"status": "healthy"}


# =============================================================================
# DEVELOPMENT SERVER
# =============================================================================

if __name__ == "__main__":
    # This block runs when you execute: python app/main.py
    # For development only - use uvicorn directly in production
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8080,
        reload=True,  # Auto-reload on code changes
    )
