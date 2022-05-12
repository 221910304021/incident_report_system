import SubjectOffred from "../models/subject_offered.js";

const add_subject = async (req, res) => {
    const subject = new SubjectOffred({
        subject_code: 'IT 403',
        subject_title: 'Elective 5',
        subject_year: '4'
    })
    try {
        await subject.save();
        res.send('success');
    } catch (error) {
        console.log(error);

    }
}

const get_subject = async (req, res) => {
    SubjectOffred.find({}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

export default {
    add_subject,
    get_subject,
}