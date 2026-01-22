// Check Answers Data - Complete Questions with Results

export const answersData = [
  {
    id: 1,
    status: 'correct',
    question: "Which sorting algorithm uses the divide-and-conquer approach?",
    options: [
      { text: "A. Bubble Sort", correct: false, wrong: false },
      { text: "B. Insertion Sort", correct: false, wrong: false },
      { text: "C. Quick Sort", correct: true, wrong: false },
      { text: "D. Selection Sort", correct: false, wrong: false }
    ]
  },
  {
    id: 2,
    status: 'correct',
    question: "Which sorting algorithm is stable?",
    options: [
      { text: "A. Quick Sort", correct: false, wrong: false },
      { text: "B. Heap Sort", correct: false, wrong: false },
      { text: "C. Merge Sort", correct: true, wrong: false },
      { text: "D. Selection Sort", correct: false, wrong: false }
    ]
  },
  {
    id: 3,
    status: 'correct',
    question: "What is the best-case time complexity of Bubble Sort (with optimization)?",
    options: [
      { text: "A. O(n²)", correct: false, wrong: false },
      { text: "B. O(n log n)", correct: false, wrong: false },
      { text: "C. O(n)", correct: true, wrong: false },
      { text: "D. O(log n)", correct: false, wrong: false }
    ]
  },
  {
    id: 4,
    status: 'skipped',
    question: "Insertion Sort is efficient for small datasets.",
    options: [
      { text: "True", correct: false, wrong: false },
      { text: "False", correct: false, wrong: false }
    ],
    explanation: "Insertion Sort is efficient for small datasets because it has a low overhead and performs well with fewer elements. The algorithm builds a sorted array one element at a time, making it quick to insert new elements into their correct position. For small datasets, the simplicity of the algorithm allows it to run faster than more complex sorting algorithms, which may have higher setup costs. Additionally, when the dataset is nearly sorted, Insertion Sort can achieve optimal performance, making it a practical choice for small or partially sorted datasets."
  },
  {
    id: 5,
    status: 'correct',
    question: "Which sorting algorithm has a worst-case time complexity of O(n²)?",
    options: [
      { text: "A. Merge Sort", correct: false, wrong: false },
      { text: "B. Quick Sort", correct: false, wrong: false },
      { text: "C. Heap Sort", correct: false, wrong: false },
      { text: "D. Bubble Sort", correct: true, wrong: false }
    ]
  },
  {
    id: 6,
    status: 'correct',
    question: "Merge Sort requires additional memory space.",
    options: [
      { text: "True", correct: true, wrong: false },
      { text: "False", correct: false, wrong: false }
    ]
  },
  {
    id: 7,
    status: 'incorrect',
    question: "Which sorting algorithm is not comparison-based?",
    options: [
      { text: "A. Merge Sort", correct: false, wrong: true },
      { text: "B. Quick Sort", correct: false, wrong: false },
      { text: "C. Counting Sort", correct: true, wrong: false },
      { text: "D. Insertion Sort", correct: false, wrong: false }
    ],
    explanation: "Counting Sort is a non-comparison-based sorting algorithm that operates by counting the occurrences of each unique element in the input. It then uses this count to determine the position of each element in the sorted output. This method is particularly efficient for sorting integers or objects with a limited range of values, as it avoids the overhead of comparison operations found in traditional sorting algorithms."
  },
  {
    id: 8,
    status: 'correct',
    question: "Which sorting algorithm has a worst-case time complexity of O(n²)?",
    options: [
      { text: "A. Selection Sort", correct: true, wrong: false },
      { text: "B. Bubble Sort", correct: false, wrong: false },
      { text: "C. Merge Sort", correct: false, wrong: false },
      { text: "D. Heap Sort", correct: false, wrong: false }
    ]
  },
  {
    id: 9,
    status: 'correct',
    question: "Quick Sort always performs better than Merge Sort.",
    options: [
      { text: "True", correct: false, wrong: false },
      { text: "False", correct: true, wrong: false }
    ]
  },
  {
    id: 10,
    status: 'correct',
    question: "What is the average-case time complexity of Quick Sort?",
    options: [
      { text: "A. O(n²)", correct: false, wrong: false },
      { text: "B. O(n log n)", correct: true, wrong: false },
      { text: "C. O(n)", correct: false, wrong: false },
      { text: "D. O(log n)", correct: false, wrong: false }
    ]
  }
];

export const answerStats = {
  total: 10,
  correct: 8,
  incorrect: 1,
  skipped: 1
};