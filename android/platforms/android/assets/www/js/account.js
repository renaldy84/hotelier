var account = {};


account.me = function(callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.me;
    $$.get(apiUrl,{access_token:at},
    function(data,status){       
        var rs = JSON.parse(data);
        callback(rs);        
    });
}
account.getInfo = function(callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.accountGetInfo;
    $$.get(apiUrl,{access_token:at},
    function(data,status){       
        var rs = JSON.parse(data);
        common.setLocal('account',rs.account);
        callback(rs);        
    });
}

account.update = function(id,data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.updateAccount+'/'+id;
    data.access_token = at;
    
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        if(rs.status==1){
            callback(true);
        }else{
            callback(false);
        }
        
    });
}

//TODO upload avatar image