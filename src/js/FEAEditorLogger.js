(function() {
  function FEAEditorLogger(el) {
    this.el = el;
    this.log = this.log.bind(this);
    this.clear = this.clear.bind(this);
  }

  FEAEditorLogger.prototype.log = function(msg) {
    var el = this.el;
    el.textContent += msg + '\n';
    el.scrollTop = el.scrollHeight;
  };

  FEAEditorLogger.prototype.clear = function(msg) {
    this.el.textContent = '';
  };

  window.FEAEditorLogger = FEAEditorLogger;
})();
