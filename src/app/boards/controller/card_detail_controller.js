/*
 * Copyright (c) 2016 Codethink Limited
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
 * Controller for the card detail modal.
 */
angular.module('sb.board').controller('CardDetailController',
    function ($scope, card, board, permissions, Story, Task, DueDate,
              Worklist, $document, $timeout, $modalInstance, $modal) {
        'use strict';

        /**
         * Story/Task title
         */
        $scope.modifications = {
            title: '',
            description: ''
        };
        $scope.toggleEditTitle = function() {
            if (!(permissions.moveCards || permissions.editBoard)) {
                return false;
            }
            if (!$scope.editingTitle) {
                if (card.item_type === 'story') {
                    $scope.modifications.title = card.story.title;
                } else if (card.item_type === 'task') {
                    $scope.modifications.title = card.task.title;
                }
            }
            $scope.editingTitle = !$scope.editingTitle;
        };

        $scope.editTitle = function() {
            var params = {};
            if (card.item_type === 'story') {
                params = {
                    id: card.story.id,
                    title: $scope.modifications.title
                };
                Story.update(params, function(updated) {
                    $scope.toggleEditTitle();
                    card.story.title = updated.title;
                });
            } else if (card.item_type === 'task') {
                params = {
                    id: card.task.id,
                    title: $scope.modifications.title
                };
                Task.update(params, function(updated) {
                    $scope.toggleEditTitle();
                    card.task.title = updated.title;
                });
            }
        };

        /**
         * Story description
         */
        $scope.toggleEditDescription = function() {
            if (!(permissions.moveCards || permissions.editBoard)) {
                return false;
            }
            if (!$scope.editingTitle) {
                $scope.modifications.description = $scope.story.description;
            }
            $scope.editingDescription = !$scope.editingDescription;
        };

        $scope.editStoryDescription = function() {
            var params = {
                id: $scope.story.id,
                description: $scope.modifications.description
            };
            Story.update(params, function(updated) {
                $scope.toggleEditDescription();
                $scope.story.description = updated.description;
            });
        };

        /**
         * Due dates
         */
        $scope.noDate = {
            id: -1,
            date: null
        };

        $scope.getRelevantDueDates = function() {
            $scope.relevantDates = [];
            angular.forEach(board.due_dates, function(date) {
                if (date.assignable) {
                    $scope.relevantDates.push(date);
                }
            });

        };

        $scope.toggleEditDueDate = function() {
            if (permissions.moveCards || permissions.editBoard) {
                $scope.editingDueDate = !$scope.editingDueDate;
            }
        };

        $scope.toggleDueDateDropdown = function() {
            var dropdown = $document[0].getElementById('due-dates-dropdown');
            var button = dropdown.getElementsByTagName('button')[0];
            $timeout(function() {
                button.click();
            }, 0);
        };

        function cardHasDate(date) {
            for (var i = 0; i < card[card.item_type].due_dates.length; i++) {
                if (card[card.item_type].due_dates[i] === date.id) {
                    return true;
                }
            }
            return false;
        }

        function assignDueDate(date) {
            if (card.item_type === 'task') {
                date.tasks.push(card.task);
            } else if (card.item_type === 'story') {
                date.stories.push(card.story);
            }
            var params = {
                id: date.id,
                tasks: date.tasks,
                stories: date.stories
            };
            DueDate.update(params).$promise.then(function(updated) {
                if (card.item_type === 'task') {
                    card.task.due_dates.push(updated.id);
                    $scope.getRelevantDueDates(card.task.due_dates);
                } else if (card.item_type === 'story') {
                    card.story.due_dates.push(updated.id);
                    $scope.getRelevantDueDates(card.story.due_dates);
                }
                $scope.assigningDueDate = false;
            });
        }

        $scope.setDisplayDate = function(date) {
            if (!cardHasDate(date) && date.id !== -1) {
                assignDueDate(date);
            }
            card.resolved_due_date = date;
            var params = {
                id: card.list_id,
                item_id: card.id,
                list_position: card.list_position,
                display_due_date: date.id
            };
            Worklist.ItemsController.update(params, function() {
                $scope.editingDueDate = false;
            });
        };

        $scope.validDueDate = function(dueDate) {
            return dueDate && !(dueDate === $scope.noDate);
        };

        /**
         * Task assignee
         */
        $scope.toggleAssigneeTypeahead = function() {
            var typeahead = $document[0].getElementById('assignee');
            var assignLink = typeahead.getElementsByTagName('a')[0];
            $timeout(function() {
                assignLink.click();
            }, 0);
        };

        $scope.toggleEditAssignee = function() {
            $scope.editingAssignee = !$scope.editingAssignee;
        };

        $scope.updateTask = function(task) {
            var params = {
                id: task.id,
                assignee_id: task.assignee_id
            };
            Task.update(params, function() {
                $scope.editingAssignee = false;
            });
        };

        /**
         * Other
         */
        $scope.deleteCard = function() {
            Worklist.ItemsController.delete({
                id: $scope.card.list_id,
                item_id: $scope.card.id
            }, function() {
                $modalInstance.close('deleted');
            });
        };

        $scope.close = function() {
            $modalInstance.close('closed');
        };


        $scope.newDueDate = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/due_dates/template/new.html',
                controller: 'DueDateNewController',
                resolve: {
                    board: function() {
                        return board;
                    }
                }
            });

            modalInstance.result.then(function(dueDate) {
                if (dueDate.hasOwnProperty('date')) {
                    board.due_dates.push(dueDate);
                }

                $scope.getRelevantDueDates();
                $scope.setDisplayDate(dueDate);
            });
        };

        if (card.item_type === 'task') {
            $scope.story = Story.get({id: card.task.story_id});
        } else if (card.item_type === 'story') {
            $scope.story = card.story;
        }
        $scope.getRelevantDueDates();

        $scope.card = card;
        $scope.board = board;
        $scope.permissions = permissions;
        $scope.showDescription = true;
        $scope.assigningDueDate = false;
        $scope.editingDueDate = false;
        $scope.editingDescription = false;
        $scope.editingAssignee = false;
    }
);
