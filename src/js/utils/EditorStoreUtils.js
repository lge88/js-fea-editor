require('whatwg-fetch');
var fetch = window.fetch;

var EditorStoreUtils = {
  fetchExampleList: function(done) {
    fetch('examples/index.json')
      .then(function(res) {
        if (res.status >= 200 && res.status < 300) {
          return res;
        }
        throw new Error(res.statusText);
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        done(null, data);
      })
      .catch(function(err) {
        done(err);
      });
  },
  fetchExample: function(url, done) {
    fetch(url)
      .then(function(res) {
        if (res.status >= 200 && res.status < 300) {
          return res;
        }
        throw new Error(res.statusText);
      })
      .then(function(res) {
        return res.text();
      })
      .then(function(txt) {
        done(null, txt);
      })
      .catch(function(err) {
        done(err);
      });
  }
};

module.exports = exports = EditorStoreUtils;
