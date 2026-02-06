// src/routes/RegistrationGuard.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';

const stepPaths = {
  1: '/register',
  2: '/register/terms',
  3: '/register/success',
  4: '/register/add-children',
  5: '/register/student-terms',
  6: '/register/complete',
  7: '/select-student',
};

/**
 * Wraps a registration step. Redirects to the correct step if user tries to skip or access a step out of order.
 * @param {number} allowedStep - The step number this route is for (1-7).
 * @param {React.ReactNode} children - The page component to render if allowed.
 */
export default function RegistrationGuard({ allowedStep, children }) {
  const location = useLocation();
  const { canAccessStep } = useRegistration();

  const canAccess = canAccessStep(allowedStep);
  const redirectTo = stepPaths[allowedStep];

  if (!canAccess) {
    // Redirect to the first step they're allowed to access, or step 1
    let target = '/register';
    for (let s = 1; s <= 7; s++) {
          if (canAccessStep(s)) {
            target = stepPaths[s];
            break;
          }
        }
    return <Navigate to={target} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
