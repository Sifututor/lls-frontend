/**
 * Maps API badge_type to display config (icon, label, tooltip)
 * Icons match static design: dashboard-1 (clapperboard/video), 2 (notes), 3 (fire), 4 (graduation), 5 (star), 6 (rocket)
 */
export const BADGE_CONFIG = {
  first_video: {
    icon: '/assets/images/icons/dashboard-1.png',
    label: 'First Video',
    tooltip: 'Watched your first video',
  },
  first_quiz: {
    icon: '/assets/images/icons/dashboard-2.png',
    label: 'First Quiz',
    tooltip: 'Completed your first quiz',
  },
  quiz_master: {
    icon: '/assets/images/icons/dashboard-2.png',
    label: 'Quiz Master',
    tooltip: 'Passed multiple quizzes',
  },
  streak_3: {
    icon: '/assets/images/icons/dashboard-3.png',
    label: '3 Day Streak',
    tooltip: '3 days in a row',
  },
  streak_7: {
    icon: '/assets/images/icons/dashboard-3.png',
    label: '7 Day Streak',
    tooltip: '7 days in a row',
  },
  streak_12: {
    icon: '/assets/images/icons/dashboard-3.png',
    label: '12 Day Streak',
    tooltip: '12 days in a row',
  },
  streak_30: {
    icon: '/assets/images/icons/dashboard-3.png',
    label: '30 Day Streak',
    tooltip: '30 days in a row',
  },
  video_10: {
    icon: '/assets/images/icons/dashboard-1.png',
    label: '10 Videos',
    tooltip: 'Watched 10 videos',
  },
  video_50: {
    icon: '/assets/images/icons/dashboard-1.png',
    label: '50 Videos',
    tooltip: 'Watched 50 videos',
  },
  course_complete: {
    icon: '/assets/images/icons/dashboard-4.png',
    label: 'Course Done',
    tooltip: 'Completed a course',
  },
  early_bird: {
    icon: '/assets/images/icons/dashboard-5.png',
    label: 'Early Bird',
    tooltip: 'Started learning early',
  },
  night_owl: {
    icon: '/assets/images/icons/dashboard-5.png',
    label: 'Night Owl',
    tooltip: 'Late night learner',
  },
  // Fallback for unknown badge types
  default: {
    icon: '/assets/images/icons/dashboard-1.png',
    label: 'Achievement',
    tooltip: 'Badge earned',
  },
};

export const getBadgeConfig = (badgeType) => {
  if (!badgeType) return BADGE_CONFIG.default;
  const key = String(badgeType).toLowerCase().replace(/-/g, '_');
  return BADGE_CONFIG[key] || {
    ...BADGE_CONFIG.default,
    label: formatBadgeLabel(badgeType),
    tooltip: `Earned: ${formatBadgeLabel(badgeType)}`,
  };
};

function formatBadgeLabel(badgeType) {
  return String(badgeType)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
