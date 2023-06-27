module.exports = app => {
    const controller = require('../controllers/process')();
  
    app.route('/api/processes').get(controller.index);
    app.route('/api/processes/:name/generate').get(controller.generate);
    app.route('/api/processes/:name/neighbors').get(controller.generateNeighbors);
    app.route('/api/processes').post(controller.store);
  }