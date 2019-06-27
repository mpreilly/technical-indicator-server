const techInd = require('technicalindicators')
const fetch = require('node-fetch')

const AVapiKey = 'W7AI95T45CCDL6VJ'

const fakeURL = 'http://localhost:3000/fakeAV'

async function getDailyCloses(symbol) {
    // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${AVapiKey}`
    const url = fakeURL
    return fetch(url)
    .then(response => {
        if (!response.ok) { throw response }
        return response.json()
    })
    .then(data => {
        // console.log(data)
        var closes = []
        for (let day of Object.keys(data['Time Series (Daily)'])) {
            // console.log(day + ": " + data['Time Series (Daily)'][day]['4. close'])
            closes.push(parseFloat(data['Time Series (Daily)'][day]['4. close']))
        }
        return closes.reverse()
    }).catch(err => console.log(err))
}

async function getBollingerBands(symbol) {
    return getDailyCloses(symbol).then(data => {
        // console.log(data)
        const BB = techInd.BollingerBands
        const input =  {
            period : 20, 
            values : data,
            stdDev : 2
        }
        const result = BB.calculate(input)
        // console.log(result)
        return result
    })
}

// bollinger band pb (%B) quantifies where the price is, relative to the bands
// ie below 0 when below bottom band, between 0 and .50 when between bottom and middle, etc
function getBollingerPB(symbol) {
    return getBollingerBands(symbol).then(bands => {
        var pbs = []
        for (let bbObj of bands) {
            pbs.push(bbObj['pb'])
        }
        return pbs
    })  
}

// rating out of 5, calculated as average of bollinger PB for given number of previous days
function getBollingerRating(symbol, numDays) {
    return getBollingerPB(symbol).then(pbs => {
        var lastNpbs = pbs.slice(-1 * numDays)
        // console.log(lastNpbs)
        const average = lastNpbs.reduce((a,b) => a + b, 0) / numDays

        //we want the average to be low, so we do 1 - average to get rating
        var rating = (1 - average) * 5
        if (rating > 5) { rating = 5 }
        else if (rating < 0) { rating = 0 }
        return rating
    })
}

function getStochasticOsc(symbol) {
    // const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${AVapiKey}`
    const url = fakeURL
    return fetch(url)
    .then(response => {
        if (!response.ok) { throw response }
        return response.json()
    })
    .then(data => {
        var closes = []
        var highs = []
        var lows = []
        for (let day of Object.keys(data['Time Series (Daily)'])) {
            closes.push(parseFloat(data['Time Series (Daily)'][day]['4. close']))
            highs.push(parseFloat(data['Time Series (Daily)'][day]['2. high']))
            lows.push(parseFloat(data['Time Series (Daily)'][day]['3. low']))
        }
        closes = closes.reverse()
        highs = highs.reverse()
        lows = lows.reverse()

        let input = {
            high: highs,
            low: lows,
            close: closes,
            period: 14,
            signalPeriod: 3
        }

        const result = techInd.Stochastic.calculate(input)
        return result
    }).catch(err => console.log(err))
}

function getRSI(symbol) {
    return getDailyCloses(symbol).then(data => {
        const input = {
            values: data,
            period: 14
        }
        return techInd.RSI.calculate(input)
    })
}

function getRSIRating(symbol, numDays) {
    return getRSI(symbol).then(rsiArr => {
        var lastNrsi = rsiArr.slice(-1 * numDays)
        const average = lastNrsi.reduce((a,b) => a + b, 0) / numDays

        // we want the average to be low, so we do 100 - average,
        // then divide by 100 to get out of 1, then multiply by 5 to get rating
        // (obviously could be simplified to divide by 20 but it's more intuitive this way)
        var rating = ((100 - average) / 100) * 5
        if (rating > 5) { rating = 5 }
        else if (rating < 0) { rating = 0 }
        return rating
    })
}

// getBollingerPB('BLK').then(pbs => console.log(pbs.pop()))
// getBollingerRating('BLK', 5).then(rating => console.log(rating))
// getRSIRating('BLK', 5).then(result => console.log(result))

module.exports.getBollingerRating = getBollingerRating
module.exports.getRSIRating = getRSIRating
module.exports.getRSI = getRSI