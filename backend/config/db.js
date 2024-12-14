import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb://localhost:27017/reactjs-food-delivery-app').then(()=>{
       console.log('DB connected') ;
    })
}