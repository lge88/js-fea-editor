var Emitter = require('../utils/Emitter');
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EditorConstants = require('../constants/EditorConstants');

var ActionTypes = EditorConstants.ActionTypes;
var _scripts = {};

function create(name, content) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  _scripts[id] = {
    name: name,
    content: content
  };
}

function update(id, updates) {
  _scripts[id] = assign({}, _scripts[id], updates);
}

function destroy(id) {
  delete _scripts[id];
}

var EditorStore = assign({}, Emitter, {
  get: function(id) {
    return _scripts[id];
  }
});

EditorStore.dispatchToken = AppDispatcher.register(function(action) {

  switch (action.type) {
  case ActionTypes.CREATE_SCRIPT:
    create(action.name, action.content);
    break;
  default:

  }

});
