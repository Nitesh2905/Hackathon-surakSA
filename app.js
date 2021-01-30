const express = require('express')
const path = require('path');
const bodyparser = require('body-parser')
const morgan = require('morgan')

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))
app.use('/js',express.static(__dirname + 'public/js'))
app.use('/img',express.static(__dirname + 'public/img'))

app.set('view engine', 'ejs')
//set the views directory
app.set('views','./views');

app.get('', (req, res) => {
    const params = { };

    res.render('login', params)
})
app.get('/index', (req, res) => {
    const params = { };

    res.render('index', params)
})


app.listen(port, () => {
    console.log(`Running successfully on ${port}`);
})