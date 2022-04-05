import express from 'express'
import mongoose from 'mongoose';
import mongoConfig from './config/mongodb.js';
import cors from 'cors';
import Student from './models/user.js';

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
    });

    try {
        await student.save();
        res.send('success');
    } catch (error) {
        console.log(error);
    }
})

app.post('/student', async (req, res)=> {
    Student.find({authID: req.body.authID}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result);
    })
})


app.listen(3001, () => {
    console.log('Server is Running');
});