module.exports = app => {
    const controller = require('../controllers/process')();
  
    app.route('/api/processes')
      .get(controller.listProcess);
  }