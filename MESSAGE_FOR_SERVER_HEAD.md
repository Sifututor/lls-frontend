# Message for Server Head / Hosting Admin

**Copy-paste yeh message aur server admin ko bhej do:**

---

## English Version (Professional)

---

**Subject:** Request – DNS / Subdomain setup for learnest-frontend.tutorla.tech

Hi,

We have deployed our React frontend via GitHub Actions to the server. The app files are uploading correctly to:

**Path on server:** `/home/lmssifututorla/learnest-frontend.tutorla.tech/`

The domain **learnest-frontend.tutorla.tech** is already added in cPanel and its document root is set to the above path. So the hosting side is correct.

**Issue:** When we open **https://learnest-frontend.tutorla.tech** in the browser, we get **"This site can't be reached"** with error **DNS_PROBE_FINISHED_NXDOMAIN**. This means the domain is not resolving (DNS record missing or wrong).

**Request:** Please do the following:

1. **DNS for learnest-frontend.tutorla.tech**  
   - Add (or fix) an **A record** for **learnest-frontend.tutorla.tech** (or subdomain **learnest-frontend** under **tutorla.tech**) pointing to **this server’s IP address**.  
   - So that when someone opens `https://learnest-frontend.tutorla.tech`, it resolves to this server.

2. **Confirm document root**  
   - Ensure the domain **learnest-frontend.tutorla.tech** in cPanel has **Document Root** = `/home/lmssifututorla/learnest-frontend.tutorla.tech` (or equivalent). It is already set; just needs to stay as is.

3. **SSL (optional but recommended)**  
   - If possible, enable SSL (HTTPS) for **learnest-frontend.tutorla.tech** (e.g. AutoSSL / Let’s Encrypt in cPanel).

No change is needed on the application or deployment side; only DNS (and SSL if not already done) is required from the server/hosting side.

Thanks.

---

## Urdu/Roman Urdu Version (Agar Urdu me bhejna ho)

---

**Subject:** learnest-frontend.tutorla.tech ke liye DNS / subdomain setup

Assalam o Alaikum / Hi,

Meri React frontend GitHub Actions se server pe deploy ho chuki hai. Files sahi jagah upload ho rahi hain:

**Server path:** `/home/lmssifututorla/learnest-frontend.tutorla.tech/`

Domain **learnest-frontend.tutorla.tech** cPanel me add hai aur document root bhi isi path pe set hai. Hosting side theek hai.

**Masla:** Browser me **https://learnest-frontend.tutorla.tech** open karne pe **"This site can't be reached"** aur **DNS_PROBE_FINISHED_NXDOMAIN** aa raha hai. Matlab domain resolve nahi ho raha (DNS record missing ya galat hai).

**Request:** Yeh kaam kar dein:

1. **learnest-frontend.tutorla.tech ke liye DNS**  
   - **learnest-frontend.tutorla.tech** (ya tutorla.tech ka subdomain **learnest-frontend**) ke liye **A record** add/fix karein jo **is server ka IP** point kare.  
   - Taki `https://learnest-frontend.tutorla.tech` open karne pe yehi server open ho.

2. **Document root confirm**  
   - cPanel me domain **learnest-frontend.tutorla.tech** ka **Document Root** `/home/lmssifututorla/learnest-frontend.tutorla.tech` hi rahe (already set hai, bas confirm ho jaye).

3. **SSL (optional)**  
   - Agar possible ho to **learnest-frontend.tutorla.tech** ke liye SSL (HTTPS) enable kar dein (cPanel me AutoSSL / Let’s Encrypt).

Application ya deployment me koi change ki zaroorat nahi; sirf server/hosting side se DNS (aur agar ho sake to SSL) set karna hai.

Shukriya.

---

## Short One-Paragraph Version (Quick message)

---

Hi, our React app is deployed to `/home/lmssifututorla/learnest-frontend.tutorla.tech/` and the domain learnest-frontend.tutorla.tech is set in cPanel. We are getting "This site can't be reached" (DNS_PROBE_FINISHED_NXDOMAIN). Please add an A record for learnest-frontend.tutorla.tech pointing to this server’s IP so the site resolves. Also please keep document root as /home/lmssifututorla/learnest-frontend.tutorla.tech and enable SSL if possible. Thanks.

---

**File save ho chuki hai:** `MESSAGE_FOR_SERVER_HEAD.md`  
Isme se jo version chaho (English / Urdu / Short) copy karke server head ko bhej do.
