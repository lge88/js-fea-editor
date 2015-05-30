var React = require('react');
var AceEditor = require('react-ace');
var brace = require('brace');

require('brace/mode/javascript');
require('brace/theme/katzenmilch');
require('brace/ext/language_tools');

var Editor = React.createClass({
  render: function() {
    return (
      <div id="editor">
        <AceEditor name="ace-editor"
                   mode="javascript"
                   theme="katzenmilch"
                   value={this.props.text}
                   width="100%"
                   height="100%"
                   onChange={this._onChange} />
      </div>
    );
  },
  _onChange: function() {}
});

module.exports = exports = Editor;
