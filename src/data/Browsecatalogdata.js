// Browse Catalog Data - All Available Courses

export const browseCatalogData = [
  {
    id: 1,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Mathematics',
    formLevel: 'Form 5',
    instructor: {
      name: 'Puan Siti Farah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Mathematics: Calculus and Functions',
    lessons: 'Form 5 • 30 Lessons'
  },
  {
    id: 2,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Physics',
    formLevel: 'Form 4',
    instructor: {
      name: 'Cikgu Ravi Kumar',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Physics: Mechanics and Waves',
    lessons: 'Form 4 • 20 Lessons'
  },
  {
    id: 3,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Chemistry',
    formLevel: 'Form 6',
    instructor: {
      name: 'Dr. Lim Wei Ling',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Chemistry: Organic Chemistry Basics',
    lessons: 'Form 6 • 35 Lessons'
  },
  {
    id: 4,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'History',
    formLevel: 'Form 5',
    instructor: {
      name: 'Puan Aisha Noor',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'History: Malaysian Independence Movement',
    lessons: 'Form 5 • 15 Lessons'
  },
  {
    id: 5,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Geography',
    formLevel: 'Form 4',
    instructor: {
      name: 'Cikgu Ahmad Zubir',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Geography: Climate and Resources',
    lessons: 'Form 4 • 25 Lessons'
  },
  {
    id: 6,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Physics',
    formLevel: 'Form 4',
    instructor: {
      name: 'Encik Ahmad Zulkarnain',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Science: Physics Fundamentals with basics',
    lessons: 'Form 4 • 25 Lessons'
  },
  {
    id: 7,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'English',
    formLevel: 'Form 5',
    instructor: {
      name: 'Cik Nurul Aisyah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'English: Literature and Comprehension',
    lessons: 'Form 5 • 20 Lessons'
  },
  {
    id: 8,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'History',
    formLevel: 'Form 4',
    instructor: {
      name: 'Tuan Mohd Rizal',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'History: Malaysian Historical Events',
    lessons: 'Form 4 • 15 Lessons'
  },
  {
    id: 9,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Geography',
    formLevel: 'Form 3',
    instructor: {
      name: 'Puan Lila Khatijah',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Geography: Environmental Studies',
    lessons: 'Form 3 • 18 Lessons'
  },
  {
    id: 10,
    thumbnail: '/assets/images/live-classes.png',
    badge: 'biology',
    subject: 'Computer Science',
    formLevel: 'Form 5',
    instructor: {
      name: 'Cik Farhana Binti',
      avatar: '/assets/images/icons/Ellipse 2.svg'
    },
    title: 'Computer Science: Programming Basics',
    lessons: 'Form 5 • 22 Lessons'
  }
];

export const filterOptions = {
  subjects: [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'History', label: 'History' },
    { value: 'Geography', label: 'Geography' },
    { value: 'English', label: 'English' },
    { value: 'Computer Science', label: 'Computer Science' }
  ],
  formLevels: [
    { value: 'Form 1', label: 'Form 1' },
    { value: 'Form 2', label: 'Form 2' },
    { value: 'Form 3', label: 'Form 3' },
    { value: 'Form 4', label: 'Form 4' },
    { value: 'Form 5', label: 'Form 5' },
    { value: 'Form 6', label: 'Form 6' }
  ],
  tutors: [
    { value: 'Puan Siti Farah', label: 'Puan Siti Farah' },
    { value: 'Cikgu Ravi Kumar', label: 'Cikgu Ravi Kumar' },
    { value: 'Dr. Lim Wei Ling', label: 'Dr. Lim Wei Ling' },
    { value: 'Puan Aisha Noor', label: 'Puan Aisha Noor' },
    { value: 'Cikgu Ahmad Zubir', label: 'Cikgu Ahmad Zubir' },
    { value: 'Encik Ahmad Zulkarnain', label: 'Encik Ahmad Zulkarnain' },
    { value: 'Cik Nurul Aisyah', label: 'Cik Nurul Aisyah' },
    { value: 'Tuan Mohd Rizal', label: 'Tuan Mohd Rizal' },
    { value: 'Puan Lila Khatijah', label: 'Puan Lila Khatijah' },
    { value: 'Cik Farhana Binti', label: 'Cik Farhana Binti' }
  ]
};