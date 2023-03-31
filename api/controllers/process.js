module.exports = () => {
    const processDB = require('../data/castle.json');
    const controller = {};
  
    controller.listProcess = (req, res) => res.status(200).json(processDB);
  
    return controller;
  }