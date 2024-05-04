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



const createVoucher = async (voucher) => {
    // console.log(req.body)
    // return;
    const voucher1 = await voucherModel.create(voucher)
    return voucher1;
}

const updateVoucher = async (voucher) => {
    await voucherModel.findOneAndUpdate({
        code: voucher.code
    }, voucher);
    const voucher1 = voucherModel.findById(voucher._id);
    return voucher1;
}

const deleteVoucher = async (voucher) => {
    await voucherModel.deleteOne({
        code: voucher.code
    })
}



module.exports = {
    getAllVoucher,
    createVoucher,
    updateVoucher,
    deleteVoucher
}

