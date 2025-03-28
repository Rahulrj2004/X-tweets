async function connectDB()
{
    try
    {
        await mongoose.connect("mongodb://localhost:27017/Twitter/write");
        console.log("Connected to the database");
    }
    catch(e)
    {
        console.error("There was some error connecting to database",e);
    }
}

connectDB();