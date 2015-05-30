var React = require('react');
var TabView = require('./lib/TabView.jsx');
var Logger = require('./Logger.jsx');
var Viewer = require('./Viewer.jsx');
var Plotter = require('./Plotter.jsx');

var OutputView = React.createClass({
  render: function() {
    return (
      <TabView id={this.props.id} selectedIndex={1}>
        <Logger label="Logger" />
        <Viewer label="Viewer" />
        <Plotter label="Plotter" />
      </TabView>
    );
  }
});

module.exports = exports = OutputView;
