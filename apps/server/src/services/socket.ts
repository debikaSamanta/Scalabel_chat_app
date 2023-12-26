import { Server } from "socket.io";
import Redis from 'ioredis';

const pub = new Redis({
    host: "127.0.0.1",
    port: 6379,
    username: "default",
    password: "123",
  });
  
  const sub = new Redis({
    host: "127.0.0.1",
    port: 6379,
    username: "default",
    password: "123",
  });

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init Socket Service...");
        this._io = new Server({
          cors: {
            allowedHeaders: ["*"],
            origin: "*",
          },
        });
        sub.subscribe("MESSAGES");
      }
    public initListeners(){
        const io = this.io;
        console.log("Init Socket Listeners...");

        io.on('connect',( socket) => {
            console.log("New client connected",socket.id);

            socket.on('event:message',async ({ message }:{ message: string})=>{
                console.log('New Message received from server',message);

                await pub.publish('MESSAGES',JSON.stringify({ message }));
            });     
         });

            sub.on('message', (channel, message) => {
                if (channel === 'MESSAGES') {
                    console.log('new message from redis')
                    console.log(message);
                    io.emit('message', message);
                    
                    }
            });
        }
    get io(){
        return this._io;
    }
}

export default SocketService;