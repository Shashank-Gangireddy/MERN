import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserRoute from './routes/UserRoutes.js';
import session from 'express-session';
import passport from 'passport';
import user from "./models/user.js";
import localStrategy from  'passport-local';
import bcrypt from 'bcrypt';


// const localStrategy = require('passport-local').Strategy;
const router = express.Router();
const app = express();

app.use(session({secret : "needtotellnobody", resave : false , saveUninitialized : true}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user , done){
    done(null , user.id);
});

passport.deserializeUser(function( id, done){
    user.findById(id, function (err , user){
        done(err,user);
    });
});

passport.use(new localStrategy( async function ( username , password , done)
{
    await user.findOne({username : username}, function (err , user){
        if(err)   return done(err);
        if(!user) return done(null , false , {message : 'Incorrect Username'});

       bcrypt.compare(password , user.password , function ( err , res){
        
         if(err) return done(err);
         if(res === false) return done(null , false , console.log("Failed idk why"));
         return done(null , user);
        });  
    }); 
}));

function isLoggedIn(req , res , next){
    if(req.isAuthenticated()) return next();
    res.redirect('/');
}


app.use('/users' , UserRoute );
app.post('/SignIn',passport.authenticate('local', {
    successMessage : 'Successful login'
}));

const CONNECTION_URL = 'mongodb+srv://shashank:shashank123@cluster0.pbk3u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

mongoose.connect(CONNECTION_URL , {useNewUrlParser: true , useUnifiedTopology: true})
 .then(() => app.listen(PORT , () => console.log(`Server is up and is running on port: ${PORT}`)))
 .catch((error) => console.log(error.message));