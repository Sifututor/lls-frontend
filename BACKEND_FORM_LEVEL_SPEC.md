# Backend: Form Level Fix for /me API

## Problem
Frontend topbar needs to show student's **form level** (e.g. "Form 2", "Form 4").  
**Network tab me `/me` response me `form_level: null` aa raha hai** – DB me "Form 2" hai lekin API me include nahi ho raha. Backend ko **GET /me** response me **user object ke andar `form_level`** field bhejna hoga (users table se select karke).

---

## Request to Backend

### 1. `/me` (GET) response me `form_level` return karo

**Current response (issue):**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": 3,
      "name": "Student",
      "email": "student@yopmail.com",
      "user_type": "student",
      "form_level": null,
      "profile": { ... }
    }
  }
}
```

**Required:**  
`form_level` **null nahi hona chahiye** for students. Jo value DB me save hai (ya registration pe set hoti hai) wahi return karo.

**Expected (example):**
```json
{
  "status": true,
  "data": {
    "user": {
      "id": 3,
      "name": "Student",
      "email": "student@yopmail.com",
      "user_type": "student",
      "form_level": "Form 2",
      "profile": { ... }
    }
  }
}
```

**Allowed values:**  
`"Form 1"`, `"Form 2"`, `"Form 3"`, `"Form 4"`, `"Form 5"` (ya jo bhi format aap use karte ho, e.g. `"form_2"` – frontend dono handle karta hai).

---

### 2. DB / Model check karo

- Students table (ya users table) me **`form_level`** column hai?
- Agar hai to:
  - Registration / activation time pe **form_level set** ho raha hai?
  - `/me` (ya user profile) query me **form_level select** ho raha hai?
- Agar column nahi hai to add karo aur registration/update flow me set karo.

---

### 3. Registration / Activation pe form_level set karo

- Student register karte waqt **form_level** bhejte hain (frontend se).
- Backend us value ko **save** karna chahiye (users table me).
- Agar student activation flow me form level set hota hai to wahan bhi ensure karo value save ho rahi hai.

---

## One-line summary (copy-paste for backend)

**“`/me` API me student user ke liye `data.user.form_level` null mat bhejo – DB me jo form level save hai (e.g. 'Form 2', 'Form 4') wahi return karo. Agar DB me value nahi hai to registration/activation pe form_level save karo aur `/me` me include karo.”**

---

## Frontend side (already done)

- Frontend `/me` se **data.user** save karta hai.
- Topbar me **data.user.form_level** dikhata hai.
- Agar `form_level` null hai to "—" dikhta hai; jab backend sahi value bhejega tab automatically "Form 2" / "Form 4" dikhega.
