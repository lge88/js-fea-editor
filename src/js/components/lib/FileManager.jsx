var React = require('react');

var FileListView = React.createClass({
  render: function() {
    var onSelect = this.props.onSelect;
    var onClose = this.props.onClose;
    var styles = {
      cursor: 'pointer'
    }
    var items = this.props.items.map(function(item, i) {
      return (
        <li style={styles}
            key={i}
            onClick={onSelect.bind(null, item.id, item.url)}>
          {item.name}
        </li>
      );
    });

    return (
      <div id={this.props.id} className="fileManager">
        <h3>File Manager</h3>
        <button onClick={onClose}>Close</button>
        <ul>
          {items}
        </ul>
      </div>
    );
  }
});

module.exports = exports = FileListView;
