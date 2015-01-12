angular.module('sb.auth').service('RefreshManager',
    function ($q, $log, $timeout, preExpireDelta, AccessToken, OpenId) {
        'use strict';

        var currentRefresh = null;
        var nextRefreshPromise = null;
        var scheduledForToken = null;

        // Try to refresh the expired access_token
        var tryRefresh = function () {

            if (!currentRefresh) {
                // Create our promise, since we should always return one.
                currentRefresh = $q.defer();
                currentRefresh.promise.then(
                    function () {
                        currentRefresh = null;
                    },
                    function () {
                        currentRefresh = null;
                    }
                );

                var refresh_token = AccessToken.getRefreshToken();
                var is_expired = AccessToken.isExpired();
                var expires_soon = AccessToken.expiresSoon();

                // Do we have a refresh token to try?
                if (!refresh_token) {
                    $log.info('No refresh token found. Aborting refresh.');
                    currentRefresh.reject();
                } else if (!is_expired && !expires_soon) {
                    $log.info('No refresh required for current access token.');
                    currentRefresh.resolve(true);
                } else {

                    $log.info('Trying to refresh token');
                    OpenId.token({
                        grant_type: 'refresh_token',
                        refresh_token: refresh_token
                    }).then(
                        function (data) {
                            AccessToken.setToken(data);
                            currentRefresh.resolve(true);
                            scheduleRefresh();
                        },
                        function () {
                            AccessToken.clear();
                            currentRefresh.reject();
                        }
                    );
                }
            }
            return currentRefresh.promise;
        };


        var scheduleRefresh = function () {
            if (!AccessToken.getRefreshToken() || AccessToken.isExpired()) {
                $log.info('Current token does not require deferred refresh.');
                return;
            }

            var expiresAt = AccessToken.getIssueDate() +
                AccessToken.getExpiresIn();

            if (!!nextRefreshPromise &&
                AccessToken.getAccessToken() === scheduledForToken) {

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
