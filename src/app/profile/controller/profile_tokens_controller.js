/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * User profile controller for all of a user's auth tokens.
 */
angular.module('sb.profile').controller('ProfileTokensController',
    function ($scope, UserToken, tokens, $modal) {
        'use strict';

        $scope.tokens = tokens;

        $scope.deleteToken = function (token) {
            token.$delete(function () {
                var idx = $scope.tokens.indexOf(token);
                if (idx > -1) {
                    $scope.tokens.splice(idx, 1);
                }
            });
        };

        $scope.issueToken = function () {
            $modal.open({
                templateUrl: 'app/profile/template/token_new.html',
                backdrop: 'static',
                controller: 'ProfileTokenNewController',
                resolve: {
                    user: function (CurrentUser) {
                        return CurrentUser.resolve();
                    }
                }
            }).result.then(function (token) {
                    // On success, append the token.
                    $scope.tokens.push(token);
                });
        };
    });


/**
 * Controller for a single token row within the profile token view.
 */
angular.module('sb.profile').controller('ProfileTokenItemController',
    function ($scope, AccessToken) {
        'use strict';

        var now = new Date();

        // Render the expiration date.
        $scope.created = new Date($scope.token.created_at);
        $scope.expires = new Date($scope.token.created_at);
        $scope.expires.setSeconds($scope.expires.getSeconds() +
            $scope.token.expires_in);

        $scope.expired = $scope.expires.getTime() < now.getTime();
        $scope.current =
            $scope.token.access_token === AccessToken.getAccessToken();
    });
