import express from "express"

import BlogModel from './schema.js'
const blogsRouter=express.Router()

blogsRouter.get("/",async(req,res,next)=>{
    try{
 const blogs=await BlogModel.find({})
 res.send(blogs)
    }catch(error){
        next(error)
    }
})


 blogsRouter.post("/",async(req,res,next)=>{
    try{
        const newBlogs=new BlogModel(req.body)
        const {_id}=await newBlogs.save()
        console.log(_id)
        res.status(201).send({_id})
    }catch(error){
        console.log(error)
        next(error)
    }
}) 
blogsRouter.get("/:blogId",async(req,res,next)=>{
    try{
const blogId=req.params.blogId
const blogs=await BlogModel.findById(blogId)
if(blogs){
    res.send(blogs)
}
else{
    res.status(404).send("not found")
}
    }catch(error){
        next(error)
    }
})
blogsRouter.put("/:blogId",async(req,res,next)=>{
    try{
const blogId=req.params.blogId
const modifiedBlog=await BlogModel.findByIdAndUpdate(blogId,req.body,{new:true})
if(modifiedBlog){
    res.send(modifiedBlog)
}
else{
    res.status(404).send("not found")
}
    }catch(error){
        next(error)
    }
})
blogsRouter.delete("/:blogId",async(req,res,next)=>{
    try{
        const blogId=req.params.blogId
const deletedBlog=await BlogModel.findByIdAndDelete(blogId)
if(deletedBlog){
    res.status(204).send()
}else{
    res.status(404).send("not found")
}

    }catch(error){
        next(error)
    }
})
export default blogsRouter