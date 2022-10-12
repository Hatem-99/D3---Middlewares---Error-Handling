import express from "express" 
import listEndpoints from "express-list-endpoints"
import usersRouter from "./api/index.js"
import { badRequestHandler, unauthorizedHandler,notFoundHandler,genericErrorHandler  } from "./errorHandling.js"
import cors from 'cors'



const server = express()
const port = 3001
server.use(cors())
server.use(express.json()) 


server.use("/blogs", usersRouter)

server.use(badRequestHandler)
server.use(unauthorizedHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)


server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})