/*
 * Copyright (c) 2015 Codethink Limited
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/**
 * Controller for "delete worklist" modal
 */
angular.module('sb.worklist').controller('WorklistAddItemController',
    function ($log, $scope, $state, worklist, $modalInstance, Story, Task,
              Criteria, Worklist, $q, valid) {
        'use strict';

        $scope.worklist = worklist;
        $scope.items = [];

        // Set our progress flags and clear previous error conditions.
        $scope.loadingItems = false;
        $scope.error = {};

        $scope.save = function() {
            var offset = $scope.worklist.items.length;
            for (var i = 0; i < $scope.items.length; i++) {
                var item = $scope.items[i];
                var item_type = '';

                if (item.type === 'Task') {
                    item_type = 'task';
                } else if (item.type === 'Story') {
                    item_type = 'story';
                }

                var params = {
                    item_id: item.value,
                    id: $scope.worklist.id,
                    list_position: offset + i,
                    item_type: item_type
                };

                if (valid(item)) {
                    Worklist.ItemsController.create(params);
                }
            }
            $modalInstance.dismiss('success');
        };

        /**
         * Remove an item from the list of items to add.
         */
        $scope.removeItem = function (item) {
            var idx = $scope.items.indexOf(item);
            $scope.items.splice(idx, 1);
        };

        /**
         * Item typeahead search method.
         */
        $scope.searchItems = function (value) {
            var deferred = $q.defer();

            var searchString = value || '';

            var searches = [
                Story.criteriaResolver(searchString, 5),
                Task.criteriaResolver(searchString, 5)
            ];

            $q.all(searches).then(function (searchResults) {
                var criteria = [];

                var addResult = function (item) {
                    if (valid(item)) {
                        criteria.push(item);
                    }
                };

                for (var i = 0; i < searchResults.length; i++) {
                    var results = searchResults[i];

                    if (!results) {
                        continue;
                    }

                    if (!!results.forEach) {
                        results.forEach(addResult);
                    } else {
                        addResult(results);
                    }
                }

                deferred.resolve(criteria);
            });

            return deferred.promise;
        };

        /**
         * Formats the item name.
         */
        $scope.formatItemName = function (model) {
            if (!!model) {
                return model.title;
            }
            return '';
        };

        /**
         * Select a new item.
         */
        $scope.selectNewItem = function (model) {
            $scope.items.push(model);
            $scope.asyncItem = '';
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });
