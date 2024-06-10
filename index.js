const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const cors = require('cors');
const redis = require('redis');
const { Server } = require("socket.io");
const { SocketServer } = require('./socketSever');
const { initializeRedisClient } = require('./middlewares/redis');


// const client = redis.createClient({url: 'redis://default:4J8rl31EB0yllLmvtGYagTvmzfTpOFcV@redis-19886.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com:19886'});

// const connectRedis = async () => {
//     try {
//       await client.connect();
//       console.log('Connect Redis Successful');
//     } catch (error) {
//       console.error('Failed to connect to Redis with error:');
//       console.error(error);
//     }
//   };
  
//   connectRedis();

//   console.log(client.isOpen)

const initializeExpressServer = async () => {

const app = express();

await initializeRedisClient();

const http = require('http');
const index = http.createServer(app);
const io = new Server(index, {
    cors: {
      origin: "*"
    },
    // transports: ['websocket'],
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
app.use('/api', require('./routers/chatRouter'))

index.listen(port, ()=>{
    console.log(`Listening on ${port}`)
})
}

initializeExpressServer()