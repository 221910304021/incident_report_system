import mongoose from "mongoose";

const Filed_Report_Schema = new mongoose.Schema(
    {
        student_id: {
            type: String,
            required: true
        }, 
        student_info : {
            type: Object,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        incident_type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        primary_description: {
            type: Object,
            required: true
        },
        evaluation: {
            type: Object,
            required: true,
            default: {},
        },
        replies: {
            type: Array,
            required: true,
            default: [],
        },
        isActive: {
            type: Boolean,
            required: true,
            default: false
        },
        isEvalueated: {
            type: Boolean,
            required: true,
            default: false
        }

    }
    , {minimize : false}
)

const Filed_Reports = mongoose.model('filed_report', Filed_Report_Schema);

export default Filed_Reports;