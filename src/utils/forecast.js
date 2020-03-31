const request = require('request')

const forecast = (longitude, latitude, callback) => {
    const url = 'https://api.darksky.net/forecast/485ed56c0832fd22d430c7d4df84f007/' + latitude + ',' + longitude

    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        }  else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            const message = body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is ' + body.currently.precipProbability + '% chance of rain.'
            callback(undefined, message)
        }
    })
}

module.exports = forecast