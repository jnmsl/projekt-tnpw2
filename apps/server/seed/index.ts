import { faker } from '@faker-js/faker';
import { connect, ConnectOptions } from 'mongoose';
import { User } from '../src/models/user';
import { Post } from '../src/models/post';
import { getModelForClass } from '@typegoose/typegoose';
import dotenv from 'dotenv';

const UserModel = getModelForClass(User);
const PostModel = getModelForClass(Post);

dotenv.config();

const mongodb: string = process.env.MONGODB_URI as string;

const createFakeUsers = async (numUsers: number) => {
  for (let i = 0; i < numUsers; i++) {
    const newUser = new UserModel({
      username: faker.internet.userName(),
      hashedPassword: faker.internet.password(),
    });

    await newUser.save();
  }
};

const createFakePosts = async (numPosts: number) => {
  const users = await UserModel.find();

  for (let i = 0; i < numPosts; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const newPost = new PostModel({
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      user: randomUser,
    });

    await newPost.save();
  }
};

const seedDatabase = async () => {
  await connect(mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
    .then((res) => {
      console.log('Database connected successfully.');
    })
    .catch((err) => {
      console.log('Database connection failed.');
    });

  console.log('Database connected successfully.');

  await UserModel.deleteMany({});
  await PostModel.deleteMany({});

  console.log('Deleted existing Users and Posts.');

  await createFakeUsers(10);
  console.log('Created 10 fake Users.');

  await createFakePosts(50);
  console.log('Created 50 fake Posts.');

  process.exit(0);
};

seedDatabase();
