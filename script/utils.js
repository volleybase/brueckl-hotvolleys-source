if (window.bhv === undefined) {
  window.bhv = {};
}

/**
 * Some utilities.
 */
window.bhv.utils = {

  setBack: function(region) {
    var i, lnks,
        key = window.bhv.request.utils.getKey();

    if (key) {
      lnks = document.querySelectorAll('div#header a');
      if (lnks) {
        for (i = 0; i < lnks.length; ++i) {
          lnks[i].setAttribute('href', lnks[i].getAttribute('href') + '#'
            + region + '_' + key);
        }
      }
    }
  },

  // -- toolbox for service worker -------------------------------------------

  // helper function
  listenForWaitingServiceWorker: function(reg, callback) {
    function awaitStateChange() {
      reg.installing.addEventListener('statechange', function() {
        if (this.state === 'installed') callback(reg);
      });
    }
    if (!reg) return;
    if (reg.waiting) return callback(reg);
    if (reg.installing) awaitStateChange();
    reg.addEventListener('updatefound', awaitStateChange);
  },

  promptUserToRefresh: function(reg) {
    // todo use notification instead of confirm
    if (window.confirm("New version available! OK to refresh?")) {
      // post to activate new service worker
      reg.waiting.postMessage('skipWaiting');
    }
  },

  // reload once when the new Service Worker starts activating
  refreshing: false,

  initReload: function() {
    navigator.serviceWorker.addEventListener('controllerchange',
      function() {
        // if (!refreshing) {
        //   refreshing = true;
        if (!window.bhv.utils.refreshing) {
          window.bhv.utils.refreshing = true;
          window.location.reload();
        }
      }
    );
  }
}
