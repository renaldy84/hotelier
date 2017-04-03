var promo = {};


promo.list = function(callback){
    var at = common.getAccessToken();
    
    var apiUrl = config.apiUrl+api.listPromo;
    $$.get(apiUrl,{
        access_token:at,
    },function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}

promo.create = function(data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.addPromo;
    data.access_token = at;
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}

promo.update = function(id,data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.updatePromo+'/'+id;
    data.access_token = at;
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}
promo.get = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.getPromo+'/'+id;
    
    $$.get(apiUrl,{access_token:at},function(data,status){
        var rs = JSON.parse(data);
        callback(rs);        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}

promo.delete = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.deletePromo+'/'+id;
    
    $$.get(apiUrl,{access_token:at},function(data,status){
        var rs = JSON.parse(data);
        if(rs.status==1){
            callback(true);            
        }else{
            callback(false);
        }
        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}