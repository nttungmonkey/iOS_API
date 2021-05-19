import express from "express";
import { createUser, getAllUser, updateUser, getSingleUser, deleteUser } from "../server/controllers/UserController.js";

const router = express.Router();

router.post("/users", createUser);
router.get("/users", getAllUser);
router.get("/users/:_id", getSingleUser);
router.patch("/users/:_id", updateUser);
router.delete("/users/:_id", deleteUser);

//Route ví dụ
router.get("/home/users", function(req, res){
    res.render("home");
});

export default router;