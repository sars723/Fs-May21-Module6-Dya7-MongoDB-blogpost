import express from "express"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"

import AuthorModel from "./schema.js"

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

export default authorsRouter
