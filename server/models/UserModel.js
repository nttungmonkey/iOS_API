import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const userSchema = new mongoose.Schema({
    user_firstname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    user_lastname: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    user_gender: {
        type: Number,
        required: true,
    },
    user_email: {
        type: String,
        required: true,
        maxlength: 100,
    },
    user_username: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        unique: true
    },
    user_password: {
        type: String,
        required: true,
        maxlength: 200,
        minlength: 6
    },
    user_phone: {
        type: String,
        required: true,
        maxlength: 10,
    },
    user_birthday: {
        type: Date,
    },
    user_avatar: {
        type: String,
    },
    user_created_by: {
        type: Number,
        required: true,
    },
    user_created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    user_updated_at: {
        type: Date,
    },
    user_isdeleted: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("User", userSchema);
