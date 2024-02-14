const voucherModel = require('../models/voucherModel')

const getAllVoucher = async (req, res, next) => {
    try{
        const voucher = await voucherModel.find({})
        res.status(200).json({
            msg:'Success',
            data: voucher
        })
    }catch{
        res.status(500).json({
            msg: 'Error'
        })
    }
}



const createVoucher = async (req, res, next) => {
    const {type, code, discount, maxD, minO, expired, canSave} = req.body;
    // console.log(req.body)
    // return;
    try{
        const voucher = await voucherModel.findOne({
            code: code
        })
        console.log(voucher)
        if(voucher) return res.status(400).json({
            msg: 'Existing Code'
        })
        const voucher1 = await voucherModel.create(req.body)
        console.log(voucher1)
        res.status(200).json({
            data: voucher1
        })
    }catch{
        res.status(500).json({
            msg: 'Error'
        })
    }
}

const updateVoucher = async (req, res, next) => {
    const idVoucher = req.params.idVoucher;
    try{
        await voucherModel.findByIdAndUpdate(idVoucher, req.body)
        const updatedVoucher = await voucherModel.findById(idVoucher);
        return res.status(200).json({
            msg: 'Success',
            data: updatedVoucher
        })
    }catch{
        return res.status(500).json({
            msg: 'Error'
        })
    }
    // console.log(idVoucher, req.body)
}

const deleteVoucher = async (req, res, next) => {
    const idVoucher = req.params.idVoucher;
    try{
        const deletedVoucher = await voucherModel.findByIdAndDelete(idVoucher)
        return res.status(200).json({
            msg: 'Success',
            data: deletedVoucher.code
        })
    }catch{
        return res.status(500).json({
            msg: 'Error'
        })
    }
    // console.log(idVoucher, req.body)
}



module.exports = {
    getAllVoucher,
    createVoucher,
    updateVoucher,
    deleteVoucher
}

