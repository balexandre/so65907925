const express = require('express')
const upload = require('multer')()
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()
const app = express()

const PORT = process.env.PORT || 3002
const publicDirectory = path.join(__dirname, 'public')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(publicDirectory))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '/views'))

const fnCreatePost = () => {
    const showError = false // set to true to show error page
    return showError
        ? Promise.reject(new Error(`couldn't create a new post`))
        : Promise.resolve(uuidv4())
}

router.post('/newpost-withfile', upload.single('newImage'), async (req, res) => {
    try {
        const { title } = req.body
        const postId = await fnCreatePost()
        const destination = `./public/images/${postId}.png`
    
        fs.writeFileSync(destination, req.file.buffer)
        res.render('result', { postId, title })
    } catch (err) {
        res.render('error', { err })
    }
})

router.get('/', (req, res) => {
    res.render('index')
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(
        `server ready at http://localhost:${PORT}`
    )
})
