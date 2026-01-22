// Browse Course Details Data - All in One File
export const browseCourseData = {
  id: 1,
  badges: [
    { type: 'subject', text: 'Mathematics', color: '#4CAF50' },
    { type: 'language', text: 'Language: EN' },
    { type: 'updated', text: 'Last updated on : 18/12/2025' }
  ],
  title: 'Advanced Calculus: Differentiation & Integration',
  instructor: {
    name: 'Sarah Jenkins',
    avatar: '/assets/images/icons/Ellipse 2.svg',
    rating: 4.9,
    reviews: 1240
  },
  duration: '12 Weeks',
  stats: {
    lessons: 24,
    quizzes: 8,
    enrolledStudents: '3.5K',
    learningHours: '10.3 Hours'
  },
  about: {
    title: 'About this course',
    description: 'Master the art of UX strategy and learn how to align user experience design with business goals. This comprehensive course covers advanced research methods, Stakeholder management, and strategic planning frameworks used by top tech companies.',
    learningPoints: [
      'Conducting qualitative and quantitative user research at scale.',
      'Creating value proposition canvases and customer journey maps.',
      'Defining UX metrics and KPIs that matter to stakeholders.'
    ]
  },
  courseContent: [
    {
      id: 1,
      title: 'Foundation of UX Strategy',
      subtitle: 'Form 5 • 24 Lessons',
      lessons: 24
    },
    {
      id: 2,
      title: 'Foundation of UX Strategy',
      subtitle: 'Form 5 • 24 Lessons',
      lessons: 24
    },
    {
      id: 3,
      title: 'Foundation of UX Strategy',
      subtitle: 'Form 5 • 24 Lessons',
      lessons: 24
    }
  ],
  upcomingClass: {
    id: 1,
    title: 'Q&A: Strategy Stakeholder Workshops',
    datetime: 'Thursday, Oct 24 • 14:00 PM',
    thumbnail: '/assets/images/live-classes.png',
    isPremium: true,
    premiumText: 'Exclusive for Premium Enrolled Students'
  },
  relatedCourses: [
    {
      id: 2,
      thumbnail: '/assets/images/live-classes.png',
      instructor: {
        name: 'Siti Sarah',
        avatar: '/assets/images/icons/Ellipse 2.svg'
      },
      title: 'UI Design Fundamentals',
      subtitle: 'Form 5 • Chapter 3/12'
    },
    {
      id: 3,
      thumbnail: '/assets/images/live-classes.png',
      instructor: {
        name: 'Siti Sarah',
        avatar: '/assets/images/icons/Ellipse 2.svg'
      },
      title: 'UI Design Fundamentals',
      subtitle: 'Form 5 • Chapter 3/12'
    }
  ]
};