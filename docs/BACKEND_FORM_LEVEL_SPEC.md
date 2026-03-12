# Backend: Form Level Fix for /me API

_Moved from project root to `docs/BACKEND_FORM_LEVEL_SPEC.md`._

## Problem
Frontend topbar needs to show student's **form level** (e.g. "Form 2", "Form 4").  
**Network tab me `/me` response me `form_level: null` aa raha hai** – DB me "Form 2" hai lekin API me include nahi ho raha. Backend ko **GET /me** response me **user object ke andar `form_level`** field bhejna hoga (users table se select karke).

_(Content truncated for brevity – original detailed explanation kept in previous commits.)_

