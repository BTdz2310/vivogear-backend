const orderModel = require('../models/orderModel');
const inventoryModel = require('../models/inventoryModel')

const createOrder = async (req, res, next) => {
    // console.log()
    const {products, placed, total, voucher, phone, address} = req.body;

    try{
        const order = await orderModel.create({
            user: res.locals.idUser.id,
            products,
            status: 0,
            placed: Number(placed),
            confirmed: null,
            pickup: null,
            received: null,
            success: null,
            canceled: null,
            returned: null,
            message: null,
            total,
            voucher,
            phone, 
            address
        })

        return res.status(200).json({
            msg: 'Đặt Hàng Thành Công',
            data: order
        })
    }catch{
        return res.status(500).json({
            msg: 'Lỗi Hệ Thống'
        })
    }


}

const placedOrder = async (order) => {
        
        const orderNew = await orderModel.create(order)

        return orderNew;
}

const handleOrder = async (order) => {
    try{
        
        await orderModel.findByIdAndUpdate(order._id, order);
        const orderNew = await orderModel.findById(order._id)

        // console.log('ORDER>>>NE', orderNew)

        return orderNew;

    }catch(e){
        throw e;
    }
}

const getUserOrder = async (req, res, next) => {
    try{
        const order = await orderModel.find({
            user: res.locals.idUser.id,
        })

        order.sort((a, b)=>b.placed-a.placed);

        return res.status(200).json({
            msg: 'Lấy Đơn Đặt Hàng Thành Công',
            data: order
        })
    }catch{
        return res.status(500).json({
            msg: 'Lỗi Hệ Thống'
        })
    }
}

const getAllOrder = async (req, res, next) => {
    try{
        const order = await orderModel.find({
            
        })

        // console.log(order)

        return res.status(200).json({
            msg: 'Lấy Đơn Đặt Hàng Thành Công',
            data: order
        })
    }catch{
        return res.status(500).json({
            msg: 'Lỗi Hệ Thống'
        })
    }
}

module.exports = {
    createOrder,
    getUserOrder,
    getAllOrder,
    handleOrder,
    placedOrder
}