const inventoryModel = require('../models/inventoryModel');
const productModel = require('../models/productModel');

const createInventory = async(req, res, next) => {
    const inv = req.body.data;
    const idSP = req.body.id;
    let data;
    const dataRtn = [];

  
    await Promise.all(inv.map(async (element) => {
      const {id, size, color, price, quantity} = element;
      const pro = await inventoryModel.findOne({
        id,
        size,
        color
      })

      try {
        if (pro) {
          data = {
            _id: pro._id,
            idSP,
            id,
            size,
            color,
            price: Number(price),
            quantity: Number(quantity) + Number(pro.quantity)
          }
  
          dataRtn.push(data);
          await inventoryModel.findByIdAndUpdate({
            "_id": pro['_id']
          }, data)
  
          console.log('DATA', dataRtn)
        } else {
            const crP = await inventoryModel.create({
                id,
                idSP,
                size,
                color,
                price: Number(price),
                quantity: Number(quantity)
              })
          data = {
            _id: crP._id,
            idSP,
            id,
            size,
            color,
            price: Number(price),
            quantity: Number(quantity)
          }
  
          dataRtn.push(data);
  
          console.log('DATA', dataRtn)
        }
      } catch {
        return res.status(500).json('not-ok')
      }
    }));
  
    console.log('rtn', dataRtn)
    return res.status(200).json({
      msg: 'ok',
      data: dataRtn
    })
  
}

const getAllInventory = async (req, res, next) => {
    try{
        const inventory = await inventoryModel.find({

        })
        return res.status(200).json({
            msg: 'Lấy dữ liệu sản phẩm thành công',
            data: inventory
        })
    }catch{
        return res.status(500).json({
            msg: 'Lấy dữ liệu sản phẩm thất bại'
        })
    }
}

const changeInventory = async (req, res, next) => {
  // console.log(req.params.id);
  console.log(req.body)
  // return res.status(200).json({
  //       msg: `Thêm Inventory ${req.params.id} thành công`,
  //       data: req.body
  //     })
  try{
    await inventoryModel.findByIdAndUpdate(req.params.id, {
      quantity: req.body.inv.quantity,
      price: req.body.inv.price
    })
    return res.status(200).json({
      msg: `Sửa Inventory ${req.params.id} thành công`,
      data: req.body
    })
  }catch{
    return res.status(500).json({
      msg: `Lỗi Server Inventory ${req.params.id}`
    })
  }
  
}

module.exports = {
    createInventory,
    getAllInventory,
    changeInventory
}