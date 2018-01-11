const getTrendSinceOpen = require('../rh-actions/get-trend-since-open');
const jsonMgr = require('../utils/json-mgr');

const getAllTickers = require('../rh-actions/get-all-tickers');

const getTrendAndSave = async (Robinhood, min) => {

    // step 1 - get all tickers
    try {
        var allTickers = require('./stock-data/allStocks');
    } catch (e) {
        allTickers = await getAllTickers(Robinhood);
    }
    allTickers = allTickers
        .filter(stock => stock.tradeable)
        .map(stock => stock.symbol);

    // step 2 - get trend
    console.log(`getting trend since open for all stocks - 6:31am + ${min} minutes`);
    const trendingArray = await getTrendSinceOpen(Robinhood, allTickers);
    const dateStr = (new Date()).toLocaleString();

    // step 3 - save trend
    await jsonMgr.save(`./stock-data/${dateStr} (+${min}).json`, trendingArray);
    console.log('done getting trend');
    
    return trendingArray;

};

module.exports = getTrendAndSave;
