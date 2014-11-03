/*
 * Copyright (c) 2013 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * A directive which checks, enables, and disables subscriptions by resource.
 *
 * @author Michael Krotscheck
 */
angular.module('sb.util').directive('subscribe',
    function (CurrentUser, Notification, Priority, SessionState, Session,
              Subscription) {
        'use strict';

        return {
            restrict: 'E',
            scope: {
                resource: '@',
                resourceId: '='
            },
            templateUrl: 'app/subscription/template/subscribe.html',
            link: function ($scope) {

                /**
                 * When we start, create a promise for the current user.
                 */
                var cuPromise = CurrentUser.resolve();

                /**
                 * Is this control currently enabled?
                 *
                 * @type {boolean}
                 */
                $scope.enabled = Session.isLoggedIn();

                /**
                 * Is this user subscribed to this resource?
                 *
                 * @type {boolean}
                 */
                $scope.subscribed = false;

                /**
                 * Is the control currently trying to resolve the user's
                 * subscription?
                 *
                 * @type {boolean}
                 */
                $scope.resolving = false;

                /**
                 * The loaded subscription resource
                 *
                 * @type {Object}
                 */
                $scope.subscription = null;

                /**
                 * The current user.
                 *
                 * @param currentUser
                 */
                $scope.currentUser = null;
                cuPromise.then(function (user) {
                    $scope.currentUser = user;
                });

                /**
                 * Set or clear the subscription.
                 */
                function setSubscription(subscription) {
                    $scope.subscription = subscription || null;
                    $scope.subscribed = !!$scope.subscription;
                }

                // Subscribe to login/logout events for enable/disable/resolve.
                var removeNotifier = Notification.intercept(function (message) {
                    switch (message.type) {
                        case SessionState.LOGGED_IN:
                            $scope.enabled = true;
                            resolveSubscription();
                            break;
                        case SessionState.LOGGED_OUT:
                            $scope.enabled = false;
                            $scope.subscribed = false;
                            break;
                    }

                }, Priority.LAST);

                // Remove the notifier when this scope is destroyed.
                $scope.$on('$destroy', removeNotifier);

                /**
                 * Resolve whether the current user already has a subscription
                 * to this resource.
                 */
                function resolveSubscription() {

                    if (!Session.isLoggedIn()) {
                        setSubscription();
                        return;
                    }

                    $scope.resolving = true;

                    cuPromise.then(
                        function (user) {
                            Subscription.browse({
                                    user_id: user.id,
                                    target_type: $scope.resource,
                                    target_id: $scope.resourceId
                                },
                                function (results) {
                                    setSubscription(results[0]);
                                    $scope.resolving = false;
                                },
                                function () {
                                    setSubscription();
                                    $scope.resolving = false;
                                }
                            );

                        }
                    );
                }

                /**
                 * When the user clicks on this control, activate/deactivate the
                 * subscription.
                 */
                $scope.toggleSubscribe = function () {
                    if ($scope.resolving) {
                        return;
                    }

                    $scope.resolving = true;

                    if (!!$scope.subscription) {
                        $scope.subscription.$delete(function () {
                            setSubscription();
                            $scope.resolving = false;
                        }, function () {
                            $scope.resolving = false;
                        });
                    } else {

                        cuPromise.then(
                            function (user) {
                                var sub = new Subscription({
                                    user_id: user.id,
                                    target_type: $scope.resource,
                                    target_id: $scope.resourceId
                                });
                                sub.$create(function (result) {
                                    setSubscription(result);
                                    $scope.resolving = false;
                                }, function () {
                                    $scope.resolving = false;
                                });
                            }
                        );
                    }
                };

                // On initialization, resolve.
                resolveSubscription();
            }
        };
    });