const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const checkId = async (id) => {
    const user = await User.findById(id)
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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
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

const allUserId = async () => {
    const users = await User.find({});
    return users.map(user=>user._id);
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
    const user = await User.find({});
    
    console.log(user)

    return res.json({
        msg: user
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

const useVoucher = async (id, voucher) => {
    let user = await User.findById(id);
    for(let i=0; i<user.voucher.length; i++){
        if(user.voucher[i].code===voucher) user.voucher[i].used = true;
    }
    await user.save();
}

const rtnVoucher = async (id, voucher) => {
    let user = await User.findById(id);
    for(let i=0; i<user.voucher.length; i++){
        if(user.voucher[i].code===voucher) user.voucher[i].used = false;
    }
    await user.save();
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  };









  const getAccessTokenGithub = async (code) => {
    try {
      const params = `?client_id=39ffe20d53ddbf0bf30f&client_secret=31c415a0b6713cf12d2f4ea99ffeca9797a961fa&code=${code}`;
  
      const response = await fetch(
        `https://github.com/login/oauth/access_token${params}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        },
      );
        const json = await response.json();
    //   console.log('tokengit',json)
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getUserDataGithub = async (accessToken) => {
    try {
        console.log(accessToken)
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const user = await loginUserGithub(data);
        const access_token = createAccessToken({ id: user._id });
        return{
            status: 200,
            msg: "Đăng nhập thành công!",
            access_token,
            user: user,
            id: user._id,
            isAdmin: user.role==='admin'
        }
    } catch (error) {
      return {
        status: 400,
        msg: error
      }
    }
  };


  const getUserDataGoogle = async (accessToken) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      );
    const data = await response.json();
    console.log(data);
    const user = await loginUserGoogle(data);
    const access_token = createAccessToken({ id: user._id });
    return{
        status: 200,
        msg: "Đăng nhập thành công!",
        access_token,
        user: user,
        id: user._id,
        isAdmin: user.role==='admin'
    }
    } catch (error) {
      return {
        status: 400,
        msg: error
      }
    }
  };

  const loginUserGoogle = async (data) => {
    try{
        let user = await User.findOne({
            social: 'google',
            socialId: data.sub
        });
        if(!user){
            await User.create({
                username: data.email,
                email: data.email,
                fullname: data.name,
                avatar: data.picture,
                social: 'google',
                socialId: data.sub,
                role: 'user'
            })
            user = await User.findOne({
                social: 'google',
                socialId: data.sub
            })
        }
        return user;
    }catch(e){
        throw new Error(e.message);
    }
  }

  const loginUserGithub = async (data) => {
    try{
        let user = await User.findOne({
            social: 'github',
            socialId: data.id
        });
        if(!user){
            await User.create({
                username: data.login,
                fullname: data.name,
                avatar: data.avatar_url,
                social: 'github',
                socialId: data.id,
                role: 'user'
            })
            user = await User.findOne({
                social: 'github',
                socialId: data.id
            })
        }
        return user;
    }catch(e){
        throw new Error(e.message);
    }
  }





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
    checkId,
    allUserId,
    rtnVoucher,
    getAccessTokenGithub, getUserDataGithub, getUserDataGoogle
}