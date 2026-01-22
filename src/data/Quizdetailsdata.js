// Quiz Details Data - Ready for API Integration

export const quizDetailsData = {
  id: 1,
  title: 'Why Performance Matters',
  badges: [
    'Form 5',
    'Computer Science',
    'Data Structures & Algorithm Optimization',
    'Chapter 2: React Performance'
  ],
  instructor: {
    name: 'Puan Siti Farah',
    avatar: '/assets/images/icons/Ellipse 2.svg'
  },
  description: 'This test evaluates your understanding of basic and advanced sorting algorithms including implementation, complexity analysis, and practical applications.',
  
  stats: [
    {
      icon: '/assets/images/icons/003-alarm.svg',
      label: 'Duration',
      value: '25 Minutes',
      size: 'short'
    },
    {
      icon: '/assets/images/icons/046-teacher.svg',
      label: 'Questions',
      value: '10 Questions',
      size: 'short'
    },
    {
      icon: '/assets/images/icons/055-notes.svg',
      label: 'Test Type',
      value: 'MCQ + True/False',
      size: 'long'
    },
    {
      icon: '/assets/images/icons/060-favorite.svg',
      label: 'Attempts',
      value: '2/3',
      size: 'short'
    },
    {
      icon: '/assets/images/icons/047-trophy.svg',
      label: 'Passing Score',
      value: '70% Required',
      size: 'medium'
    }
  ],
  
  topics: [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Time & Space Complexity',
    'Stable vs Unstable Sorting',
    'Best, Worst, Average Case Analysis'
  ],
  
  instructions: {
    general: [
      'You must complete the test in one sitting',
      'Timer starts immediately after you click Start Test',
      'You cannot pause or reset the timer',
      'Do not refresh or close the browser tab',
      'Once submitted, answers cannot be changed'
    ],
    behavior: [
      'You can move between questions freely'
    ],
    submission: [
      'Test auto-submits when time ends',
      'Score is shown immediately after submission'
    ]
  },
  
  requirements: {
    device: [
      {
        icon: '/assets/images/icons/035-desktop.svg',
        text: 'Use a laptop or desktop for best experience'
      },
      {
        icon: '/assets/images/icons/003-chart.svg',
        text: 'Stable internet connection required'
      }
    ],
    rules: [
      {
        icon: '/assets/images/icons/057-error sign.svg',
        text: 'Phone calls during test',
        allowed: false
      },
      {
        icon: '/assets/images/icons/057-error sign.svg',
        text: 'Switching browser tabs',
        allowed: false
      },
      {
        icon: '/assets/images/icons/057-error sign.svg',
        text: 'Copy/paste functionality',
        allowed: false
      },
      {
        icon: '/assets/images/icons/022-check.svg',
        text: 'Pen and paper for rough work',
        allowed: true
      }
    ]
  },
  
  questionTypes: [
    {
      type: 'MCQ',
      icon: '/assets/images/icons/MCQ.png',
      description: 'Multiple choice questions testing conceptual understanding',
      className: 'mcq-card'
    },
    {
      type: 'True/False',
      icon: '/assets/images/icons/Truefalse.png',
      description: 'True or false questions assessing conceptual clarity.',
      className: 'truefalse-card'
    }
  ]
};

// Multiple quiz samples for different subjects
export const quizzesList = [
  {
    id: 1,
    ...quizDetailsData
  },
  {
    id: 2,
    title: 'Sorting Algorithms Fundamentals',
    badges: ['Form 5', 'Computer Science', 'Chapter 1: Introduction'],
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    description: 'Test your knowledge of fundamental sorting algorithms.',
    stats: [
      { icon: '/assets/images/icons/003-alarm.svg', label: 'Duration', value: '20 Minutes', size: 'short' },
      { icon: '/assets/images/icons/046-teacher.svg', label: 'Questions', value: '8 Questions', size: 'short' },
      { icon: '/assets/images/icons/055-notes.svg', label: 'Test Type', value: 'MCQ', size: 'long' },
      { icon: '/assets/images/icons/060-favorite.svg', label: 'Attempts', value: '1/3', size: 'short' },
      { icon: '/assets/images/icons/047-trophy.svg', label: 'Passing Score', value: '60% Required', size: 'medium' }
    ],
    topics: ['Bubble Sort', 'Selection Sort', 'Insertion Sort'],
    instructions: quizDetailsData.instructions,
    requirements: quizDetailsData.requirements,
    questionTypes: quizDetailsData.questionTypes
  }
];