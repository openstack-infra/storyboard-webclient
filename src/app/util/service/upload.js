/*
 * Copyright (c) 2019 Adam Coldrick
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

angular.module('sb.util').service('Upload', function() {
    'use strict';

    function swiftUpload(file, url, auth, onload) {
        var xhr = new XMLHttpRequest();
        var objectUrl = url + '/' + file.name;
        xhr.open('PUT', objectUrl);
        xhr.setRequestHeader('X-Auth-Token', auth);
        xhr.onload = onload(file, objectUrl);
        xhr.send(file);
    }

    function upload(file, url, auth, type, onload) {
        if (type === 'swift') {
            swiftUpload(file, url, auth, onload);
        }
    }

    return {
        upload: upload
    };
})
