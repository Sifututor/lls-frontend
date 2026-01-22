// Quiz Take Data - Complete Questions & Settings

export const quizSettings = {
  totalQuestions: 10,
  timeLimit: 15 * 60, // 15 minutes in seconds
  passingScore: 70, // percentage
  attemptsLeft: 3
};

export const quizQuestions = [
  {
    id: 1,
    question: "Which sorting algorithm uses the divide-and-conquer approach?",
    options: [
      { letter: "A", text: "Bubble Sort" },
      { letter: "B", text: "Insertion Sort" },
      { letter: "C", text: "Quick Sort" },
      { letter: "D", text: "Selection Sort" }
    ],
    correctAnswer: "C"
  },
  {
    id: 2,
    question: "Which sorting algorithm is stable?",
    options: [
      { letter: "A", text: "Quick Sort" },
      { letter: "B", text: "Heap Sort" },
      { letter: "C", text: "Merge Sort" },
      { letter: "D", text: "Selection Sort" }
    ],
    correctAnswer: "C"
  },
  {
    id: 3,
    question: "What is the best-case time complexity of Quick Sort?",
    options: [
      { letter: "A", text: "O(n)" },
      { letter: "B", text: "O(n log n)" },
      { letter: "C", text: "O(n²)" },
      { letter: "D", text: "O(log n)" }
    ],
    correctAnswer: "B"
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best worst-case time complexity?",
    options: [
      { letter: "A", text: "Bubble Sort" },
      { letter: "B", text: "Merge Sort" },
      { letter: "C", text: "Quick Sort" },
      { letter: "D", text: "Selection Sort" }
    ],
    correctAnswer: "B"
  },
  {
    id: 5,
    question: "Insertion Sort works efficiently on which type of data?",
    options: [
      { letter: "A", text: "Large datasets" },
      { letter: "B", text: "Nearly sorted data" },
      { letter: "C", text: "Reverse sorted data" },
      { letter: "D", text: "Random data" }
    ],
    correctAnswer: "B"
  },
  {
    id: 6,
    question: "Which sorting algorithm is in-place?",
    options: [
      { letter: "A", text: "Merge Sort" },
      { letter: "B", text: "Counting Sort" },
      { letter: "C", text: "Bubble Sort" },
      { letter: "D", text: "Radix Sort" }
    ],
    correctAnswer: "C"
  },
  {
    id: 7,
    question: "What is the space complexity of Merge Sort?",
    options: [
      { letter: "A", text: "O(1)" },
      { letter: "B", text: "O(log n)" },
      { letter: "C", text: "O(n)" },
      { letter: "D", text: "O(n log n)" }
    ],
    correctAnswer: "C"
  },
  {
    id: 8,
    question: "Which sorting algorithm uses a pivot element?",
    options: [
      { letter: "A", text: "Merge Sort" },
      { letter: "B", text: "Quick Sort" },
      { letter: "C", text: "Heap Sort" },
      { letter: "D", text: "Selection Sort" }
    ],
    correctAnswer: "B"
  },
  {
    id: 9,
    question: "What is the average time complexity of Bubble Sort?",
    options: [
      { letter: "A", text: "O(n)" },
      { letter: "B", text: "O(n log n)" },
      { letter: "C", text: "O(n²)" },
      { letter: "D", text: "O(log n)" }
    ],
    correctAnswer: "C"
  },
  {
    id: 10,
    question: "Which sorting algorithm is NOT comparison-based?",
    options: [
      { letter: "A", text: "Quick Sort" },
      { letter: "B", text: "Merge Sort" },
      { letter: "C", text: "Counting Sort" },
      { letter: "D", text: "Heap Sort" }
    ],
    correctAnswer: "C"
  }
];

export const quizIcons = {
  correct: '/assets/images/icons/022-check.svg',
  incorrect: '/assets/images/icons/057-error sign.svg',
  skipped: '/assets/images/icons/057-error sign-skip.svg'
};