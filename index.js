const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express();

const http = require('http');
const index = http.createServer(app);
const { Server } = require("socket.io");
const { SocketServer } = require('./socketSever');
const io = new Server(index, {
    cors: {
      origin: "*"
    },
        allowEIO3: true});
app.use(cors());
// app.use(cors({
//     origin: "*",
//   }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const port = process.env.PORT || 5001;

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
        // await mongoose.connect('mongodb://127.0.0.1:27017/cellphone', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
        console.log('Connect DB Successful')
    }catch(error){
        console.log('Error Connect DB',error)
    }
}

connectDB();

io.on("connection", (socket) => {
    SocketServer(socket, io);
    // console.log(socket.id)
  });


app.use('/api', require('./routers/authRouter'))
app.use('/api', require('./routers/productRouter'))
app.use('/api', require('./routers/inventoryRouter'))
app.use('/api', require('./routers/userCartRouter'))
app.use('/api', require('./routers/notifyRouter'))
app.use('/api', require('./routers/voucherRouter'))
app.use('/api', require('./routers/orderRouter'))

index.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})

