import Database from 'better-sqlite3'

const db = new Database('./museum_data.db', {
  verbose: console.log
})

const museums = [
    {
        name: "Louvre",
        city: "Paris"
    },
    {
        name: "British Museum",
        city: "London"
    },
    {
        name: "Museo del Prado",
        city: "Madrid"
    },
    {
        name: "Hermitage",
        city: "Saint Petersburg"
    },
    {
        name: "Metropolitan Museum of Art",
        city: "New York"
    }
]

const works = [
    {
        name: "Mona Lisa",
        picture: "https://www.planetware.com/photos-large/F/france-louvre-mona-lisa.jpg",
        museumId: 1
    },
    {
        name: "Les Noces de Cana",
        picture: "https://www.planetware.com/photos-large/F/france-louvre-wedding-at-cana.jpg",
        museumId: 1
    },
    {
        name: "Vénus de Milo",
        picture: "https://www.planetware.com/photos-large/F/france-louvre-mona-lisa.jpg",
        museumId: 1
    },
    {
        name: "The Rosetta",
        picture: "https://www.britishmuseum.org/sites/default/files/styles/uncropped_large/public/2020-07/bust-ramesses-the-great-v2-1920.jpg?itok=NVolPxxH",
        museumId: 2
    },
    {
        name: "A voluptuary under the horrors of digestion",
        picture: "http://lh6.ggpht.com/D52pMVefDozgs88h8sQXzW2KevcHpiqkDbEv2Yb6KsLNmI0zZhIVn4nQzQ=w238-h300-n-l64",
        museumId: 2
    },
    {
        name: "Las Meninas",
        picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/1200px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg",
        museumId: 3
    },
    {
        name: "Peacock Clock",
        picture: "https://lh6.ggpht.com/zBctqSzsQc5ANSr2oTEY7jcL3LWi9bMdpWRHbAzIBUTKk1yT3cXlufwZEDvj=s1200",
        museumId: 4
    },
    {
        name: "Self-Portrait with a Straw Hat",
        picture: "https://images.metmuseum.org/CRDImages/ep/original/DT1502_cropped2.jpg",
        museumId: 5
    }
]

const dropMuseums = db.prepare(`DROP TABLE IF EXISTS museums;`)
const dropWorks = db.prepare(`DROP TABLE IF EXISTS works;`)
dropWorks.run()
dropMuseums.run()

const createMuseums = db.prepare(`
CREATE TABLE museums (
  id     INTEGER,
  name   TEXT NOT NULL,
  city  TEXT NOT NULL,
  PRIMARY KEY(id)
);
`)

const createWorks = db.prepare(`
CREATE TABLE works (
  id    	INTEGER,
  name  	TEXT NOT NULL,
  picture 	TEXT,
  museumId INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY(museumId) REFERENCES museums(id)
);`)

createMuseums.run()
createWorks.run()

const createMuseum = db.prepare(`
INSERT INTO museums (name, city) VALUES (?, ?);
`)

const createWork = db.prepare(`
INSERT INTO works (name, picture, museumId) VALUES (?, ?, ?);
`)

for (const museum of museums) {
  createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
  createWork.run(work.name, work.picture, work.museumId)
}
