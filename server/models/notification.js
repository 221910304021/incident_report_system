import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    sender: {
        type: Object,
        required: true,
    },
    reciever: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    report_type: {
        type: String,
        required: true,
    },
    report_id: {
        type: String,
        required: true,
    },
    date:  {
        type: String,
        required: true,
    },
    time:  {
        type: String,
        required: true,
    },
});

const Notification = mongoose.model("notifications", NotificationSchema)

export default Notification;