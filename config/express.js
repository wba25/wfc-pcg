const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
var cors = require('cors');

module.exports = () => {
    const app = express();

    // SETANDO VARIÁVEIS DA APLICAÇÃO
    app.set('port', process.env.PORT || config.get('server.port'));

    // MIDDLEWARES
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(cors());
    app.use("/data", express.static('data'));
    app.use("/output", express.static('output'));

    // ROTAS
    require('../api/routes/process')(app);

    return app;
};