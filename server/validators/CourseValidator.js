import Course from "../models/CourseModel.js";

export function courseValidate(req, res){
    req.check('course_title', 'Title is required.').not().isEmpty();
    req.check('course_title', 'Title must be more than 3 characters').isLength({min:3});
    req.check('course_title', 'Title must be less than 50 characters').isLength({max:50});
    req.check('course_desc', 'Description is required.').not().isEmpty();
    req.check('course_desc', 'Description must be more than 3 characters').isLength({min:3});
    req.check('course_desc', 'Description must be less than 100 characters').isLength({max:100});

    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({
            error: firstError
        });
    }
    next();
}