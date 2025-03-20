@echo off
set DJANGO_SETTINGS_MODULE=backend.settings
call daphne -b 0.0.0.0 -p 8000 backend.asgi:application
