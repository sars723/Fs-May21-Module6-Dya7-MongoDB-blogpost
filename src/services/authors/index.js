import express from "express"
import q2m from "query-to-mongo"
import { basicAuthMiddleware } from "../../auth/basic.js"
import { JWTAuthMiddleware } from "../../auth/token.js"
import { adminOnlyMiddleware } from "../../auth/admin.js"
import { JWTAuthenticate } from "../../auth/tools.js"
import createHttpError from "http-errors"
import passport from "passport"

import AuthorModel from "./schema.js"
import BlogModel from "../blogs/schema.js"

const authorsRouter = express.Router()

authorsRouter.get("/",JWTAuthMiddleware, async (req, res, next) => {
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

authorsRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new AuthorModel(req.body) 
    const { _id } = await newAuthor.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/me/stories", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const posts = await BlogModel.find({ author: req.author._id.toString() })

    res.status(200).send(posts)

  } catch (error) {
    next(error)
  }
})

authorsRouter.get("/me",JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.author)
  } catch (error) {
    next(error)
  }
})

authorsRouter.put("/me",JWTAuthMiddleware, async (req, res, next) => {
  try {
   req.author=req.body
    await req.author.save()

    res.send(req.author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.delete("/me",JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.author.deleteOne()
    res.send("deleted")

    res.send(author)
  } catch (error) {
    next(error)
  }
})


authorsRouter.get("/googleLogin", passport.authenticate("google", { scope: ["profile", "email"] }))

authorsRouter.get("/googleRedirect", passport.authenticate("google"), async (req, res, next) => {
  try {
    console.log("redirect")
    console.log(req.author)
    res.redirect(`http://localhost:3000?accessToken=${req.author.tokens.accessToken}&refreshToken=${req.author.tokens.refreshToken}`)
  } catch (error) {
    next(error)
  }
})
authorsRouter.get("/:authorID",JWTAuthMiddleware,adminOnlyMiddleware, async (req, res, next) => {
  try {
    const author = new AuthorModel.findById(req.params.authorID) 

    res.send(author)
  } catch (error) {
    next(error)
  }
})
authorsRouter.post("/login",async (req, res, next) => {
  try {
    const { email, password } = req.body

    const author = await AuthorModel.checkCredentials(email, password)

    if (author) {
      const accessToken = await JWTAuthenticate(author)
      res.send({ accessToken })
    } else {
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

export default authorsRouter
