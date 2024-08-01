import 'dotenv/config';
import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const MONGODB_USER = process.env.MONGODB_USER;
    const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
    const MONGODB_URL = process.env.MONGODB_URL;
    const MONGODB_DB = process.env.MONGODB_DB;

    console.log('Please wait, connecting to the database.');

    await mongoose.connect(
      `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`
    );

    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};
