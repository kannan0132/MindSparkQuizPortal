import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

export const connectDB = async (uri, seedCallback) => {
    try {
        // Try connecting to the provided URI first
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 2000, // Fail fast if local DB isn't running
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.warn('⚠️ Local MongoDB not found. Starting In-Memory Database...');

        try {
            mongod = await MongoMemoryServer.create();
            const mongoUri = mongod.getUri();

            await mongoose.connect(mongoUri);
            console.log('🚀 In-Memory Database started successfully!');

            if (seedCallback) {
                console.log('🌱 Seeding In-Memory Database...');
                await seedCallback();
            }

            console.log('   Note: Data will be lost when the server restarts.');
        } catch (memErr) {
            console.error('❌ Failed to start In-Memory Database:', memErr);
            process.exit(1);
        }
    }
};

export const disconnectDB = async () => {
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
};
