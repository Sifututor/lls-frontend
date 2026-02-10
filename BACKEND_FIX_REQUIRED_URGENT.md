# 🚨 URGENT: Backend `/api/me` Endpoint Fix Required

## Problem Identified

Frontend console logs show that `/api/me` endpoint is returning **incomplete user data**:

```javascript
Current Response (WRONG):
{
  user: {
    id: 3,
    name: "Student",
    email: "student@yopmail.com",
    user_type: "student",
    is_premium: false,
    // ❌ Missing profile data below:
    first_name: undefined,
    last_name: undefined,
    profile_image: undefined,
    avatar: undefined
  }
}
```

---

## Required Fix

**Endpoint:** `GET /api/me`

**Current Issue:** Response does NOT include profile data (`first_name`, `last_name`, `profile_image`)

**Required Response Format:**

### Option 1: Include Profile Fields Directly in User Object (RECOMMENDED)
```json
{
  "user": {
    "id": 3,
    "name": "Student Test",
    "email": "student@yopmail.com",
    "first_name": "Student",           ← REQUIRED
    "last_name": "Test",               ← REQUIRED
    "profile_image": "http://10.0.0.178:8000/storage/profiles/abc123.jpg",  ← REQUIRED
    "avatar": "http://10.0.0.178:8000/storage/profiles/abc123.jpg",         ← REQUIRED (same as profile_image)
    "phone": "+1234567890",
    "user_type": "student",
    "is_premium": false,
    "email_verified_at": "2025-01-30T10:00:00.000000Z",
    "created_at": "2025-01-15T10:00:00.000000Z",
    "updated_at": "2025-01-30T10:00:00.000000Z"
  }
}
```

### Option 2: Include Nested Profile Object
```json
{
  "user": {
    "id": 3,
    "name": "Student Test",
    "email": "student@yopmail.com",
    "user_type": "student",
    "is_premium": false,
    "profile": {                       ← Nested profile object
      "id": 5,
      "user_id": 3,
      "first_name": "Student",         ← REQUIRED
      "last_name": "Test",             ← REQUIRED
      "profile_image": "http://10.0.0.178:8000/storage/profiles/abc123.jpg",  ← REQUIRED
      "phone": "+1234567890",
      "country": "MY",
      "dob": "2000-01-15"
    }
  }
}
```

---

## Backend Code Fix (Laravel Example)

### Current Code (WRONG):
```php
// app/Http/Controllers/AuthController.php
public function me(Request $request)
{
    return response()->json([
        'user' => auth()->user()  // ❌ Only returns users table data
    ]);
}
```

### Fixed Code (CORRECT):
```php
// app/Http/Controllers/AuthController.php
public function me(Request $request)
{
    $user = auth()->user();
    
    // Option 1: Load profile relationship
    $user->load('profile');
    
    // Option 2: Manually merge profile data into user object
    $userData = $user->toArray();
    if ($user->profile) {
        $userData['first_name'] = $user->profile->first_name;
        $userData['last_name'] = $user->profile->last_name;
        $userData['profile_image'] = $user->profile->profile_image 
            ? url('storage/' . $user->profile->profile_image) 
            : null;
        $userData['avatar'] = $userData['profile_image']; // Same as profile_image
        $userData['phone'] = $user->profile->phone;
    }
    
    return response()->json([
        'user' => $userData
    ]);
}
```

### Model Relationship Required:
```php
// app/Models/User.php
class User extends Authenticatable
{
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}
```

---

## Database Schema Check

Ensure these tables exist and are properly related:

### `users` table:
```sql
- id
- name
- email
- password
- user_type (student/parent/tutor/admin)
- is_premium (boolean)
- email_verified_at
- created_at
- updated_at
```

### `profiles` table:
```sql
- id
- user_id (foreign key to users.id)
- first_name
- last_name
- profile_image (relative path: "profiles/abc123.jpg")
- phone
- country
- dob
- created_at
- updated_at
```

---

## Critical Requirements

1. **Profile Image URL Must Be FULL URL:**
   - ❌ Wrong: `"profiles/abc123.jpg"`
   - ✅ Correct: `"http://10.0.0.178:8000/storage/profiles/abc123.jpg"`
   
2. **Must Fetch FRESH Data from Database:**
   - No caching
   - No stale data
   - Always query database directly

3. **Must Include Profile Data:**
   - `first_name` from profiles table
   - `last_name` from profiles table
   - `profile_image` (full URL) from profiles table

---

## Testing After Fix

### Test 1: Check API Response
```bash
curl -X GET http://10.0.0.178:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "user": {
    "id": 3,
    "name": "Student Test",
    "email": "student@yopmail.com",
    "first_name": "Student",      ← Check this exists
    "last_name": "Test",          ← Check this exists
    "profile_image": "http://...", ← Check this exists (full URL)
    "user_type": "student",
    "is_premium": false
  }
}
```

### Test 2: Update Profile Then Check /me
```bash
# 1. Update profile
curl -X POST http://10.0.0.178:8000/api/account-settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "first_name=Updated" \
  -F "last_name=Name" \
  -F "profile_image=@/path/to/image.jpg"

# 2. Immediately check /me
curl -X GET http://10.0.0.178:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return UPDATED data:
{
  "user": {
    "first_name": "Updated",      ← Should show new name
    "last_name": "Name",          ← Should show new name
    "profile_image": "http://...", ← Should show new image
    ...
  }
}
```

---

## Other Endpoints That Need Same Fix

These endpoints also need to return complete profile data:

1. **`POST /api/login`** - Should return user with profile data
2. **`POST /api/account-settings`** - Response should include updated profile
3. **`GET /api/account-settings`** - Should return user with profile data

---

## Priority: 🔴 URGENT

**Without this fix:**
- Profile updates won't persist after logout/login
- User name won't display correctly in TopBar
- Profile image won't display
- Frontend localStorage will have `undefined` values

**Frontend is working correctly** ✅  
**Backend needs to return complete data** ❌

---

**Fix this ASAP and test using the curl commands above!**
