import { Server } from 'socket.io';
import Notification from '../models/notification.js'



const mainSocket = (server) => {

    const io = new Server(server, { cors:{
        origin: ['http://localhost:3000', 'http://localhost:3006']
    } 
    });

    io.on("connection", (socket) => {

        socket.on('addNotifactionReply', ({sender, reciever, title, report_type, report_id, date, time}) => {

            const notification = new Notification({sender, reciever, title, report_type, report_id, date, time})

            notification.save().then((res) =>  {
                io.emit(reciever, {
                    report_id,
                    sender_id : sender.authID,
                    res
                })
                io.emit(sender.authID, {
                    report_id,
                    sender_id : sender.authID,
                    
                })
            }).catch((err) => {
                console.log(err);
            });
            
        })
        
        socket.on('disconnect', () => {

        })
    });
}


export default {
    mainSocket
}