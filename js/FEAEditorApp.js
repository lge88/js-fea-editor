(function() {
  var fe = window.fe;
  // from utils.js
  var getUrl = window.getUrl,
      hasClass = window.hasClass,
      addClass = window.addClass,
      removeClass = window.removeClass;

  function FEAEditorLogger(el, containerEl) {

    function log(msg) {
      el.textContent += msg + '\n';
      el.scrollTop = el.scrollHeight;
    };

    function clear() {
      el.textContent = '';
    };

    this.log = log;
    this.clear = clear;

    return this;
  }

  function FEAEditorApp() {
    this.editor = this.initEditor();
    this.examples = [
      'examples/ex1.js',
      'examples/ex2.js'
    ];

    this.loggerEl = document.getElementById('logger');
    this.loggerContainerEl = document.getElementById('logger-container');
    this.logger = FEAEditorLogger(this.loggerEl, this.loggerContainerEl);

    this.logger.clear();
  }
  window.FEAEditorApp = FEAEditorApp;

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
    var logger = this.logger;
    code = [
      '(function(fe, logger, viewer){',
      code,
      '})(fe, logger);'
    ].join('');

    eval(code);
  };

  FEAEditorApp.prototype.clearLog = function() {
    this.logger.clear();
  };

  FEAEditorApp.prototype.updateTabUI = function(ev) {
    var el = ev.target;
    var tabLabels = el.parentNode.children;
    var idx = Array.prototype.indexOf.call(tabLabels, el);
    var containerId = el.parentNode.getAttribute('data-container-id');
    var container = document.getElementById(containerId);
    var tabBodies = container.children;

    var i, len = tabBodies.length, bodyNode, labelNode;
    for (i = 0; i < len; ++i) {
      bodyNode = tabBodies[i];
      labelNode = tabLabels[i];
      removeClass(labelNode, 'selected');
      removeClass(labelNode, 'unselected');
      removeClass(bodyNode, 'selected');
      removeClass(bodyNode, 'unselected');
      if (i === idx) {
        addClass(labelNode, 'selected');
        addClass(bodyNode, 'selected');
      } else {
        addClass(labelNode, 'unselected');
        addClass(bodyNode, 'unselected');
      }
    }
  };

})();
