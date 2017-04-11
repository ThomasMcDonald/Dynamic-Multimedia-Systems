facebook.photos = [];
facebook.albums = [];
facebook.pageContent = [];
facebook.posts = [];
facebook.numPhotos = 0;
facebook.infoCount = 0;
facebook.AlbumReadyCallBack;
facebook.ContentReadyCallBack;
facebook.PostsReadyCallBack;
facebook.PhotoReadyCallBack;
facebook.ReturnedSizes = 0;



//This function checks if the user is logged in, if they are it will move change the screen, 
//if they are not it will log the user in and then change th screen
facebook.loginAndPrepare = function(){ 
    FB.getLoginStatus(function(response){
    if(response.status === 'connected')  window.location.replace("https://dmstravelapplication-thomasmcdonald1996-1.c9.io/Assignment/#/mainScreen");
    else{
    FB.login(function(response) {
         if (response.authResponse) {
                window.location.replace("https://dmstravelapplication-thomasmcdonald1996-1.c9.io/Assignment/#/mainScreen"); 
         } else {
           alert('User cancelled login or did not fully authorize.');
         }
       },{scope: 'manage_pages, publish_actions'});
    }
});
}    
//This function checks if the user is logged in,
//if they are it will retrieve all the page posts that have been liked by the page.
facebook.getPagePosts = function(callback)
{
    facebook.PostsReadyCallBack = callback
     FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
           FB.api(
    "815157038515764/feed?fields=likes,message,story,created_time",
    function (response) {
      if (response && !response.error) {
     for (var i = 0; i < response.data.length; i++)
            {
                if(response.data[i].hasOwnProperty('likes'))
                {
                
                    for(var j=0;j<response.data[i].likes.data.length;j++)
                     {
                        if(response.data[i].likes.data[j].id == "815157038515764")
                        {
                            facebook.posts.push(response.data[i]);
                        }
                     }
                   

                }
            }
      }
          facebook.PostsReadyCallBack(facebook.posts);
     }
        );

        }
        });
        }


//This function checks if the user is logged in, 
//if they are it will then retrieve the facebook page description.
facebook.getPageContents = function(content){ 
    facebook.ContentReadyCallBack = content;
    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
            FB.api(
            "/815157038515764/?fields=description",
            function (response) {
              if (response && !response.error) 
                  {
                    var gatherObjects = {desc:response.description}
            		facebook.pageContent.push(gatherObjects);
                  }
                  facebook.ContentReadyCallBack(facebook.pageContent);
                }
                );
            }
    });
}


//This function checks if the user is logged in, 
//if they are it will then log them out.
facebook.logoutPrepare = function(){ 
    FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
            FB.logout(function(response) {
                 Materialize.toast('Logged Out', 4000)
            });
        }
    });
    
}


////This function checks if the user is logged in, 
//if they are it will then log them out.
facebook.FacebookPowersCombined = function(callback){
     facebook.AlbumReadyCallBack = callback;
    FB.getLoginStatus(function(response){
        if(response.status === 'connected'){
      FB.api(
          "815157038515764/?fields=albums{photos,cover_photo,description,id,name,location,created_time,likes}",
          function (response) {
            if (response && !response.error) {
              for(var i=0;i<response.albums.data.length;i++)
              {
                if(response.albums.data[i].name != "Profile Pictures" && response.albums.data[i].name != "Cover Photos" && response.albums.data[i].location.indexOf("Australia") >= 0){
                var gatherObjects = {id: response.albums.data[i].id, name:response.albums.data[i].name, CoverPhoto: response.albums.data[i].cover_photo.id, created:response.albums.data[i].created_time, likes:response.albums.data[i].likes.data.length, photoNo:response.albums.data[i].photos.data.length};
        		facebook.albums.push(gatherObjects);
                }
              }
              facebook.AlbumReadyCallBack(facebook.albums);
            }
          }
      );
    }
    else alert("User not Logged In");
    });
}

//This function checks if a user has liked a picture from the given photos array,
//if they have liked the photo then the like indicator for that photo will be blue
facebook.CheckUserLikes = function(photos)
{
                FB.api(
                "/me",
                function (response) {
                  if (response && !response.error) {
               for (var i = 0; i < photos.length; i++)
                {
                        for(var j=0;j<photos[i].likes.data.length;j++)
                         {
                            if(photos[i].likes.data[j].id == response.id)
                            {
                                
                                var LikesPointer = $('.'+photos[i].id);
                                 LikesPointer.css('color','blue');
                                
                            }
                         }
                   

                    }
            
              }
            }
        );
}
//This function checks if the user is logged in
//if they are logged in then it will allow the user to like the photo
//It will update the local version of this document as well 
//as the facebook like counter on the facebook page containing this image
facebook.LikeAdder = function(picId){
    FB.getLoginStatus(function(response)
        {
            if (response.status === 'connected')
            {
                
                 FB.api(
                    picId+'/likes',
                    'POST',
                    {},
                    function(response) {
                        FB.api(
                        picId,
                        'GET',
                        {"fields":"likes"},
                        function(response2) {
                            var LikesCount = $('#'+picId);
                            var LikesPointer = $('.'+picId);
                            LikesCount.html('Likes '+response2.likes.data.length);
                            LikesPointer.css('color','blue');
                            
                            
                        }
                    );
                    }
                );
        }
    });
};

//This function checks if the user is logged in
//if they are logged in then it will allow the user to de-like the photo
//It will update the local version of this document as well 
//as the facebook like counter on the facebook page containing this image
facebook.decrementLikes = function(picId){
        FB.getLoginStatus(function(response)
        {
            if (response.status === 'connected')
            {
                FB.api(
                    picId+'/likes',
                    'DELETE',
                    {},
                function(response) {
                        FB.api(
                        picId,
                        'GET',
                        {"fields":"likes"},
                        function(response2) {
                            var LikesCount = $('#'+picId);
                            var LikesPointer = $('.'+picId);
                            LikesCount.html('Likes '+response2.likes.data.length);
                            LikesPointer.css('color','');
                        }
                    );
                    
                }
            );
            }
        });
}