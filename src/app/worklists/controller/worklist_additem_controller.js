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
        $scope.saving = false;
        $scope.loadingItems = false;
        $scope.error = {};

        var unstaged = function(item) {
            var accept = true;
            angular.forEach($scope.items, function(selectedItem) {
                if (!selectedItem.hasOwnProperty('value')) {
                    selectedItem.value = selectedItem.id;
                }
                if (!item.hasOwnProperty('value')) {
                    item.value = item.id;
                }

                if (selectedItem.type === item.type &&
                    selectedItem.value === item.value) {
                    accept = false;
                    item.invalid = item.type +
                                   ' is already waiting to be added.';
                }
            });
            return accept;
        };

        $scope.save = function() {
            $scope.saving = true;
            var creates = [];
            var offset = $scope.worklist.items.length;
            for (var i = 0; i < $scope.items.length; i++) {
                var item = $scope.items[i];
                var item_type = '';

                if (item.type === 'Task') {
                    item_type = 'task';
                } else if (item.type === 'Story') {
                    item_type = 'story';
                }

                if (!item.hasOwnProperty('value')) {
                    item.value = item.id;
                }

                var params = {
                    item_id: item.value,
                    id: $scope.worklist.id,
                    list_position: offset + i,
                    item_type: item_type
                };

                if (valid(item)) {
                    creates.push(
                        Worklist.ItemsController.create(params).$promise
                    );
                }
            }
            $q.all(creates).then(function() {
                $scope.saving = false;
                $modalInstance.dismiss('success');
            });
        };

        /**
         * Remove an item from the list of items to add.
         */
        $scope.removeItem = function (item) {
            var idx = $scope.items.indexOf(item);
            $scope.items.splice(idx, 1);
        };

        /**
         * Item search method.
         */
        $scope.targets = ['Stories', 'Tasks'];
        $scope.searchTarget = 'Tasks';
        $scope.searchQuery = '';
        $scope.searchItems = function (value) {
            var searchString = value || '';

            var searches = [];
            if (searchString !== '') {
                if ($scope.searchTarget === 'Stories') {
                    searches.push(Story.criteriaResolver(searchString, 50));
                } else if ($scope.searchTarget === 'Tasks') {
                    searches.push(Task.criteriaResolver(searchString, 50));
                }
            }

            $q.all(searches).then(function (searchResults) {
                var validated = [];
                var invalid = [];

                var addResult = function (item) {
                    if (valid(item) && unstaged(item)) {
                        validated.push(item);
                    } else {
                        invalid.push(item);
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

                $scope.searchResults = validated;
                $scope.invalidSearchResults = invalid;
            });
        };

        $scope.setSearchTarget = function(target) {
            $scope.searchTarget = target;
            $scope.searchItems($scope.searchQuery);
        };

        $scope.loadTasks = function(story) {
            story.loadingTasks = true;
            Task.browse({story_id: story.value}, function(tasks) {
                var results = [];
                var invalid = [];

                angular.forEach(tasks, function(task) {
                    task.type = 'Task';
                    if (valid(task) && unstaged(task)) {
                        results.push(task);
                    } else {
                        invalid.push(task);
                    }
                });

                story.tasks = results;
                story.invalidTasks = invalid;
                story.loadingTasks = false;
            });
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
        $scope.selectTask = function (task, source, event) {
            event.stopPropagation();
            task.type = 'Task';
            $scope.items.push(task);
            if (source.length > 0) {
                var idx = source.indexOf(task);
                source.splice(idx, 1);
            }
        };

        $scope.selectStory = function (story, source, event) {
            event.stopPropagation();
            story.type = 'Story';
            $scope.items.push(story);
            if (source.length > 0) {
                var idx = source.indexOf(story);
                source.splice(idx, 1);
            }
        };

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    });
