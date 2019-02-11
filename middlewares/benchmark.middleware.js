exports.benchmark = (req, res, next) => {
    const startTime = new Date().getTime();
    res.on('finish', function (event) {
        // TODO: finish event is too late to set a header because it is already sent, any suggestions?
        const elapsed = (new Date().getTime() - startTime) / 1000;
        console.log('It took ' + elapsed + ' seconds');
    });
    next();
    const elapsed = (new Date().getTime() - startTime) / 1000;
    res.set('X-Perf-Time', elapsed);
};