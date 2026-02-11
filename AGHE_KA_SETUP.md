# 🚀 AGHE KA SETUP - Step by Step

## ✅ JO HO CHUKA HAI

- ✅ GitHub Actions workflow ready (SSH/SCP deploy)
- ✅ Build steps fixed (CSS, npm cache)
- ✅ Code push ho chuka hai
- ✅ Workflow file: `.github/workflows/deploy.yml`

---

## 📋 AB KYA KARNA HAI (4 STEPS)

### STEP 1: GitHub Secrets Add Karo (4 Secrets)

**Kahan:** `github.com` → Apni Repo → **Settings** → **Secrets and variables** → **Actions**

**"New repository secret"** pe click karke yeh 4 secrets add karo:

---

#### Secret 1: SSH_HOST
```
Name: SSH_HOST
Value: tutorla.tech
```
*(Ya apne server ka IP, e.g. 123.45.67.89)*

---

#### Secret 2: SSH_USER
```
Name: SSH_USER
Value: lmssifututorla
```
*(Apna cPanel username)*

---

#### Secret 3: SSH_KEY
```
Name: SSH_KEY
Value: [Puri private key paste karo - neeche dekho kaise banaye]
```

**SSH Key kaise banaye / kahan se milegi:**

**Option A – cPanel se (recommended):**
1. cPanel login → **Security** → **SSH Access**
2. **Manage SSH Keys** pe jao
3. **Generate a New Key** (ya pehle wali use karo)
4. **View/Download** se private key copy karo
5. Puri key copy karo (-----BEGIN ... se -----END ... tak)
6. GitHub Secret **SSH_KEY** me paste karo

**Option B – Local (Windows):**
- Git Bash / PowerShell:
```bash
ssh-keygen -t ed25519 -C "github-deploy" -f deploy_key -N ""
```
- `deploy_key` file kholo (private key)
- Puri content copy karo
- cPanel me **SSH Access** → **Import Key** me public key (`deploy_key.pub`) add karo
- GitHub me **SSH_KEY** secret me private key paste karo

---

#### Secret 4: SSH_DIR
```
Name: SSH_DIR
Value: /home/lmssifututorla/learnest-frontend.tutorla.tech/
```
*(Document root / jahan site deploy karni hai – ending me `/` zaroor)*

---

### STEP 2: Workflow Run Karo

**Option A – Manual run (sabse easy):**
1. `github.com` → Repo → **Actions** tab
2. Left side **"Deploy to cPanel"** pe click
3. Right side **"Run workflow"** → **Run workflow**
4. 3–4 min wait karo

**Option B – Push se automatic:**
- Koi bhi change commit + push karo `main` pe:
```bash
git add .
git commit -m "Trigger deploy"
git push origin main
```

---

### STEP 3: Deployment Status Check Karo

1. **Actions** tab me latest run dikhegi
2. **Status:**
   - 🟡 Yellow = chal raha hai (wait karo)
   - ✅ Green = success
   - ❌ Red = fail (logs open karke error dekho)

3. **Green hone par:** Build + SCP dono complete, files server pe upload ho chuki hongi

---

### STEP 4: Website Check Karo

Browser me jao:

```
https://learnest-frontend.tutorla.tech
```

- Home page load ho rahi hai?
- Login / routes theek chal rahe hain?
- Console (F12) me koi error toh nahi?

---

## 🔧 AGAR DEPLOY FAIL HO (Red ❌)

1. Failed run pe click karo
2. **Deploy via SFTP (SCP)** step pe click karo
3. Logs me dekho:
   - **Permission denied (publickey)** → SSH_KEY galat ya server pe key add nahi hui
   - **Connection refused** → SSH_HOST / port 22 block ya galat
   - **No such file or directory** → SSH_DIR path galat

**Fix:**
- SSH_KEY: Puri key, copy-paste me extra space/line mat chhodna
- SSH_HOST: Sirf hostname (tutorla.tech) ya IP, `ssh://` mat lagana
- SSH_DIR: cPanel File Manager me exact path dekho, wahi use karo, end me `/`

---

## 📌 QUICK CHECKLIST

- [ ] SSH_HOST secret add kiya
- [ ] SSH_USER secret add kiya
- [ ] SSH_KEY secret add kiya (puri private key)
- [ ] SSH_DIR secret add kiya
- [ ] Actions → Deploy to cPanel → Run workflow (ya push kiya)
- [ ] Run green ✅ hua
- [ ] https://learnest-frontend.tutorla.tech open karke check kiya

---

## 🎯 SUMMARY

| Step | Kya karna hai |
|------|----------------|
| 1 | GitHub me 4 secrets: SSH_HOST, SSH_USER, SSH_KEY, SSH_DIR |
| 2 | Actions → Deploy to cPanel → Run workflow (ya git push) |
| 3 | Run complete hone tak wait, green ✅ dekho |
| 4 | Site open karke verify karo |

Bas itna aghe ka setup hai. Secrets sahi hon to deploy auto chal jayegi. 🚀
