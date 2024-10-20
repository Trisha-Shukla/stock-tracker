const apiKey='IP12LPHJVIM8I5R6';
let stockChart;
const stockData=[];

const trendingStocks=async()=>{
    
    const trendingStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'INTC'];

    trendingStocks.forEach((stock)=>{
        
        const option=document.createElement('option');
        option.value=stock;
        
        option.text=stock;
        document.getElementById('trending-stock').appendChild(option);
    })

}
trendingStocks();
const fetchingStockData=async(symbol)=>{
    try {
        
        const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`);
        const data = await response.json();
        console.log(data);
        
    
        return data['Time Series (Daily)'];
    } catch (error) {
        console.error('fetching error',error)
    }

}

const loadTrendingStock=async()=>{
    const loadStock=document.getElementById('trending-stock').value ;    
    const fetchedData= await fetchingStockData(loadStock);
    console.log(fetchedData);
    if(fetchedData){
    displayStockData(fetchedData, loadStock);
}
else{
    document.getElementById('stock-detail').innerHTML= `Stock data not available for ${loadStock}` ;
}
    

    

}
const searchStock=async()=>{
    const searchedStock=document.getElementById('search-input').value.toUpperCase() ;    
    console.log(searchedStock);
    
    const fetchedData= await fetchingStockData(searchedStock);
    if(fetchedData){
        displayStockData(fetchedData, searchedStock);
    }
    else{
        document.getElementById('stock-detail').innerHTML= `Stock symbol not found ${searchedStock} ` ;
    }
    
}
const displayStockData=(fetchedData,stockName)=>{
    
    
        const latestDate=Object.keys(fetchedData)[0];
    console.log(latestDate);
    
    const latestData=fetchedData[latestDate];
    console.log(latestData);
    const price=latestData['4. close'];
    const change=(latestData['4. close']-fetchedData[Object.keys(fetchedData)[1]]['4. close'] ).toFixed(2);
    const volume=latestData['5. volume'];
     
    document.getElementById('stock-name').innerText=stockName;
    document.getElementById('price').innerText=`Price: $ ${price}`;
    document.getElementById('change').innerText=`Change:$ ${change}`;
    document.getElementById('volume').innerText=`Volume: ${volume}`
    stockData.push({
        stock:stockName,
        price:price,
        change:change,
        volume:volume,
    });
    stockGraph(fetchedData);
    compareData();
    
    
}

const compareData=()=>{
console.log(stockData);
const tableBody=document.createElement('tbody');
stockData.forEach((data)=>{
    tableBody.innerHTML=`<td>${data.stock}</td>
    <td>$ ${data.price}</td>
    <td>${data.change}</td>
    <td>${data.volume}</td>
    `
});
document.getElementById('compare-table').appendChild(tableBody);


}

const stockGraph=(fetchedData)=>{
    const ctx=document.getElementById('stock-chart').getContext('2d');
    const label=Object.keys(fetchedData).slice(0,30).reverse();
    const data=label.map((date)=>{
        return fetchedData[date]['4. close'];
    })

    if(stockChart){
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });

}

document.getElementById('load-stock').addEventListener('click',loadTrendingStock);
document.getElementById('search-btn').addEventListener('click',searchStock);