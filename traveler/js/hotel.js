var hotel = {};

hotel.list = function(callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.listHotels;
    $$.get(apiUrl,{
        access_token:at,
    },function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    });
}

hotel.get = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.getHotel+'/'+id;
    
    $$.get(apiUrl,{access_token:at},
    function(data,status){
        
        var rs = JSON.parse(data);
        callback(rs);        
    });
};

hotel.delete = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.deleteHotel+'/'+id;
    
    $$.get(apiUrl,{access_token:at},function(data,status){
        var rs = JSON.parse(data);
        if(rs.status==1){
            callback(true);            
        }else{
            callback(false);
        }
        
    });
}
hotel.update = function(id,data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.updateHotel+'/'+id;
    data.access_token = at;
    
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    });
}

hotel.create = function(data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.addHotel;
    data.access_token = at;
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);       
    });
}


hotel.addPicture = function(hotel_id,
                            picfile,
                            extension,
                            sequence){
    if(typeof hotel_id === 'undefined') return false;
    if(typeof picfile === 'undefined') return false;
    if(typeof extension === 'undefined') return false;
    if(typeof sequence === 'undefined') return false;
    return new Promise(function(resolve,reject){
        //do something here
    });
}
hotel.deletePicture = function(hotel_id,pic_id){
    if(typeof hotel_id === 'undefined') return false;
    if(typeof pic_id === 'undefined') return false;
    return new Promise(function(resolve,reject){
        //do something here
    });
}

hotel.find = function(lat,lon){
    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.findHotel;
        $$.get(apiUrl,{access_token:at,lat:lat,lon:lon,distance:10},
        function(data,status){
            var rs = JSON.parse(data);
            if(rs.status==1){
                common.setLocal('hotel_found',rs.data);
               resolve(rs.data);
            }else{
                reject(new Error('cannot find a nearby hotel in '+distance+'KM distance'));
            }
            
        });
    });
}