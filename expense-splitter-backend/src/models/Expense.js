import mongoose from "mongoose";
const expenseSchema=new mongoose.Schema({
  group:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Group",
    required:true,
  },
  paidBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  amount:{
    type:Number,
    required:true,
  },
  description:{
    type:String,

  },
  isSettled: {
  type: Boolean,
  default: false
},

  splits:[{
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
    amount:{type:Number,},
  },
  ],
  },
  {timestamps:true}

);
export default mongoose.model("Expense",expenseSchema);