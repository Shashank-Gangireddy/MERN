import user from "../models/user.js";
import bcrypt from 'bcrypt';

export const userslist = async (req , res) => {
    try {
        const users = await user.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({message : error.message});
    }
};

export const createNewUser =   (req , res) =>{
        const usname = req.body.username;
        const pw = req.body.password;
        bcrypt.genSalt(10, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(pw, salt, function(err, hash) {
                if(err)return next(err);
                const newUser = new user({
                    username : usname,
                    password : hash
                });
                newUser.save();
                res.status(201).json(newUser);
            });
        });
    try {
       
    } catch (error) {
        res.status(404).json({message : error.message});
    }
};