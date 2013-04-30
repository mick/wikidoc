var CLIENT_ID = '330542529503.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {

    checkAuth();
  
  //window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
    handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authButton = document.getElementById('authorizeButton');
  authButton.style.display = 'none';

  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.
    console.log(authResult);
    $("div.metadata").fadeOut();
    getDoc("1dJqUZ8IVra2QOLTHG6JCljA4vTqWR0UD7mOtI-V1f7Q", function(file){
      console.log(file);


      $.ajax(file.exportLinks["text/html"], {headers:{"Authorization":"Bearer "+authResult.access_token}, success:function(data){


        $(".lastmodified").text(file.modifiedDate);
        $(".owner").text(file.ownerNames.join(","));
        $(".editlink a").attr("href", file.alternateLink);

        $(".page").find(".content").remove();
        $(".page").append("<div class='content right'></div>");

        var $content =  $(data);
        $content.find("style").remove();
        $("div.content").html("<div class='title'>"+file.title+"</div>")
        $("div.content").append($content).find("style").remove();
        $("div.content").removeClass("right");
        $("div.metadata").fadeIn();
      }, error:function(e){console.log("error ", e);}});

    })

  } else {
    // No access token could be retrieved, show the button to start the authorization flow.
    authButton.style.display = 'block';
    authButton.onclick = function() {
      gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult);
    };
  }
}


function getDoc(fileid, callback){

  var request = gapi.client.request({
    'path': '/drive/v2/files/'+encodeURIComponent(fileid),
    'method': 'GET'});
  if (!callback) {
    callback = function(file) {
      console.log(file)
    };
  }
  request.execute(callback);

}
