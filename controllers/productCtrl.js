const productModel = require('../models/productModel');

const createProduct = async (req, res, next) => {
    const {brand, details, id, img, imgsDetail, name, type, color, size, price} = req.body;
    // console.log(brand, details, id, img, imgsDetail, name, type);
    let data;

    const pro = await productModel.findOne({
        id
    })

    if(pro){
        try{
            data = {
                _id: pro['_id'],
                id,
                type,
                name,
                brand,
                details,
                img,
                imgsDetail,
                color: [...pro.color, ...color.filter(cl=>!pro.color.includes(cl))],
                size: [...pro.size, ...size.filter(s=>!pro.size.includes(s))],
                price: Math.min(price, pro.price)
            }
            await productModel.findByIdAndUpdate({
                '_id': pro['_id']
            },data)
        }catch{
            return res.status(500).json('not-ok')
        }
    }else{
        try{
            const crP = await productModel.create({
                id,
                type,
                name,
                brand,
                details,
                img,
                imgsDetail,
                color,
                size,
                price
            })
            data = {
                _id: crP._id,
                id,
                type,
                name,
                brand,
                details,
                img,
                imgsDetail,
                color,
                size,
                price
            }
        }catch{
            return res.status(500).json('not-ok')
        }
    }
    return res.status(200).json({
        msg: 'ok',
        data: data
    })
}

const getAllProducts = async (req, res, next) => {
    try{
        const products = await productModel.find({

        })
        // console.log(products)
        return res.status(200).json({
            msg: 'Lấy dữ liệu sản phẩm thành công',
            data: products
        })
    }catch{
        return res.status(500).json({
            msg: 'Lấy dữ liệu sản phẩm thất bại'
        })
    }
}

const changeProduct = async (req, res, next) => {
    // console.log(req.body)
    // console.log(req.params.id)
    try{
        await productModel.findByIdAndUpdate(req.params.id, {
            type: req.body.type
        })
        return res.status(200).json({
            msg: `Sửa Product ${req.params.id} thành công`,
            data: req.body
        })
    }catch{
        return res.status(500).json({
            msg: 'Lỗi Server'
        })
    }
    
}

const deleteProduct = async (req, res, next) => {
    console.log(req.params.id)
    try{
        await productModel.findByIdAndUpdate(req.params.id, {
            available: false
        })
        return res.status(200).json({
            msg: `Xoá Product ${req.params.id} thành công`,
            data: req.params.id
        })
    }catch{
        return res.status(500).json({
            msg: `Lỗi Server`,
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    changeProduct,
    deleteProduct
}