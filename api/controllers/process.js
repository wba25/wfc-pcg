const wfcModel = require('../../wfc/simple-tiled');
const mongo = require('../../database/mongo');
const storage = require('../../database/storage');

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
        await storage.syncFolder(process['path'], process['tiles']);
        res.status(201).json();
    };

    controller.generate = async (req, res) => {
        const processName = `data/${req.params.name}/`;
        const process = await mongo.findOne('processes', { path: processName.toLowerCase() });
        mongo.disconnect();
        if (!process) {
            res.status(404).json({ message: 'Process not found' });
            return;
        }
        const [path, error] = await wfcModel.generate(process);
        if (error) {
            res.status(500).json({ message: error.message });
            return;
        }
        res.status(200).json(path);
    };
  
    return controller;
  }