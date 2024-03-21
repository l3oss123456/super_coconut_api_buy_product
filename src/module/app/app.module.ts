import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from '@/connection/database/mongodb/mongodb.module';
import { AdminModule } from '../admin/admin.module';
import { LotteryModule } from '../lottery/lottery.module';
// import { SocketGateway } from '@/connection/socket/socker.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MongodbModule,
    AdminModule,
    LotteryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
