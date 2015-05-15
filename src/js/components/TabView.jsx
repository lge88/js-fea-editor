var React = require('react');
var classNames = require('classnames');

var TabLabelBar = React.createClass({
  render: function() {
    var onClick = this.props.onClick;
    var selected = this.props.selectedIndex;
    var labels = this.props.labels.map(function(label, i) {
      var classes = classNames({
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
      <div id="tabview-bar" className="tabview-bar">
        {labels}
      </div>
    );
  }
});

var TabBody = React.createClass({
  render: function() {
    return (
      <div id="tabview-body" className="tabview-body">
        {this.props.children}
      </div>
    );
  }
});

var TabView = React.createClass({
  getInitialState: function() {
    return {
      selectedIndex: 1
    };
  },
  render: function() {
    var i = this.state.selectedIndex;
    var content = this.props.children[i];
    var labels = this.props.children.map(function(c) {
      return c.props.label;
    });

    return (
      <div className="output-container tabview">
        <TabLabelBar onClick={this._handleTabClicked}
                     selectedIndex={i}
                     labels={labels}/>
        <TabBody>{content}</TabBody>
      </div>
    );
  },
  _handleTabClicked: function(i) {
    this.setState({
      selectedIndex: i
    });
  }
});

module.exports = exports = TabView;
