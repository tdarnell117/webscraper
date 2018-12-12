const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const bodyparser = require('body-parser');
//const logger = require('morgan');
//const mongo = require('mongojs');

// const db = mongo('fruitsdb');

// db.citrus.find((e, r) => {
//     if(e) { console.log(e)} else { console.log(r)}})


mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true});

    
const db = require('./models');
require('./routes')(app)
//app.use(logger("dev"));
app.get('/models', (req, res) => res.render('app'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

const Schema = mongoose.Schema

const stackSchema = new Schema({
    question: String
})

const Stack = mongoose.model('Stack', stackSchema)


app.get('/stacks', (req, res) => 
    axios.get(`https://www.nytimes.com/`)
        .then(r => {
            const $ = cheerio.load(r.data)
            const stackArr = []
            $('div.css-6p6lnl').each((i, elem) => {
                stackArr.push({
                    question: $(elem).text()
                        
                    })
        })
        Stack.create(stackArr)
        res.json(stackArr)
    })
    .catch(e => console.log(e))  
)

app.listen(3000, _ => console.log('https://localhost:3000'))

