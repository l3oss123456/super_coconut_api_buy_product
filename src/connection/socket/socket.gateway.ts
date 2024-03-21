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

@WebSocketGateway({
  // cors: {
  //   origin: '*',
  // },
  cors: {
    origin: [
      'https://adminv3.wemove.co.th',
      'http://wemove-sit.th1.proen.cloud',
      'http://localhost:3000',
      'http://localhost:3010',
    ],
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  // constructor(private jwtService: JwtService) {}

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
}
