const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const productRoutes = require("./api/routes/products");
const orderRoutes = require('./api/routes/orders');

mongoose.connect("mongodb+srv://douniabakhkhouch2000:" 
    + process.env.MONGO_ATLAS_PW +
    "@node-rest-shop.4uai9.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop"
).then(() => {
    console.log('connected to mongodb')
}).catch((err) => {
    console.log('error cnnecting to mongodb', err)
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE');
        return res.status(200);
    }
    next();
})

//routes which should handle the requests
app.use('/products', productRoutes)
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 400;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    })
})

module.exports = app;