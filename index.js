require('dotenv').config()
const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

morgan.token('post-content', (req) => {
    if (req.method === 'POST') {
        return  JSON.stringify(req.body)
    }
    return  ''
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))
app.use(cors())
app.use(express.static('build'))

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendick",
//         number: "39-23-6423122"
//     }
// ]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res) => {
    const length = persons.length
    const dateTime = new Date
    console.log(dateTime)
    const str = `<p>Phonebook has info for ${length} people</p> <br> ${dateTime}`


    res.send(str)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }
    // const sameName = persons.find(person => person.name === body.name)
    // const sameNumber = persons.find(person => person.number === body.number) 
    // if(sameName) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    // if(sameNumber) {
    //     return res.status(400).json({
    //         error: 'number must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const generateId = () => {
    const id = Math.floor(Math.random() * Math.floor(347))

    return id
}

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
