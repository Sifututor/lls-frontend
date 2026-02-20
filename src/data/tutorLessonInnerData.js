/**
 * Tutor Lesson Inner – Static Data (Exact from Figma Image)
 */

export const tutorLessonInnerData = {
  headerTags: ['Form 4', 'Mathematics', 'Additional Mathematics', '15 Minutes', '87 Students'],
  lessonTitle: 'Welcome to the Course',
  seriesTag: 'Published',
  
  lessonInfo: {
    title: 'Algorithmic Efficiency',
    description: 'This lesson explores Big O notation, time complexity, and space complexity. By the end of this lesson, you\'ll be able to analyze algorithms and improve their efficiency.',
    lastUpdated: 'Last updated: Jan 2026',
    language: 'Bahasa Melayu'
  },

  video: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '/assets/images/course-details-img.jpg',
  },

  downloads: [
    { id: 1, name: 'Light_Waves_S...', fullName: 'Light_Waves_Study_Guide.pdf', size: '1.2 MB' },
    { id: 2, name: 'Experiment_Da...', fullName: 'Experiment_Data.zip', size: '210 MB' },
  ],

  totalCommentsCount: '1.2k',
  commentFilters: ['Unanswered', 'Answered', 'Latest', 'Oldest', 'Upvoted'],
  commentPlaceholder: 'Share your thoughts...',
  replyPlaceholder: 'Submit you answer',

  comments: [
    {
      id: 1,
      userName: 'Ahmad Kamal',
      avatar: '/assets/images/avatars/student1.jpg',
      time: '4 days ago',
      text: 'The explanation of diffraction was very helpful! I finally understand how it applies to optical fibers. Thanks, Cikgu!',
      answered: false,
      pinned: true,
      replies: [],
    },
    {
      id: 2,
      userName: 'Siti Aminah',
      avatar: '/assets/images/avatars/student2.jpg',
      time: '4 days ago',
      text: 'Can anyone explain the difference between constructive and destructive interference in simpler terms? I\'m still a bit confused.',
      answered: true,
      pinned: false,
      answerText: 'Constructive interference happens when two waves meet and combine to make a bigger wave. Think of it like two friends pushing a swing together, making it go higher. On the other hand, destructive interference occurs when two waves meet and cancel each other out, like two friends pulling a swing in opposite directions, making it stop. So, constructive adds up, while destructive takes away!',
      replies: [],
    },
    {
      id: 3,
      userName: 'Lee Wei',
      avatar: '/assets/images/avatars/student3.jpg',
      time: '4 days ago',
      text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
      answered: true,
      pinned: true,
      answerText: 'Yes, there is a practice quiz available for this topic! It\'s a great way to test your understanding before the school exam. You can find it on the course website or ask your teacher for access.',
      replies: [
        {
          userName: 'Lee Wei',
          avatar: '/assets/images/avatars/student3.jpg',
          time: '4 days ago',
          text: 'Is there a practice quiz for this topic? I want to test my understanding before the school exam.',
          answerText: 'Yes, there is a practice quiz available for this topic! It\'s a great way to test your understanding before the school exam. You can find it on the course website or ask your teacher for access.',
        }
      ],
      replyCount: 8,
    },
    {
      id: 4,
      userName: 'Ravi Kumar',
      avatar: '/assets/images/avatars/student4.jpg',
      time: '4 days ago',
      text: 'How does the refractive index affect the speed of light in different mediums? I need some clarification.',
      answered: false,
      pinned: true,
      replies: [],
    },
    {
      id: 5,
      userName: 'Lim Mei Ling',
      avatar: '/assets/images/avatars/student5.jpg',
      time: '4 days ago',
      text: 'Can we get more examples of how these concepts are applied in real-world technologies?',
      answered: true,
      pinned: false,
      answerText: 'Constructive interference is used in technologies like noise-canceling headphones, where sound waves combine to enhance desired sounds while reducing unwanted noise. Destructive interference is applied in various fields, such as in the design of certain types of antennas, where it helps to minimize signal interference. Another example is in optical coatings, like those on camera lenses, where constructive interference enhances specific wavelengths of light for clearer images, while destructive interference reduces glare.',
      replies: [],
    },
  ],

  enrolledStudents: [
    { id: 1, name: 'Alice Johnson', stid: 'ST001', attended: 'Yes', duration: '3 months', quizAttended: '3', performance: '85%' },
    { id: 2, name: 'Brian Smith', stid: 'ST002', attended: 'Yes', duration: '5 months', quizAttended: '5', performance: '72%' },
    { id: 3, name: 'David Brown', stid: 'ST004', attended: 'Yes', duration: '4 months', quizAttended: '4', performance: '80%' },
    { id: 4, name: 'Catherine Lee', stid: 'ST003', attended: 'No', duration: '2 months', quizAttended: '0', performance: '15%' },
    { id: 5, name: 'Henry Adams', stid: 'ST008', attended: 'Yes', duration: '5 months', quizAttended: '5', performance: '45%' },
    { id: 6, name: 'Grace Hall', stid: 'ST007', attended: 'No', duration: '3 months', quizAttended: '0', performance: '90%' },
    { id: 7, name: 'Frank King', stid: 'ST006', attended: 'Yes', duration: '1 month', quizAttended: '1', performance: '85%' },
    { id: 8, name: 'Eva White', stid: 'ST005', attended: 'Yes', duration: '6 months', quizAttended: '6', performance: '80%' },
    { id: 9, name: 'Jack Taylor', stid: 'ST010', attended: 'No', duration: '2 months', quizAttended: '0', performance: '40%' },
    { id: 10, name: 'Isabella Walker', stid: 'ST009', attended: 'Yes', duration: '4 months', quizAttended: '4', performance: '85%' },
  ],
};

export const getTutorLessonInnerByLessonId = (lessonId) => {
  return {
    ...tutorLessonInnerData,
    video: tutorLessonInnerData.video,
    downloads: tutorLessonInnerData.downloads,
    comments: tutorLessonInnerData.comments,
    enrolledStudents: tutorLessonInnerData.enrolledStudents,
  };
};

export default tutorLessonInnerData;