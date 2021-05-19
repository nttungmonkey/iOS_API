import express from "express";
import { createCourse, getAllCourse, updateCourse, getSingleCourse, deleteCourse } from "../server/controllers/CourseController.js";


const router = express.Router();

//API Course
router.post("/courses", createCourse);
router.get("/courses", getAllCourse);
router.get('/courses/:_id', getSingleCourse);
router.patch('/courses/:_id', updateCourse);
router.delete('/courses/:_id', deleteCourse);


export default router;
