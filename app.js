require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const productsRouter = require('./routes/products.routes');
const usersRouter = require('./routes/users.routes');
const addressesRouter = require('./routes/addresses.routes');
const commentsRouter = require('./routes/comments.routes');
const tagAndCategoriesRouter = require('./routes/tags_categories.routes');
const pagesRouter = require('./routes/pages.routes');

const ordersRouter = require('./routes/orders.routes');

const AuthMiddleware = require('./middlewares/auth.middleware');
const AppResponseDto = require('./dtos/responses/app_response.dto');
const BenchmarkMiddleware = require('./middlewares/benchmark.middleware');

const app = express();

app.use(BenchmarkMiddleware.benchmark);
app.use(AuthMiddleware.loadUser);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api', commentsRouter);
app.use('/api', addressesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api', tagAndCategoriesRouter);
app.use('/api', pagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.json(AppResponseDto.buildWithErrorMessages(err));
});

module.exports = app;
