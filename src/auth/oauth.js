import GoogleStrategy from "passport-google-oauth20"
import passport from "passport"
import AuthorModel from "../services/authors/schema.js"
import { JWTAuthenticate } from "./tools.js"

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}:${process.env.PORT}/authors/googleRedirect`,
  },
  async (accessToken, refreshToken, profile, passportNext) => {
    try {
      
      console.log(profile)

      const author = await AuthorModel.findOne({ googleId: profile.id })

      if (author) {

        const tokens = await JWTAuthenticate(author)

        passportNext(null, { tokens })
      } else {
        
        const newAuthor = {
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          role: "User",
          googleId: profile.id,
        }

        const createdAuthor = new UserModel(newAuthor)
        const savedAuthor = await createdAuthor.save()
        const tokens = await JWTAuthenticate(savedAuthor)

        passportNext(null, { Author: savedAuthor, tokens })
      }
    } catch (error) {
      console.log(error)
      passportNext(error)
    }
  }
)

passport.serializeUser(function (author, passportNext) {
  passportNext(null, author) 
})

export default googleStrategy
