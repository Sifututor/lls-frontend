# ✅ DEPLOYMENT CHECKLIST - Aapko Kya Karna Hai

## 🎯 COMPLETED (Already Done!)

- ✅ `deploy.sh` script created
- ✅ `.github/workflows/deploy.yml` created (GitHub Actions)
- ✅ `.env.production` file created
- ✅ `package.json` updated (homepage + deploy scripts)
- ✅ `.gitignore` updated

---

## 📝 AAPKO YEH KARNA HAI

### STEP 1: GitHub Secrets Add Karein ⚠️ ZAROORI

GitHub repository pe jao aur yeh secrets add karein:

**Path:** Settings → Secrets and variables → Actions → New repository secret

```
Secret 1:
Name: FTP_HOST
Value: ftp.yourdomain.com          ← Apna domain yahan

Secret 2:
Name: FTP_USER
Value: youruser@yourdomain.com     ← Apna cPanel username

Secret 3:
Name: FTP_PASS
Value: your_cpanel_password        ← Apna cPanel password

Secret 4:
Name: FTP_DIR
Value: /public_html/               ← Yeh path cPanel se dekh lo

Secret 5:
Name: REACT_APP_API_URL
Value: https://yourdomain.com/api  ← Apne backend ka URL
```

---

### STEP 2: Configuration Files Edit Karein

#### File 1: `.env.production`

```env
REACT_APP_API_URL=https://yourdomain.com/api  ← Change this
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

#### File 2: `package.json`

```json
{
  "homepage": "https://yourdomain.com"  ← Change this
}
```

**Important:** `yourdomain.com` ko apne actual domain se replace karo

---

### STEP 3: cPanel Me FTP Details Nikalo

1. cPanel login karo
2. **Files** → **FTP Accounts** pe jao
3. Yeh details note karo:
   - FTP Host (e.g., `ftp.yourdomain.com`)
   - Username (e.g., `user@yourdomain.com`)
   - Password
4. **Domains** section me Document Root dekho:
   - Main domain: `/public_html`
   - Subdomain: `/public_html/subdomain_name`

---

### STEP 4: Deploy Karo! 🚀

#### Option A: Automatic (Recommended)

```bash
# Bas code push kar do
git add .
git commit -m "Setup cPanel deployment"
git push origin main
```

**Ab kya hoga:**
1. GitHub Actions automatically start hoga
2. Build ho jayega
3. cPanel pe upload ho jayega
4. Done! ✅

**Check karne ke liye:**
- GitHub → Your Repo → **Actions** tab
- Green ✅ dekho

---

#### Option B: Manual (Windows users ke liye)

Agar Windows pe ho aur Git Bash install hai:

```bash
# Git Bash kholo
cd /f/sifu-projects/react-project/learnest-react-fixed

# deploy.sh edit karo:
# FTP_HOST, FTP_USER, FTP_PASS, REMOTE_DIR update karo

# Script ko executable banao
chmod +x deploy.sh

# Deploy karo
./deploy.sh
```

---

### STEP 5: Test Karo

Website pe jao aur check karo:

```
✅ https://yourdomain.com/
✅ https://yourdomain.com/login
✅ https://yourdomain.com/dashboard
```

Browser console (F12) me errors dekho.

---

## 🎯 QUICK ACTION ITEMS

Abhi turat yeh karo (5 minutes):

1. [ ] GitHub Secrets add karo (FTP details)
2. [ ] `.env.production` me API URL change karo
3. [ ] `package.json` me homepage URL change karo
4. [ ] Git push karo main branch pe
5. [ ] GitHub Actions tab me green ✅ ka wait karo
6. [ ] Website pe jaake test karo

---

## ❓ HELP

Agar kuch samajh nahi aaya:

1. `CPANEL_DEPLOYMENT_GUIDE.md` file kholo
2. Wahan detailed instructions hain
3. Troubleshooting section bhi hai

---

## 🚨 COMMON MISTAKES

❌ **Galti 1:** GitHub Secrets add karna bhool gaye
✅ **Fix:** Settings → Secrets → Add all 5 secrets

❌ **Galti 2:** FTP_DIR me ending slash nahi diya
✅ **Fix:** `/public_html/` (slash zaroor)

❌ **Galti 3:** Homepage URL galat diya
✅ **Fix:** Exact domain name (without trailing slash)

❌ **Galti 4:** .htaccess upload nahi hua
✅ **Fix:** Automatic upload hoga, check karo FTP se

---

## 🎉 SUCCESS!

Agar sab kuch sahi raha toh:

```
✅ GitHub Actions: Pass
✅ Website: Live
✅ Routes: Working
✅ API: Connected
```

**CONGRATULATIONS! Aapka app ab live hai! 🚀**

---

**Next push se automatic deployment shuru ho jayegi!**
