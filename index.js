require('dotenv').config()
const { json, response } = require('express')
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

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))
app.use(cors())


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/info', (req, res, next) => {
    
    const dateTime = new Date
    console.log(dateTime)

    Person.countDocuments({}, (error, count) => {
        res.json({ info: `Phonebook has info for ${count} people `, dateTime})
    }).catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error.name)
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(deletedPerson => {
            if (deletedPerson) {
                res.status(204).end()
            } else {
                res.status(404).end()
            }
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => {
        console.log(error)
        next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    console.log('tänne päästään')
    const body = req.body
    console.log(body)

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {
        new: true
    })
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson)
        })
        .catch(error => {
            console.log(error)
            next(error)
        })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }

    if(error.name === 'ValidationError') {
        return response.status(400).json({ errorMessage: error.message})
    }
}

app.use(errorHandler)


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
