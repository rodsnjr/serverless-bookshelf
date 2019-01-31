const stockRepository = require('./src/repository/stock.repository');

const buildResponse = function(status, content = {}) {
    return {
        statusCode: status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    }
}

module.exports.stockEntry = function(event) {
    const stockMessage = JSON.parse(event.Records[0].Sns.Message);
    console.log('StockEntry Handler - Received Stock Entry', stockMessage);
    return stockRepository.stockEntry(stockMessage.bookId, stockMessage.amount)
        .then(stockEntry => { 
            console.log('Stock Entry Added ', stockEntry);
            return stockEntry;
        });
}

module.exports.getStock = function(event, context) {
    console.log('StockEntry Get For book');
    return stockRepository.amountStockByBookId(event.pathParameters.bookId)
        .then(stockAmountFound => buildResponse(200, stockAmountFound))
        .catch(error => buildResponse(500, { message: error }));
}