(function() {
  var THREE = window.THREE;

  function FEAEditorViewer(el) {
    var w = el.parentNode.offsetWidth;
    var h = el.parentNode.offsetHeight;

    var camera = new THREE.PerspectiveCamera(50, w / h, 1, 1000);
    camera.position.set(0, 0, 500);

    var scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    var world = new THREE.Object3D();
    scene.add(world);

    var renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0xf3f2f3, 1);

    var controller = new THREE.EditorControls(camera, renderer.domElement);

    this.el = el;
    this.renderer = renderer;
    this.controller = controller;
    this.scene = scene;
    this.world = world;
    this.camera = camera;

    window.addEventListener('resize', function() {
      var w = el.parentNode.offsetWidth;
      var h = el.parentNode.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
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

  FEAEditorViewer.prototype.clear = function() {
    var world = this.world;
    while (world.children.length > 0)
      world.remove(world.children[0]);
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

    this.world.add(mesh);

    return mesh;
  };

  function createGeometry0d(gcells, x, colors) {
    var dim = gcells.dim();
    if (dim < 0) return null;

    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices = [];

    geometry.vertices = gcells
      .vertices()
      .map(function(i) {
        var v = x.at(i);
        return new THREE.Vector3(v[0] || 0, v[1] || 0, v[2] || 0);
      });

    if (colors) {
      geometry.colors = colors;
    }

    markGeometryDirty(geometry);
    return geometry;
  };

  function createGeometry1d(gcells, x, colors) {
    var dim = gcells.dim();
    if (dim < 1) return null;

    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices = [];


    var edgeColors = [];
    gcells
      .edges()
      .forEach(function(edge) {
        var i1 = edge[0], i2 = edge[1];
        var v1 = x.at(i1);
        var v2 = x.at(i2);
        vertices.push(
          new THREE.Vector3(v1[0] || 0, v1[1] || 0, v1[2] || 0),
          new THREE.Vector3(v2[0] || 0, v2[1] || 0, v2[2] || 0)
        );
        if (colors) {
          edgeColors.push(colors[i1], colors[i2]);
        }
      });

    if (edgeColors.length) {
      geometry.colors = edgeColors;
    }

    markGeometryDirty(geometry);
    return geometry;
  };

  function createGeometry2d(gcells, x, colors) {
    var dim = gcells.dim();
    if (dim < 2) return null;

    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices = [];

    var faces = geometry.faces = [];
    var faceIndices = gcells.triangles();

    x.values().forEach(function (v) {
      vertices.push(
        new THREE.Vector3(v[0] || 0, v[1] || 0, v[2] || 0)
      );
    });

    faceIndices
      .forEach(function(face) {
        var i1 = face[0], i2 = face[1], i3 = face[2];
        // no duplicate vertex
        if (i1 !== i2 && i2 !==i3 && i3 !== i1) {
          var f = new THREE.Face3(i1, i2, i3);
          if (colors) {
            f.vertexColors[0] = colors[i1];
            f.vertexColors[1] = colors[i2];
            f.vertexColors[2] = colors[i3];
          }
          faces.push(f);
        }
      });

    // geometry.computeCentroids();
    // merge vertices is expensive and buggy
    // geometry.mergeVertices();
    geometry.computeFaceNormals();
    // geometry.computeVertexNormals();
    // geometry.computeTangents();

    if (colors) {
      geometry.colors = colors;
    }

    markGeometryDirty(geometry);
    return geometry;
  };

  function markGeometryDirty(geometry) {
    geometry.dynamic = true;
    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.uvsNeedUpdate = true;
    geometry.normalsNeedUpdate = true;
    geometry.tangentsNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
    geometry.lineDistancesNeedUpdate = true;
    geometry.buffersNeedUpdate = true;
  };

  FEAEditorViewer.DEFAULT_MATERIALS = [
    {
      id: 'particalDefault',
      type: 'PointCloudMaterial',
      color: 'red',
      size: 4,
      sizeAttenuation: false
    },
    {
      id: 'particalVertexColor',
      type: 'PointCloudMaterial',
      size: 4,
      vertexColors: THREE.VertexColors,
      sizeAttenuation: false
    },
    {
      id: 'lineDefault',
      type: 'LineBasicMaterial',
      color: 'blue',
      lineWidth: 1
    },
    {
      id: 'lineVertexColor',
      type: 'LineBasicMaterial',
      vertexColors: THREE.VertexColors,
      lineWidth: 1
    },
    {
      id: 'meshDefault',
      type: 'MeshLambertMaterial',
      color: 0x999999,
      shading: THREE.FlatShading,
      vertexColors: THREE.FaceColors
    },
    {
      id: 'meshVertexColor',
      type: 'MeshBasicMaterial',
      vertexColors: THREE.VertexColors
    }
  ].map(function(m) {
    return [m.id, new THREE[m.type](omit(m, 'id', 'type'))];
  })
    .reduce(function(o, m) {
      o[m[0]] = m[1];
      return o;
    }, {});

  function omit(obj) {
    var argv = Array.prototype.slice.call(arguments), argc = argv.length;
    var keyMask = argv.slice(1).reduce(function(o, k) { o[k] = true; return o;}, {});
    var keysToKeep = Object.keys(obj).filter(function(k) { return !keyMask[k]; });
    return keysToKeep.reduce(function(o, k) {
      o[k] = obj[k];
      return o;
    }, {});
  }

  function getDefaultMaterial(dim, options) {
    if (!options) options = {};
    var hasColors = !!(options.hasColors), material;
    if (dim <= 0) {
      if (hasColors) {
        material = FEAEditorViewer.DEFAULT_MATERIALS.particalVertexColor;
      } else {
        material = FEAEditorViewer.DEFAULT_MATERIALS.particalDefault;
      }
    } else if (dim === 1) {
      if (hasColors) {
        material = FEAEditorViewer.DEFAULT_MATERIALS.lineVertexColor;
      } else {
        material = FEAEditorViewer.DEFAULT_MATERIALS.lineDefault;
      }
    } else {
      if (hasColors) {
        material = FEAEditorViewer.DEFAULT_MATERIALS.meshVertexColor;
      } else {
        material = FEAEditorViewer.DEFAULT_MATERIALS.meshDefault;
      }
    }
    return material;
  };

  function FEViewModel(feb, geom, options) {
    THREE.Object3D.call(this);
    if (!options) options = {};
    this._feb = feb;
    this._geom = geom;
    this._u = options.u || null;

    this._state = {
      showVertices: true,
      showEdges: true,
      showFaces: true,
      showDeformedVertices: true,
      showDeformedEdges: true,
      showDeformedFaces: true
    };
    this.setState(options);
  }
  FEViewModel.prototype = Object.create(THREE.Object3D.prototype);
  FEViewModel.prototype.constructor = FEViewModel;

  function clone(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function assign(a, b) {
    var argv = Array.prototype.slice.call(arguments), argc = argv.length;
    if (argc <= 1) return a;
    if (argc > 2) {
      var dest = assign.apply(null, argv.slice(0, 2));
      return assign.apply(null, [dest].concat(argv.slice(2)));
    }
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }

  FEViewModel.prototype.setState = function(updates) {
    if (typeof updates !== 'object') updates = {};
    var nextState = assign({}, this._state, updates);
    this._update(nextState);
  };

  FEViewModel.prototype._update = function(state) {
    if (state.showVertices === true) this._drawVertices();
    if (state.showEdges === true) this._drawEdges();
    if (state.showFaces === true) this._drawFaces();

    if (state.showDeformedVertices === true) this._drawDeformedVertices();
    if (state.showDeformedEdges === true) this._drawDeformedEdges();
    if (state.showDeformedFaces === true) this._drawDeformedFaces();

    this._state = state;
  };

  FEViewModel.prototype._drawVertices = function() {
    if (this._vertices) this.remove(this._vertices);
    var gcells = this._feb.gcells();
    if (gcells.dim() >= 0) {
      var geom = this._geom;
      var material = getDefaultMaterial(0);
      var geometry = createGeometry0d(gcells, geom);
      var mesh = new THREE.PointCloud(geometry, material);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._vertices = mesh;
    }
  };

  FEViewModel.prototype._drawDeformedVertices = function() {
    if (this._deformedVertices) this.remove(this._deformedVertices);
    var gcells = this._feb.gcells();
    if (gcells.dim() >= 0 && this._u) {
      var u = this._u;
      var geom = this._geom.add(u);
      var material = getDefaultMaterial(0);
      var geometry = createGeometry0d(gcells, geom);
      var mesh = new THREE.PointCloud(geometry, material);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._deformedVertices = mesh;
    }
  };

  FEViewModel.prototype._drawEdges = function() {
    if (this._edges) this.remove(this._edges);

    var gcells = this._feb.gcells();
    if (gcells.dim() >= 1) {
      var geom = this._geom;
      var material = getDefaultMaterial(1);
      var geometry = createGeometry1d(gcells, geom);
      var mesh = new THREE.Line(geometry, material, THREE.LinePieces);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._edges = mesh;
    }
  };

  FEViewModel.prototype._drawDeformedEdges = function() {
    if (this._deformedEdges) this.remove(this._deformedEdges);

    var gcells = this._feb.gcells();
    if (gcells.dim() >= 1 && this._u) {
      var geom = this._geom.add(this._u);
      var material = getDefaultMaterial(1);
      var geometry = createGeometry1d(gcells, geom);
      var mesh = new THREE.Line(geometry, material, THREE.LinePieces);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._deformedEdges = mesh;
    }
  };

  FEViewModel.prototype._drawFaces = function() {
    if (this._faces) this.remove(this._faces);

    var gcells = this._feb.gcells();
    if (gcells.dim() >= 2) {
      var geom = this._geom;
      var material = getDefaultMaterial(2);
      var geometry = createGeometry2d(gcells, geom);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._faces = mesh;
    }
  };

  FEViewModel.prototype._drawDeformedFaces = function() {
    if (this._deformedFaces) this.remove(this._deformedFaces);

    var gcells = this._feb.gcells();
    if (gcells.dim() >= 2 && this._u) {
      var geom = this._geom.add(this._u);
      var material = getDefaultMaterial(2);
      var geometry = createGeometry2d(gcells, geom);
      var mesh = new THREE.Mesh(geometry, material);
      mesh.matrixAutoUpdate = true;
      this.add(mesh);
      this._deformedFaces = mesh;
    }
  };

  FEAEditorViewer.prototype.draw = function(feb, geom, options) {
    if (!options) options = {};

    var model = new FEViewModel(feb, geom, options);
    this.world.add(model);
    return model;
  };

  window.FEAEditorViewer = FEAEditorViewer;

})();
