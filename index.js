const getBollingerRating = require('./technical-ratings').getBollingerRating
const getRSIRating = require('./technical-ratings').getRSIRating
const getRSI = require('./technical-ratings').getRSI

const fakeResponse = require('./fakeAVresponse').response

const express = require('express')
const app = express()
const port = 3000

app.get('/bollinger-rating/:symbol', (req, res) => {
    getBollingerRating(req.params.symbol, 5).then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/RSI-rating/:symbol', (req, res) => {
    getRSIRating(req.params.symbol, 5).then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/RSI/:symbol', (req, res) => {
    getRSI(req.params.symbol).then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/fakeAV', (req, res) => {
    res.send(fakeResponse)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// getBollingerRating('BLK', 5).then(data => console.log(data))
// getRSIRating('BLK', 5).then(data => console.log(data))