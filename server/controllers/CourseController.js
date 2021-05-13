import mongoose from "mongoose";
import Course from "../models/CourseModel.js";

export function createCourse(req, res){
    const course = new Course({
        course_title: req.body.course_title,
        course_desc: req.body.course_desc,
    });
    return course
            .save()
            .then((newCourse) => {
                return res.status(201).json({
                    success: true,
                    message: 'New cause created successfully',
                    Course: newCourse,
                });
            })
            .catch((error) => {
                console.log("error");
                res.status(500).json({
                    success: false,
                    message: "Server error. Please try again.",
                    error: error.message,
                });
            });
}
export function getAllCourse(req, res){
    Course.find()
    .select("course_id course_title course_desc")
    .then((allCourse) => {
        return res.status(200).json({
            success: true,
            message: "A list of all course",
            Course: allCourse
        });
    })
    .catch((error) => {
        res.status(500).json({
            success: false,
            message: "Server error. Please try again.",
            error: error.message,
        });
    });
}
export function getSingleCourse(req, res){
    const id = req.params._id;
    Course.findById(id)
        .then((singleCourse) => {
            res.status(200).json({
                success: true,
                message: "Single course",
                Course: singleCourse,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: "This course does not exist",
                error: error.message,
            });
        });

}
export function updateCourse(){
    const id = req.params._id;
    const updateObject = req.body;
    Course.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'Course is updated',
        updateCourse: updateObject,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
}
export function deleteCourse(req, res) {
    const id = req.params._id;
    Course.findByIdAndRemove(id)
      .exec()
      .then(()=> res.status(204).json({
        success: true,
        message: 'Course is deleted',
      }))
      .catch((error) => res.status(500).json({
        success: false,
      }));
  }