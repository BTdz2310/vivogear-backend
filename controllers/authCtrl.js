const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const checkId = async (token) => {
    if(!token) return null;

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.id });
  
    return user;
}

const register = async (req, res, next) => {
    const {username, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 11);
    // console.log(username, password, phone, address)
    try{
        let userNew;
        const user = await User.findOne({
            username
        })
        if(user){
            return res.status(400).json('Existed')
        }else{
            userNew = await User.create(
                {
                    username,
                    password: passwordHash,
                    // phone
                }
            );
        }
        return res.status(200).json(userNew)
    }catch(err){
        return res.status(500).json('Error Server')
    }
}

const login = async (req, res, next) => {
    const {username, password} = req.body;
    // console.log(username, password)
    try{
        const user = await User.findOne({
            username
        })
        // console.log(user)
        if(!user) return res.status(400).json("Tên Tài Khoản Không Tồn Tại!")
        const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json("Sai Mật Khẩu!");
    
    const access_token = createAccessToken({ id: user._id });
    console.log({
        msg: "Đăng nhập thành công!",
        access_token,
        user: user,
        id: user._id,
        isAdmin: user.role==='admin'
      })

        // if(user.role==='admin') return res.status(200).json({
        //     msg: "Đăng nhập thành công!",
        //     access_token,
        //     id: user._id,
        //     user: user,
        //     isAdmin: true
        //   });


        return res.status(200).json({
            msg: "Đăng nhập thành công!",
            access_token,
            user: user,
            id: user._id,
            isAdmin: user.role==='admin'
          });

    }catch(err){
        return res.status(500);
    }
}

const checkAuth = async (req, res, next) => {
    // console.log('>>>LOGIN', res.locals.idUser)
    const user = await User.findOne({
        _id: res.locals.idUser.id
    })
    return res.status(200).json({
        access_token: req.headers["authorization"].split(' ')[1],
        id: res.locals.idUser.id,
        user, 
        isAdmin: user.role==='admin'
    })
}

const checkAdmin = async (req, res, next) => {
    const user = await User.findOne({
        _id: res.locals.idUser.id
    })
    return res.status(200).json({
        isAdmin: user.role==='admin'
    })
}

const checkAdmin2 = async (token) => {
    const user = await checkId(token);
    if(!user) return false;
    return user.role==='admin';
}

const updateUser = async (req, res, next) => {
    const idUser = res.locals.idUser.id;
    try{
        await User.updateOne({
            _id: idUser
        }, req.body)
        const user = await User.findOne({
            _id: idUser
        })
        return res.status(200).json({
            data: user,
            msg: 'Cập Nhật Hồ Sơ Thành Công'
        })  
    }catch{
        return res.status(500).json({
            msg: 'Lỗi Server'
        })
    }
}

const addVoucherUser = async (req, res, next) => {
    const user = await User.findById(res.locals.idUser.id);

    user.voucher = [{
        code: req.body.code,
        used: false
    }, ...user.voucher]
    await user.save();

    // console.log(user)
    return res.status(200).json({
        data: user.voucher
    })
}

const test = async (req, res) => {
    // const user = await User.updateMany({},{
    //     voucher: [],
    //     avatar: 'https://img.freepik.com/premium-vector/male-avatar-icon-unknown-anonymous-person-default-avatar-profile-icon-social-media-user-business-man-man-profile-silhouette-isolated-white-background-vector-illustration_735449-122.jpg'
    // })
    
    res.json({
        msg: 'CHECK'
    })
}

const changePassword = async (req, res) => {
    // console.log(res.locals.idUser.id)
    
    const user = await User.findById(res.locals.idUser.id);

    const match = await bcrypt.compare(req.body.oldPassword, user.password);
    if(!match) return res.status(400).json({
        msg: "Sai Mật Khẩu!"
    });


    const passwordHash = await bcrypt.hash(req.body.newPassword, 11);

    user.password = passwordHash;
    await user.save();
    return res.status(200).json({
        data: user,
        msg: 'Cập Nhật Mật Khẩu Thành Công'
    });
}

const useVoucher = async (req, res, next) => {
    const {order, product} = req.body;
    try{
        let user = await User.findById(res.locals.idUser.id);
        console.log('>>>VOUCHER', user.voucher)
        for(let i=0; i<user.voucher.length; i++){
            if(user.voucher[i].code===order) user.voucher[i].used = true;
            if(user.voucher[i].code===product) user.voucher[i].used = true;
        }
        await user.save();

        return res.status(200).json({
            data: user
        })
    }catch(e){
        return res.status(500).json({
            msg: `Lỗi Server: ${e}`
        })
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  };

module.exports = {
    register,
    login,
    checkAuth,
    test,
    updateUser,
    addVoucherUser,
    changePassword,
    useVoucher,
    checkAdmin,
    checkAdmin2,
    checkId
}