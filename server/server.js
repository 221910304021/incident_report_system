import express from 'express'
import http from 'http'
import mongoose from 'mongoose';
import cors from 'cors';
import Student from './models/user.js';
import Filed_Reports from './models/filed-report.js';
import Username from './models/username.js';
import 'dotenv/config';
import filed_reports_controller from './controllers/filed_reports_controller.js';
import username_controllers from './controllers/username_controllers.js';
import student_controllers from './controllers/student_controllers.js';
import evalutor_controller from './controllers/evalutor_controller.js';
import subject_controllers from './controllers/subject_controllers.js';
import SubjectOffred from './models/subject_offered.js';

const app = express();

app.use(express.json());
app.use(cors());

const server = http.createServer(app)

mongoose.connect(`mongodb+srv://${process.env.NODE_MONGO_CONFIG_USERNAME}:${process.env.NODE_MONGO_CONFIG_PASSWORD}@cluster0.do96v.mongodb.net/${process.env.NODE_MONGO_CONFIG_DBNAME}?retryWrites=true&w=majority`, {
    useNewURLParser: true,
});

let watchReports = Filed_Reports.watch();

app.post('/save-student', async (req, res) => {
    student_controllers.save_student(req,res)
})

app.put('/update-student', async (req, res) => {
    student_controllers.update_student_info(req, res)
})

app.put('/update-dp', async (req, res) => {
    student_controllers.update_student_dp(req, res)
   
})

app.post('/student', async (req, res)=> {
    student_controllers.get_student(req,res)
})

app.post('/file-report', async (req, res) => {
    filed_reports_controller.file_new_report(req, res)
})

app.post('/get-reports', async(req, res) => {

    filed_reports_controller.get_report_per_student(req, res)

})

app.get('/get-all-reports', async(req, res) => {

    filed_reports_controller.get_all_reports(req, res)

})

app.post('/get-report', async(req, res) => {
    filed_reports_controller.get_report(req, res)
})

app.post('/send-reply', async(req, res) => {
    filed_reports_controller.send_reply(req, res);

})

app.post('/close-report', async(req, res) => {
    filed_reports_controller.close_report(req,res)
})

app.post('/select-report', async (req, res) => {
    filed_reports_controller.add_evaluator(req, res)
})

app.post('/add-resolution', async (req, res) => {
    filed_reports_controller.add_evaluation(req, res)
})


app.post('/save-username', async (req, res) => {
    username_controllers.save_username(req, res)
})

app.post('/check-username', async (req, res) => {
   username_controllers.check_username(req, res)
})

app.post('/add-subject', async (req, res) => {
   subject_controllers.add_subject(req, res);
})

app.post('/get-subjects', async (req, res) => {
    subject_controllers.get_subject(req, res)
})

app.post('/create-evaulator', async (req, res) => {
    evalutor_controller.create_auth(req.body.email, req.body.password, req, res)
})

app.post('/save-evaluator', async (req, res) => {
    evalutor_controller.create_evaluator(req, res)
})

app.post('/get-evaluator', async (req, res) => {
    evalutor_controller.get_evaluator(req,res)
})

app.post('/check-evaluator', async (req, res)=>{
    evalutor_controller.check_evaluator(req,res)
})

server.listen(3001, () => {
    console.log('Server is Running');
});