// src/hooks/usePremium.js
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const usePremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPremiumStatus = () => {
      const isPremiumStorage = (localStorage.getItem('isPremium') || Cookies.get('isPremium')) === 'true';
      let isPremiumUser = false;
      try {
        const raw = localStorage.getItem('userData') || Cookies.get('userData') || '{}';
        const userData = typeof raw === 'string' ? JSON.parse(raw) : raw;
        isPremiumUser = userData.is_premium === true || userData.is_premium === 1 || userData.is_premium === '1';
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error('Error parsing userData:', err);
      }
      setIsPremium(isPremiumStorage || isPremiumUser);
      setIsLoading(false);
    };

    checkPremiumStatus();
    window.addEventListener('storage', checkPremiumStatus);
    return () => window.removeEventListener('storage', checkPremiumStatus);
  }, []);

  const refreshPremiumStatus = () => {
    const isPremiumStorage = (localStorage.getItem('isPremium') || Cookies.get('isPremium')) === 'true';
    let isPremiumUser = false;
    try {
      const raw = localStorage.getItem('userData') || Cookies.get('userData') || '{}';
      const userData = typeof raw === 'string' ? JSON.parse(raw) : raw;
      isPremiumUser = userData.is_premium === true || userData.is_premium === 1 || userData.is_premium === '1';
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Error parsing userData:', err);
    }
    setIsPremium(isPremiumStorage || isPremiumUser);
  };

  return { 
    isPremium, 
    isLoading,
    refreshPremiumStatus
  };
};

export default usePremium;