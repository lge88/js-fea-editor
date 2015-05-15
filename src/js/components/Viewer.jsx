var React = require('react');

var Viewer = React.createClass({
  // TODO: figure out width and height dynamicly
  render: function() {
    var styles = {
      // background: 'red'
    };
    return (
      <canvas id="viewer"
              width="500"
              height="500"
              style={styles}
              className="tabview-panel viewer" />
    );
  }
});

module.exports = exports = Viewer;
