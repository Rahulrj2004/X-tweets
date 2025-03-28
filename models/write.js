import  mongoose from "mongoose";

const write_schema = new mongoose.Schema({
    profile:Buffer,
    contentType1:String,
    Username:String,
    data:String,
    likes:Number,
    repost:Number,
    chats:Number,
    views:Number
})

export const diddy = mongoose.model("write",write_schema);


const post_schema = new mongoose.Schema({
    profile:Buffer,
    contentType1:String,
    Username:String,
    img:Buffer,
    contentType:String,
    likes:Number,
    repost:Number,
    chats:Number,
    views:Number
})

export const p_diddy = mongoose.model("see",post_schema);

const user_schema = mongoose.Schema({
    profile:Buffer,
    contentType:String,
    Username:String,
    email:String,
    password:String
})

export const user = mongoose.model("user",user_schema);


const video_schema = new mongoose.Schema({
    profile:Buffer,
    contentType1:String,
    Username:String,
    filename:String,
    contentType:String,
    likes:Number,
    repost:Number,
    chats:Number,
    views:Number
})

export const vid = mongoose.model("video",video_schema);