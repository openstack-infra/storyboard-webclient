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

            <p class="lead">A task tracking system for inter-related
                projects.</p>

        </div>
    </div>
    <div class="row">
        <div class="col-sm-8">

            <h2>Stories</h2>

            <p>It all begins with a <strong>story</strong>. A story is a
                bug report or proposed feature. Stories are then further
                split into <strong>tasks</strong>, which affect a given
                project and branch. You can easily track backports of
                bugs to a specific branch, or plan cross-project
                features.</p>
            <a href="#!/story" class="btn btn-primary">
                Access Stories
                <i class="fa fa-chevron-right"></i>
            </a>

            <h2>Projects</h2>

            <p>StoryBoard lets you efficiently track your work across a
                large number of interrelated projects. Flexible
                <strong>project groups</strong> lets you get the views
                that makes the most sense to you.</p>
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
            <small><p class="text-muted">Webclient version: <%- sha %></p></small>
        </div>
        <div class="col-sm-4">
            <hr class="visible-xs"/>
            <h4>Contributing</h4>

            <p>StoryBoard is open source! If you would like to contribute to
               the development of StoryBoard, please take a look at the
               "Project Resources" and "Getting Started" sections of our
               README.</p>
            <p><a href=" http://git.openstack.org/cgit/openstack-infra/storyboard/tree/README.rst"
                  target="_blank">
                README.md
            </a></p>

            <hr/>
            <h4>Attribution</h4>

            <p>StoryBoard was built with the help of the following openly
                licensed projects.</p>

            <p><strong>FontAwesome </strong></p>

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
