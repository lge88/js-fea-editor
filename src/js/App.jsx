var React = require('react');
var EditorApp = require('./components/EditorApp.jsx');

window.fe = require('js-fea');

React.render(<EditorApp />, document.getElementById('app'));
