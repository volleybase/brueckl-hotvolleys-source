// check for a new cache
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    // new app cache has been downloaded:
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {

      // swap it in, reload the page
      window.applicationCache.swapCache();
      window.location.reload();
    }

  }, false);

}, false);
