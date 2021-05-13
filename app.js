import express from "express";
import bodyParse from "body-parser";
import mongoose from "mongoose";
import logger from "morgan";
import dotenv from "dotenv"
import mainRoutes from "./server/routes/main.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const url = process.env.DB_URL;

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
