const express = require('express')
const router = express.Router()
// const multer = require('multer')
// const path = require('path')
// const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
// const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
/*const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})*/

// All books route
router.get('/', async (req, res) => {
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
})

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

// Create book route
router.post('/new', /*upload.single('cover'),*/ async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        publishDate: new Date(req.body.publishDate),
        description: req.body.description,
        author: req.body.author,
        pageCount: req.body.pageCount,
        // coverImageName: fileName
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect(`/books/${newBook.id}`)
    }
    catch {
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    }
})

// function removeBookCover(filename) {
//     fs.unlink(path.join(uploadPath, filename), (error) => {
//         if (error) console.log(error)
//     })
// }

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        // const book = await Book.findById(req.params.id)
        // const author = await Author.findById(book.author)
        res.render('books/show', { book: book })
    }
    catch {
        res.redirect('/books')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        // const authors = await Author.find({})
        // const params = { 
        //     book: book, 
        //     authors: authors 
        // }
        // // if (hasError) params.errorMessage = 'Error updating book'
        // res.render('books/edit', params)
        renderEditPage(res, book)
    }
    catch {
        res.redirect('/books')
    }
})

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = { 
            book: book, 
            authors: authors 
        }
        if (hasError) params.errorMessage = `Error ${form} book`
        res.render(`books/${form}`, params)
    }
    catch {
        res.redirect("/books")
    }
}

router.put('/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.description = req.body.description
        book.pageCount = req.body.pageCount
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        if (req.body.cover != null && req.body.cover != '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }
    catch {
        if (book == null) {
            res.redirect('/')
        }
        else {
            renderEditPage(res, book, true)
        }
    }
})

router.delete('/:id', async (req, res) => {
    let book

    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect(`/books`)
    }
    catch {
        if (book == null) {
            res.redirect('/books')
        }
        else {
            res.redirect(`/books/${req.params.id}`)
        }
    }
})

module.exports = router