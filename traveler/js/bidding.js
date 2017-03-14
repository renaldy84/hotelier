/*
* we will retrieve the available biddings nearby
* - when the hotelier take the bid.
*  once hotelier won it, we automatically create a promo and booking id and booking code.
* we send a message to traveler app ,and notify the customer about their new booking.
*/

var bidding = {};

bidding.available = function(location){
    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.availableBiddings;
        
        $$.get(apiUrl,{access_token:at,lat:location.lat,lon:location.lon},
        function(data,status){
            var rs = JSON.parse(data);
            if(status==200){
                resolve(rs.data);        
            }else{
                reject(new Error('cannot retrieve bidding list'));
            }
            
        });
    });
}
bidding.my_biddings = function(location){
    if(typeof location === 'undefined') return false;
    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.my_biddings;
        console.log(apiUrl);
        $$.get(apiUrl,{access_token:at,lat:location.lat,lon:location.lon},
        function(data,status){
            var rs = JSON.parse(data);
            
            if(status==200){
                resolve(rs.data);        
            }else{
                reject(new Error('cannot retrieve bidding offers'));
            }
            
        });
    });
}
bidding.submit = function(data){
    if(typeof data === 'undefined') return false;
    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.submitBid;
        data.access_token = at;
        $$.post(apiUrl,data,function(data,status){
            var rs = JSON.parse(data);
            if(rs.status==1){
                resolve(true);
            }else{
                reject(new Error('cannot submit a bid'));
            }
        });
    });
    
}
bidding.bid = function(bid_id,price){
    if(typeof bid_id === 'undefined') return false;
    if(typeof price === 'undefined') return false;
    if(isNaN(price)) return false

    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.make_bid+'/'+bid_id;
        
        $$.get(apiUrl,{access_token:at,price:price},
        function(data,status){
            var rs = JSON.parse(data);
            
            if(rs.status==1){
                resolve(true);        
            }else{
                reject(new Error('cannot bid'));
            }
            
        });
    });
}
bidding.get = function(bid_id){
    return new Promise(function(resolve,reject){

    });
}
bidding.list = function(){
    return new Promise(function(resolve,reject){
         var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.currentBiddings;

        $$.get(apiUrl,{access_token:at},
        function(data,status){
            var rs = JSON.parse(data);
            if(status==200){
                resolve(rs.data);        
            }else{
                reject(new Error('cannot retrieve bidding list'));
            }
            
        });
    });
}
bidding.notify = function(bid_id){
    return new Promise(function(resolve,reject){

    });
}

bidding.select = function(id){
    return new Promise(function(resolve,reject){
         var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.selectBid+'/'+id;
        $$.get(apiUrl,{access_token:at},
        function(data,status){
            var rs = JSON.parse(data);
            if(status==200){
                resolve(rs);        
            }else{
                reject(new Error('cannot retrieve bidding list'));
            }
            
        });
    });
}
