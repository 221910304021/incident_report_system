import express from 'express'
import mongoose from 'mongoose';
import mongoConfig from './config/mongodb.js';
import cors from 'cors';
import Student from './models/user.js';
import Filed_Reports from './models/filed-report.js';
import Username from './models/username.js';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb+srv://${mongoConfig.userName}:${mongoConfig.password}@cluster0.do96v.mongodb.net/${mongoConfig.dbName}?retryWrites=true&w=majority`, {
    useNewURLParser: true,
});

app.post('/save-student', async (req, res) => {

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
})

app.put('/update-student', async (req, res) => {
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
    
    Student.updateOne({_id : req.body.object_id}, student, {}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})

app.put('/update-dp', async (req, res) => {
    const student = {
        "$set": {
            photoUrl: req.body.photoUrl,
        }
    };
    
    Student.updateOne({authID : req.body.authID}, student, {}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})

app.post('/student', async (req, res)=> {
    Student.find({authID: req.body.authID}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result);
    })
})

app.post('/file-report', async (req, res) => {
    const filed_report = new Filed_Reports({
        student_id: req.body.student_id,
        student_info: req.body.student_info,
        date: req.body.date,
        time: req.body.time,
        incident_type: req.body.incident_type,
        description: req.body.description,
        isActive: req.body.isActive,
    });

    try {
        await filed_report.save();
        res.send('success');
    } catch (error) {
        console.log(error);

    }
})

app.post('/get-reports', async(req, res) => {
    Filed_Reports.find({student_id: req.body.student_id}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})

app.post('/get-report', async(req, res) => {
    Filed_Reports.find({_id: req.body.report_id}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})

app.post('/close-report', async(req, res) => {
    Filed_Reports.findByIdAndUpdate(req.body.report_id,{isActive: false}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})

app.post('/save-username', async (req, res) => {
    
    const username = new Username({
        authID: req.body.authID,
        username: req.body.username,
        email: req.body.email
    })
    try {
        await username.save();
        res.send('success');
    } catch (error) {
        console.log(error);

    }
})

app.post('/check-username', async (req, res) => {
    Username.find({username: req.body.username}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
})


app.listen(3001, () => {
    console.log('Server is Running');
});