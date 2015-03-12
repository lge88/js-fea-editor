(function() {
  var fe = window.fe;

  // from utils.js
  var getUrl = window.getUrl,
      hasClass = window.hasClass,
      addClass = window.addClass,
      removeClass = window.removeClass;

  var FEAEditorViewer = window.FEAEditorViewer;
  var FEAEditorLogger = window.FEAEditorLogger;

  function FEAEditorApp() {
    this.examples = [
      'examples/ex1.js',
      'examples/ex2.js'
    ];

    this.editorEl = document.getElementById('editor');
    this.loggerEl = document.getElementById('logger');
    this.viewerEl = document.getElementById('viewer');

    this.clearLog();
    this.loadExample(0);
  }
  window.FEAEditorApp = FEAEditorApp;

  FEAEditorApp.prototype.logger = function() {
    if (!this._logger) {
      this._logger = new FEAEditorLogger(this.loggerEl);
    }
    return this._logger;
  };

  FEAEditorApp.prototype.viewer = function() {
    if (!this._viewer) {
      this._viewer = new FEAEditorViewer(this.viewerEl);
    }
    return this._viewer;
  };

  FEAEditorApp.prototype.editor = function() {
    if (!this._editor) {
      var editor;
      var ace = window.ace;
      ace.require('ace/ext/language_tools');

      var el = this.editorEl;
      editor = ace.edit(el);

      editor.setOptions({
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
      });

      editor.setTheme('ace/theme/katzenmilch');

      var session = editor.getSession();
      session.setMode('ace/mode/javascript');
      editor.$blockScrolling = Infinity;
      this._editor = editor;
    }

    return this._editor;
  };

  FEAEditorApp.prototype.loadExample = function(idx) {
    var examples = this.examples, editor = this.editor();
    var url = examples[idx];
    getUrl(url, function(req) {
      var code = req.response;
      editor.setValue(code);
    });
  };

  FEAEditorApp.prototype.runScript = function() {
    var code = this.editor().getValue();
    var logger = this.logger();
    var viewer = this.viewer();
    code = [
      '(function(fe, logger, viewer){',
      code,
      '})(fe, logger, viewer);'
    ].join('');

    eval(code);
  };

  FEAEditorApp.prototype.clearLog = function() {
    this.logger().clear();
  };

  FEAEditorApp.prototype.clearViewer = function() {
    this.viewer().clear();
  };

  FEAEditorApp.prototype.updateTabUI = function(idx) {
    var tabBar = document.getElementById('tabview-bar');
    var tabBody = document.getElementById('tabview-body');
    var tabLabels = tabBar.querySelectorAll('.tabview-label');
    var tabPanels = tabBody.querySelectorAll('.tabview-panel');

    if (tabLabels[idx] && tabPanels[idx]) {
      [].forEach.call(tabLabels, function(node) {
        removeClass(node, 'selected');
        addClass(node, 'unselected');
      });

      [].forEach.call(tabPanels, function(node) {
        removeClass(node, 'selected');
        addClass(node, 'unselected');
      });

      removeClass(tabLabels[idx], 'unselected');
      removeClass(tabPanels[idx], 'unselected');
      addClass(tabLabels[idx], 'selected');
      addClass(tabPanels[idx], 'selected');
    }

    // TODO: should use setState();
    // this.viewer();
    if (hasClass(this.viewerEl, 'selected')) {
      this.viewer().start();
    } else {
      this.viewer().stop();
    }
  };

})();
