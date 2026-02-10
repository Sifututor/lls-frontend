# 🔍 Profile Persistence Debug Guide

## ✅ All Fixes Applied

I've added comprehensive debug logs to track the entire profile update flow:

### Files Modified:
1. **`src/store/api/authApi.js`**
   - Added logs to `login` mutation
   - Added logs to `getMe` query
   - Added logs to `updateAccountSettings` mutation

2. **`src/store/slices/authSlice.js`**
   - Added logs to `updateUserProfile` reducer

---

## 🧪 TEST SEQUENCE

Follow these steps EXACTLY and watch console logs at each step:

### Step 1: PROFILE UPDATE

```
1. Login as: student@yopmail.com
2. Go to: /student/profile → Edit Profile
3. Open Browser DevTools: F12 → Console tab
4. Clear console logs (🚫 icon)
5. Change name to: "Test Updated Name"
6. Upload a new profile image (if you want)
7. Click "Save"
```

**Expected Console Logs:**
```
🟢 PROFILE UPDATE API RESPONSE: {
  status: true,
  profile: {...},
  profile_image: "uploads/profile_images/123.png"  ← Backend path
}
🔄 Calling /me API to refresh user data after profile update...
🔵 getMe API Response: {
  user: {
    name: "Test Updated Name",
    profile_image: "http://10.0.0.178:8000/uploads/...",  ← Full URL
    ...
  }
}
💾 getMe saving to localStorage: {...}
🔵 updateUserProfile called with payload: {...}
🔵 Updating profile: {
  fullName: "Test Updated Name",
  fullAvatar: "http://10.0.0.178:8000/uploads/..."
}
💾 Saving updated user to localStorage: {...}
✅ User data saved successfully
```

**Verify:**
- ✅ TopBar shows "Test Updated Name" and new image
- ✅ Profile page shows updated data

---

### Step 2: CHECK localStorage

```
1. Stay on the same page
2. In DevTools, go to: Application tab → Local Storage
3. Find key: "userData"
4. Check the value
```

**Expected:**
```json
{
  "id": 3,
  "name": "Test Updated Name",  ← Updated
  "profile_image": "http://10.0.0.178:8000/uploads/profile_images/123.png",  ← Updated
  "avatar": "http://10.0.0.178:8000/uploads/profile_images/123.png",  ← Updated
  "first_name": "Test Updated",
  "last_name": "Name",
  ...
}
```

**If profile_image is null or old value** → BACKEND ISSUE (Go to Step 6)

---

### Step 3: LOGOUT

```
1. Click Logout button
2. Watch console logs
```

**Expected Console Logs:**
```
(logout action called)
(localStorage cleared)
```

**Verify:**
- ✅ Redirected to /login
- ✅ localStorage "userData" key is removed

---

### Step 4: LOGIN AGAIN

```
1. Login with: student@yopmail.com
2. Clear console logs first (🚫 icon)
3. Enter credentials and click Login
4. Watch console CAREFULLY
```

**Expected Console Logs:**
```
🟢 LOGIN API RESPONSE: {
  token: "✅ Token received",
  user: {
    name: "Test Updated Name",  ← Should be updated
    profile_image: "http://10.0.0.178:8000/uploads/...",  ← Should be updated
    ...
  }
}
💾 Saving login user data to localStorage: {...}
🔄 Calling /me API to get fresh user data...
🔵 getMe API Response: {
  user: {
    name: "Test Updated Name",  ← Should match
    profile_image: "http://10.0.0.178:8000/uploads/...",  ← Should match
    ...
  }
}
💾 getMe saving to localStorage: {...}
```

**Verify:**
- ✅ Dashboard loads
- ✅ TopBar shows "Test Updated Name" and new image

---

### Step 5: CHECK localStorage AGAIN

```
1. Go to: Application tab → Local Storage → "userData"
2. Check if data matches what you updated
```

**Expected:**
```json
{
  "name": "Test Updated Name",  ← Should persist
  "profile_image": "http://10.0.0.178:8000/uploads/profile_images/123.png",  ← Should persist
  ...
}
```

---

## 🚨 IF DATA STILL NOT PERSISTING

### Scenario A: Console Shows OLD Data in Login Response

**Problem:**
```
🟢 LOGIN API RESPONSE: {
  user: {
    name: "OLD NAME",  ← ❌ Wrong! Should be "Test Updated Name"
    profile_image: null  ← ❌ Wrong! Should have image URL
  }
}
```

**This means:** Backend `/api/login` is returning **CACHED/STALE data**.

**Solution:** Tell backend developer:
```
"Login API (/api/login) database se fresh user data fetch nahi kar raha.
Profile update ke baad bhi purana data return ho raha hai.
Please check:
1. Query mein cache clear karo
2. SELECT query mein profile_image column include karo
3. User table join karo with profiles table"
```

---

### Scenario B: Console Shows CORRECT Data in Login, but WRONG Data in getMe

**Problem:**
```
🟢 LOGIN API RESPONSE: {
  user: { name: "Test Updated Name" }  ← ✅ Correct
}
🔵 getMe API Response: {
  user: { name: "OLD NAME" }  ← ❌ Wrong!
}
```

**This means:** Backend `/api/me` endpoint is returning **CACHED data**.

**Solution:** Tell backend developer:
```
"/api/me endpoint cached data return kar raha hai.
Fresh data database se fetch karo.
Profile table se profile_image properly load karo."
```

---

### Scenario C: Console Shows CORRECT Data, but UI Shows OLD Data

**Problem:**
```
Console: ✅ All data correct (name, profile_image)
TopBar: ❌ Shows old name or no image
```

**This means:** Frontend component not reading from updated state/localStorage.

**Solution:**
1. Check TopNavbar.js - is it using `useSelector(selectCurrentUser)`?
2. Check if it's reading `user.name` and `user.avatar`
3. Try hard refresh: Ctrl+Shift+R

---

## 📸 SEND ME SCREENSHOTS

Please send screenshots of:

1. **Console Logs during Profile Update** (Step 1)
   - Should show: `🟢 PROFILE UPDATE API RESPONSE`
   - Should show: `🔵 getMe API Response`

2. **Console Logs during Login** (Step 4)
   - Should show: `🟢 LOGIN API RESPONSE`
   - Should show: `🔵 getMe API Response`

3. **localStorage After Login** (Step 5)
   - Application tab → Local Storage → "userData"

4. **Network Tab during Login**
   - F12 → Network tab
   - Filter: Fetch/XHR
   - Click on `/login` request
   - Show Response tab

---

## 🎯 QUICK DIAGNOSIS

| Console Log | What It Means | Action |
|------------|---------------|--------|
| `🟢 LOGIN API RESPONSE: { user: { name: "OLD" } }` | Backend returning stale data | **Backend Issue** - Fix `/api/login` |
| `🔵 getMe API Response: { user: { name: "OLD" } }` | Backend /me returning stale data | **Backend Issue** - Fix `/api/me` |
| `💾 Saving to localStorage: { name: "NEW" }` + UI shows "OLD" | Component not re-rendering | **Frontend Issue** - Check component |
| No `🔵 getMe` log after login | getMe not being called | **Frontend Issue** - But already fixed in authApi.js |

---

**Test karo aur console logs ke screenshots send karo! 📸**
