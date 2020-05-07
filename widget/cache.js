var cache = {
  storeName: 'cacheStore',
  saveCache: function(object) {
    window.buildfire.localStorage.setItem(this.storeName + '_' + window.buildfire.getContext().instanceId, JSON.stringify(object), function(){});
  },
  getCache: function(callback) {
    window.buildfire.localStorage.getItem(this.storeName + '_' + window.buildfire.getContext().instanceId, function(error, value){
      if (error) return callback(error, null);
      callback(null, JSON.parse((typeof value === 'undefined') ? null : value));
    });
  }
};
