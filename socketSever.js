const { checkAdmin2, allUserId, useVoucher, rtnVoucher } = require('./controllers/authCtrl');
const { createNotify, readAllNotify, newNotify } = require('./controllers/notifyCtrl');
const { handleOrder, placedOrder } = require('./controllers/orderCtrl');
const jwt = require("jsonwebtoken");
const user = require('./models/userModel');
const { createReview,  } = require('./controllers/reviewCtrl');
const { updateQuantity, updateQuantityPlus } = require('./controllers/inventoryCtrl');
const { createVoucher, updateVoucher, deleteVoucher } = require('./controllers/voucherCtrl');
const { sendMessage } = require('./controllers/chatCtrl');
const { writeData, readData } = require('./middlewares/redis');

const adminSocket = [];
const userSocketMap = {};

const SocketServer = (socket, io) => {

    // adminSocket.forEach((admin) => {
    //     console.log('adm',admin.id);
    //   });

    socket.on('credential', async (token) => {
        if(token){
            const isAdmin = await checkAdmin2(token);
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            if (isAdmin) {
                await writeData('admin', socket.id, {
                    EX: 21600
                })
            }else{
                await writeData(decoded.id, socket.id, {
                    EX: 21600
                })
            }
        }
      });

    socket.on('sendMsg', async(e)=>{
        
        try{

            console.log(e)
            const chat = await sendMessage(e);
            io.emit('receiveMsg', chat);
            const adminID = await readData('admin');
            if(adminID) io.to(adminID).emit('receiveMsg', chat);

        }catch(e){
            socket.emit('SEError', e);
        }

    })

    socket.on('CENRegister', async (e)=>{

        const {username, idUser, createTime} =  e;

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
        // socket.emit('test')
        io.to(userSocketMap['65ccdb553a423981ae38c3d3']).emit('test')
        // console.log('read',e)
        const notify = await readAllNotify(e)
    })

    socket.on('TEST', ()=>{
        socket.emit('test')
    })


    socket.on('CEOPlaced', async (order) => {
        try {
            const orderRtn = await placedOrder(order);
            // console.log('odER1>>>', orderRtn)
            socket.emit('SEOSuccess', orderRtn);
            // console.log('odER2>>>', orderRtn)
            const newQuantity = await updateQuantity(order.products);
            io.emit('SEIQuantity', newQuantity);
            await Promise.all(orderRtn.voucher.map(async (vch)=>{
                await useVoucher(orderRtn.user, vch)
            }))
            const admin = await readData('admin');
            if(admin) io.to(admin).emit('SEOSuccess', orderRtn);
        } catch(e) {
            socket.emit('SEError', e);
        }
    })

    socket.on('CEOHandle', async (order) => {
        try {
            const orderRtn = await handleOrder(order);
            // console.log('ord>>', orderRtn)
            // console.log('adm',adminSocket.map(adm=>adm.id))
            
            socket.emit('SEOSuccess', orderRtn);
            const admin = await readData('admin');
            if(admin) io.to(admin).emit('SEOSuccess', orderRtn);
            
            const userSocketId = userSocketMap[orderRtn.user];

            if(orderRtn.status===5||orderRtn.status===6){
                const newQuantity = await updateQuantityPlus(orderRtn.products);
                io.emit('SEIQuantity', newQuantity);
                await Promise.all(orderRtn.voucher.map(async (vch)=>{
                    await rtnVoucher(orderRtn.user, vch)
                }))

                io.to(userSocketId).emit('SEVReturn', orderRtn.voucher);
            }

            // console.log('>>>>SOCKET', userSocketId, orderRtn.user ,userSocketMap)
            if (userSocketId) {
                console.log(userSocketId)
                io.to(userSocketId).emit('SEOSuccess', orderRtn);
                const notify1 = await newNotify({
                    user: orderRtn.user,
                    url: '/user/purchase',
                    text: 'Đơn Hàng Đã Được Cập Nhật.',
                    content: `Đơn Hàng "${orderRtn._id}" Đã Được Cập Nhật. Bấm Vào Để Theo Dõi Đơn Hàng`,
                    image: 'order',
                    createTime: Date.now(),
                })
                io.to(userSocketId).emit('SENNew', notify1);
              }
        } catch(e) {
            socket.emit('SEError', e)
        }
    })

    socket.on('CERCreate', async (review)=>{
        try{
            const newReview = await createReview(review);
            console.log(newReview);
            io.emit('SERNew', newReview);
        }catch(e){
            io.emit('SEError', e);
        }
    })

    socket.on('CEVCreate', async (voucher) => {
        try{
            const voucher1 = await createVoucher(voucher);
            if(voucher1.inform){
                const users = await allUserId();
                await Promise.all(users.map(async (user)=>{
                    const notify1 = await newNotify({
                        user: user,
                        url: '/user/voucher',
                        text: 'Voucher Mới Đã Được Cập Nhật.',
                        content: `Voucher "${voucher1.code}" Đã Được Thêm, Hãy Nhập Vào Để Nhận Thêm Ưu Đãi. Bấm Vào Để Xem Ngay`,
                        image: 'voucher',
                        createTime: Date.now(),
                    })
                    const userSocketId = userSocketMap[user];
                    if (userSocketId) {
                        io.to(userSocketId).emit('SENNew', notify1);
                    }
                }))
            }
        }catch(e){
            socket.emit('SEError', e)
        }
    })
    
    socket.on('CEVUpdate', async (voucher) => {
        try{
            const voucher1 = await updateVoucher(voucher);
            if(voucher1.inform){
                const users = await allUserId();
                await Promise.all(users.map(async (user)=>{
                    const notify1 = await newNotify({
                        user: user,
                        url: '/user/voucher',
                        text: 'Voucher Mới Đã Được Cập Nhật.',
                        content: `Voucher "${voucher1.code}" Đã Được Thêm, Hãy Nhập Vào Để Nhận Thêm Ưu Đãi. Bấm Vào Để Xem Ngay`,
                        image: 'voucher',
                        createTime: Date.now(),
                    })
                    const userSocketId = userSocketMap[user];
                    if (userSocketId) {
                        io.to(userSocketId).emit('SENNew', notify1);
                    }
                }))
            }
        }catch(e){
            socket.emit('SEError', e)
        }
    })

    socket.on('CEVDelete', async (voucher) => {
        try{
            await deleteVoucher(voucher);
        }catch(e){
            socket.emit('SEError', e)
        }
    })

    socket.on('CEUUseVoucher', async (voucherArr) => {
        try{
            await Promise.all(voucherArr.voucher.map(async (vch)=>{
                await useVoucher(voucherArr.user, vch)
            }))
        }catch(e){
            socket.emit('SEError', e)
        }
    })
}

module.exports = {
    SocketServer
}