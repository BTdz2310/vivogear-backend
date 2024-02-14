const { checkAdmin2, checkId } = require('./controllers/authCtrl');
const { createNotify, readAllNotify } = require('./controllers/notifyCtrl');
const { handleOrder, placedOrder } = require('./controllers/orderCtrl');
// const io = 
const user = require('./models/userModel')

const adminSocket = [];
const userSocketMap = {};

const SocketServer = (socket, io) => {

    adminSocket.forEach((admin) => {
        console.log('adm',admin.id);
      });

    socket.on('credential', async (token) => {
        console.log('TOKEN', token);
        const isAdmin = await checkAdmin2(token);
        // console.log(isAdmin)
        if(token){
            if (isAdmin) {
                // console.log('admTren',socket.id)
                adminSocket.push(socket);
            }else{
                const user = await checkId(token);
                socket.userId = user._id;
                userSocketMap[user._id] =  socket.id;
            }
        }

        // console.log(userSocketMap)
      });

    socket.on('CENRegister', async (e)=>{
        const {username, idUser, createTime} =  e;

        // const decoded = jwt.verify(e, process.env.ACCESS_TOKEN_SECRET);
        // const user = await user.findOne({ _id: decoded.id });

        const notify = await createNotify({
            user: idUser,
            url: '/',
            text: `Chào mừng ${username} !!!`,
            content: 'Bạn có thể bắt đầu mua sắm ngay bây giờ hoặc truy cập tài khoản của mình để xem lịch sử mua sắm, quản lý thông tin cá nhân và hơn thế nữa.',
            image: 'user',
            createTime,
        })


    })

    socket.on('CENReadAll', async (e)=>{
        socket.emit('test')
        // console.log('read',e)
        const notify = await readAllNotify(e)
    })


    socket.on('CEOPlaced', async (order) => {
        try {
            const orderRtn = await placedOrder(order);
            // console.log('odER>>>', orderRtn)
            socket.emit('SEOSuccess', orderRtn);
            adminSocket.forEach((admin) => {
                console.log(admin)
                admin.emit('SEOSuccess', orderRtn);
              });
        } catch(e) {
            socket.emit('SEOFailed', e);
        }
    })

    socket.on('CEOHandle', async (order) => {
        try {
            const orderRtn = await handleOrder(order);
            // console.log('ord>>', orderRtn)
            // console.log('adm',adminSocket.map(adm=>adm.id))
            
            // socket.emit('SEOSuccess', orderRtn);
            adminSocket.forEach((admin) => {
                // console.log('admDuoi',admin.id)
                admin.emit('SEOSuccess', orderRtn);
            });

            const userSocketId = userSocketMap[orderRtn.user];
            // console.log('>>>>SOCKET', userSocketId, orderRtn.user ,userSocketMap)
            if (userSocketId) {
                console.log(userSocketId)
                io.to(userSocketId).emit('SEOSuccess', orderRtn);
                // io.emit('SEOSuccess', orderRtn);
                // io.emit('check');
                // io.to(userSocketId).emit('check');
              }
        } catch(e) {
            socket.emit('SEOFailed', e)
        }
    })

}

module.exports = {
    SocketServer
}