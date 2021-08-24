
module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {

        // socket.on('topic',topic=>{
        //     if(socket.myTopic){
        //         socket.leave(socket.myTopic);
        //     }
        //     socket.join(topic);
        //     socket.myTopic=topic;
        // })                    לשייך סוקט לנושא מסויים           
  

        // socket.on('ok', () => {
        //    io.to(socket.myTopic).emit('update-ok', null);
        // })                   לשלוח רק למי שמחובר לנושא מסויים


        socket.on('ok', () => {
           io.emit('update-ok', null);
        })
        
        
    })
}