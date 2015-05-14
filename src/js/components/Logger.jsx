var React = require('react');

var Logger = React.createClass({
  render: function() {
    return (
      <pre id="logger" className="tabview-panel logger selected"></pre>
    );
  }
});

module.exports = exports = Logger;
