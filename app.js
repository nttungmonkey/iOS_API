import express from "express";
import bodyParse from "body-parser";
import mongoose from "mongoose";
import logger from "morgan";
import dotenv from "dotenv"
import mainRoutes from "./server/routes/main.js";
import jwt from "jsonwebtoken";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const url = process.env.DB_URL;
const secret = process.env.SECRET;

app.set("view engine", "ejs");
app.set("views","./views");

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));
app.use(logger("dev"));

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Database connected");
    })
    .catch((error) => {
        console.log("Error connecting to database: " + error.message);
    });

const server = app.listen(port, function(){
    console.log("Server running with port:%s", port);
});
app.get("/", (req, res) => {
    res.send("Abc");
});
app.use("/api/", mainRoutes);

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
