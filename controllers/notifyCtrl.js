const notifyModel = require('../models/notifyModel');

const createNotify = async ({user, url, text, content, image, createTime}) =>  {
    const notify = await notifyModel.create({
        user,
        url,
        text,
        content,
        image,
        createTime,
        isRead: false
    })
    return notify;
}

const getAllNotify = async (req, res, next) => {
    // console.log(res.locals.idUser.id)
    try{
        const notify = await notifyModel.find({
            user: res.locals.idUser.id
        })
        // console.log('>>>notify',notify)
        res.status(200).json({
            data: notify
        })
    }catch(e){
        res.status(500).json(e)
    }
}

const readAllNotify = async (id) => {
    try{
        const notify = notifyModel.updateMany({
            user: id
        },{
            isRead: true
        })
        return notify
    }catch(e){
        console.log(e)
    }
}


module.exports = {
    createNotify,
    getAllNotify,
    readAllNotify
}

