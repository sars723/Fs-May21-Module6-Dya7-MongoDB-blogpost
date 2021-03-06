import express from "express"
import commentModel from '../comments/schema.js'
import BlogModel from './schema.js'
import createError from 'http-errors'
import q2m from "query-to-mongo";
import { basicAuthMiddleware } from "../../auth/basic.js"

const blogsRouter=express.Router()

blogsRouter.get("/",async(req,res,next)=>{
    try{
        const query = q2m(req.query);
        console.log(query)
        const total = await BlogModel.countDocuments(query.criteria);
 const blogs=await BlogModel.find(query.criteria, query.options.fields)
 res.send({
    links: query.links("/blogs", total),
    total,
     blogs})
    }catch(error){
        next(error)
    }
})


 blogsRouter.post("/",async(req,res,next)=>{
    try{
        const newBlogs=new BlogModel(req.body)
        const {_id}=await newBlogs.save()
        console.log(_id)
        res.status(201).send(newBlogs)
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


blogsRouter.put("/:blogID/comments/commentID",async(req,res,next)=>{
  
    const blog=await BlogModel.findById(req.params.blogID)
    if(blog){
        const commentIndex=blog.comments.findIndex((comment)=>comment._id.toString()===req.params.commentID)
        if(commentIndex===-1){
            res.status(404).send({
                message: `comment with ${req.params.commentID} is not found!`,
              });
        }else{
            blog.comments[commentIndex] = {
                ...blog.comments[commentIndex].toObject(),
                ...req.body,_id: req.params.blogID
              };
              await blog.save();
              res.status(204).send(blog.comments);
        }
       
    }else{
        res
        .status(404)
        .send({ message: `blog with ${req.params.id} is not found!` });
    }
})
blogsRouter.get("/:blogID/comments/commentID",async(req,res,next)=>{
    try {
    const blog=await BlogModel.findById(req.params.blogID)
    if(blog){
        res.send(blog.comment)
    }else{
        res.status(404).send("not found")
    }
    } catch (error) {
        next(error)
    }
})

blogsRouter.get("/:blogID/comments",async(req,res,next)=>{
    try {
        
    const blog=await BlogModel.findById(req.params.blogID)
    if(blog){
        /* const comment=blog.comment.find((comment)=>comment._id.toString()===req.params.commentID) */
       /*  if(comment){ */
             res.send(blog.comment)
    
    }else{
        res.status(404).send("blog not found")
    }
    } catch (error) {
        next(error)
    }
})

blogsRouter.post("/:blogID/comments",async(req,res,next)=>{
    try {
    const blog=await BlogModel.findById(req.params.blogID)
    if(blog){
        await BlogModel.findByIdAndUpdate(req.params.blogID,{$push:{comment:req.body}},{new:true,runValidators: true,})
      
            res.status(204).send(blog.comment)
        }
      
    else{
        next(createError(404,`comment with id${req.params.comment}not found`))
    }
    } catch (error) {
        next(error)
    }
})

blogsRouter.delete("/:blogID/comments/:commentID",async(req,res,next)=>{
    try {
    const blog=await BlogModel.findById(req.params.blogID)
    if(blog){
        await BlogModel.findByIdAndUpdate(req.params.blogID,{$pull:{comments:{_id:req.params.commentID}}},{new:true,runValidators: true,})
        res.status(204).send(blog.comments)
    }else{
        res.status(404).send("blog not found")
    }
    } catch (error) {
        next(error)
    }
})


export default blogsRouter