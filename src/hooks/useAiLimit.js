// src/hooks/useAiLimit.js
import { useState, useEffect, useCallback } from 'react';
import { isPremiumUser } from '../store/api/authApi';

const MAX_FREE_QUESTIONS = 5;

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

// ✅ FIX: Get current user ID for user-specific storage
function getCurrentUserId() {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return userData?.id || 'guest';
  } catch {
    return 'guest';
  }
}

export function useAiLimit() {
  const isPremium = isPremiumUser();
  
  // ✅ FIX: User-specific storage key
  const userId = getCurrentUserId();
  const STORAGE_KEY = `ai_tutor_questions_${userId}`;

  const getStoredData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return { date: getTodayDate(), count: 0 };

      const data = JSON.parse(stored);

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

  const [questionsData, setQuestionsData] = useState(getStoredData);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setQuestionsData(getStoredData());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [getStoredData]);

  const canAskQuestion = isPremium || questionsData.count < MAX_FREE_QUESTIONS;

  const recordQuestion = useCallback(() => {
    if (isPremium) return true;

    const currentData = getStoredData();

    if (currentData.count >= MAX_FREE_QUESTIONS) {
      return false;
    }

    const newData = {
      date: getTodayDate(),
      count: currentData.count + 1,
    };

    setQuestionsData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  }, [isPremium, getStoredData, STORAGE_KEY]);

  const remainingQuestions = isPremium
    ? Infinity
    : Math.max(0, MAX_FREE_QUESTIONS - questionsData.count);

  return {
    canAskQuestion,
    usedQuestions: questionsData.count,
    maxQuestions: MAX_FREE_QUESTIONS,
    remainingQuestions,
    hoursUntilReset: getHoursUntilReset(),
    recordQuestion,
    isPremium,
  };
}

export default useAiLimit;
