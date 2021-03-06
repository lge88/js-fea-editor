function hasClass(ele, cls) {
  return ele.classList.contains(cls);
  // return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}

function addClass(ele,cls) {
  ele.classList.add(cls);
  // if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(ele,cls) {
  ele.classList.remove(cls);
  // if (hasClass(ele,cls)) {
  //   var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
  //   ele.className=ele.className.replace(reg,' ');
  // }
}

function toggleClass(ele,cls) {
  ele.classList.toggle(cls);
}

function getUrl(url, callback) {
  var xhr;
  if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
  else {
    var versions = ["MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0",
                    "Microsoft.XmlHttp"];

    for(var i = 0, len = versions.length; i < len; i++) {
      try {
        xhr = new ActiveXObject(versions[i]);
        break;
      }
      catch(e){}
    } // end for
  }

  xhr.onreadystatechange = ensureReadiness;

  function ensureReadiness() {
    if(xhr.readyState < 4) {
      return;
    }

    if(xhr.status !== 200) {
      return;
    }

    // all is well
    if(xhr.readyState === 4) {
      callback(xhr);
    }
  }

  xhr.open('GET', url, true);
  xhr.send('');
}
