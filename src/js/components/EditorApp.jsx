var React = require('react');
var Toolbar = require('./Toolbar.jsx');
var Editor = require('./Editor.jsx');
var OutputView = require('./OutputView.jsx');

var EditorApp = React.createClass({
  getInitialState: function() {
    // TODO: get state from store, listen to store.
    return {
      code: "/*global fe logger viewer*/",
      visibility: {
        toolbar: false,
        editor: false,
        outputView: true
      }
    };
  },

  render: function() {
    var toolbar, editor, outputView;
    var code = this.state.code;

    if (this.state.visibility.toolbar) {
      toolbar = <Toolbar />;
    }

    if (this.state.visibility.editor) {
      editor = <Editor text={code} />;
    }

    if (this.state.visibility.outputView) {
      outputView = <OutputView />;
    }

    return (
      <div>
        {toolbar}
        {editor}
        {outputView}
      </div>
    );
  }
});

module.exports = exports = EditorApp;
