/*
 * Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * The centralized notification service, aka the central routing point for all
 * broadcast notifications. You use it by registering interceptors and
 * subscribers, and handling any messages that are sent().
 *
 * Interceptors are intended to be both filters and decorators, where
 * individual components can handle messages before either terminating
 * the dispatch chain, or passing them on to the next interceptor. In this
 * fashion it is easy to handle specific messages in one context while
 * other messages in another.
 *
 * Subscribers are processors that handle all messages vetted by our
 * interceptors.
 */
angular.module('sb.notification').factory('Notification',
    function ($log, Severity, Priority) {
        'use strict';

        var subscribers = [];
        var interceptors = [];

        return {
            /**
             * Send a notification.
             *
             * @param type A type identifier, such as a string. Use this for
             * your subscribers to determine what kind of a message you're
             * working with.
             * @param message A human readable message for this notification.
             * @param severity The severity of this message, any of the
             * constants provided in Severity.
             * @param cause The cause of this message, perhaps a large amount
             * of debugging information.
             * @param callback If this message prompts the user to do
             * something, then pass a function here and it'll be rendered
             * in the message.
             * @param callbackLabel A custom label for the callback.
             */
            send: function (type, message, severity, cause, callback,
                            callbackLabel) {
                // Return the type.
                if (!type || !message) {
                    $log.warn('Invoked Notification.send() without a type' +
                        ' or message.');
                    return;
                }

                // sanitize our data.
                var n = {
                    'type': type,
                    'message': message,
                    'severity': severity || Severity.INFO,
                    'cause': cause || null,
                    'callback': callback || null,
                    'callbackLabel': callbackLabel || null,
                    'date': new Date()
                };

                // Iterate through the interceptors.
                for (var i = 0; i < interceptors.length; i++) {
                    if (!!interceptors[i].method(n)) {
                        return;
                    }
                }

                // Iterate through the subscribers.
                for (var j = 0; j < subscribers.length; j++) {
                    subscribers[j](n);
                }
            },

            /**
             * Add a message interceptor to the notification system, in order
             * to determine which messages you'd like to handle.
             *
             * @param interceptor A method that accepts a notification. You can
             * return true from the interceptor method to indicate that this
             * message has been handled and should not be processed further.
             * @param priority An optional priority (default 999).
             * Interceptors with a lower priority will go first.
             * @returns {Function} A method that may be called to remove the
             * interceptor at a later time.
             */
            intercept: function (interceptor, priority) {

                var i = {
                    'priority': priority || Priority.LAST,
                    'method': interceptor
                };

                // Add and sort the interceptors. We're using unshift here so
                // that the sorting algorithm ends up being a single-pass
                // bubble sort.
                interceptors.unshift(i);
                interceptors.sort(function (a, b) {
                    return a.priority - b.priority;
                });

                return function () {
                    interceptors.remove(i);
                };
            },

            /**
             * Subscribe to all messages that make it through our interceptors.
             *
             * @param subscriber A subscriber method that receives a
             * notification.
             * @returns {Function}  A method that may be called to remove the
             * subscriber at a later time.
             */
            subscribe: function (subscriber) {
                subscribers.push(subscriber);

                return function () {
                    subscribers.remove(subscriber);
                };
            }
        };
    });