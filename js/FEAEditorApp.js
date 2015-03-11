function FEAEditorApp() {
  this.editor = this.initEditor();
  this.examples = [
    'examples/ex1.js',
    'examples/ex2.js'
  ];

  this.loggerEl = document.getElementById('logger');
  this.loggerContainerEl = document.getElementById('logger-container');

  this.clearLog();
  this.augmentFeContext(window.fe);

}

FEAEditorApp.prototype.initEditor = function() {
  var editor;
  var ace = window.ace;
  ace.require('ace/ext/language_tools');

  editor = ace.edit("js-fea-editor");

  editor.setOptions({
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true
  });

  editor.setTheme('ace/theme/katzenmilch');

  var session = editor.getSession();
  session.setMode('ace/mode/javascript');
  editor.$blockScrolling = Infinity;
  return editor;
};

FEAEditorApp.prototype.loadExample = function(idx) {
  var examples = this.examples, editor = this.editor;
  var url = examples[idx];
  getUrl(url, function(req) {
    var code = req.response;
    editor.setValue(code);
  });
};

FEAEditorApp.prototype.runScript = function() {
  var code = this.editor.getValue();
  code = '(function(fe){' + code + '})(window.fe);';
  eval(code);
};

FEAEditorApp.prototype.clearLog = function() {
  this.loggerEl.textContent = '';
};

FEAEditorApp.prototype.augmentFeContext = function(fe) {
  var logger = this.loggerEl;
  var loggerContainer = this.loggerContainerEl;

  function log(msg) {
    logger.textContent += msg + '\n';
    loggerContainer.scrollTop = loggerContainer.scrollHeight;
  }

  function clear() {
    logger.textContent = '';
  }

  fe.io = fe.io || {};
  fe.io.log = log;
  fe.io.clear = clear;
};
