import mongoose from "mongoose";

const UsernameSchema = new mongoose.Schema({
    authID: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
    
});

const Username = mongoose.model("usernames", UsernameSchema)

export default Username;