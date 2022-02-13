import { SubscribeMessage, WebSocketGateway, WebSocketServer, } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class ProductGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('receiveNewProductReview')
  handleNewProductReview(client: Socket, data: any): void {
    client.broadcast.emit("sendNewProductReview", data);
  }
}
