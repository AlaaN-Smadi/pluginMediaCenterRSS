'use strict';

(function (angular, buildfire) {
  angular.module('mediaCenterRSSPluginContent')

    /**************************************
     *  providers and factories/services  *
     **************************************/

    /**
     * A provider for retrieving global window.buildfire object defined in buildfire.js.
     */
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire;
      };
      return Buildfire;
    }])

    /**
     * A factory which is a wrapper on global buildfire.datastore object defined in buildfire.js
     */
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      return {
        get: function (_tagName) {
          var deferred = $q.defer()
            , callback = function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            };
          Buildfire.datastore.get(_tagName, callback);
          return deferred.promise;
        },
        save: function (_item, _tagName) {
          var deferred = $q.defer()
            , callback = function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            };
          if (!_item) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, callback);
          return deferred.promise;
        }
      };
    }])

    /**
     * A REST-ful factory used to validate RSS feed url.
     */
    .factory("FeedParseService", ['$q', '$http', function ($q, $http) {
      var validateFeedUrl = function (_feedUrl) {
        var deferred = $q.defer();
        if (!_feedUrl) {
          deferred.reject(new Error('Undefined feed url'));
        }
        $http.post('https://proxy.buildfire.com/validatefeedurl',
          { feedUrl: _feedUrl })
          .success(function (response) {
            if (response.data && response.data.isValidFeedUrl) {
              deferred.resolve(response);
            } else {
              deferred.reject(response.data.error);
            }
          })
          .error(function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      return {
        validateFeedUrl: validateFeedUrl
      };
    }])
    .factory("Utils", ['$q', '$http', function ($q, $http) {
      var _nanoid = function(t=21) {
        return crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?'-':'_'),'');
      }
      return {
        _nanoid: _nanoid
      };
    }]);
})(window.angular, window.buildfire);