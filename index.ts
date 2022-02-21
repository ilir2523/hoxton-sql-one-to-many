import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
app.use(cors())
app.use(express.json())
const PORT = 8000

const db = new Database('./museum_data.db', {
    verbose: console.log
})

const getAllMuseums = db.prepare(`
SELECT * FROM museums;
`)

const getAllWorks = db.prepare(`
SELECT * FROM works;
`)

const getAllWorksAndMuseums = db.prepare(`
SELECT works.id, works.name, works.picture, museums.name as museum, museums.city 
FROM works 
INNER JOIN museums ON works.museumId = museums.id;
`)

const getMuseumById = db.prepare(`
SELECT * FROM museums WHERE id=?;
`)

const getWorkById = db.prepare(`
SELECT * FROM museums WHERE id=?;
`)

const getWorkAndMuseumById = db.prepare(`
SELECT works.id, works.name, works.picture, museums.name as museum, museums.city 
FROM works 
INNER JOIN museums ON works.museumId = museums.id
WHERE works.id=?;
`)

const getAllMuseumsAndWorksJson = db.prepare(`
SELECT museums.*, json_group_array(json_object('worksId', works.id, 'workName', works.name, 'picture', works.picture)) "works"
FROM museums INNER JOIN works ON works.museumId = museums.id
GROUP BY museums.id;
`)

const getMuseumAndWorkJsonById = db.prepare(`
SELECT museums.*, json_group_array(json_object('worksId', works.id, 'workName', works.name, 'picture', works.picture)) "works"
FROM museums INNER JOIN works ON works.museumId = museums.id
WHERE museums.id=?;`)

const createMuseum = db.prepare(`INSERT INTO museums (name, city) VALUES (?,?);`)
const createWork = db.prepare(`INSERT INTO works (name, picture, museumId) VALUES (?,?,?);`)



app.get('/museums', (req, res) => {
    const museums = getAllMuseums.all()
    res.send(museums)
})

app.get('/museums/:id', (req, res) => {
    const id = req.params.id
    const museums = getMuseumById.get(id)
    if (museums) {
        res.send(museums)
    } else res.status(404).send({ error: "Museum not found." })
})

app.get('/museums-works', (req, res) => {
    const museums = getAllMuseumsAndWorksJson.all()
    for (const data of museums) {
        data.works = JSON.parse(data.works)
    }
    res.send(museums)
})

app.get('/museums-works/:id', (req, res) => {
    const id = req.params.id
    const museums = getMuseumAndWorkJsonById.get(id)
    if (museums.id !== null) {
        museums.works = JSON.parse(museums.works)
        res.send(museums)
    } else res.status(404).send({error: "Museum with works not found"}) 
})

app.get('/works', (req, res) => {
    const works = getAllWorks.all()
    res.send(works)
})

app.get('/works/:id', (req, res) => {
    const id = req.params.id
    const works = getWorkById.get(id)
    if (works) {
        res.send(works)
    } else res.status(404).send({ error: "Work not found." })
})

app.get('/works-museums', (req, res) => {
    const works = getAllWorksAndMuseums.all()
    res.send(works)
})

app.get('/works-museums/:id', (req, res) => {
    const id = req.params.id
    const museums = getWorkAndMuseumById.get(id)
    museums.works = JSON.parse(museums.works)
    res.send(museums)
})


app.post('/museums', (req, res) => {
    const { name, city } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push(`Name missing or not a string`)
    if (typeof city !== 'string') errors.push(`City missing or not a string`)

    if (errors.length === 0) {
        const info = createMuseum.run(name, city)
        const newMuseum = getMuseumById.get(info.lastInsertRowid)
        res.status(201).send(newMuseum)
    } else res.status(400).send({ errors: errors })
})

app.post('/works', (req, res) => {
    const { name, picture, museumId } = req.body

    const errors = []

    if (typeof name !== 'string') errors.push(`Name missing or not a string`)
    if (typeof picture !== 'string') errors.push(`City missing or not a string`)
    if (typeof museumId !== 'number') errors.push(`museumId missing or not a number`)

    if (errors.length === 0) {
        const info = createWork.run(name, picture, museumId)
        const newWork = getWorkById.get(info.lastInsertRowid)
        res.status(201).send(newWork)
    } else res.status(400).send({ errors: errors })

})

app.listen(PORT, () => console.log(`
Listening on: http://localhost:${PORT}
- http://localhost:${PORT}/museums
- http://localhost:${PORT}/museums-works
- http://localhost:${PORT}/works
- http://localhost:${PORT}/works-museums
`))