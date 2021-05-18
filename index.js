const fetch = require('node-fetch')


const apiUrl = 'https://api.apify.com/v2/datasets/z0PzhOM8YnDpNxPLw/items?token=ioRdCccgWATA4qfSt4nASYxkH'

let tempStorage = new Promise(resolve => {
    // setTimeout(() => {
    fetch(apiUrl).then(async (r) => {
        r = await r.json()
        r = formatResponse(r)
        resolve(tempStorage = r)
    })
    // }, 2000)
})

function formatResponse (res){
    let temp = {}
    for(let element of res) {
        let asin = element.ASIN

        if(!temp[asin]) temp[asin] = []
        delete element.ASIN

        temp[asin] = [...temp[asin], element]
        // temp[element['ASIN']] = {...temp[element.ASIN], get()}
    }
    return temp
}


async function handleRequest (req) {

    if(tempStorage instanceof Promise) await tempStorage

    switch (req.action._) {
        case 'GET':    return tempStorage[req.action.ASIN]
        case 'UPDATE': return tempStorage[req.action.ASIN] = req.action.value
        case 'DELETE': return delete tempStorage[req.action.ASIN]
    }
}

let actions = { // FOR TESTING
    GET: {
        action: {
            _: 'GET',
            ASIN: 'B01L1Y0TCC'
        }
    },
    UPDATE: {
        action: {
            _: 'UPDATE',
            ASIN: 'B01L1Y0TCC',
            value: {selerName: 'Name', url: 'http://'}
        }
    },
    DELETE: {
        action: {_: 'DELETE', ASIN: 'B01L1Y0TCC'}
    }
}

handleRequest(actions.GET).then(result => { // <<<<< FOR TESTING WITHOUT BROWSER
    console.log('result ', result);
})
// handleRequest(actions.UPDATE).then(result => {
// handleRequest(actions.DELETE).then(result => {



const express = require('express')
const app = express()
app.listen(3001)

app.use(express.json());

// http://localhost:3001/?req={"action": {"_": "GET","ASIN": "BEBONCOOL"}}
// ^^^ IN BROWSER URL 
app.get('/', async (req, res) => {
    let request = JSON.parse(req.query.req)
    console.log('req :>> ', JSON.parse(req.query.req));

    handleRequest(request).then(result => {
        console.log('result from URL ', result);
        res.status(200).send(JSON.stringify(result))
    })
  })
