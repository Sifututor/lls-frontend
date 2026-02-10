// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCircularFavicon } from './utils/favicon';
import { isPremiumUser } from './store/api/authApi';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Global CSS
import './assets/css/fonts.css'; // Load fonts FIRST
import './assets/css/root.css';
import './assets/css/base.css';
import './assets/css/layout.css';
import './assets/css/components.css';
import './assets/css/card-alignment.css';
import './assets/css/responsive.css';
import './assets/css/my-courses.css';
import './assets/css/course-details.css';
import './assets/css/browse-course-details.css';
import './assets/css/quiz-check-answers.css';
import './assets/css/quiz-take.css';
import './assets/css/auth.css';
import './assets/css/legal.css';
import './assets/css/Ai-tutor.css';
import './assets/css/Profile.css';
import './assets/css/parent-dashboard.css';
import './assets/css/tutor.css';
import './styles/toast.css';

import { LayoutProvider } from './context/LayoutContext';
import { RegistrationProvider } from './context/RegistrationContext';

function App() {
  useEffect(() => {
    setCircularFavicon('/assets/images/favicons.png');
  }, []);

  useEffect(() => {
    const updatePremiumBodyClass = () => {
      if (isPremiumUser()) {
        document.body.classList.add('is-premium');
      } else {
        document.body.classList.remove('is-premium');
      }
    };
    updatePremiumBodyClass();
    window.addEventListener('storage', updatePremiumBodyClass);
    return () => window.removeEventListener('storage', updatePremiumBodyClass);
  }, []);

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        toastStyle={{
          borderRadius: '12px',
          fontFamily: 'inherit',
          fontSize: '14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      />
      <Provider store={store}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <LayoutProvider>
            <RegistrationProvider>
              <AppRoutes />
            </RegistrationProvider>
          </LayoutProvider>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
