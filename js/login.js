var login = function(){}


login.login = function(email,password,callback){
    var apiUrl = config.apiUrl+api.login;
        $$.get(apiUrl,{
            email:email,
            password:password,
            role:'hotelier'
        },function(data,status,xhr){
           if(status==200){
             var rs = JSON.parse(data);
             if(rs.status==1){
                common.setAccessToken(rs.access_token);
                callback(true,rs.access_token);
             }else{
                callback(false,false);  
             }
           }else{
               callback(false,false);
           }
        },function(xhr,status){
            common.handleAjaxError(xhr,status).then(function()
            {
                callback(false,false);
            });
        });
}
