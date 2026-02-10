# 🎯 KAHAN KYA KARNA HAI - Step by Step

## 📍 LOCATION 1: GitHub Website (Browser me)

### STEP 1: GitHub Secrets Add Karna

**Kahan Jana Hai:**
```
1. Browser kholo (Chrome/Firefox)
2. GitHub.com pe jao
3. Login karo
4. Apni repository kholo: learnest-react-fixed
```

**Ab Kya Karna Hai:**

```
5. Upar **Settings** tab pe click karo
   (About, Code, Issues, Pull requests ke saath)

6. Left sidebar me neeche jao
   **Secrets and variables** pe click karo
   
7. Dropdown me **Actions** pe click karo

8. Ab right side pe green button hai:
   **New repository secret** - ismein click karo
```

**Ab 5 Secrets Add Karo (Ek ek karke):**

#### Secret #1:
```
Name*: FTP_HOST
Secret*: ftp.yourdomain.com

[Add secret] green button pe click
```

#### Secret #2:
```
Name*: FTP_USER
Secret*: youruser@yourdomain.com

[Add secret] green button pe click
```

#### Secret #3:
```
Name*: FTP_PASS
Secret*: your_cpanel_password_yahan_likho

[Add secret] green button pe click
```

#### Secret #4:
```
Name*: FTP_DIR
Secret*: /public_html/

[Add secret] green button pe click
```

#### Secret #5:
```
Name*: REACT_APP_API_URL
Secret*: https://yourdomain.com/api

[Add secret] green button pe click
```

**✅ Done! Pehla kaam complete!**

---

## 📍 LOCATION 2: cPanel Website (Browser me)

### STEP 2: FTP Details Nikalna

**Kahan Jana Hai:**
```
1. Browser me naya tab kholo
2. Apne cPanel ka URL type karo:
   https://yourdomain.com:2083
   YA
   https://yourdomain.com/cpanel

3. Login karo (username + password)
```

**Ab Kya Karna Hai:**

#### A) FTP Host Nikalna:
```
1. cPanel dashboard me "Files" section dhundo
2. "FTP Accounts" pe click karo
3. Page pe scroll down karo
4. "Special FTP Accounts" section me dekho
5. Wahan "FTP Server:" likha hoga
   Example: ftp.yourdomain.com
6. Isko copy karo (Ctrl+C)
```

#### B) Username Nikalna:
```
Same page pe:
- "Username" column me dekho
- Format: youruser@yourdomain.com
- Isko copy karo
```

#### C) Password:
```
Yeh wahi password hai jo aapne cPanel login me diya tha
YA
New FTP account bana sakte ho "Add FTP Account" button se
```

#### D) Document Root Nikalna:
```
1. cPanel me wapas jao (back button)
2. "Domains" section dhundo
3. "Domains" pe click karo
4. Apna domain/subdomain dhundo
5. "Document Root" column me dekh lo:
   
   Main domain:    /public_html
   Subdomain:      /public_html/subdomain_folder
   Addon domain:   /public_html/addon_folder

6. Yeh path yaad kar lo (ending me / slash zaroor)
```

**✅ Ab yeh sab values note kar lo (Notepad me copy karo)**

---

## 📍 LOCATION 3: VS Code / Cursor (Code Editor)

### STEP 3: Configuration Files Edit Karna

**Kahan Jana Hai:**
```
Apna Cursor/VS Code editor kholo
Project: learnest-react-fixed
```

**Ab Kya Karna Hai:**

#### File #1: `.env.production` Edit Karo

```
1. Left sidebar me files dikhengi
2. `.env.production` file dhundo (root folder me hai)
3. Double click karo - file khul jayegi
4. Line 3 dikhayi degi:
   REACT_APP_API_URL=https://yourdomain.com/api
   
5. `yourdomain.com` ko apne domain se replace karo
   Example: REACT_APP_API_URL=https://mysite.com/api
   
6. Ctrl+S press karke save karo
```

**Puri file aise dikhegi:**
```env
# Production Environment Variables
# Update these values with your actual production API URL

REACT_APP_API_URL=https://APNA_DOMAIN_YAHAN.com/api
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

#### File #2: `package.json` Edit Karo

```
1. Left sidebar me `package.json` file dhundo
2. Double click karo - file khul jayegi
3. Line 5 dikhayi degi:
   "homepage": "https://yourdomain.com",
   
4. `yourdomain.com` ko apne domain se replace karo
   Example: "homepage": "https://mysite.com",
   
5. Ctrl+S press karke save karo
```

**Yeh section aise dikhega:**
```json
{
  "name": "learnest-react",
  "version": "1.0.0",
  "description": "Learnest - Online Learning Platform",
  "homepage": "https://APNA_DOMAIN_YAHAN.com",
  "private": true,
```

**✅ Done! Files save ho gayi!**

---

## 📍 LOCATION 4: Git Bash / Terminal (Cursor me)

### STEP 4: Code Push Karna

**Kahan Jana Hai:**
```
Cursor editor me:
1. Upar menu me "Terminal" pe click karo
2. "New Terminal" pe click karo
   YA
   Shortcut: Ctrl + ` (backtick key)
   
Neeche terminal khul jayega
```

**Ab Kya Karna Hai:**

Terminal me yeh commands type karo (ek ek line):

```bash
# Command 1: Files stage karo
git add .

# Enter press karo, phir next command:

# Command 2: Commit karo
git commit -m "Setup cPanel deployment pipeline"

# Enter press karo, phir next command:

# Command 3: Push karo
git push origin main
```

**Ya sab ek saath bhi kar sakte ho:**
```bash
git add . && git commit -m "Setup cPanel deployment" && git push origin main
```

**✅ Push ho gaya!**

---

## 📍 LOCATION 5: GitHub Actions Tab (Browser me Check Karna)

### STEP 5: Deployment Status Dekhna

**Kahan Jana Hai:**
```
1. Browser me GitHub kholo
2. Apni repository me jao: learnest-react-fixed
3. Upar tabs me "Actions" pe click karo
   (Code, Issues, Pull requests ke saath)
```

**Kya Dikhega:**

```
1. Latest workflow run dikhega:
   "Setup cPanel deployment pipeline"
   
2. Status dikhayi dega:
   🟡 Yellow/Orange = Running (wait karo)
   ✅ Green check = Success! (Done!)
   ❌ Red X = Failed (error hua)
```

**Agar Green ✅ Dikha:**
```
🎉 Congratulations! 
Aapka app deploy ho gaya!
Browser me apne domain pe jao:
https://yourdomain.com
```

**Agar Red ❌ Dikha:**
```
Workflow pe click karo
Logs dekho kahan error aayi
Common issues:
- GitHub Secrets galat hain
- FTP credentials wrong hain
- FTP_DIR path galat hai
```

---

## 🗺️ QUICK MAP - Kahan Kya Hai

```
📍 GitHub.com/your-repo/settings/secrets
   → Yahan Secrets add karo (5 values)

📍 cPanel Dashboard → FTP Accounts
   → Yahan FTP details nikalo

📍 cPanel Dashboard → Domains
   → Yahan Document Root dekho

📍 Cursor Editor → .env.production file
   → Yahan API URL change karo

📍 Cursor Editor → package.json file
   → Yahan homepage URL change karo

📍 Cursor Terminal (Ctrl + `)
   → Yahan git commands run karo

📍 GitHub.com/your-repo/actions
   → Yahan deployment status dekho
```

---

## 📸 VISUAL GUIDE

### GitHub Secrets Ka Exact Path:

```
github.com
  └── Your Repository (learnest-react-fixed)
      └── Settings (top navigation)
          └── Secrets and variables (left sidebar, neeche)
              └── Actions (dropdown)
                  └── New repository secret (green button)
                      └── Name + Secret fill karo
                          └── Add secret button
```

### cPanel FTP Ka Exact Path:

```
yourdomain.com/cpanel
  └── Login
      └── Files Section (dashboard pe)
          └── FTP Accounts
              └── Special FTP Accounts section
                  └── FTP Server + Username dekho
```

### File Edit Ka Exact Path:

```
Cursor Editor
  └── Explorer (left sidebar)
      └── learnest-react-fixed (root folder)
          ├── .env.production (double click → edit → Ctrl+S)
          └── package.json (double click → edit → Ctrl+S)
```

---

## ✅ FINAL CHECKLIST

### Kya Ho Gaya:
- [x] Files create hui (maine kar diya)
- [x] Configuration ready hai (maine kar diya)

### Aapko Kya Karna Hai:
- [ ] GitHub.com → Settings → Secrets → 5 secrets add karo
- [ ] cPanel → FTP details note karo
- [ ] Cursor → .env.production → API URL change karo
- [ ] Cursor → package.json → homepage change karo
- [ ] Terminal → git commands run karo
- [ ] GitHub → Actions tab → green ✅ dekho
- [ ] Browser → yourdomain.com → website check karo

---

## 🆘 AGAR CONFUSED HO

**To yeh karo:**

1. **Screenshot le lo:**
   - GitHub Secrets page ka
   - cPanel FTP Accounts page ka
   - Files ka

2. **Values ek ek karke bharo**
   - Pehle GitHub secrets (5 values)
   - Phir files edit karo (2 files)
   - Phir git push karo

3. **Test karo:**
   - GitHub Actions tab dekho
   - Website pe jao aur check karo

---

## 💡 EASY YAAD RAKHNE KE LIYE

```
5 JAGAH KAAM KARNA HAI:

1️⃣ GitHub Website (Secrets add)
2️⃣ cPanel Website (FTP details)
3️⃣ Cursor Editor (Files edit)
4️⃣ Terminal (Git push)
5️⃣ GitHub Website (Check deployment)

Bas! Itna hi! 🎉
```

---

**Agar koi step samajh na aaye, bolo main aur detail me bataunga!** 😊
