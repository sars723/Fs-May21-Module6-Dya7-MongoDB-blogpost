import createHttpError from "http-errors"
import { verifyJWT } from "./tools.js"
import AuthorModel from '../services/authors/schema.js'

export const JWTAuthMiddleware = async (req, res, next) => {
    
    if (!req.headers.authorization) {
      next(createHttpError(401, "Please provide credentials in Authorization header!"))
    } else {
      try {
       
        const token = req.headers.authorization.replace("Bearer ", "")
   console.log(token)
        const decodedToken = await verifyJWT(token)
        console.log(decodedToken)
  
        const author = await AuthorModel.findById(decodedToken._id)
 
        if (author) {
          req.author = author
          next()
        } else {
          next(createHttpError(404, "Author not found!"))
        }
      } catch (error) {
        next(createHttpError(401, "Token not valid!"))
      }
    }
  }
  