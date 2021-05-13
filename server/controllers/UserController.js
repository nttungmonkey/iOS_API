import mongoose from "mongoose";
import User from "../models/UserModel.js";

export function createUser(req, res){
    const user = new User({
        user_firstname: req.body.user_firstname,
        user_lastname: req.body.user_lastname,
        user_gender: req.body.user_gender,
        user_email: req.body.user_email,
        user_username: req.body.user_username,
        user_password: req.body.user_password,
        user_phone: req.body.user_phone,
        user_birthday: req.body.user_birthday,
        user_avatar: req.body.user_avatar,
        user_created_by: req.body.user_created_by,
    });
    return user
            .save()
            .then((newUser) => {
                res.status(201).json({
                    success: true,
                    message: 'New user created successfully',
                    User: newUser, 
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
export function getAllUser(req, res){
    User.find()
    .select("user_id user_firstname user_lastname user_gender user_email user_username user_password user_phone user_birthday user_avatar user_created_by user_created_at user_updated_at")
    .then((allUser) => {
        return res.status(200).json({
            success: true,
            message: "A list of all user",
            User: allUser
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
export function getSingleUser(req, res){
    const id = req.params._id;
    User.findById(id)
        .then((singleUser) => {
            res.status(200).json({
                success: true,
                message: "Single user",
                User: singleUser,
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
export function updateUser(req, res){
    const id = req.params._id;
    const updateObject = req.body;
    User.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'User is updated',
        updateUser: updateObject,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
}
export function deleteUser(req, res) {
    const id = req.params._id;
    User.findByIdAndRemove(id)
      .exec()
      .then(()=> res.status(204).json({
        success: true,
        message: 'User is deleted',
      }))
      .catch((error) => res.status(500).json({
        success: false,
        message: error.message,
      }));
  }