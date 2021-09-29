import jwt from 'jsonwebtoken'

const generateJWT = payload =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRETE, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  )

export const verifyJWT = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRETE, (err, decodedToken) => {
      if (err) reject(err)
      resolve(decodedToken)
    })
  )

  export const JWTAuthenticate = async author => {
    
    const accessToken = await generateJWT({ _id: author._id })
  
    return accessToken
  }