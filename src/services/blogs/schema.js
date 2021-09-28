import mongoose from 'mongoose'

const {Schema,model}=mongoose

const blogSchema=new Schema({
category:{type:String,required:true},
title:{type:String,required:true},
cover:{type:String,required:true},
readTime:{
    value:{
        type:Number,required:true
    },
    unit:{
        type:String,required:true
    }
},
author: { type: Schema.Types.ObjectId, ref: "Author" },
/* author:{
    name:{
        type:String,required:true
    },email:{
        type:String,required:true
    },avatar:{
        type:String,required:true
    }
} */
content:{type:String,required:true},
/* comments:{default:[],type:[commentSchema] */
comment:[
    {   
        user:{name:String,avatar:String},
        comment:String,
        rate:Number
    }
]
},
{
    timestamps:true
})
export default model("blog",blogSchema)
