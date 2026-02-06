// src/context/RegistrationContext.js
import React, { createContext, useContext, useReducer, useCallback } from 'react';

const REGISTRATION_STORAGE_KEY = 'learnest_registration_state';

const initialState = {
  step: 1,
  parentData: {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    user_type: 'parent',
  },
  termsAccepted: {
    pdpa_terms: false,
    pdpa_privacy: false,
    pdpa_consent: false,
  },
  children: [{ name: '', email: '', form_level: '' }],
  registrationComplete: false,
  parentId: null,
  // For display after success (e.g. list of children with ids from API)
  childrenDisplay: [],
  selectedStudentId: null,
};

const stepPaths = {
  1: '/register',
  2: '/register/terms',
  3: '/register/success',
  4: '/register/add-children',
  5: '/register/student-terms',
  6: '/register/complete',
  7: '/select-student',
};

function getStepFromPath(pathname) {
  const match = Object.entries(stepPaths).find(([, path]) => path === pathname || (path !== '/register' && pathname.startsWith(path)));
  if (match) return match[0];
  if (pathname === '/register') return 1;
  if (pathname === '/register/terms') return 2;
  if (pathname === '/register/success') return 3;
  if (pathname === '/register/add-children') return 4;
  if (pathname === '/register/student-terms') return 5;
  if (pathname === '/register/complete') return 6;
  if (pathname === '/select-student') return 7;
  return null;
}

function loadState() {
  try {
    const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialState, ...parsed };
    }
  } catch (e) {
    console.warn('RegistrationContext: failed to load state', e);
  }
  return { ...initialState };
}

function saveState(state) {
  try {
    sessionStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('RegistrationContext: failed to save state', e);
  }
}

const actions = {
  SET_PARENT_DATA: 'SET_PARENT_DATA',
  SET_TERMS: 'SET_TERMS',
  SET_CHILDREN: 'SET_CHILDREN',
  SET_CHILDREN_DISPLAY: 'SET_CHILDREN_DISPLAY',
  SET_STEP: 'SET_STEP',
  SET_PARENT_ID: 'SET_PARENT_ID',
  SET_REGISTRATION_COMPLETE: 'SET_REGISTRATION_COMPLETE',
  SET_SELECTED_STUDENT: 'SET_SELECTED_STUDENT',
  RESET: 'RESET',
};

function reducer(state, action) {
  switch (action.type) {
    case actions.SET_PARENT_DATA:
      return { ...state, parentData: { ...state.parentData, ...action.payload }, step: Math.max(state.step, 1) };
    case actions.SET_TERMS:
      return { ...state, termsAccepted: { ...state.termsAccepted, ...action.payload }, step: Math.max(state.step, 2) };
    case actions.SET_CHILDREN:
      return { ...state, children: action.payload, step: Math.max(state.step, 4) };
    case actions.SET_CHILDREN_DISPLAY:
      return { ...state, childrenDisplay: action.payload };
    case actions.SET_STEP:
      return { ...state, step: action.payload };
    case actions.SET_PARENT_ID:
      return { ...state, parentId: action.payload };
    case actions.SET_REGISTRATION_COMPLETE:
      return { ...state, registrationComplete: action.payload };
    case actions.SET_SELECTED_STUDENT:
      return { ...state, selectedStudentId: action.payload };
    case actions.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  React.useEffect(() => {
    saveState(state);
  }, [state]);

  const setParentData = useCallback((payload) => {
    dispatch({ type: actions.SET_PARENT_DATA, payload });
  }, []);

  const setTermsAccepted = useCallback((payload) => {
    dispatch({ type: actions.SET_TERMS, payload });
  }, []);

  const setChildren = useCallback((payload) => {
    dispatch({ type: actions.SET_CHILDREN, payload });
  }, []);

  const setChildrenDisplay = useCallback((payload) => {
    dispatch({ type: actions.SET_CHILDREN_DISPLAY, payload });
  }, []);

  const setStep = useCallback((step) => {
    dispatch({ type: actions.SET_STEP, payload: step });
  }, []);

  const setParentId = useCallback((id) => {
    dispatch({ type: actions.SET_PARENT_ID, payload: id });
  }, []);

  const setRegistrationComplete = useCallback((value) => {
    dispatch({ type: actions.SET_REGISTRATION_COMPLETE, payload: value });
  }, []);

  const setSelectedStudentId = useCallback((id) => {
    dispatch({ type: actions.SET_SELECTED_STUDENT, payload: id });
  }, []);

  const resetRegistration = useCallback(() => {
    dispatch({ type: actions.RESET });
    try {
      sessionStorage.removeItem(REGISTRATION_STORAGE_KEY);
    } catch (e) {}
  }, []);

  const canAccessStep = useCallback(
    (stepNumber) => {
      if (stepNumber === 1) return true;
      if (stepNumber === 2) return !!state.parentData?.email && !!state.parentData?.password;
      if (stepNumber === 3) return !!state.parentId;
      if (stepNumber === 4) return !!state.parentId;
      if (stepNumber === 5) return Array.isArray(state.children) && state.children.length > 0 && state.children.some((c) => c.name && c.form_level);
      if (stepNumber === 6) return state.registrationComplete;
      if (stepNumber === 7) return state.registrationComplete;
      return false;
    },
    [state.parentData, state.parentId, state.children, state.registrationComplete]
  );

  const value = {
    ...state,
    setParentData,
    setTermsAccepted,
    setChildren,
    setChildrenDisplay,
    setStep,
    setParentId,
    setRegistrationComplete,
    setSelectedStudentId,
    resetRegistration,
    canAccessStep,
    stepPaths,
    getStepFromPath,
  };

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return ctx;
}

export default RegistrationContext;
