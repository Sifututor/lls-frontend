// Course Details Page Data - Ready for API Integration

export const courseData = {
  id: 1,
  title: 'Data Structures & Algorithm Optimization',
  instructor: {
    name: 'Puan Siti Farah',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  badges: [
    { id: 1, text: 'Form 5' },
    { id: 2, text: 'Computer Science' },
    { id: 3, text: '18 Videos' },
    { id: 4, text: '4 Quizzes' }
  ],
  progress: 60,
  video: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/assets/images/course-details-img.jpg'
  }
};

export const currentLesson = {
  title: 'Algorithmic Efficiency',
  description: "This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you'll be able to analyze algorithms and improve their efficiency.",
  lastUpdated: 'Jan 2026',
  language: 'Bahasa Melayu'
};

export const notesData = [
  {
    id: 1,
    timestamp: '00:49:55',
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scramb"
  },
  {
    id: 2,
    timestamp: '00:51:19',
    content: "Convolutional Neural Networks (CNN) for Images aLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
  },
  {
    id: 3,
    timestamp: '00:58:19',
    content: "Generative AI in DetailLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scramb"
  },
  {
    id: 4,
    timestamp: '00:58:19',
    content: 'Popular Generative AI Tools'
  },
  {
    id: 5,
    timestamp: '00:58:19',
    content: 'Natural Language Processing (NLP) and Large Language Models (LLMs)'
  },
  {
    id: 6,
    timestamp: '00:58:19',
    content: 'Computer Vision'
  }
];

export const downloadsData = [
  {
    id: 1,
    name: 'Light_Waves_S...',
    fullName: 'Light_Waves.pdf',
    size: '1.2 MB'
  },
  {
    id: 2,
    name: 'Experiment_Da...',
    fullName: 'Experiment_Data.zip',
    size: '210 MB'
  }
];

export const commentsData = [
  {
    id: 1,
    userName: 'Ahmad Kamal',
    avatar: '/assets/images/icons/Ellipse 2.svg',
    time: '4 days ago',
    text: 'The explanation of diffraction was very helpful! I finally understand how it applies to optical fibers. Thanks, Cikgu!',
    upvotes: 78,
    replies: 8
  },
  {
    id: 2,
    userName: 'Siti Aminah',
    avatar: '/assets/images/icons/Ellipse 2.svg',
    time: '4 days ago',
    text: "Can anyone explain the difference between constructive and destructive interference in simpler terms? I'm still a bit confused.",
    upvotes: 78,
    replies: 8
  },
  {
    id: 3,
    userName: 'Lee Wei',
    avatar: '/assets/images/icons/Ellipse 2.svg',
    time: '4 days ago',
    text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
    upvotes: 78,
    replies: 8
  },
  {
    id: 4,
    userName: 'Ravi Kumar',
    avatar: '/assets/images/icons/Ellipse 2.svg',
    time: '4 days ago',
    text: 'How does the refractive index affect the speed of light in different mediums? I need some clarification.',
    upvotes: 78,
    replies: 8
  }
];

export const courseContentData = [
  {
    id: 1,
    title: 'Chapter 1: Introduction',
    meta: '3/3 • 15 mins • Attempts: 3/5 Left',
    score: '85%',
    completed: true,
    isOpen: true,
    lessons: [
      {
        id: 'ch1-l1',
        title: 'Welcome to the Course',
        duration: '▸ 2:30',
        score: '84%',
        completed: true
      },
      {
        id: 'ch1-l2',
        title: 'Prerequisites Check',
        duration: '▸ 5:15',
        score: '85%',
        completed: true
      },
      {
        id: 'ch1-l3',
        title: 'Setting up the Environment',
        duration: '▸ 7:45',
        score: '86%',
        completed: true
      }
    ],
    buttonText: 'Completed (85% Score)',
    buttonDisabled: false
  },
  {
    id: 2,
    title: 'Chapter 2: React Performance',
    meta: '5/5 • 15 mins • Attempts: 3/5 Left',
    score: null,
    completed: false,
    isOpen: false,
    lessons: [
      {
        id: 'ch2-l1',
        title: 'Why Performance Matters',
        duration: '▸ 10:20',

        completed: false
      },
      {
        id: 'ch2-l2',
        title: 'Understanding Memoization',
        duration: '▸ 12:45',

        completed: false
      },
      {
        id: 'ch2-l3',
        title: 'The useMemo Hook',
        duration: '▸ 8:30',

        completed: false
      },
      {
        id: 'ch2-l4',
        title: 'The useCallback Hook',
        duration: '▸ 15:00',

        completed: false
      },
      {
        id: 'ch2-l5',
        title: 'Profiler API',
        duration: '▸ 09:15',

        completed: false
      }
    ],
    buttonText: 'Start Mock Test (2/3 Attempt Left)',
    buttonDisabled: true
  },
  {
    id: 3,
    title: 'Chapter 3: Dynamic Programming',
    meta: '0/6 • 1h 30 mins',
    score: null,
    completed: false,
    isOpen: false,
    lessons: [
      {
        id: 'ch3-l1',
        title: 'Introduction to DP',
        duration: '▸ 15:00',
        score: '0%',
        completed: false
      },
      {
        id: 'ch3-l2',
        title: 'Memoization Patterns',
        duration: '▸ 18:00',
        score: '0%',
        completed: false
      },
      {
        id: 'ch3-l3',
        title: 'Advanced Techniques',
        duration: '▸ 20:00',
        score: '0%',
        completed: false
      }
    ],
    buttonText: 'Start Mock Test (3/3 Attempt Left)',
    buttonDisabled: true
  },
  {
    id: 4,
    title: 'Chapter 4: Graph Algorithms',
    meta: '0/6 • 1h 30 mins',
    score: null,
    completed: false,
    isOpen: false,
    lessons: [
      {
        id: 'ch4-l1',
        title: 'Graph Basics',
        duration: '▸ 12:00',
        score: '0%',
        completed: false
      },
      {
        id: 'ch4-l2',
        title: 'BFS and DFS',
        duration: '▸ 16:00',
        score: '0%',
        completed: false
      },
      {
        id: 'ch4-l3',
        title: 'Shortest Path Algorithms',
        duration: '▸ 18:00',
        score: '0%',
        completed: false
      }
    ],
    buttonText: 'Start Mock Test (3/3 Attempt Left)',
    buttonDisabled: true
  }
];

export const upcomingClassData = {
  id: 1,
  thumbnail: '/assets/images/live-classes.png',
  status: 'Scheduled',
  time: 'Fri 10:00 AM',
  duration: '60 Min',
  instructor: {
    name: 'Aminah Zain',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  title: 'Design Thinking in Education',
  description: 'Exploring design thinking methodologies for effective teaching.'
};

export const recordedClassData = {
  id: 1,
  thumbnail: '/assets/images/live-classes.png',
  subject: 'Physics',
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
      type: 'ai',
      text: "Hello! I'm ready to help you your calculus studies today. We left off discussing derivatives. Would you like to solve a practice problem or review the chain rule concepts?"
    },
    {
      id: 2,
      type: 'user',
      text: "Let's review chain rule concepts first. I'm still a bit confused about how to apply it when there are trigonometric functions involved."
    }
  ],
  suggestions: [
    "Explain Newton's 2nd Law",
    "Quadratic Formula?"
  ],
  questionsRemaining: 5,
  plan: 'Free Plan'
};