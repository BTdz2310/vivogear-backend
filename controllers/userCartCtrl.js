const userCartModel = require('../models/userCartModel')

const createUserCart = async (req, res, next) => {
    const {idInv, idSP, quantity, name, img} = req.body;

    let data;

    try{
        data = await userCartModel.create({
            idInv,
            idUser: res.locals.idUser.id,
            idSP,
            name,
            img,
            quantity
        })
    }catch(err){
        res.status(500).json(err)
    }

    // console.log(res.locals.idUser.id)

    res.status(200).json({
        msg: 'ok',
        data: {
            ...req.body,
            _id: data._id
        }
    })
}

const updateUserCart = async (req, res, next) => {
    const {idInv, quantity} = req.body;

    let data;

    try{
        data = await userCartModel.updateOne({
            idInv,
            idUser: res.locals.idUser.id
        }, {
            quantity
        })
    }catch(err){
        res.status(500).json(err)
    }

    // console.log(res.locals.idUser.id)

    res.status(200).json({
        msg: 'ok',
        data: {
            ...req.body,
            _id: data._id
        }
    })
}

const deleteUserCart = async (req, res, next) => {
    const {idInv} = req.body;

    let data;

    try{
        data = await userCartModel.deleteOne({
            idInv,
            idUser: res.locals.idUser.id
        })
    }catch(err){
        res.status(500).json(err)
    }

    // console.log(res.locals.idUser.id)

    res.status(200).json({
        msg: 'ok',
        data: {
            idInv,
            _id: data._id
        }
    })
}

const getAllUserCart = async (req, res, next) => {
    let data;

    try{
        data = await userCartModel.find({
            idUser: res.locals.idUser.id
        }).select('idInv idSP quantity name img _id')
    }catch(err){
        res.status(500).json(err)
    }
    res.status(200).json({
        msg: 'ok',
        data
    })
}

const clearUserCart = async (req, res, next) => {
    await userCartModel.deleteMany({
        idUser: res.locals.idUser.id
    })
    return res.status(200).json({
        msg: 'Success'
    })
}

module.exports = {
    createUserCart,
    getAllUserCart,
    updateUserCart,
    deleteUserCart,
    clearUserCart
}