const credentials = (req, res, next) => {
    if (req.headers.origin === process.env.CLIENT_URL) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

export default credentials