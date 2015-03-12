(function() {
  var THREE = window.THREE;
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

  function FEAEditorViewer(el) {
    var w = el.parentNode.offsetWidth;
    var h = el.parentNode.offsetHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 1, 1000);
    camera.position.set(0, 0, 500);

    var scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    var renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);

    var controller = new THREE.EditorControls(camera, renderer.domElement);

    this.el = el;
    this.renderer = renderer;
    this.controller = controller;
    this.scene = scene;
    this.camera = camera;
  }

  FEAEditorViewer.prototype._animate = function() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  };

  FEAEditorViewer.prototype.animate = function() {};

  FEAEditorViewer.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
  };

  FEAEditorViewer.prototype.start = function() {
    this.animate = this._animate;
    this.controller.enabled = true;
    this.animate();
  };

  FEAEditorViewer.prototype.stop = function() {
    this.controller.enabled = false;
    this.animate = function() {};
  };

  FEAEditorViewer.prototype.drawCube = function(a, b, c, x, y, z) {
    var geo = new THREE.BoxGeometry(a, b, c);
    var mat = new THREE.MeshPhongMaterial({
      color: 0xdddddd
      , specular: 0x009900
      , emissive: 0xff0000
      , ambient: 0x030303
      , shininess: 30
      , shading: THREE.SmoothShading
      , opacity: 0.9
      , transparent: true
      , wireframe: false
    });

    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);

    this.scene.add(mesh);

    return mesh;
  };

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

    // TODO: should use setState();
    // this.viewer();
    if (hasClass(this.viewerEl, 'selected')) {
      this.viewer().start();
    } else {
      this.viewer().stop();
    }
  };

})();
