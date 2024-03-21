// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import mongoose, { Connection } from 'mongoose';

// @Injectable()
// export class DatabaseHealthMiddleware implements NestMiddleware {
//   private mongooseConnection: Connection;

//   constructor() {
//     // Connect to MongoDB
//     this.mongooseConnection = mongoose.createConnection('mongodb://localhost:27017/mydatabase', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     // Handle connection events
//     this.mongooseConnection.on('connected', () => {
//       console.log('Connected to MongoDB');
//     });

//     this.mongooseConnection.on('error', (err) => {
//       console.error(`MongoDB connection error: ${err}`);
//     });
//   }

//   async use(req: Request, res: Response, next: NextFunction) {
//     try {
//       // Check if the MongoDB connection is ready
//       if (this.mongooseConnection.readyState === 1) {
//         next();
//       } else {
//         throw new Error('MongoDB connection is not ready');
//       }
//     } catch (error) {
//       // Handle errors
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// }

// import {
//   Injectable,
//   NestMiddleware,
//   Inject,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { Sequelize } from 'sequelize';

// @Injectable()
// export class DatabaseHealthMiddleware implements NestMiddleware {
//   constructor(@Inject('SEQUELIZE') private readonly sequelize: Sequelize) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     try {
//       await this.sequelize.authenticate();
//       next();
//     } catch (error) {
//       throw new InternalServerErrorException({
//         message: {
//           code: 5000,
//           description: `Connection error`,
//         },
//       });
//     }
//   }
// }
