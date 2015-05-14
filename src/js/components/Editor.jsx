var React = require('react');
var AceEditor = require('react-ace');
var brace = require('brace');

require('brace/mode/javascript');
require('brace/theme/katzenmilch');
require('brace/ext/language_tools');

var Editor = React.createClass({
  render: function() {
    return (
      <AceEditor name="editor"
                 mode="javascript"
                 theme="katzenmilch"
                 value={this.props.text}
                 onChange={this._onChange} />
    );
  },
  _onChange: function() {}
});

module.exports = exports = Editor;
