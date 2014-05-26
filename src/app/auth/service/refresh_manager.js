angular.module('sb.auth').service('RefreshManager',
    function($log, AccessToken, OpenId) {
        'use strict';

        // Try to refresh the expired access_token
        this.tryRefresh = function() {
            var refresh_token = AccessToken.getRefreshToken();
            if (!refresh_token) {
                return false;
            }

            $log.info('Trying to refresh token');
            var params = {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            };

            OpenId.token(params).then(
                function(data) {
                    AccessToken.setToken(data);
                    return true;
                },
                function() {
                    AccessToken.clear();
                }
            );

            return false;
        };

    }
);