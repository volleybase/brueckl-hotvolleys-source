if (window.bhv === undefined) {
  window.bhv = {};
}

if (!window.bhv.db) {
  window.bhv.db = {
    set: function(key, value) {
      if (localStorage) {
        localStorage.setItem(key, value);
      }
    },

    get: function(key) {
      if (localStorage) {
        return localStorage.getItem(key);
      }
    },

    delete: function(key) {
      if (localStorage) {
        localStorage.removeItem(key);
      }
    }
  }
}
