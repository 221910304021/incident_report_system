import Filed_Reports from "../models/filed-report.js"

const get_report = async (req, res) => {
    Filed_Reports.find({_id: req.body.report_id}, (err, result) => {
        if (err) {
            res.status(400).json({ error: err})
        } 
       res.send(result)
    })
}

const get_all_reports = async (req, res) => {
    Filed_Reports.find({}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

const get_report_per_student = async(req, res) => {
    Filed_Reports.find({student_id: req.body.student_id}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

const file_new_report = async (req, res) => {
    const filed_report = new Filed_Reports({
        student_id: req.body.student_id,
        student_info: req.body.student_info,
        date: req.body.date,
        time: req.body.time,
        incident_type: req.body.incident_type,
        description: req.body.description,
        evaluation: {},
        primary_description: req.body.primary_description,
        isActive: req.body.isActive,
    }); 

    try {
        await filed_report.save();
        res.send('success');
    } catch (error) {
        console.log(error);

    }
}

const add_evaluator = async (req, res) => {
    const evaluator = {
        '$set' : {
            'evaluation.evaluator_info': req.body.evaluator_info
        }
    }

    Filed_Reports.updateOne({_id: req.body.report_id}, evaluator, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
}

const add_evaluation = async (req, res) => {
    const evaluator = {
        '$set' : {
            'evaluation.resolution': req.body.resolution
        },
        isEvalueated: true,
    }

    Filed_Reports.updateOne({_id: req.body.report_id}, evaluator, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
}


const send_reply = async (req, res) => {
    const report = {
        '$push' : {
            'replies': req.body.reply,
        }
    }
    Filed_Reports.updateOne({_id : req.body.report_id}, report, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
}

const close_report = async (req, res) => {
    Filed_Reports.findByIdAndUpdate(req.body.report_id,{isActive: false}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

export default { 
    get_report, 
    get_all_reports, 
    get_report_per_student, 
    file_new_report, 
    send_reply, 
    close_report,
    add_evaluator,
    add_evaluation,
 }