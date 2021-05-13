import express from "express";
import { createCourse, getAllCourse, updateCourse, getSingleCourse, deleteCourse } from "../controllers/CourseController.js";
import { createUser, getAllUser, updateUser, getSingleUser, deleteUser } from "../controllers/UserController.js";

const router = express.Router();

//API Course
router.post("/courses", createCourse);
router.get("/courses", getAllCourse);
router.get('/courses/:_id', getSingleCourse);
router.patch('/courses/:_id', updateCourse);
router.delete('/courses/:_id', deleteCourse);

//API User
router.post("/users", createUser);
router.get("/users", getAllUser);
router.get('/users/:_id', getSingleUser);
router.patch('/users/:_id', updateUser);
router.delete('/users/:_id', deleteUser);

export default router;
