var AppDispatcher = require('../dispatcher/AppDispatcher');
var EditorConstants = require('../constants/EditorConstants');

var EditorActions = {
  runScript: function() {
    AppDispatcher.dispatch({
      actionType: EditorConstants.RUN_SCRIPT
    });
  }

};

module.exports = exports = EditorActions;
