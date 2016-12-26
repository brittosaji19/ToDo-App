// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var todoapp=angular.module('starter', ['ionic'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
todoapp.controller('mainCtrl',function($scope){
  document.addEventListener("deviceready", deviceIsReady, false);

  function deviceIsReady(){
    readJSON();
    $scope.apply();
  }
  $scope.swiped=false;
  $scope.gotDIR=false;
  $scope.listItems=[];
  ;
  $scope.addItem=function(){
    var item=prompt("Enter New Item");
    if(!(item==="" || item===undefined)){
      $scope.listItems.push({name:item,done:false});
      console.log("event to add "+item+" has been registered");
      writeJSON();
    }
    console.log("Field left empty");
  };
  $scope.rmTest=function(){
    $scope.swiped=true;
    for(var i=0;i<$scope.listItems.length;i++){
      if($scope.listItems[i].done==true){
        $scope.listItems.splice(i,1);
        writeJSON();
      }
    }
  };
  var writeJSON=function(){
   console.log("Button Clicked");
   window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function (fs) {
     fs.root.getDirectory("TodoLocal",{create:true},function (dirEntry) {
        dirEntry.getFile("todo.JSON",{create:true},function (gotDirEntry) {
                    gotDirEntry.createWriter(function (Writer) {
                      var JSONString=JSON.stringify($scope.listItems);
                      Writer.write(JSONString);
                    })
        })
     })
   })
  }
 var readJSON=function(){
    window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+"TodoLocal/todo.JSON",gotFile,failToGet);
      function gotFile(fileEntry){
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {

            var fromFile=this.result;
            var DataObject=JSON.parse(fromFile);
            for(var i=0;i<DataObject.length;i++) {
              $scope.listItems.push({name:DataObject[i].name,done:DataObject[i].done});
            }
            var myctrl=angular.element($('#AppCtrl'));
            myctrl.scope().$apply();
          }
          reader.readAsText(file);
        });
      }
      function failToGet(){
        document.querySelector("#textarea").innerHTML = "failed to parse file";
      }
    }
});
