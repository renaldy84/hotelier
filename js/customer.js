var customer = {};

//in real usecase the hotelier cannot add customer account

customer.create = function(data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.addCustomer;
    data.access_token = at;
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);        
    });
}

customer.list = function(callback){
    var at = common.getAccessToken();

    var apiUrl = config.apiUrl+api.listCustomer;
    $$.get(apiUrl,{
        access_token:at,
    },function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    });
}