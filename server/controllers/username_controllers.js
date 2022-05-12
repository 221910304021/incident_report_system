import Username from "../models/username.js";

const save_username = async (req, res) => {
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
}

const check_username = async (req, res) => {
    Username.find({username: req.body.username}, (err, result) => {
        if (err) {
            res.send(err)
        } 
        res.send(result)
    })
}

export default { save_username, check_username }