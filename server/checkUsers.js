import mongoose from 'mongoose';
import Account from './models/Account.js';

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mindspark-quiz');
        console.log('Connected to database');

        const users = await Account.find({}).select('username email createdAt').sort({ createdAt: -1 });

        console.log(`\nTotal registered users: ${users.length}\n`);

        if (users.length > 0) {
            console.log('Registered Users:');
            console.log('================');
            users.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}`);
                console.log(`   Email: ${user.email || 'N/A'}`);
                console.log(`   Joined: ${new Date(user.createdAt).toLocaleString()}`);
                console.log('');
            });
        } else {
            console.log('No users found in database');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUsers();
