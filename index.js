const WebSocket = require("ws")
const _ = require('lodash')
const db = require('./db')

var ws = new WebSocket('wss://api.bitfinex.com/ws/2');
const BOOK = {}

ws.on('open', () => {
    console.log('WebSocket Client Connected');
    BOOK.bids = {}
    BOOK.asks = {}
    BOOK.psnap = {}
    BOOK.mcnt = 0
    ws.send(JSON.stringify({event: "subscribe", channel: "book", symbol: "tBTCUSD"}))
})
ws.on('error', error => { console.log("Connection Error: " + error.toString()) })
ws.on('close', () => { console.log('echo-protocol Connection Closed') })
ws.on('message', data => {
    data = JSON.parse(data)
    
    if (data.event) return
    if (data[1] === 'hb') return

    // Book Snapshot
    if (BOOK.mcnt === 0) {
        for (let level of data[1]) {
            let pp = { 
                price: level[0], 
                count: level[1], 
                amount: Math.abs(level[2]),
                side: level[2] > 0 ? 'bids' : 'asks'
            }
            BOOK[pp.side][pp.price] = pp
        }

        console.log(BOOK)
    } 
    
    // Book updates
    else {
        let pp = { 
            price: data[1][0], 
            count: data[1][1], 
            amount: Math.abs(data[1][2]),
            side: data[1][2] > 0 ? 'bids' : 'asks'
        }

        if (pp.count === 0) _.unset(BOOK, `${pp.side}.${pp.price}`)
        else _.set(BOOK, `${pp.side}.${pp.price}`, pp)
    }

    BOOK.mcnt++
})

 

