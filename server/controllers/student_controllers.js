import Student from "../models/user.js";
import Filed_Reports from "../models/filed-report.js";

const save_student = async (req, res) => {
    const student = new Student({
        authID: req.body.authID,
        student_number: req.body.student_number,
        first_name: req.body.first_name,
        mid_name: req.body.mid_name,
        last_name: req.body.last_name,
        year_level: req.body.year_level,
        section: req.body.section,
        photoUrl: req.body.photoUrl,
    });

    try {
        await student.save();
        res.send('success');
    } catch (error) {
        console.log(error);
    }
}

const update_student_info = async (req, res) => {
    const student = {
        "$set": {
            authID: req.body.authID,
            student_number: req.body.student_number,
            first_name: req.body.first_name,
            mid_name: req.body.mid_name,
            last_name: req.body.last_name,
            year_level: req.body.year_level,
            section: req.body.section,
        }
    };

    const report = {
        "$set": {
            'student_info.authID': req.body.authID,
            'student_info.student_number': req.body.student_number,
            'student_info.first_name': req.body.first_name,
            'student_info.mid_name': req.body.mid_name,
            'student_info.last_name': req.body.last_name,
            'student_info.year_level': req.body.year_level,
            'student_info.section': req.body.section,
        }
    }
    
    Student.updateOne({_id : req.body.object_id}, student, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
    Filed_Reports.updateMany({student_id : req.body.authID}, report, {}, (err, result) => {})
}

const update_student_dp = async (req, res) => {
    const student = {
        "$set": {
            photoUrl: req.body.photoUrl,
        }
    };
    const report = {
        '$set' : {
            'student_info.photoUrl': req.body.photoUrl,
        }
    }
    Student.updateOne({authID : req.body.authID}, student, {}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
    Filed_Reports.updateMany({student_id : req.body.authID}, report, {}, (err, result) => {})
}

const get_student = async (req, res) => {
    Student.find({authID: req.body.authID}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result);
    })
}

export default { 
    save_student,
    update_student_info,
    update_student_dp,
    get_student,
}