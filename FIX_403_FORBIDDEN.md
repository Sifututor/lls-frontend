# Fix 403 Forbidden on Live Site

## What was done in code

- **.htaccess** in the deployment workflow and in `deploy.sh` is updated to:
  - **Require all granted** – allows Apache 2.4+ to serve the site (fixes 403).
  - **Options -Indexes +FollowSymLinks** – no directory listing, symlinks allowed.

After you **push and redeploy**, the new `.htaccess` will be uploaded and 403 may be fixed.

---

## If 403 still appears after redeploy

### 1. cPanel File Manager – check files

- Open **File Manager** → go to document root of `learnest-frontend.tutorla.tech`  
  (e.g. `public_html/learnest-frontend.tutorla.tech` or `/home/lmssifututorla/learnest-frontend.tutorla.tech`).
- Confirm:
  - **index.html** is in the **root** of that folder (not inside another subfolder).
  - **.htaccess** is in the **same** folder as **index.html**.
  - **static/** (or similar) folder is there with JS/CSS.

If **index.html** is inside a subfolder (e.g. `build/`), move its contents one level up so that the **document root** of the domain points to the folder that contains **index.html** and **.htaccess**.

---

### 2. Permissions

In File Manager, set:

- **Folders:** `755`
- **Files (e.g. index.html, .htaccess, JS, CSS):** `644`

Right‑click folder/file → **Change Permissions** → set as above.

---

### 3. .htaccess manually (if deploy didn’t upload it)

In the **same directory as index.html**, create or edit **.htaccess** with:

```apache
# Allow access (fix 403)
<IfModule mod_authz_core.c>
  Require all granted
</IfModule>
Options -Indexes +FollowSymLinks

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

Save and try the site again.

---

### 4. Document root in cPanel

- **Domains** → **learnest-frontend.tutorla.tech** → **Manage**.
- **Document Root** must be the folder that **contains index.html** (e.g. `/home/lmssifututorla/learnest-frontend.tutorla.tech`).
- If it was pointing to a parent or wrong folder, correct it and save.

---

### 5. Ask hosting / server admin

If 403 continues, ask them to:

- Confirm **AllowOverride** is set so that **.htaccess** is read (e.g. `AllowOverride All` for this directory).
- Confirm there is no **Require all denied** (or similar) for this vhost/document root.
- Check **ModSecurity** or other security rules that might block the subdomain.

---

## Summary

1. Push the repo and **redeploy** so the new `.htaccess` is uploaded.
2. Check **index.html** and **.htaccess** are in the **document root**.
3. Set permissions to **755** (dirs) and **644** (files).
4. If needed, paste the `.htaccess` block above manually.
5. If still 403, get server/hosting to check **AllowOverride** and security rules.
