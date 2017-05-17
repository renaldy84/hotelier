var profile_photo = {};


profile_photo.take_photo_from_camera = function(id,myApp,myView){
    //id --> hotelier's  account_id
    if(typeof id === 'undefined') id = 0;
   
    return new Promise(function(resolve,reject){
        try{
            var rs = navigator.camera.getPicture(
            function(imageURI){
                myView.router.loadPage("upload_profile_photo.html?id="+id);
                //on success
                var options = new FileUploadOptions();
                options.fileKey = "pic";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                
                var params = new Object();
                params.context = "owner";
                params.id = id;
                options.params = params;
                options.chunkedMode = false;
                
                try{
                    var ft = new FileTransfer();
                    
                    ft.upload(imageURI, encodeURI(config.uploadUrl), 
                    function(result){
                        //go back to page edit hotel
                        myView.router.loadPage("account.html?id="+id);
                        resolve(result);
                    }, 
                    function(error){
                        //go to upload photo error page
                        myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                        reject(error);
        
                     }, 
                    options);
                    
                }catch(e){
                    //go to upload photo error page
                    myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                    reject(e);
                }
                
                
                
            }, 
            function(message) {
                //on error
                //go to upload photo error page
                myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                reject(new Error('cannot take picture'));
            }, 
            {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.CAMERA
            });

        }catch(err){
            //go to upload photo error page
            myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
            reject(err);
        }
        
    });
}
profile_photo.take_photo_from_gallery = function(id,myApp,myView){
    
    if(typeof id === 'undefined') id = 0;
    
    return new Promise(function(resolve,reject){
        try{
            var rs = navigator.camera.getPicture(
            function(imageURI){

                window.resolveLocalFileSystemURL(imageURI, function(entry) {
                  console.log(entry.toURL());
                  var the_uri = entry.toURL();
                   myView.router.loadPage("upload_profile_photo.html?id="+id);
                      //on success
                      var options = new FileUploadOptions();
                      options.fileKey = "pic";
                      options.fileName = the_uri.substr(the_uri.lastIndexOf('/') + 1);
                      options.mimeType = "image/jpeg";
                      console.log(options.fileName);
                      var params = new Object();
                      params.context = "owner";
                      params.id = id;
                      options.params = params;
                      options.chunkedMode = false;

                      try{
                          var ft = new FileTransfer();

                          ft.upload(the_uri, encodeURI(config.uploadUrl),
                          function(result){
                              //go back to page edit profile
                              myView.router.loadPage("account.html?id="+id);
                              resolve(result);
                          },
                          function(error){
                              //go to upload photo error page
                              myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                              reject(error);

                           },
                          options);

                      }catch(e){
                          //go to upload photo error page
                          myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                          reject(e);
                      }
                  }, function(evt){
                     console.log(evt.message);
                     myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                     reject(evt);
                  }
                );


            }, 
            function(message) {
                //on error
                myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
                reject(new Error('cannot take picture'));
            }, 
            {
                quality: 100,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });

        }catch(err){
            myView.router.loadPage("upload_profile_photo_failed.html?id="+id);
            reject(err);
        }
        
    });
}

