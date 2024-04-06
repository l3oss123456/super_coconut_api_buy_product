import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mongodb_config = {
  uri: `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`,
  // uri: `mongodb://localhost:27017`,
  options: {
    dbName: process.env.MONGODB_DATABASE_NAME,
  },
};

@Module({
  providers: [
    {
      provide: 'MONGODB_CONNECTION',
      useFactory: () => {
        try {
          mongoose.connect(mongodb_config.uri, { ...mongodb_config.options });
          console.log('MongoDB Connected');
        } catch (error) {
          console.log('MongoDB Connection error: ', error);
        }
      },
    },
  ],
})
export class MongodbModule {}
