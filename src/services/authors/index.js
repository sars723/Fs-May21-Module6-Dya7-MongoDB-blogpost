import express from "express"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"

import AuthorModel from "./schema.js"
import BlogModel from "../blogs/schema.js"

const authorsRouter = express.Router()

authorsRouter.get("/",basicAuthMiddleware, async (req, res, next) => {
  try {
    const query = q2m(req.query)

    console.log(query)

    const total = await AuthorModel.countDocuments(query.criteria)
    const authors = await AuthorModel.find(query.criteria, query.options.fields)
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort) 

    res.send({ links: query.links("/authors", total), total, authors, pageTotal: Math.ceil(total / query.options.limit) })
  } catch (error) {
    next(error)
  }
})

authorsRouter.post("/",basicAuthMiddleware, async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body) 
    const { _id } = await newAuthor.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/me/stories", basicAuthMiddleware, async (req, res, next) => {
  try {
    const posts = await BlogModel.find({ author: req.author._id.toString() })

    res.status(200).send(posts)

  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me",basicAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me",basicAuthMiddleware, async (req, res, next) => {
  try {
   req.author=req.body
    await req.author.save()

    res.send(req.author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.delete("/me",basicAuthMiddleware, async (req, res, next) => {
  try {
    await req.author.deleteOne()
    res.send("deleted")

    res.send(author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/:authorID",basicAuthMiddleware,adminOnlyMiddleware, async (req, res, next) => {
  try {
    const author = new AuthorModel.findById(req.params.authorID) 

    res.send(author)
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
