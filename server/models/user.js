import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: true,
    },
    student_number: {
        type: Number,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    mid_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: true,
    },
    year_level: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: true,
    },
    

});

const Student = mongoose.model("Students", StudentSchema)

export default Student;