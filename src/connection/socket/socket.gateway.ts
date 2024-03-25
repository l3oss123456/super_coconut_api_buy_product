import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
// import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { ForbiddenException } from '@nestjs/common';
import * as cron from 'node-cron';
import * as R from 'ramda';
import lottery_func from '@/service/lottery/lottery_func';
import lotteryRandomConfig_func from '@/service/lotteryRandomConfig/lotteryRandomConfig_func';
import helper from '@/utils/helper';
import mongodb_domain from '@/utils/mongodb_domain';
import { LotteryRandomConfigModel } from '@/model/mongodb/lottery/lotteryRandomConfig.model';

@WebSocketGateway({
  // cors: {
  //   origin: '*',
  // },
  cors: {
    origin: [
      'https://adminv3.wemove.co.th',
      'http://wemove-sit.th1.proen.cloud',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3010',
    ],
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  // constructor(private jwtService: JwtService) {}
  // private start_spin_time_task_cronjob = null;
  // private first_prize_spin_time_task_cronjob = null;
  // private second_prize_spin_time_task_cronjob = null;
  private cronjob = {
    start_spin_time: null,
    first_prize_spin_time: null,
    second_prize_spin_time: null,
  };

  private disconnect(socket: Socket) {
    socket.emit('Error', new ForbiddenException());
    socket.disconnect();
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    try {
      console.log('Client connected:', client.id);

      return this.server.to(client.id).emit('message', 'Connected');
    } catch (error) {
      console.log('disconnect user');
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    // Handle incoming messages
    console.log(`Received message from ${client.id}: ${payload.message}`);
    this.server.emit('message', payload); // Broadcast the message to all connected clients
  }

  sendMessage(channel: string, client_id: string, message: any) {
    this.server.to(client_id).emit(channel, message);
  }

  broadcast(chanel: string, data: any): void {
    this.server.emit(chanel, data);
  }

  @SubscribeMessage('initialCronjobLotteryRandomConfigSchedule')
  initialLotteryRandomConfigSchedule(client: Socket, domain: string) {
    this.handleInitialCronjob({ domain: domain });
  }

  @SubscribeMessage('updateCronjobLotteryRandomConfigSchedule')
  handleUpdateLotteryRandomConfigScheduleTimeData(
    client: Socket,
    payload: any,
  ) {
    // console.log(`Received test event from ${client.id}:`, payload);
    this.handleUpdateCronjob({ payload: payload });

    // this.server.on('updateCronjobSchedule', (data) => {
    //   console.log('datadata', data);
    // });
  }

  async handleInitialCronjob({ domain = null }: { domain: string }) {
    if (!R.isNil(domain)) {
      const find_one = await mongodb_domain.MongodbFindOne({
        model: LotteryRandomConfigModel,
        filter: { lottery_type: process.env.SERVER_TYPE, domain: domain },
      });

      if (!R.isNil(find_one.data) && !R.isEmpty(find_one.data)) {
        const data = find_one.data;

        if (
          !R.isNil(data.start_spin_time) &&
          !R.isEmpty(data.start_spin_time)
        ) {
          this.handleUpdateCronjob({
            is_initial: true,
            payload: {
              type: 'start_spin_time',
              time: data.start_spin_time,
              domain: domain,
            },
          });
        }
        if (
          !R.isNil(data.first_prize_spin_time) &&
          !R.isEmpty(data.first_prize_spin_time)
        ) {
          this.handleUpdateCronjob({
            is_initial: true,
            payload: {
              type: 'first_prize_spin_time',
              time: data.first_prize_spin_time,
              domain: domain,
            },
          });
        }
        if (
          !R.isNil(data.second_prize_spin_time) &&
          !R.isEmpty(data.second_prize_spin_time)
        ) {
          this.handleUpdateCronjob({
            is_initial: true,
            payload: {
              type: 'second_prize_spin_time',
              time: data.second_prize_spin_time,
              domain: domain,
            },
          });
        }
      }
    }
  }

  async handleUpdateCronjob({
    payload = null,
    is_initial = false,
  }: {
    payload: {
      type: string; // start_spin_time | first_prize_spin_time | second_prize_spin_time
      time: string;
      domain: string;
    };
    is_initial?: boolean;
  }) {
    const time_zone = `Asia / Bangkok`;

    if (!R.isNil(payload) && !R.isNil(payload.type)) {
      if (!R.isNil(this.cronjob[payload.type])) {
        this.cronjob[payload.type].stop();
      }

      const cronjob_schedule = helper.ToCronJobScheduleFromHourAndMinute({
        time: payload.time,
      });

      this.cronjob[payload.type] = cron.schedule(
        // `${cronjob_schedule}`,
        '*/3 * * * * *',
        async () => {
          // Your cron job logic here
          await lottery_func
            .stopRandomToMongodb({ domain: payload.domain })
            .then(async () => {
              await lottery_func
                .startRandomToMongodb({
                  domain: payload.domain,
                })
                .then(async () => {
                  if (is_initial === false) {
                    await lotteryRandomConfig_func.updateTimeInLotterRandomConfig(
                      {
                        random_type: payload.type,
                        time: payload.time,
                        domain: payload.domain,
                      },
                    );
                  }
                });
            });
          await this.broadcast('startRandom', {
            // start_random: true,
            start_random: is_initial === false ? true : false,
            domain: payload.domain,
          });
        },
        {
          scheduled: true,
          time_zone, // Set the timezone for the cron job
        },
      );

      this.cronjob[payload.type].start();
    }
  }
}
