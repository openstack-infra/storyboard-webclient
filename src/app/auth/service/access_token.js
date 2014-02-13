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
 * AccessToken storage service, an abstraction layer between our token storage
 * and the rest of the system. This feature uses localStorage, which means that
 * our application will NOT support IE7. Once that becomes a requirement, we'll
 * have to use this abstraction layer to store data in a cookie instead.
 */
angular.module('sb.auth').factory('AccessToken',
    function (localStorageService) {
        'use strict';

        /**
         * Our local storage key name constants
         */
        var TOKEN_TYPE = 'token_type';
        var ACCESS_TOKEN = 'access_token';
        var REFRESH_TOKEN = 'refresh_token';
        var ID_TOKEN = 'id_token';
        var EXPIRES_IN = 'expires_in';
        var ISSUE_DATE = 'issue_date';

        return {

            /**
             * Clears the token
             */
            clear: function () {
                localStorageService.remove(TOKEN_TYPE);
                localStorageService.remove(ACCESS_TOKEN);
                localStorageService.remove(REFRESH_TOKEN);
                localStorageService.remove(ID_TOKEN);
                localStorageService.remove(EXPIRES_IN);
                localStorageService.remove(ISSUE_DATE);
            },

            /**
             * Sets all token properties at once.
             */
            setToken: function (tokenType, accessToken, refreshToken, idToken,
                                issueDate, expiresIn) {
                this.setTokenType(tokenType);
                this.setAccessToken(accessToken);
                this.setRefreshToken(refreshToken);
                this.setIdToken(idToken);
                this.setIssueDate(issueDate);
                this.setExpiresIn(expiresIn);
            },

            /**
             * Is the current access token expired?
             */
            isExpired: function () {
                var expiresIn = this.getExpiresIn() || 0;
                var issueDate = this.getIssueDate() || 0;
                var now = Math.round((new Date()).getTime() / 1000);

                return issueDate + expiresIn < now;
            },

            /**
             * Get the token type. Bearer, etc.
             */
            getTokenType: function () {
                return localStorageService.get(TOKEN_TYPE);
            },

            /**
             * Set the token type.
             */
            setTokenType: function (value) {
                return localStorageService.set(TOKEN_TYPE, value);
            },

            /**
             * Retrieve the date this token was issued.
             */
            getIssueDate: function () {
                return localStorageService.get(ISSUE_DATE) || null;
            },

            /**
             * Set the issue date for the current access token.
             */
            setIssueDate: function (value) {
                return localStorageService.set(ISSUE_DATE, value);
            },

            /**
             * Get the number of seconds after the issue date when this token
             * is considered expired.
             */
            getExpiresIn: function () {
                return localStorageService.get(EXPIRES_IN) || 0;
            },

            /**
             * Set the number of seconds from the issue date when this token
             * will expire.
             */
            setExpiresIn: function (value) {
                return localStorageService.set(EXPIRES_IN, value);
            },

            /**
             * Retrieve the access token.
             */
            getAccessToken: function () {
                return localStorageService.get(ACCESS_TOKEN) || null;
            },

            /**
             * Set the access token.
             */
            setAccessToken: function (value) {
                return localStorageService.set(ACCESS_TOKEN, value);
            },

            /**
             * Retrieve the refresh token.
             */
            getRefreshToken: function () {
                return localStorageService.get(REFRESH_TOKEN) || null;
            },

            /**
             * Set the refresh token.
             */
            setRefreshToken: function (value) {
                return localStorageService.set(REFRESH_TOKEN, value);
            },

            /**
             * Retrieve the id token.
             */
            getIdToken: function () {
                return localStorageService.get(ID_TOKEN) || null;
            },

            /**
             * Set the id token.
             */
            setIdToken: function (value) {
                return localStorageService.set(ID_TOKEN, value);
            }
        };
    });