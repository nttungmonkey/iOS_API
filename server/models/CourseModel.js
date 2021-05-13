import mongoose from "mongoose";

mongoose.Promise = global.Promise;
const courseSchema = new mongoose.Schema({
    course_id: mongoose.Schema.Types.ObjectId,
    course_title: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3
    },
    course_desc: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 3
    },
});

export default mongoose.model("Course", courseSchema);