//ONLOAD build the UI of the sign in Screen.
document.onload = CreateSignIn();

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.notification);
}

//Variables
var Users;
var _username;
var inputPassword;
var userNum;
//URL consts
var URL_GetUsers = 'http://introtoapps.com/datastore.php?action=load&appid=214098128&objectid=users';
var URL_AddUserPrefix = 'http://introtoapps.com/datastore.php?action=append&appid=214098128&objectid=users&data=';

var UserObject = {
  Users : []
};

//Create the sign in UI
function CreateSignIn(){
  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "usernameInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF;margin-top: 20px;font-size:2vh");
  onsItem.setAttribute('placeholder',"Username");

console.log(localStorage.getItem("username"));
if(localStorage.getItem("username"))
{
  console.log("HI");
  onsItem.setAttribute('value',localStorage.getItem("username"));
}

  document.getElementById('inputDiv').appendChild(onsItem);

  var onsItem= document.createElement('input');
  onsItem.setAttribute('class', "text-input");
  onsItem.setAttribute('ng-model', "text");
  onsItem.setAttribute('id', "passwordInput");
  onsItem.setAttribute('style', "style=display: block; width: 90%; height:20%;text-align:center; background-color: #FFFFFF;font-size:2vh");
  onsItem.setAttribute('type',"password");
  onsItem.setAttribute('placeholder',"Password");
  document.getElementById('inputDiv').appendChild(onsItem);

  var signInButton= document.createElement('button');
  signInButton.setAttribute('class', "signInButton");
  signInButton.setAttribute('onclick', "CheckSignIn()");
  signInButton.setAttribute('style', "display: block;height: 15%; background-color: #41C9C9;text-align:center");
  signInButton.innerHTML = "SIGN IN";
  document.getElementById('inputDiv').appendChild(signInButton);
  var signUpButton= document.createElement('button');
  signUpButton.setAttribute('class', "signUpButton");
  signUpButton.setAttribute('onclick', "CheckSignUp()");
  signUpButton.setAttribute('style', "height: 30%; width: 80%;");
  signUpButton.innerHTML = "SIGN UP";
  document.getElementById('buttonDiv').appendChild(signUpButton);

}

//Check the input from the user when the sign up button is pressed.
function CheckSignUp()
{
  _username = document.getElementById('usernameInput').value;
  inputPassword = document.getElementById('passwordInput').value;

  //Simple check if nothing is entered in either input
  if(_username == "" || inputPassword == "")
  {
    return null;
  }

  //Get list of Users and check if the username is currently already in use.
  $.getJSON(URL_GetUsers,function(data)
  {
    Users = data.Users;
    if(CheckUsername())
    {

      var passwdParam = {
      	"password": inputPassword,
      	"salt": "MySalt", //
      	"iterations": 50000,
      	"keyLength": "32" //  is bytes, not bits!
      };

      var hashedValue= PasswordCrypto.pbkdf2_Sync(passwdParam);

        console.log(hashedValue);
          UserObject = data;
          UserObject.Users.push({
              "username" : _username,
              "password"  : hashedValue,
              "quizzes" : []
          });

          CreateNewUser();
          localStorage.setItem("username",_username);
          goToMain();
    }

  }).fail(function(){
      console.log('No data found creating new data');
      CreateNewUser();
      goToMain();
  });
}


function CheckSignIn()
{
  _username = document.getElementById('usernameInput').value;
  inputPassword = document.getElementById('passwordInput').value;
  //Get current Users and cycle through usernames to check if it exists if not call dialog saying username not found.
  $.getJSON(URL_GetUsers,function(data)
  {

    Users = data.Users;
    if(!CheckUsername())
    {
      //USERNAME EXISTS
          if(CheckPassword())
          {
            //PASSWORD EXISTS
            localStorage.setItem("username",_username);
            goToMain();
          }
          else {
            // TODO: display error dialog
            //PASSWORD DOESNT EXIST


navigator.notification.alert(
    'Incorrect password',  // message
    alertDismissed,         // callback
    'Oops',            // title
    'Ok'                  // buttonName
);

          }
    }
    else {
      // TODO: display error dialog
      //USERNAME DOESNT EXIST

      console.log(navigator);


      navigator.notification.alert(
          'Username does not exist',  // message
          alertDismissed,         // callback
          'oops',            // title
          'OK'                  // buttonName
      );
    }

  }).fail(function(){
      console.log('NO USERS EXIST');
  });
}

function alertDismissed() {
  document.getElementById('passwordInput').innerHTML = "";
}

function goToMain()
{
   window.location = "menu.html";
}

function CreateNewUser(){
  var jsonData = JSON.stringify(UserObject);
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      {
      console.log("Created ");
      }
  }
  xmlHttp.open("GET",  URL_AddUserPrefix + encodeURIComponent(jsonData), true);
  xmlHttp.send();
}


function CheckUsername(){
  for (var i = 0; i < Users.length; i++) {
    if(Users[i].username == _username)
    {
      userNum = i;
      console.log(Users[i].username + " -NAME EXISTS- " + _username);
      localStorage.setItem("userNum",userNum);
      console.log('SET LOCAL SOTRAGE USERNUM: ' + userNum);
      return false;
    }
  }
  return true;
}

function CheckPassword(){
    if(Users[userNum].password == inputPassword)
    {
      console.log(Users[userNum].username + " -PASWORD CORRECT- ");
      return true;
    }
    else {
      //TODO: display password specifc error message
      console.log(Users[userNum].username + " -PASWORD WRONG- ");
      return false;
    }
}
