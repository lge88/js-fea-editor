var Emitter = require('../utils/Emitter');
var assign = require('object-assign');
var AppDispather = require('../dispatcher/AppDispatcher');
var EditorConstants = require('../constants/EditorConstants');

var _scripts = {};
var _currentScriptId;

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
  getCurrentScriptContent: function() {
    var script = _scripts[_currentScriptId];
    return script.content;
  },
  getCurrentScriptName: function() {
    var script = _scripts[_currentScriptId];
    return script.name;
  }
});
