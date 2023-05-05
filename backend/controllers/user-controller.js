const User = require('../model/User');
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "MyKey";

const signup = async(req, res, next) => {
    const {name, email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email:email});
    } catch {
        console.log("error")
    }
    if(existingUser) {
        return res.status(400).json({message: 'User already exists! Login Instead.'});
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password:hashedPassword
    });

    try{
        await user.save();
    } catch(err) {
        console.log(err);
    }
    return res.status(201).json({message:user})
}

const login = async (req, res, next) => {
    const{email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email:email});
    } catch (err) {
        return new Error(err);
    }
    if(!existingUser) {
        return res.status(400).json({message: 'User not found! Signup Please '})
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect) {
        return res.status(400).json({message:'Invalid Email / Password'});
    }

    const token = jwt.sign({id: existingUser._id}, JWT_SECRET_KEY, {
        expiresIn: "1hr"
    });

    if(req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = ""
    }

    console.log("Generate Token", token);

    res.cookie(String(existingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 3600),
        httpOnly: true,
        sameSite: 'lax'
    });

    return res.status(200).json({message:'Successfully Logged In', user: existingUser, token});
}

const verifyToken = (req, res, next) => {

    const cookies = req.headers.cookie;

    console.log("Header Cookie", cookies);

    const token = cookies.split("=")[1];
    if(!token) {
        res.status(404).json({message: "No Token Found"});
    }
    console.log("CheckVerify Token", token);
    jwt.verify(String(token), JWT_SECRET_KEY, (err, user)=>{
        if(err) {
            res.status(400).json({message: "Invalid Token"});
        }
        console.log("Verify Token = ", user.id);
        req.id = user.id
    });
    next();
}

const getUser = async (req, res, next) => {
    const email = req.params.email;
    console.log("Get User email = ", email);
    let user;
    try {
        user = await User.findOne({email})
    } catch(err) {
        return new Error(err);
    }
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json({user});
}

const refreshToken = (req, res, next) =>{
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];
    if(!prevToken) {
        return res.status(400).json({message: 'Could not found the token'});
    }
    jwt.verify(String(prevToken), JWT_SECRET_KEY, (err, user)=>{
        if(err) {
            console.log(err);
            return res.status(403).json({message: 'Authentication Failed'})
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({id: user._id}, JWT_SECRET_KEY, {
            expiresIn: "1hr"
        });
        console.log("Re-Generate Token", token);
        res.cookie(String(user._id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 3600),
            httpOnly: true,
            sameSite: 'lax'
        });
        req.id = user.id;
        next();
    });
}

exports.signup = signup
exports.login = login
exports.verifyToken = verifyToken
exports.getUser = getUser
exports.refreshToken = refreshToken