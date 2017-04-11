 $(document).ready(function(){
   $('.mainScreen').hide();
   $('.button').click(function(){
       FB.login(function(response) {
         if (response.authResponse) {
           console.log('Welcome!  Fetching your information.... ');
           
           FB.api('/me', function(response) {
             console.log('Good to see you, ' + response.name + '.');
           });
           
           FacebookPowersCombined();
           moveScreen();
           
           
         } else {
           console.log('User cancelled login or did not fully authorize.');
         }
       });
       
       });
 });
 
 
 function FacebookPowersCombined()
 {
     /* make the API call */
  FB.api(
      "815157038515764/?fields=albums{photos{comments{like_count},likes},likes}",
      function (response) {
        if (response && !response.error) {
          console.log(response);
        }
      }
  );
   
 }
 
function PowersActivateDisplay()
{
  
  
}


function moveScreen()
{
  		$('.mainScreen').show();
  		$('.splashscreen').slideUp(2000);
  		
}