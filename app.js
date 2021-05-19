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

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log("Error connecting to database: " + error.message);
    });

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

io.on("connection", function(socket){
    console.log("New Id" + socket.id);
    socket.on("disconnect", function(){
        console.log("User disconnected");
    });
});
