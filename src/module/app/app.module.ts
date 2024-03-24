import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from '@/connection/database/mongodb/mongodb.module';
import { AdminModule } from '../admin/admin.module';
import { LotteryModule } from '../lottery/lottery.module';
import { SocketGateway } from '@/connection/socket/socket.gateway';
import { OnStartUpServerService } from '@/service/onStartUpServer/onStartUpServer.service';
import { LotteryRandomConfigModule } from '../lotteryRandomConfig/lotteryRandomConfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MongodbModule,
    AdminModule,
    LotteryModule,
    LotteryRandomConfigModule,
  ],
  // controllers: [],
  providers: [SocketGateway, OnStartUpServerService],
})
export class AppModule {}
