/**
 * Tutor Course Inner page - static data matching design image.
 * Course: Additional Mathematics. Chapters with status (Published/Draft/Pending/Rejected) and lesson cards.
 */

export const tutorCourseInnerMeta = {
  id: 1,
  title: 'Additional Mathematics',
  subject: 'Mathematics',
  level: 'Form 4',
  videos: 12,
  quizzes: 8,
  students: 67,
};

/** Chapter status: Published (green), Draft (light grey), Pending (orange), Rejected (red) */
export const tutorCourseInnerChapters = [
  {
    id: 1,
    title: 'Chapter 1: Introduction',
    status: 'Published',
    classesCount: 3,
    totalMins: 45,
    lessons: [
      { id: 101, title: 'Welcome to the Course', status: 'Published', completed: 3, total: 3, mins: 15 },
      { id: 102, title: 'Prerequisites Check', status: 'Pending', completed: 3, total: 3, mins: 15 },
      { id: 103, title: 'Setting up the Environment', status: 'Draft', completed: 3, total: 3, mins: 15 },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: React Performance',
    status: 'Draft',
    classesCount: 3,
    totalMins: 45,
    lessons: [
      { id: 201, title: 'Welcome to the Course', status: 'Rejected', completed: 3, total: 3, mins: 15 },
      { id: 202, title: 'Prerequisites Check', status: 'Published', completed: 3, total: 3, mins: 15 },
      { id: 203, title: 'Setting up the Environment', status: 'Published', completed: 3, total: 3, mins: 15 },
    ],
  },
  {
    id: 3,
    title: 'Chapter 3: Dynamic Programming',
    status: 'Pending',
    classesCount: 4,
    totalMins: 60,
    lessons: [
      { id: 301, title: 'Welcome to the Course', status: 'Pending', completed: 3, total: 3, mins: 15 },
      { id: 302, title: 'Prerequisites Check', status: 'Rejected', completed: 3, total: 3, mins: 15 },
      { id: 303, title: 'Setting up the Environment', status: 'Draft', completed: 3, total: 3, mins: 15 },
      { id: 304, title: 'Welcome to the Course', status: 'Published', completed: 3, total: 3, mins: 15 },
    ],
  },
  {
    id: 4,
    title: 'Chapter 4: Graph Algorithms',
    status: 'Rejected',
    classesCount: 2,
    totalMins: 30,
    lessons: [
      { id: 401, title: 'Welcome to the Course', status: 'Draft', completed: 3, total: 3, mins: 15 },
      { id: 402, title: 'Prerequisites Check', status: 'Draft', completed: 3, total: 3, mins: 15 },
    ],
  },
];

/**
 * Chapter detail page (View Chapter Details) - static data for one chapter.
 * Banner: Form 4, Mathematics, Additional Mathematics, 3 Videos, 3 Quizzes, 45 mins.
 * About this chapter + Lessons list.
 */
/** Default lesson titles for padding to 4 cards */
const DEFAULT_LESSON_TITLES = ['Welcome to the Course', 'Prerequisites Check', 'Setting up the Environment', 'Course Overview'];

export const getChapterDetailByChapterId = (chapterId) => {
  const chapter = tutorCourseInnerChapters.find((ch) => ch.id === Number(chapterId));
  if (!chapter) return null;
  const courseMeta = tutorCourseInnerMeta;
  // Chapter detail page: show 4 lesson cards, all Published
  const baseLessons = chapter.lessons.slice(0, 4);
  const lessons = Array.from({ length: 4 }, (_, i) => {
    const src = baseLessons[i];
    return src
      ? { ...src, status: 'Published' }
      : { id: chapter.id * 100 + i, title: DEFAULT_LESSON_TITLES[i], status: 'Published', completed: 3, total: 3, mins: 15 };
  });
  return {
    ...chapter,
    lessons,
    courseTitle: courseMeta.title,
    subject: courseMeta.subject,
    level: courseMeta.level,
    videos: chapter.classesCount,
    quizzes: 3,
    totalMins: chapter.totalMins,
    aboutHeading: 'About this chapter',
    aboutDescription:
      'Master the art of UX strategy and learn how to align user experience design with business goals. This comprehensive course covers advanced research methods, Stakeholder management, and strategic planning frameworks used by top tech companies.',
    aboutBulletTitle: 'You will dive deep into:',
    aboutBullets: [
      'Conducting qualitative and quantitative user research at scale.',
      'Creating value proposition canvases and customer journey maps.',
      'Defining IJX metrics and KPIs that matter to stakeholders.',
    ],
  };
};
