const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
var cors = require('cors');

module.exports = () => {
    const app = express();

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

    // MIDDLEWARES
    app.use(bodyParser.json());
    app.use("/data", express.static('data'));
    app.use(cors());

    // ROTAS
    require('../api/routes/process')(app);

    return app;
};