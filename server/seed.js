import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const questions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    category: "geography",
    difficulty: "easy",
    points: 10,
    timeLimit: 30
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    category: "science",
    difficulty: "easy",
    points: 10,
    timeLimit: 30
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "4",
    category: "general",
    difficulty: "easy",
    points: 10,
    timeLimit: 20
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare",
    category: "entertainment",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean",
    category: "geography",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: "1945",
    category: "history",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: "Au",
    category: "science",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "How many continents are there?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    category: "geography",
    difficulty: "easy",
    points: 10,
    timeLimit: 25
  },
  {
    question: "What is the speed of light in vacuum?",
    options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
    correctAnswer: "300,000 km/s",
    category: "science",
    difficulty: "hard",
    points: 20,
    timeLimit: 40
  },
  {
    question: "Which sport is played at Wimbledon?",
    options: ["Football", "Tennis", "Basketball", "Golf"],
    correctAnswer: "Tennis",
    category: "sports",
    difficulty: "easy",
    points: 10,
    timeLimit: 25
  },
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: "2",
    category: "general",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    category: "entertainment",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
    category: "science",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  },
  {
    question: "In which country is the Great Wall located?",
    options: ["Japan", "China", "India", "Korea"],
    correctAnswer: "China",
    category: "geography",
    difficulty: "easy",
    points: 10,
    timeLimit: 25
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Diamond", "Platinum", "Titanium"],
    correctAnswer: "Diamond",
    category: "science",
    difficulty: "medium",
    points: 15,
    timeLimit: 30
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindspark-quiz');
    console.log('✅ Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert seed questions
    await Question.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} questions`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

