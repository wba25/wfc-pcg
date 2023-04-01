const wfcModel = require('../../wfc/simple-tiled');

module.exports = () => {
    const processDB = require('../data/castle.json');
    const controller = {};
  
    controller.index = (req, res) => res.status(200).json(processDB);
    controller.store = (req, res) => {
        const process = req.body;
        // processDB.push(process);
        wfcModel.run(process);
        res.status(201).json(process);
    };
  
    return controller;
  }