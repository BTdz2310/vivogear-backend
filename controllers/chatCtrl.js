const chatModel = require('../models/chatModel');
const { checkId } = require('./authCtrl');

const sendMessage = async (e) => {

    try{

        const {created_at, content, link, side, idUser} = e;
        await chatModel.create({
            idUser: idUser,
            created_at: created_at,
            side: side,
            content: content,
            link: link
        })

        const chats = await chatModel.find({
                idUser: idUser
            }).populate({
                path: 'idUser',
                select: 'username _id'
            }).sort({
                created_at: 'ascending'
            }) 

        return chats

    }catch(err){
        throw err;
    }

}

const newChat = async (req, res, next) => {

    try{

        const {created_at, content, link, side, idUser} = req.body;
        await chatModel.create({
            idUser,
            created_at,
            side,
            content,
            link
        })

        return res.status(200).json({
            data: await chatModel.find({
                idUser: idUser
            }).sort({
                created_at: 'ascending'
            })
        })

    }catch(err){
        return res.status(500).json({
            msg: e
        })
    }

}

const getAllMsg = async (req, res, next) => {

    try{
  
        const chats = await chatModel.find({
            idUser: res.locals.idUser.id
        }).sort({
            created_at: 'ascending'
        });

        // console.log(chats)

        return res.status(200).json({
            data: chats,
            msg: 'Lấy dữ liệu thành công'
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            msg: e
        })
    }

}

const getMsgAdmin= async (req, res, next) => {

    try{

        const user = await checkId(res.locals.idUser.id);

        if(user.role!=='admin'){
            return res.status(400).json({
                msg: 'Bạn Không Thê Thực Hiện Yêu Cầu Này'
            })
        }

        const chats = await chatModel.find({

        }).populate({
            path: 'idUser',
            select: 'username _id'
        }).sort({
            created_at: 'ascending'
        });

        // console.log(chats)

        return res.status(200).json({
            data: chats,
            msg: 'Lấy dữ liệu thành công'
        })

    }catch(e){
        // console.log(e)
        return res.status(500).json({
            msg: e
        })
    }

}

module.exports = {
    sendMessage,
    getAllMsg,
    newChat,
    getMsgAdmin
}

