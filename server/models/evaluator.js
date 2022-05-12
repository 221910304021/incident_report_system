import mongoose from "mongoose";

const EvaluatorSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: true,
        default: 'https://firebasestorage.googleapis.com/v0/b/admin-incident-report-dev.appspot.com/o/default-dp%2FCICT.png?alt=media&token=b76a77d8-9531-48ff-9cc8-6546d9c06728'
    },
})

const Evaluator = mongoose.model('evaluator', EvaluatorSchema)

export default Evaluator;