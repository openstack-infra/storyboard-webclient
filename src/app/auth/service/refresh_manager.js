angular.module('sb.auth').service('RefreshManager',
    function($q, $log, $timeout, preExpireDelta, AccessToken, OpenId) {
        'use strict';

        var nextRefreshPromise = null;
        var scheduledForToken = null;

        // Try to refresh the expired access_token
        var tryRefresh = function() {
            var deferred = $q.defer();
            var resolved = false;

            var refresh_token = AccessToken.getRefreshToken();
            if (!refresh_token) {
                $log.info('No refresh token found. Aborting refresh.');
                deferred.reject();
                resolved = true;
            }

            if (!resolved && !AccessToken.isExpired() &&
                !AccessToken.expiresSoon()) {
                $log.info('No refresh is required for existing access token.');
                deferred.resolve(true);
                resolved = true;
            }

            if (resolved) {
                return deferred.promise;
            }

            $log.info('Trying to refresh token');
            var params = {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            };


            OpenId.token(params).then(
                function(data) {
                    AccessToken.setToken(data);
                    deferred.resolve(true);
                    scheduleRefresh();
                },
                function() {
                    AccessToken.clear();
                    deferred.reject();
                }
            );

            return deferred.promise;
        };


        var scheduleRefresh = function() {
            if (!AccessToken.getRefreshToken()) {
                return;
            }

            var expiresAt = AccessToken.getIssueDate() +
                AccessToken.getExpiresIn();
            
            if (!!nextRefreshPromise &&
                AccessToken.getAccessToken === scheduledForToken) {
                
                $log.info('The refresh is already scheduled.');
                return;
            }
            
            var now = Math.round((new Date()).getTime() / 1000);
            var delay = (expiresAt - preExpireDelta - now) * 1000;
            nextRefreshPromise = $timeout(tryRefresh, delay, false);
            scheduledForToken = AccessToken.getAccessToken();

            $log.info('Refresh scheduled to happen in ' + delay + ' ms');
        };

        this.tryRefresh = tryRefresh;
        this.scheduleRefresh = scheduleRefresh;

    }
);