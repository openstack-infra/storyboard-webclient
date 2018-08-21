<!--
  ~ Copyright (c) 2014 Hewlett-Packard Development Company, L.P.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License"); you may
  ~ not use this file except in compliance with the License. You may obtain
  ~ a copy of the License at
  ~
  ~ 	http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  ~ WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
  ~ License for the specific language governing permissions and limitations
  ~ under the License.
  -->

<div class="container-fluid">
    <div class="row">
        <div class="col-xs-12">
            <h1>StoryBoard</h1>

            <p class="lead">The cross-project task-tracker!</p>

        </div>
    </div>
    <div class="row">
        <div class="col-sm-8">

            <h2>Stories</h2>

            <p>It all begins with a <strong>story</strong>. A story is a
                bug report or proposed feature. Stories are then further
                split into <strong>tasks</strong>, which affect a given
                <strong>project</strong> and <strong>branch</strong>.</p>
            <a href="#!/story" class="btn btn-primary">
                Access Stories
                <i class="fa fa-chevron-right"></i>
            </a>

            <h2>Projects</h2>

            <p>StoryBoard lets you efficiently track your work across a
                large number of interrelated projects. Flexible
                <strong>project groups</strong> let you group together the
                projects you're interested in so you can find things quicky
                and easily.</p>
            <a href="#!/project" class="btn btn-primary">
                Access Projects
                <i class="fa fa-chevron-right"></i>
            </a>

            <h2>Worklists and Boards</h2>
            <p>For categorisation or prioritisation, <strong>stories</strong>
               and <strong>tasks</strong> can be gathered in ordered
               <strong>worklists</strong>.  Teams, projects, or sponsors may
               create a <strong>board</strong> with manual or automatic
               lanes to provide a clear overview of activity of interest.</p>
            <p><a href="#!/board"
               target="_blank"
               class="btn btn-primary">
                Access Worklists and Boards
                <i class="fa fa-chevron-right"></i>
            </a></p>
            <small><p class="text-muted">
            Webclient version: {{"<%- sha %>" | truncate: 10}}</p></small>
        </div>
        <div class="col-sm-4">
            <hr class="visible-xs"/>
            <h4>Contributing</h4>

            <p>
                StoryBoard is open source! If you would like to contribute to
                the development of StoryBoard, you must follow the steps in the
                <a href=" http://docs.openstack.org/infra/manual/developers.html"
                  target="_blank">
                    Developer's Guide
                </a>
            </p>

            <p>Note that all bugs with StoryBoard's API should be filed in 
                <a href="https://storyboard.openstack.org/#!/project/456"
                 target="_blank">openstack-infra/storyboard</a> and all of
                StoryBoard's UI bugs should be filed in
                <a href="https://storyboard.openstack.org/#!/project/457"
                 target="_blank">openstack-infra/storyboard-webclient</a>.
            </p>

            <p><a href="http://git.openstack.org/cgit/openstack-infra/storyboard/tree/README.rst"
               target="_blank">
                  Project README
            </a></p>

            <p>
                <a href="http://www.apache.org/licenses/LICENSE-2.0"
                   target="_blank">
                    Project license
                </a>
            </p>


            <hr/>
            <h4>Attribution</h4>

            <p>StoryBoard was built with the help of the following openly
                licensed projects:</p>

            <p><strong>FontAwesome</strong></p>

            <p><a href="http://fontawesome.io/" target="_blank">
                The iconic font designed for Bootstrap
            </a></p>

            <p><strong>AngularJS</strong></p>

            <p><a href="http://angularjs.org/" target="_blank">
                Superheroic JavaScript Framework
            </a></p>

            <p><strong>Bootstrap</strong></p>

            <p><a href="http://getbootstrap.com/" target="_blank">
                Mobile first front-end framework
            </a></p>

        </div>
    </div>
</div>
</div>
