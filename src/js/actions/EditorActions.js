var AppDispatcher = require('../dispatcher/AppDispatcher');
var EditorConstants = require('../constants/EditorConstants');
var EditorStore = require('../stores/EditorStore');
var EditorStoreUtils = require('../utils/EditorStoreUtils');

var EditorActions = {
  fetchExampleList: function() {
    AppDispatcher.dispatch({
      actionType: EditorConstants.ActionTypes.FETCH_EXAMPLELIST_ATTEMPT
    });

    EditorStoreUtils.fetchExampleList(function(err, data) {
      if (err) {
        console.log("fetch list err = ", err);
        AppDispatcher.dispatch({
          actionType: EditorConstants.ActionTypes.FETCH_EXAMPLELIST_FAIL
        });
      } else {
        AppDispatcher.dispatch({
          actionType: EditorConstants.ActionTypes.FETCH_EXAMPLELIST_SUCCESS,
          scripts: data.examples
        });
      }
    });
  },

  fetchExample: function(id, url) {
    AppDispatcher.dispatch({
      actionType: EditorConstants.ActionTypes.FETCH_EXAMPLE_ATTEMPT
    });

    EditorStoreUtils.fetchExample(url, function(err, content) {
      if (err) {
        AppDispatcher.dispatch({
          actionType: EditorConstants.ActionTypes.FETCH_EXAMPLE_FAIL
        });
      } else {
        AppDispatcher.dispatch({
          actionType: EditorConstants.ActionTypes.FETCH_EXAMPLE_SUCCESS,
          id: id,
          content: content
        });
      }
    });
  },

  selectScript: function(id) {
    AppDispatcher.dispatch({
      actionType: EditorConstants.ActionTypes.SELECT_SCRIPT,
      id: id
    });
  },

  updateUIVisibilities: function(states) {
    AppDispatcher.dispatch({
      actionType: EditorConstants.ActionTypes.UPDATE_UI_VISIBILITIES,
      visibilities: states
    });
  },

  runScript: function() {
    // in editor store initialize a vm
    AppDispatcher.dispatch({
      actionType: EditorConstants.ActionTypes.RUN_SCRIPT
    });
  }

};

module.exports = exports = EditorActions;
