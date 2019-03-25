angular.module('sb.services').factory('Assignee',
    function (ResourceFactory, $resource, DSCacheFactory, storyboardApiBase) {
        'use strict';

        var signature = {
            'create': {
                method: 'POST'
            },
            'get': {
                method: 'GET'
            },
            'update': {
                method: 'PUT',
                interceptor: {
                    response: function(response) {
                        var user = response.resource;
                        DSCacheFactory.get('defaultCache').put(
                            storyboardApiBase + '/users/' + user.id,
                            user);
                    }
                }
            },
            'delete': {
                method: 'DELETE'
            },
            'browse': {
                method: 'GET',
                isArray: true,
                responseType: 'json',
                cache: false
            },
            'search': {
                method: 'GET',
                url: storyboardApiBase + '/users/search',
                isArray: true,
                responseType: 'json',
                cache: false
            }
        };
        var resource = $resource(
            storyboardApiBase + '/users/:id',
            {id: '@id'},
            signature
        );

        ResourceFactory.applySearch(
            'Assignee',
            resource,
            'full_name',
            {Text: 'q'}
        );

        return resource;
    });
