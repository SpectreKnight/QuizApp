/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        LoadQuizzes();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
LoadQuizzes();

var UserObject = {
  Users : []
};
//const URL_GetQuizzes;

//Load all the quizzes from the json file
function LoadQuizzes()
{
  $.getJSON('json/quizzes_sample.json',function(data)
  {
        $.each(data.Quizzes,function(i,emp){
             var onsItem= document.createElement('ons-list-item');
             onsItem.setAttribute('modifier', "chevron");
             onsItem.setAttribute('style',"background-color:#FFF09B")
             onsItem.setAttribute('onclick', "goToMain("+i+")");
             onsItem.innerHTML = onsItem.innerHTML + emp.title;
             document.getElementById('quizList').appendChild(onsItem);

            //Check if the user has already attempted/completed this quiz
             $.getJSON(URL_GetUsers,function(data)
             {
               console.log(data);

               var userInfo = data.Users[localStorage.getItem("userNum")];
               console.log(usersInfo);

             })
      });

      console.log('Loaded quizzes for user: ' +  localStorage.getItem("userNum"));

  }).fail(function(){
    document.getElementById("question").innerHTML = "error";
      console.log('error');
  });

}
//Move to main.html and save the quiz number to be used when accessing it later
function goToMain(pos)
{
   window.location = "main.html";
   localStorage.setItem("_quizNum",pos);
}
