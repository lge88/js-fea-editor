var React = require('react/addons');

var Logger = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
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
