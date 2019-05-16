import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()

const port = 3030

app.use(cors())
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.status(200).send({ data: 'hello', error: '' })
})

app.listen(port, () => {
    console.log(`Events API is listening on port ${port}`)
})