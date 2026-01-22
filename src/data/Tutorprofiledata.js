// Tutor Profile Data - For Reusing Existing Components
export const tutorProfileData = {
  id: 1,
  
  // For BrowseCourseStats component
  stats: {
    lessons: '3,343,651',      // Will show as "Total Learners"
    quizzes: '1,024,859',      // Will show as "Reviews"
    enrolledStudents: '',      // Empty - not needed
    learningHours: ''          // Empty - not needed
  },

  // For BrowseAboutSection component
  about: {
    title: 'About me',
    description: `Greetings! I'm Dr. Siti, a passionate educator from the lively city of Kuala Lumpur. As the head instructor at the esteemed "Code & Grow" academy, I have had the wonderful opportunity to mentor thousands of enthusiastic students throughout Malaysia, guiding them in mastering the intricate art of coding and empowering them to pursue their aspirations in the dynamic tech world.

My journey into coding began when I was just 10 years old, fueled by an unquenchable curiosity and a dream to craft interactive stories that would engage and inspire audiences. Over the years, I have created a diverse range of applications and websites, but I have come to realize that my greatest joy comes from teaching. I am wholeheartedly dedicated to exploring and applying innovative teaching methods that make learning to code not only accessible but also a delightful experience for everyone.

In my courses, I make it a point to incorporate my research insights, ensuring that each lesson is not only educational but also enjoyable and captivating. I firmly believe that when students are genuinely excited about their learning journey, they are far more likely to excel and flourish in their coding endeavors. My goal is to create an environment where curiosity thrives and creativity flourishes, paving the way for the next generation of tech innovators.`,
    learningPoints: []         // Empty - not needed for tutor profile
  },

  // For TutorCard component (new)
  tutorCard: {
    badge: 'Instructor',
    name: 'Dr. Angela Yu',
    role: 'Developer and Lead Instructor',
    socialLinks: [
      {
        name: 'Website',
        icon: '/assets/images/icons/location.svg',
        url: 'https://example.com'
      },
      {
        name: 'LinkedIn',
        icon: '/assets/images/icons/location.svg',
        url: 'https://linkedin.com'
      },
      {
        name: 'Twitter',
        icon: '/assets/images/icons/location.svg',
        url: 'https://twitter.com'
      },
      {
        name: 'Facebook',
        icon: '/assets/images/icons/location.svg',
        url: 'https://facebook.com'
      }
    ]
  },

  // For CourseCard component (reuse)
  courses: [
     {
    id: 1,
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
  ]
};