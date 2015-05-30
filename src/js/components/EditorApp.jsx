var React = require('react');
var Modal = require('react-modal');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var Toolbar = require('./Toolbar.jsx');
var Editor = require('./Editor.jsx');
var OutputView = require('./OutputView.jsx');
var FileManager = require('./lib/FileManager.jsx');
var EditorStore = require('../stores/EditorStore');
var EditorActions = require('../actions/EditorActions');

Modal.setAppElement(document.body);
Modal.injectCSS();

function getStateFromStores() {
  var state = EditorStore.getState();
  return state;
}

var EditorApp = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return { data: getStateFromStores() };
  },

  componentDidMount: function() {
    EditorStore.addChangeListener(this._onChange);
    EditorActions.fetchExampleList();
  },

  componentWillUnmount: function() {
    EditorStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({ data: getStateFromStores() });
  },

  _getCode: function(state) {
    var id = state.get('selectedScriptId');
    console.log("id = ", id);
    if (id === null) {
      return '';
    } else {
      return state.getIn(['scripts', id, 'content'], '');
    }
  },

  _getScripts: function(state) {
    var scripts = state.get('scripts').toArray().map(function(val) {
      return val.toJSON();
    });
    return scripts;
  },

  render: function() {
    var toolbar, editor, outputView, fileManager;

    var state = this.state.data;
    var code = this._getCode(state);
    var scripts = this._getScripts(state);

    if (state.getIn(['uiVisibilities', 'toolbar'])) {
      toolbar = <Toolbar id="toolbar" />;
    }

    if (state.getIn(['uiVisibilities', 'editor'])) {
      editor = <Editor id="editor" text={code} />;
    }

    if (state.getIn(['uiVisibilities', 'outputView'])) {
      outputView = <OutputView id="outputView" />;
    }

    if (state.getIn(['uiVisibilities', 'fileManager'])) {
      fileManager = <FileManager id="fileManager"
                                 items={scripts}
                                 onClose={this._closeFileManager}
                                 onAdd={this._addScript}
                                 onDelete={this._deleteScript}
                                 onSelect={this._selectScript} />;
    }

    return (
      <div id="appBody">
        <div id="main">
          {toolbar}
          <div id="mainContent">
            {editor}
            {outputView}
          </div>
        </div>

        <Modal isOpen={state.getIn(['uiVisibilities', 'fileManager'])}
               onRequestClose={this._closeFileManager}>
          {fileManager}
        </Modal>
      </div>
    );
  },

  _closeFileManager: function() {
    EditorActions.updateUIVisibilities({ fileManager: false });
  },

  _selectScript: function(id, url) {
    console.log('id: ', id, 'url: ', url);
    // TODO: if the script content is null:
    EditorActions.fetchExample(id, url);
    EditorActions.selectScript(id);
    EditorActions.updateUIVisibilities({ fileManager: false });
  },

  _addScript: function(id, name) {

  },

  _deleteScript: function(id, name) {

  },
});

module.exports = exports = EditorApp;
