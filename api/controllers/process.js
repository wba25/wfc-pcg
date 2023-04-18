const wfcModel = require('../../wfc/simple-tiled');
const mongo = require('../../database/mongo');


module.exports = () => {
    const controller = {};
    
    controller.index = async (req, res) => {
        const processes = await mongo.find('processes');
        mongo.disconnect();
        res.status(200).json(processes);
    };

    controller.store = async (req, res) => {
        const process = req.body;        
        await mongo.updateOrCreate('processes', { 'path': process['path'] }, process);
        mongo.disconnect();
        res.status(201).json(process);
    };

    controller.generate = async (req, res) => {
        const processName = `data/${req.params.name}/`;
        const process = await mongo.findOne('processes', { path: processName.toLowerCase() });
        mongo.disconnect();
        if (!process) {
            res.status(404).json({ message: 'Process not found' });
            return;
        }
        const [result, error] = await wfcModel.generate(process);
        console.log("got", result, error);
        if (error) {
            res.status(500).json({ message: error });
            return;
        }
        res.status(200).json(result);
    };
  
    return controller;
  }