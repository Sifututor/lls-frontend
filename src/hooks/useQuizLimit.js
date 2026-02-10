// src/hooks/useQuizLimit.js
import { useState, useEffect, useCallback } from 'react';
import { isPremiumUser } from '../store/api/authApi';

const MAX_FREE_ATTEMPTS = 3; // Free users: 3 attempts per quiz per day

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function getHoursUntilReset() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60)));
}

// Get current user ID for user-specific storage
function getCurrentUserId() {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData?.id || 'guest';
  } catch {
    return 'guest';
  }
}

/**
 * Hook to manage quiz attempt limits for free users
 * @param {string|number} quizId - The ID of the quiz
 * @returns {Object} Quiz limit state and functions
 */
export function useQuizLimit(quizId) {
  const isPremium = isPremiumUser();
  
  // User-specific storage key for this quiz
  const userId = getCurrentUserId();
  const STORAGE_KEY = `quiz_attempts_${userId}_${quizId}`;

  const getStoredData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { date: getTodayDate(), count: 0 };

      const data = JSON.parse(stored);

      // Reset if it's a new day
      if (data.date !== getTodayDate()) {
        const newData = { date: getTodayDate(), count: 0 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        return newData;
      }

      return data;
    } catch {
      return { date: getTodayDate(), count: 0 };
    }
  }, [STORAGE_KEY]);

  const [attemptsData, setAttemptsData] = useState(getStoredData);

  // Check for date changes when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setAttemptsData(getStoredData());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [getStoredData]);

  // Check if user can start a new quiz attempt
  const canStartAttempt = isPremium || attemptsData.count < MAX_FREE_ATTEMPTS;

  // Record a new quiz attempt
  const recordAttempt = useCallback(() => {
    // Premium users have unlimited attempts
    if (isPremium) return true;

    const currentData = getStoredData();

    // Check if limit reached
    if (currentData.count >= MAX_FREE_ATTEMPTS) {
      return false;
    }

    const newData = {
      date: getTodayDate(),
      count: currentData.count + 1,
    };

    setAttemptsData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  }, [isPremium, getStoredData, STORAGE_KEY]);

  const remainingAttempts = isPremium
    ? Infinity
    : Math.max(0, MAX_FREE_ATTEMPTS - attemptsData.count);

  return {
    canStartAttempt,
    usedAttempts: attemptsData.count,
    maxAttempts: MAX_FREE_ATTEMPTS,
    remainingAttempts,
    hoursUntilReset: getHoursUntilReset(),
    recordAttempt,
    isPremium,
  };
}

export default useQuizLimit;
