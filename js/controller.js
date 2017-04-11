var facebook = {};


var app = angular.module('photoApp', ['ngRoute','ngAnimate']);



//Controls which controllers the views use 
//and the location the views can be accessed from.
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/splashScreen.html',
        controller: 'LoginReady'
      }).
      when('/mainScreen', {
        templateUrl: 'views/mainScreen.html',
        controller: 'AlbumReady'
      }).
      when('/photoScreen', {
        templateUrl: 'views/photoScreen.html',
        controller: 'PhotosReady'
      }).
      when('/about', {
        templateUrl: 'views/about.html'
      }).
      when('/design', {
        templateUrl: 'views/design.html'
      });
}]);

//LoginReady Controller handles all the content on the /splashScreen view
app.controller('LoginReady', function($scope, $location){
        
        //This function is called on button click on the login button located in the  /splashScreen view
        $scope.login = function(){
            facebook.loginAndPrepare(); // Located in model.js
        }
        
        
        
});

//AlbumReady Controller handles all the content on the /mainScreen view
app.controller('AlbumReady', function($scope,$location,MyService){
    facebook.photos = []; //Resets array just in case of double data
    facebook.albums = []; //Resets array in case of double data
    facebook.pageContent = []; //Resets array in case of double data
    facebook.posts = []; //Resets array in case of double data
  
    //This is a callback function that is called by the facebook.FacebookPowersCombined().
    $scope.albumReady = function(albums)
        {
          albums.sort(function(a, b){
            return (b.likes - a.likes);
            });
          $scope.albums = albums;
          $scope.$apply();
        }
    //This is a callback function that is called by the facebook.getPageContents().
    $scope.pageDetails = function(content)
        {
          $scope.PageDetails = content;
          $scope.$apply();
        }
    //This is a callback function that is called by the facebook.getPagePosts().   
    $scope.pagePosts = function(content)
        {
            $scope.posts = content;
            $scope.$apply();
        }
            
        
    facebook.FacebookPowersCombined($scope.albumReady); // Located in model.js
    facebook.getPageContents($scope.pageDetails); // Located in model.js
    facebook.getPagePosts($scope.pagePosts);  // Located in model.js
    
    //This function is called on button click on the logout button in the /mainScreen view
    //Location is changed using the $location.path method 
    $scope.logout =  function()
        {
            facebook.logoutPrepare();// Located in model.js
            $location.path("/");
        }
        
    //This function is when the album is clicked, it receives the album id and location,
    //The album id is saved using the MyService.setAlbumId(id) method.
    //Location is changed using the $location.path method 
    $scope.goNext = function(location,id)
    {
          MyService.setAlbumId(id);
          $location.path(location);
    }
    
    //Changes the location to the about page
    $scope.about = function()
    {
        $location.path('/about');
    }
    //Changes the location to the design page
    $scope.design = function()
    {
        $location.path('/design');
    }
});


//PhotosReady Controller handles all the content on the /photoScreen view
app.controller('PhotosReady', function($scope,$location,MyService,$templateCache){
    facebook.photos = []; //Resets array just in case of double data
    //This function checks if the user is currently logged in
    //if they are logged in then it will retrieve the photos that are related to the Album ID saved(See Above)
    //This is done by using the MyService.getAlbumID() method.
    //
    //it will save all required data to display the photos into an array and then 
    //provide that array to the $scope which will push it to the view
    FB.getLoginStatus(function(response)
    {
        if(response.status === 'connected')
        {
            $scope.id = MyService.getAlbumId();
            $scope.photos = [];
            var array = [];
            $scope.photo_data = {};
           FB.api($scope.id,
           {
               fields: 'photos{name, images, likes.limit(999), height}'
           },function(response)
           { 
               for (var i = 0; i <response.photos.data.length; i++)
               {
                   $scope.photo_data.id = response.photos.data[i].id
                  if (response.photos.data[i].hasOwnProperty('name'))
                  {
                      $scope.photo_data.name = response.photos.data[i].name;
                  }else
                  {
                      response.photos.data[i].name = "photo";
                  }
                  $scope.photo_data.large = response.photos.data[i].images[0].source;

                  if(response.photos.data[i].height = 320)
                  {
                        if(response.photos.data[i].images[i] != undefined)
                         $scope.photo_data.thumb = response.photos.data[i].images[i].source;
                        else  $scope.photo_data.thumb = response.photos.data[i].images[3].source;
                  }
                  if(response.photos.data[i].hasOwnProperty('likes') && response.photos.data[i].likes.data.length > 0)
                  {
                      $scope.photo_data.likesLength = response.photos.data[i].likes.data.length;
                      $scope.photo_data.likes = response.photos.data[i].likes;
                      
                  }else
                  {
                      $scope.photo_data.likes = 0;
                  }
                  
                    array.push({id:$scope.photo_data.id,name: $scope.photo_data.name, large: $scope.photo_data.large, thumb: $scope.photo_data.thumb, likes:$scope.photo_data.likes, likesLength: $scope.photo_data.likesLength});
                    $scope.$apply();
               }
               facebook.CheckUserLikes(array);// Located in model.js
           });
           $scope.photos = array;
        }
    });
     //This function is called on button click on the logout button in the /photoScreen view
    //Location is changed using the $location.path method 
    $scope.logout =  function(){
            facebook.logoutPrepare();// Located in model.js
            $location.path("/");
        }
     //This function is called when a like button has been pressed,
     //it is supplied the picture Id(picId) and then calls the function facebook.LikeAdder(picId).
   $scope.incrementLikes = function(picId)
    {
     facebook.LikeAdder(picId); // Located in model.js
    }
    
    
    $scope.decrementLikes = function(picId)
    {
        facebook.decrementLikes(picId);// Located in model.js
    }
    
     //Changes the locaiton to the about page
    $scope.about = function()
    {
        $location.path('/about');
    }
    //Changes the locaiton to the design page
    $scope.design = function()
    {
        $location.path('/design');
    }
});



//The app factory helps store the album ID which is used above
app.factory('MyService', function()
{
    var albumId = '';
    function setAlbumId(data)
    {
        albumId = data;
    }
    function getAlbumId()
    {
        return albumId;
    }
    return{
        setAlbumId: setAlbumId,
        getAlbumId: getAlbumId
    }
})
