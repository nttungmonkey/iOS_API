import express from "express";
import bodyParse from "body-parser";
import mongoose from "mongoose";
import logger from "morgan";
import dotenv from "dotenv"
import courseRoutes from "./routes/course.js";
import userRoutes from "./routes/user.js";
import jwt from "jsonwebtoken";
import {createServer} from "http";
import {Server} from "socket.io";
import multer from "multer";
import ytdl from "ytdl-core";
import { resolve } from "path";
import { rejects } from "assert";

dotenv.config();

const port = process.env.PORT || 3000;
const url = process.env.DB_URL;
const secret = process.env.SECRET;

const app = express();
app.set("view engine", "ejs");
app.set("views","./server/views");
app.use(express.static("public"));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));

const server = createServer(app);
const io = new Server(server); 
app.io = io;

//app.listen được thay bằng server.listen(3000)
server.listen(3000);

//Connect to MonggoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log("Error connecting to database: " + error.message);
    });

const getYoutubeInfo = async(id)=>{
        let data = await ytdl.getInfo(id);
        var url = "";
        data.formats.forEach(function(item){
            if (item.hasVideo == true && item.hasAudio==true){
                url = item.url;
                console.log(url);         
            }   
        }); 
        return url;     
}

//Setup Multer for upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()  + "-" + file.originalname)
    }
});  
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg"){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("avatar");

app.use("/api/", [courseRoutes, userRoutes]);

app.post("/login", function(req, res){
    if (req.body.Username=="admin"&&req.body.Password=="123456"){
        var account = {
            "Username": "admin",
            "Email": "admin@gmail.com"
        }
        jwt.sign({
            exp: Math.floor(Date.now()/1000) + 60*60*24*30,
            data: account
        }, secret, function(err, token){
            if(err) {
                res.json({
                    success: false,
                    message: "Sign token fail.",
                    token: []
                });
            }
            else{
                res.json({
                    success: true,
                    message: "Sign token successfully.",
                    token: token
                });
            }
        });
    }
    else {
        res.json({
            success: false,
            message: "Login fail, please try again.",
            token: "fail"
        })
    }

});

app.post("/verifyToken", function(req, res){
    jwt.verify(req.body.Token, secret, function(err, decoded){
        if(err){
            res.json({
                success: false,
                message: "Wrong token.",
                data: []
            });
        }
        else{
            res.json({
                success: false,
                message: "Verify token successfully.",
                data: decoded
            });
        }
    });
});

app.post("/uploadFile",  function(req, res){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
            res.json({
                result: 0,
                data: "A Multer error occurred when uploading."
            });
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
            res.json({
                result: 0,
                data: "A Multer error occurred when uploading." + err
            });
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            res.json({
                result: 0,
                data: req.file.filename
            });
        }

    });
});

app.get("/youtube/:id", function(req, res){
    getYoutubeInfo(req.params.id).then((data)=>{
        console.log(data);
        res.json({"result": 1, "data": data});
    }).catch((err) => {
        res.json({"result": 1, "data": err});
    });
    
    
});

io.on("connection", function(socket){
    console.log("New Id" + socket.id);
    socket.on("disconnect", function(){
        console.log("User disconnected");
    });
    socket.on("C_Sendto_S", function(data){
        console.log(data);
        socket.broadcast.emit("S_Sendto_C", data)
    });
    
});
