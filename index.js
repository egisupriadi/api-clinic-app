const express = require('express')
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express()
const { router } = require('./config')

const port = 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

router(app)

app.listen(port, () => console.log(`App listening on port ${port}`))