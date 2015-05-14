var React = require('react');
var Toolbar = require('./Toolbar.jsx');
var Editor = require('./Editor.jsx');

var EditorApp = React.createClass({
  getInitialState: function() {
    // TODO: get state from store, listen to store.
    return {
      code: "/*global fe logger viewer*/",
      visibility: {
        toolbar: true,
        editor: true
      }
    };
  },

  render: function() {
    var toolbar, editor;
    var code = this.state.code;

    if (this.state.visibility.toolbar) {
      toolbar = <Toolbar />;
    }

    if (this.state.visibility.editor) {
      editor = <Editor text={code} />;
    }

    return (
      <div>
        {toolbar}
        {editor}
      </div>
    );
  },
  onChange: function() {

  }
});

module.exports = exports = EditorApp;
