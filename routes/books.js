const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All books route
router.get('/', async (req, res) => {
    let searchOptions = {}
    let query = Book.find()
    if (req.query.title != null && req.query.title !== "") {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
        query = query.lte('publishDate', req.query.publishedBefore) // .lte (l -> less, t -> than, e -> equal to)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
        query = query.gte('publishDate', req.query.publishedAfter) // .gte (g -> greate, t -> than, e -> equal to)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    }
    catch {
        res.redirect('/')
    }
    // let searchOptions = {}
    // if (req.query.name != null && req.query.name !== "") {
    //     searchOptions.name = new RegExp(req.query.name, 'i')
    // }
    // try {
    //     const authors = await Author.find(searchOptions)
    //     res.render('books/index', {books: books, searchOptions: req.query})
    // }
    // catch {
    //     res.redirect('/')
    // }
})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create book route
router.post('/new', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        description: req.body.description,
        author: req.body.author,
        pageCount: req.body.pageCount,
        coverImageName: fileName
    })

    try {
        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect(`/books`)
    }
    catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), (error) => {
        if (error) console.log(error)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = { 
            book: book, 
            authors: authors 
        }
        if (hasError) params.errorMessage = 'Error creating book'
        res.render('books/new', params)
    }
    catch (error) {
        res.redirect("/books")
    }
}

module.exports = router