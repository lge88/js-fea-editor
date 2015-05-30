var Emitter = require('../utils/Emitter');
var assign = require('object-assign');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EditorConstants = require('../constants/EditorConstants');
var Immutable = require('immutable');

var ActionTypes = EditorConstants.ActionTypes;

// states:
var _state = Immutable.Map({
  fetching: true,
  selectedScriptId: null,
  scripts: Immutable.Map(),
  uiVisibilities: Immutable.Map({
    toolbar: true,
    editor: true,
    outputView: true,
    fileManager: false
  })
});

function create(name, content) {
  var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);

  _state = _state.setIn(['scripts', id], Immutable.Map({
    id: id,
    name: name,
    content: content
  }));

  return _state.getIn(['scripts' , id]);
}

function update(id, updates) {
  _state = _state.mergeIn(['scripts', id], updates);
}

function destroy(id) {
  _state = _state.deleteIn(['scripts', id]);
}

function addScriptsListToCache(scripts) {
  if (Array.isArray(scripts)) {
    scripts.forEach(function(script) {
      var name = script && script.name;
      var item, id;
      if (name) {
        item = create(name, null);
        id = item.get('id');
        update(id, script);
      }
    });
  }
}

var EditorStore = assign({}, Emitter, {
  getState: function() {
    return _state;
  }
});

EditorStore.dispatchToken = AppDispatcher.register(function(action) {
  console.log("action = ", action);

  switch (action.actionType) {
  case ActionTypes.CREATE_SCRIPT:
    create(action.name, action.content);
    EditorStore.emitChange();
    break;

  case ActionTypes.FETCH_EXAMPLELIST_ATTEMPT:
  case ActionTypes.FETCH_EXAMPLE_ATTEMPT:
    _state = _state.set('fetching', true);
    EditorStore.emitChange();
    break;

  case ActionTypes.FETCH_EXAMPLELIST_SUCCESS:
    addScriptsListToCache(action.scripts);
    _state = _state.set('fetching', false);
    EditorStore.emitChange();
    break;

  case ActionTypes.FETCH_EXAMPLE_SUCCESS:
    _state = _state.setIn(['scripts', action.id, 'content'], action.content);
    _state = _state.set('fetching', false);
    EditorStore.emitChange();
    break;

  case ActionTypes.SELECT_SCRIPT:
    _state = _state.set('selectedScriptId', action.id);
    EditorStore.emitChange();
    break;

  case ActionTypes.UPDATE_UI_VISIBILITIES:
    _state = _state.mergeIn(['uiVisibilities'], action.visibilities);
    EditorStore.emitChange();
    break;

  default:

  }


});

module.exports = exports = EditorStore;
