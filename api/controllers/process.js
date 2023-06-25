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
        try {
            const process = req.body;
            process["tiles"] = await storage.syncFiles(process['path'], process['tiles']);
            await mongo.updateOrCreate('processes', { 'path': process['path'] }, process);
            mongo.disconnect();
            res.status(201).json();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    controller.generate = async (req, res) => {
        const processName = `data/${req.params.name}/`;
        const tilemap_process = await mongo.findOne('processes', { path: processName.toLowerCase() });
        mongo.disconnect();
        if (!tilemap_process) {
            res.status(404).json({ message: 'Process not found' });
            return;
        }
        tilemap_process['path'] = process.env.BASE_FILE_URL + tilemap_process['path'];
        const [path, error] = await wfcModel.generate(tilemap_process, destWidth, destHeight);
        if (error) {
            res.status(500).json({ message: error.message });
            return;
        }
        res.status(200).json(path);
    };
  
    return controller;
  }