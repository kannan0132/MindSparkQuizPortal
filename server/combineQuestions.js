// Final script to combine all questions and update seedData.js
import fs from 'fs';
import { questions as existingQuestions } from './seedData.js';
import expandedQuestions from './batch2Questions.js';

// Read the generated questions from batch 1
const batch1Content = fs.readFileSync('./seedData_new.js', 'utf8');
const batch1Match = batch1Content.match(/export const questions = (\[[\s\S]*\]);/);
const batch1Questions = JSON.parse(batch1Match[1]);

// Get only the new questions from batch 1 (exclude existing ones)
const newBatch1Questions = batch1Questions.slice(existingQuestions.length);

// Combine all questions
const allQuestions = [...existingQuestions, ...newBatch1Questions, ...expandedQuestions];

// Write final seedData.js
const output = `export const questions = ${JSON.stringify(allQuestions, null, 4)};\n`;
fs.writeFileSync('./seedData.js', output);

console.log(`\n✅ Successfully updated seedData.js!`);
console.log(`📊 Question Statistics:`);
console.log(`   - Total Questions: ${allQuestions.length}`);
console.log(`   - Existing: ${existingQuestions.length}`);
console.log(`   - Batch 1 (Geography + Science): ${newBatch1Questions.length}`);
console.log(`   - Batch 2 (History + Entertainment + Sports + Astronomy + General): ${expandedQuestions.length}`);

// Count by category
const categoryCount = {};
allQuestions.forEach(q => {
    categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
});

console.log(`\n📁 Questions by Category:`);
Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   - ${cat}: ${count}`);
});

// Count by difficulty
const difficultyCount = {};
allQuestions.forEach(q => {
    difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1;
});

console.log(`\n⚡ Questions by Difficulty:`);
Object.entries(difficultyCount).sort((a, b) => b[1] - a[1]).forEach(([diff, count]) => {
    console.log(`   - ${diff}: ${count}`);
});

console.log(`\n🎯 Ready to seed the database!`);
console.log(`   Run: node seed.js`);
