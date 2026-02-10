// TEMPORARY DEBUG FILE — Add this code to Dashboard.js to see API responses

// Add this in Dashboard.js after API calls (around line 32):

console.log('=== DASHBOARD API DEBUG ===');
console.log('1. My Courses API Response:', apiResponse);
console.log('2. Live Classes API Response:', liveClassesResponse);
console.log('3. Analytics API Response:', analyticsData);
console.log('===========================');

// Add this after data transformations (around line 182):
console.log('=== DASHBOARD DATA DEBUG ===');
console.log('1. Continue Learning Courses:', continueLearningCourses);
console.log('2. Live Classes Data:', liveClassesData);
console.log('3. Stats Data:', statsData);
console.log('============================');

// This will show you EXACTLY what the API is returning vs what's being displayed
// If you see fake data in API responses, backend is the issue
// If API returns empty but fake data in transformed data, frontend is the issue
