const getBollingerRating = require('./technical-ratings').getBollingerRating
const getRSIRating = require('./technical-ratings').getRSIRating

getBollingerRating('BLK', 5).then(data => console.log(data))
getRSIRating('BLK', 5).then(data => console.log(data))