const allowedCors = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://blazhev.mesto.nomoredomains.monster',
  'https://blazhev.mesto.nomoredomains.monster',
  'https://movie-explorer-front-api.netlify.app',
  'http://movie-explorer-front-api.netlify.app/',
  'https://level-3--movie-explorer-front-api.netlify.app/',
  'http://blazhev.mov-exp-front.nomoreparties.sbs',
  'https://blazhev.mov-exp-front.nomoreparties.sbs',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
