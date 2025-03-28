import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { diddy } from "./models/write.js";
import { p_diddy } from "./models/write.js";
import { user } from "./models/write.js";
import { vid } from "./models/write.js";
import multer from "multer";
import { GridFSBucket } from "mongodb";
import cors from "cors";


// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT||4000;
async function connectDB() {
    try {
        await mongoose.connect("mongodb+srv://mr_unknown:unknown@cluster0.fboxd.mongodb.net/Twitter?retryWrites=true&w=majority&appName=cluster0");
        console.log("Connected to the database");
    }
    catch (e) {
        console.error("There was some error connecting to database", e);
    }
}

connectDB(); 

let gridFSBucket;
mongoose.connection.once("open", () => {
    gridFSBucket = new GridFSBucket(mongoose.connection.db, { bucketName: "videos" });
    console.log("GridFS Initialized!");
});


const uploadImage = multer({ storage: multer.memoryStorage() }); 
const uploadVideo = multer(); 

const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 }  
});


app.use(cors()); 
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/src", express.static(path.join(__dirname, "src")));
app.use("/front", express.static(path.join(__dirname, "front")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname,"/front/index.html"));
    try {
        res.sendFile(path.join(__dirname, "front", "Aut.html"));
    }
    catch (er) {
        res.status(500).json({ error: "Error getting the Authentication page" });
    }
})

app.get("/home-X",(req,res)=>{
    try{
        res.sendFile(path.join(__dirname,"front","index.html"));
    }
    catch(er)
    {
        res.status(500).json({error:"Error getting the index file "});
    }
})


app.get("/get-posts", async (req, res) => {
    try {
        const posts = await diddy.find();
        res.json(posts);
    }
    catch (er) {
        console.error("Error fetching post data:", er);
        res.status(500).json({ error: "Failed to fetch posts" });
    }

})

app.get("/get-vids", async (req, res) => {
    try {
        const posts = await vid.find();
        res.json(posts);
    }
    catch (er) {
        console.error("Error fetching post data:", er);
        res.status(500).json({ error: "Failed to fetch posts" });
    }

})

app.get("/get-sees",async(req,res)=>{
    try{
        const posts = await p_diddy.find();
        res.json(posts);
    }
    catch(er)
    {
        console.error("There was error getting the images",er);
        res.status(500).json({error:"Failed to fetch posts"});
    }
})

app.post("/write-post", async (req, res) => {
    try {
        
        const { profile,username,data, chats, repost, likes, views } = req.body;
        if (!profile) {
            return res.status(400).json({ error: "No profile found" });
        }
        // console.log(req.body);
        const base64Data = profile.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        
        const baba = new diddy(
            {
                profile:buffer,
                Username:username,
                contentType1:"image/png",
                data: data,
                chats: chats,
                repost: repost,
                likes: likes,
                views: views
            }
        )
        await baba.save();
        console.log("-----post saved sucessfully-----");
        res.status(201).json({ message: "Post saved successfully!" });
    }
    catch (e) {
        res.status(500).json({ e: "Failed to save post" });
    }
})

app.post("/upload", async (req, res) => {
    try {
        const fileType = req.headers["content-type"].startsWith("image") ? "image" : "video";
        let uploadMiddleware = fileType === "image" ? uploadImage.single("file") : uploadVideo.single("file");

        uploadMiddleware(req,res,async(err)=>{
            if (err) return res.status(500).json({ error: "Upload failed" });

            if (!req.file) return res.status(400).json({ error: "No file uploaded" });

            
            const { chats, repost, likes, views, profile, username } = req.body;
            
            const base64Data1 = profile.replace(/^data:image\/\w+;base64,/, "");
            const buffer1 = Buffer.from(base64Data1, "base64");
            
            if(fileType == "image")
                {
                    const dada = new p_diddy(
                        {
                            img: req.file.buffer,
                            contentType:req.file.mimetype,
                            profile:buffer1,
                            Username:username,
                            contentType1:"image/png",
                            chats: chats,
                            repost: repost,
                            likes: likes,
                            views: views
                        }
                    )
                    await dada.save();
                    res.json({
                        message:"Image uploaded sucessfully",
                        
                    });
                }
            else
            {
                const filename = `${req.file.originalname}`;
                // ✅ Stream video directly to GridFS
                const uploadStream = gridFSBucket.openUploadStream(req.file.originalname, {
                    contentType: req.file.mimetype,
                });

                uploadStream.end(req.file.buffer); // ✅ Directly pass buffer to GridFS

                uploadStream.on("finish", async () => {

                    const newVideo = new vid({
                        filename: filename,
                        contentType: req.file.mimetype,
                        profile: buffer1,
                        Username: username,
                        contentType1: "image/png",
                        chats,
                        repost,
                        likes,
                        views,
                    });
                    await newVideo.save();
                    return res.json({ message: "Video uploaded successfully!" });
                });
            }
        });
    }
    catch (er) {
        console.error(er);
        res.status(500).json({ er: "There was an error saving the post" });
    }
})

app.get("/image/:id", async (req, res) => {
    try {
        const post = await p_diddy.findById(req.params.id);
        if (!post || !post.img) {
            return res.status(404).json({ error: "Image not found" });
        }

        const base64Image = post.img.toString("base64");
        const base64profile = post.profile.toString("base64");

        res.json({ img: base64Image, contentType: post.contentType, profile:base64profile, contentType1:post.contentType1 });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving the image" });
    }
});

app.get("/profile/:id",async (req,res)=>{
    try{
        const post = await diddy.findById(req.params.id);
        if(!post || !post.profile)
        {
            return res.status(404).json({error:"Profile pic not found"});
        }
        const base64profile = post.profile.toString("base64");
        res.json({profile:base64profile,contentType:post.contentType1});
    }
    catch(er)
    {
        console.error(er);
        res.status(500).json({error:"Error retrieving the profile"});
    }
})

app.get("/Vprofile/:id",async (req,res)=>{
    try{
        const post = await vid.findById(req.params.id);
        if(!post || !post.profile)
        {
            return res.status(404).json({error:"Profile pic not found"});
        }
        const base64profile = post.profile.toString("base64");
        res.json({profile:base64profile,contentType:post.contentType1,filename:post.filename});
    }
    catch(er)
    {
        console.error(er);
        res.status(500).json({error:"Error retrieving the profile"});
    }
})

app.get("/video/:filename", async (req, res) => {
    try
    {
        const file = await mongoose.connection.db.collection("videos.files").findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ error: "Video not found" });
        }

        res.set({
            "Content-Type": file.contentType,
            "Content-Length": file.length, // Ensure correct video length
            "Accept-Ranges": "bytes", // Enable seeking support
        });

        gridFSBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    }
    catch (error) {
        console.error("Error retrieving video:", error);
        res.status(500).json({ error: "Error retrieving video" });
    }
});

app.post("/log_in", async(req,res)=>{
    try{
        const {email,password} = req.body;
        const baba = await user.findOne({email});

        if(!baba)
        {
            return res.status(404).json({message:"User not found"});
        }

        if(baba.password !== password)
        {
            return res.status(401).json({message:"Incorrect password"});
        }

        return res.status(200).json({message:"Sucessfully loged in ",userID:baba._id});
    }
    catch(er)
    {
        console.error("Some issue occured",er);
        res.status(500).json({message:"Internal server error"});
    }
})

app.post("/Sign-in",upload.single("pic"),async (req,res)=>{
    try{
        const {email,username,password} = req.body;
        if(!req.file)
        {
           return res.status(400).json({message:"No file uploaded"});
        }
        const pic = req.file;

        const baba = await user.findOne({email});
        if(baba)
        {
            return res.status(400).json({message:"You are already an user,Kindly head to log-in page"});
        }
        const dada = new user(
            {
                profile:pic.buffer,
                contentType:pic.mimetype,
                Username:username,
                email:email,
                password:password
            }
        )
        await dada.save();
        return res.status(200).json({message:"Sucessfully loged in ",
            user_id:dada._id
        });
    }
    catch(er)
    {
        console.error("There was a trouble signing-in",er);
        res.status(500).json({message:"Internal Server error"});
    }
})

app.get("/get-profile/:user_id",async (req,res)=>{
    try
    {
        const NewUser = await user.findById(req.params.user_id); 

        if (!NewUser || !NewUser.profile) {
            return res.status(404).json({ message: "User or image not found" });
        }
        const base64img = NewUser.profile.toString("base64");
        res.json({image:`data:${NewUser.contentType};base64,${base64img}`,name:NewUser.Username});
    }
    catch(er)
    {
        console.error("can't get the email",er);
        res.status(500).json({message:"Internal server error"});
    }
})

app.listen(port, () => {
    console.log("The server is running st port :- ", port);
})

