import Evaluator from "../models/evaluator.js";
import {getAuth} from 'firebase-admin/auth'
import  app from "../firebase/admin_firebase.js";

const auth = getAuth(app)

const create_auth = (email, password, req, res) => {
    auth.createUser({email: email, password:password})
    .then((response) => {
        res.send(response)
    }).catch((error) => {
        res.status(400).json({ error: error.message })
    })
}

const create_evaluator = (req, res) => {
    const evaluator = new Evaluator({
        authID: req.body.authID,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        photoUrl: req.body.photoUrl
    })

    evaluator.save().then((response) => {
        res.send(response)
    }).catch((error) => {
        res.send(error)
    })
}

const check_evaluator = (req, res) => {
    auth.getUserByEmail(req.body.email)
    .then((response) => {
        res.send(response)
    }).catch((error) =>{ 
        res.send(error)
    })
}

const get_evaluator = (req, res) => {
    Evaluator.find({authID: req.body.authID}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

export default {
    create_auth,
    create_evaluator,
    check_evaluator,
    get_evaluator,
}