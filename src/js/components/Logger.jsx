var React = require('react/addons');
var cn = require('classnames');

var Logger = React.createClass({
  render: function() {
    var classes = cn({
      'tabview-panel': true,
      'logger': true
    });
    return (
      <pre id="logger"
           className={classes}>
        Logger!
      </pre>
    );
  }
});

module.exports = exports = Logger;
