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
 * Controller for the "edit task" modal popup.
 */
angular.module('sb.story').controller('StoryTaskEditModalController',
    function ($scope, $modal, $modalInstance, Project, Story, Task, User,
              Team, $q, task, projectName, branchName, tasks,
              projectNames, updateTask, editNotes, cancelEditNotes,
              showAddWorklist, removeTask) {
        'use strict';

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.task = task;
        $scope.name = projectName;
        $scope.branchName = branchName;
        $scope.projectNames = projectNames;
        $scope.tasks = tasks;
        $scope.updateTask = updateTask;
        $scope.editNotes = editNotes;
        $scope.cancelEditNotes = cancelEditNotes;
        $scope.showAddWorklist = showAddWorklist;
        $scope.removeTask = removeTask;
    })
;
