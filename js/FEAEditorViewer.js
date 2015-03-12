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

  FEAEditorViewer.prototype._createGeometry0d = function(gcells, x, colors) {
    var dim = gcells.dim();
    if (dim < 0) return null;

    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices = [];

    geometry.vertices = gcells
      .vertices()
      .map(function(i) {
        var v = x.get(i);
        return new THREE.Vector3(v[0] || 0, v[1] || 0, v[2] || 0);
      });

    if (colors) {
      geometry.colors = colors;
    }

    this._markGeometryDirty(geometry);
    return geometry;
  };

  FEAEditorViewer.prototype._createGeometry1d = function(gcells, x, colors) {
    var dim = gcells.dim();
    if (dim < 1) return null;

    var geometry = new THREE.Geometry();
    var vertices = geometry.vertices = [];


    var edgeColors = [];
    gcells
      .edges()
      .forEach(function(edge) {
        var i1 = edge[0], i2 = edge[1];
        var v1 = x.get(i1);
        var v2 = x.get(i2);
        vertices.push(
          new THREE.Vector3(v1[0] || 0, v1[1] || 0, v1[2] || 0),
          new THREE.Vector3(v2[0] || 0, v2[1] || 0, v2[2] || 0)
        );
        if (colors) {
          edgeColors.push(colors[i1-1], colors[i2-1]);
        }
      });

    if (edgeColors.length) {
      geometry.colors = edgeColors;
    }

    this._markGeometryDirty(geometry);
    return geometry;
  };

  FEAEditorViewer.prototype._createGeometry2d = function(gcells, x, colors) {
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
        var i1 = face[0]-1, i2 = face[1]-1, i3 = face[2]-1;
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

    this._markGeometryDirty(geometry);
    return geometry;
  };

  FEAEditorViewer.prototype._markGeometryDirty = function(geometry) {
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

  FEAEditorViewer.prototype._getDefaultMaterial = function(dim, options) {
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

  FEAEditorViewer.prototype.drawFeb = function(feb, geom, options) {
    if (!options) options = {};

    var colors = options.colors;
    var gcells = feb.gcells();
    var dim = gcells.dim();

    var material = this._getDefaultMaterial(dim, { hasColors: colors });

    var geometry, mesh;

    if (dim == 0) {
      geometry = this._createGeometry0d(gcells, geom, colors);
      mesh = new THREE.PointCloud(geometry, material);
    } else if (dim == 1) {
      geometry = this._createGeometry1d(gcells, geom, colors);
      mesh = new THREE.Line(geometry, material, THREE.LinePieces);
    } else if (dim == 2) {
      geometry = this._createGeometry2d(gcells, geom, colors);
      mesh = new THREE.Mesh(geometry, material);
    }

    if (options.u) {
      // TODO: draw deformed
    }

    mesh.matrixAutoUpdate = true;

    this.world.add(mesh);

    return mesh;
  };

  window.FEAEditorViewer = FEAEditorViewer;

})();
