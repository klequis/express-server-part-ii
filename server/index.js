import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import morgan from "morgan"
import todo from "../routes/todo-route"
import config from "../config"

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(morgan("dev"))

app.use("/api/todo", todo)
app.get("/api", (req, res) => {
  console.error("Invalid endpoint!")
  res.send("Invalid endpoint!")
})

app.listen(config.port, () => {
  console.log(`Events API is listening on port ${port}`)
})
