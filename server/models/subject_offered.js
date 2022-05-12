import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
    subject_code: {
        type: String,
        required: true,
    },
    subject_title: {
        type: String,
        required: true,
    },
    subject_year: {
        type: String,
        required: true,
    },
});

const SubjectOffred = mongoose.model("subject_offereds", SubjectSchema)

export default SubjectOffred;