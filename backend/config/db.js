import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://bala0428:Bala%40123@data.an06x.mongodb.net/github?retryWrites=true&w=majority&appName=data').then(()=>{
       console.log('DB connected') ;
    })
}
