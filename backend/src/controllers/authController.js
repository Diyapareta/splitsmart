import User from "../models/User.js";
import bcrypt from"bcryptjs";
import jwt from "jsonwebtoken";
export const registerUser=async(req,res)=>{
  try {
    const{name,email,password}=req.body;
    const userexist=await User.findOne({email});
    if(userexist){
      return res.status(400).json({message:"user already exist"})
    };
    const salt=await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt);
    const user=await User.create({
      name,email,password:hashPassword,
    });
     res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const loginUser=async(req,res)=>{
  try {
    // console.log("JWT Secret at login:", process.env.JWT_SECRET);

    const{email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"invalid crediantials"});

    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"invalid credentials"});
    }
    const token =jwt.sign({id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"1d"}
    );
    res.json({
      token,user:{
        id:user._id,
        name:user.name,
        email:user.email,
      },
    });
  } catch (error) {
    res.status(500).json({message:error.message});
    
  }
}