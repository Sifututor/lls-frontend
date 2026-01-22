// Dashboard Data - Easy to replace with API
export const statsData = [
  {
    id: 1,
    type: 'blue',
    label: '↑ 2 this week',
    icon: '/assets/images/icons/042-graduation.svg',
    value: 12,
    title: 'Courses Enrolled',
    progressText: 'Progress',
    progressValue: '12 of 20',
    progress: 60,
    targetValue: 20
  },
  {
    id: 2,
    type: 'purple',
    label: '↑ 24 this week',
    icon: '/assets/images/icons/140-video.svg',
    value: 148,
    title: 'Videos Watched',
    progressText: 'Progress',
    progressValue: '148 of 200',
    progress: 74,
    targetValue: 200
  },
  {
    id: 3,
    type: 'green',
    label: '↑ 3% this month',
    icon: '/assets/images/icons/001-analytics.svg',
    value: '92%',
    title: 'Quiz Average',
    progressText: 'Performance',
    progressValue: 'Excellent',
    progress: 92
  },
  {
    id: 4,
    type: 'orange',
    label: '↑ 8h this week',
    icon: '/assets/images/icons/127-time.svg',
    value: '48h',
    title: 'Learning Time',
    progressText: 'Weekly Goal',
    progressValue: '48 of 100h',
    progress: 48,
    targetValue: 100
  }
];

export const liveClassesData = [
  {
    id: 1,
    slug: 'color-psychology-workshop',
    thumbnail: '/assets/images/live-classes.png',
    status: 'ongoing',
    subject: 'biology',
    duration: '60 Min',
    title: 'Data Structures & Algorith...',
    instructor: {
      name: 'Sarah Jenkins',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    mainTitle: 'Color Psychology Workshop',
    meta: 'Form 5 • Chapter 3/12',
    description: 'Understanding color psychology in UI. Live A&A Session',
    buttonType: 'join'
  },
  {
    id: 2,
    slug: 'color-psychology-workshop-2',
    thumbnail: '/assets/images/live-classes.png',
    status: 'ongoing',
    subject: 'biology',
    duration: '60 Min',
    title: 'Data Structures & Algorith...',
    instructor: {
      name: 'Sarah Jenkins',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    mainTitle: 'Color Psychology Workshop',
    meta: 'Form 5 • Chapter 3/12',
    description: 'Understanding color psychology in UI. Live A&A Session',
    buttonType: 'join'
  },
  {
    id: 3,
    slug: 'design-thinking-education',
    thumbnail: '/assets/images/live-classes.png',
    status: 'upcoming',
    subject: 'biology',
    duration: '90 Min',
    title: 'Data Structures & Algorith...',
    instructor: {
      name: 'Aminah Zain',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    mainTitle: 'Design Thinking in Education',
    meta: 'Form 5 • Chapter 3/12',
    description: 'Exploring design thinking methodologies for effective teaching.',
    buttonType: 'notify'
  },
  {
    id: 4,
    slug: 'design-thinking-education-2',
    thumbnail: '/assets/images/live-classes.png',
    status: 'scheduled',
    subject: 'biology',
    duration: '90 Min',
    title: 'Data Structures & Algorith...',
    instructor: {
      name: 'Aminah Zain',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    mainTitle: 'Design Thinking in Education',
    meta: 'Form 5 • Chapter 3/12',
    description: 'Exploring design thinking methodologies for effective teaching.',
    buttonType: 'notify'
  }
];

export const coursesData = [
  {
    id: 1,
    slug: 'advanced-mechanics-forces-motion',
    thumbnail: '/assets/images/live-classes.png',
    badge: 'physics',
    lastWatched: true,
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Advanced Mechanics: Forces & Motion',
    chapter: 'Form 5 • Chapter 3/12',
    progress: 35
  },
  {
    id: 2,
    slug: 'advanced-mechanics-forces-motion-2',
    thumbnail: '/assets/images/live-classes.png',
    badge: 'physics',
    lastWatched: false,
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Advanced Mechanics: Forces & Motion',
    chapter: 'Form 5 • Chapter 3/12',
    progress: 35
  },
  {
    id: 3,
    slug: 'advanced-mechanics-forces-motion-3',
    thumbnail: '/assets/images/live-classes.png',
    badge: 'physics',
    lastWatched: false,
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Advanced Mechanics: Forces & Motion',
    chapter: 'Form 5 • Chapter 3/12',
    progress: 35
  },
  {
    id: 4,
    slug: 'advanced-mechanics-forces-motion-4',
    thumbnail: '/assets/images/live-classes.png',
    badge: 'physics',
    lastWatched: false,
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Advanced Mechanics: Forces & Motion',
    chapter: 'Form 5 • Chapter 3/12',
    progress: 35
  }
];

export const qaData = [
  {
    id: 1,
    slug: 'algebra-introduction-indices',
    avatar: 'A',
    avatarColor: 'algebra',
    title: 'Algebra - Introduction to Indices',
    time: '2 Hours ago',
    status: 'answered',
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    subject: 'physics',
    question: 'How to solve simultaneous equations?',
    upvotes: 12,
    answers: 5
  },
  {
    id: 2,
    slug: 'sejarah-introduction-indices',
    avatar: 'S',
    avatarColor: 'sejarah',
    title: 'Sejarah - Introduction to Indices',
    time: '3 Hours ago',
    status: 'answered',
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    subject: 'physics',
    question: 'What was the impact of the British on local culture?',
    upvotes: 22,
    answers: 7
  },
  {
    id: 3,
    slug: 'chemistry-introduction-indices',
    avatar: 'C',
    avatarColor: 'chemistry',
    title: 'Chemistry - Introduction to Indices',
    time: '4 Hours ago',
    status: 'unanswered',
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    subject: 'physics',
    question: 'How does the Haber process affect industry?',
    upvotes: 8,
    answers: 2
  }
];

export const achievementBadges = [
  { id: 1, icon: '/assets/images/icons/dashboard-1.png', alt: 'Trophy' },
  { id: 2, icon: '/assets/images/icons/dashboard-2.png', alt: 'Graduation Cap' },
  { id: 3, icon: '/assets/images/icons/dashboard-3.png', alt: 'Fire' },
  { id: 4, icon: '/assets/images/icons/dashboard-4.png', alt: 'Star' },
  { id: 5, icon: '/assets/images/icons/dashboard-5.png', alt: 'Calendar' },
  { id: 6, icon: '/assets/images/icons/dashboard-6.png', alt: 'Users' }
];