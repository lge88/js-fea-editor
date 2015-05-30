var React = require('react');
var EditorActions = require('../actions/EditorActions');

var ToolbarButton = React.createClass({
  render: function() {
    return (
      <button className="btn"
              onClick={this.props.onClick}>{this.props.text}</button>
    );
  }
});

var Toolbar = React.createClass({
  render: function() {
    return (
      <div id={this.props.id} className="toolbar">
        <ToolbarButton text="Run"
                       onClick={this._runScript} />
        <ToolbarButton text="Save"
                       onClick={this._saveScript} />
        <ToolbarButton text="Open"
                       onClick={this._openScript} />
      </div>
    );
  },
  _runScript: function() {
    alert('Run');
  },
  _saveScript: function() {
    alert('save');
  },
  _openScript: function() {
    EditorActions.updateUIVisibilities({ fileManager: true });
  }
});

module.exports = exports = Toolbar;
