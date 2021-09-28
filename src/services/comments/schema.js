import mongoose from 'mongoose'


const {Schema, model}=mongoose

const commentSchema=new Schema({
    user:{
       name: {type:String,required:true},
       avatar:{type:String,required:true}
    },
  comment:{type:String,required:true},
  rate:{type:Number,required:true,
    min:[1,"Rate must be min 1"],
    max:[5,"Rate must be max 5"],
    default:1,
 },

},{
    timestamps:true
})

export default model("Comment",commentSchema)

