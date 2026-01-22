// Live Class Details Data
export const liveClassData = {
  badges: [
    { id: 1, text: 'SPM Physics Mastery' }
  ],
  title: 'Advanced Calculus: Differentiation & Integration',
  instructor: {
    name: 'Sarah Jenkins',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  rating: '4.9',
  reviews: '1,240 reviews',
  duration: '12 Weeks',
  video: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/assets/images/live-classes.png'
  }
};

export const currentLesson = {
  title: 'Algorithmic Efficiency',
  description: 'This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you will be able to analyze algorithms and improve their efficiency.',
  lastUpdated: 'Last updated: Jan 2026',
  language: 'Bahasa Melayu'
};

export const notesData = [
  {
    id: 1,
    timestamp: '00:15:23',
    content: 'Important: Remember to analyze time complexity before space complexity'
  },
  {
    id: 2,
    timestamp: '00:28:45',
    content: 'Big O notation represents worst-case scenario'
  },
  {
    id: 3,
    timestamp: '00:42:10',
    content: 'Common complexities: O(1), O(log n), O(n), O(n log n), O(n²)'
  }
];

export const downloadsData = [
  {
    id: 1,
    name: 'Lesson_Notes.pdf',
    fullName: 'Algorithmic_Efficiency_Notes.pdf',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Code_Examples.zip',
    fullName: 'Big_O_Examples.zip',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Practice_Problems.pdf',
    fullName: 'Complexity_Analysis_Problems.pdf',
    size: '3.1 MB'
  }
];

export const commentsData = [
  {
    id: 1,
    userName: 'Ahmad Kamal',
    avatar: '/assets/images/icons/Ellipse 3.svg',
    time: '4 days ago',
    text: 'The explanation of diffraction was very helpful! I finally understand how it applies to optical fibers. Thanks, Cikgu!',
    upvotes: 78,
    replies: 8
  },
  {
    id: 2,
    userName: 'Siti Aminah',
    avatar: '/assets/images/icons/Ellipse 3.svg',
    time: '4 days ago',
    text: 'Can anyone explain the difference between constructive and destructive interference in simpler terms? I am still a bit confused.',
    upvotes: 78,
    replies: 8
  },
  {
    id: 3,
    userName: 'Lee Wei',
    avatar: '/assets/images/icons/Ellipse 3.svg',
    time: '4 days ago',
    text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
    upvotes: 78,
    replies: 8
  },
  {
    id: 4,
    userName: 'Ravi Kumar',
    avatar: '/assets/images/icons/Ellipse 3.svg',
    time: '4 days ago',
    text: 'How does the refractive index affect the speed of light in different mediums? I need some clarification.',
    upvotes: 78,
    replies: 8
  },
  {
    id: 5,
    userName: 'Lim Mei Ling',
    avatar: '/assets/images/icons/Ellipse 3.svg',
    time: '4 days ago',
    text: 'Can we get more examples of how these concepts are applied in real-world technologies?',
    upvotes: 78,
    replies: 8
  }
];

export const upcomingClassData = {
  thumbnail: '/assets/images/live-classes.png',
  status: 'Scheduled',
  time: 'Thu 2:00 PM',
  duration: '90 Min',
  instructor: {
    name: 'Aminah Zain',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  title: 'Design Thinking in Education',
  description: 'Exploring design thinking methodologies for effective teaching.'
};

export const recordedClassData = {
  thumbnail: '/assets/images/live-classes.png',
  subject: 'Biology',
  duration: '60 Min',
  instructor: {
    name: 'Sarah Jenkins',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  title: 'Color Psychology Workshop',
  description: 'Understanding color psychology in UI. Live A&A Session'
};

export const aiChatData = {
  messages: [
    {
      id: 1,
      type: 'user',
      text: 'Can you explain Big O notation?'
    },
    {
      id: 2,
      type: 'ai',
      text: 'Big O notation describes the performance of an algorithm. It shows how the runtime grows as input size increases.'
    }
  ],
  suggestions: [
    'Explain Newtons 2nd Law',
    'Quadratic Formula?'
  ],
  questionsRemaining: 5,
  plan: 'Free Plan'
};