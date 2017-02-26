function log(txt) {
  if (console && console.log) {
    console.log(txt);
  }
}

if (window.bhv === undefined) {
  window.bhv = {};
}

window.bhv.request = {
  queryResults: function(id, onsuccess, onerror) {
    if (!id || !Number.isFinite(id)) {
      log('Invalid id ' + id + '!');
      return false;
    }

    if (!XMLHttpRequest) {
      log('XMLHttpRequest is not available!');
      return false;
    }

    var request = new XMLHttpRequest();
    if (!request || ! ("withCredentials" in request)) {
      log('XMLHttpRequest is not available!');
      return false;
    }

    function reqHandler(evtXHR) {
      if (request.readyState === 4 && request.status == 200) {
        onsuccess(request.responseText);
      }
    }

    function reqError(event) {
      log('Error handler called!');
      onerror();
    }

    // start request (add dummy timestamp to avoid caching)
    var url = 'http://kvv.volleynet.at/volleynet/service/xml2.php?action=tabelle&bew_id=' + id;
    request.open('GET', url + '&dummy=' + (new Date()).getTime(), true);
    request.onerror = reqError;
    request.onreadystatechange = reqHandler;
    request.send();

    return true;
  }
}
