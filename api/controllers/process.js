const wfcModel = require('../../wfc/simple-tiled');
const mongo = require('../../database/mongo');


module.exports = () => {
    // const processDB = require('../data/castle.json');
    const controller = {};
    
    controller.index = async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        const processes = await mongo.find('processes');
        res.status(200).json(processes);
    };
    controller.store = async (req, res) => {
        const process = req.body;
        // await mongo.insertOne('processes', process);
        // mongo.disconnect();
        // processDB.push(process);
        wfcModel.run(process);
        res.status(201).json(process);
    };
  
    return controller;
  }