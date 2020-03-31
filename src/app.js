const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    // render a view
    res.render('index', {
        title: 'Weather',
        name: 'Steve Scheider'
    })
}) 

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Steve Scheider'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Steve Scheider',
        message: 'important help message.'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'you must provide an address.'
        })
    }

    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(longitude, latitude, (error, forecastdata) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                location,
                forecast: forecastdata,
                address: req.query.address
            })
        })
    })    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term.'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error_404', {
        title: 'Help Article',
        name: 'Steve Scheider',
        message: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('error_404', {
        title: '404 error',
        name: 'Steve Scheider',
        message: 'Page not found.'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
