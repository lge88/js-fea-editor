var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

var TabLabelBar = React.createClass({
  render: function() {
    var onClick = this.props.onClick;
    var selected = this.props.selectedIndex;
    var labels = this.props.labels.map(function(label, i) {
      var classes = cn({
        'tabview-label': true,
        'selected': (i === selected),
        'unselected': !(i === selected)
      });

      return (
        <button key={i}
                className={classes}
                onClick={onClick.bind(null, i)}>
          {label}
        </button>
      );
    });

    return (
      <div className="tabview-bar">
        {labels}
      </div>
    );
  }
});

var TabBody = React.createClass({
  render: function() {
    return (
      <div className="tabview-body">
        {this.props.children}
      </div>
    );
  }
});

/**
 * TabView component
 * <TabView selectedIndex={1}>
 *   <Logger label="Logger" />
 *   <Viewer label="Viewer" />
 *   <Plotter label="Plotter" />
 * </TabView>
 */
var TabView = React.createClass({
  getInitialState: function() {
    var selectedIndex = 0;
    if (typeof this.props.selectedIndex !== 'undefined')
      selectedIndex = this.props.selectedIndex;
    return { selectedIndex: selectedIndex };
  },
  render: function() {
    var i = this.state.selectedIndex;
    var content = this.props.children[i];
    var labels = this.props.children.map(function(c) {
      return c.props.label;
    });

    return (
      <div id={this.props.id} className="tabview">
        <TabLabelBar onClick={this._handleTabClicked}
                     selectedIndex={i}
                     labels={labels}/>
        <TabBody>{content}</TabBody>
      </div>
    );
  },
  _handleTabClicked: function(i) {
    this.setState({ selectedIndex: i });
  }
});

module.exports = exports = TabView;
