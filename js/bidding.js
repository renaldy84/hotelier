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
            
        },function(xhr,status){
            common.handleAjaxError(xhr,status);
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
        },function(xhr,status){
            common.handleAjaxError(xhr,status);
        });
    });
    
}
bidding.bid = function(bid_id,price){
    if(typeof bid_id === 'undefined') return false;
    if(typeof price === 'undefined') return false;
    if(isNaN(price)) return false

    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        common.getLocation().then(function(location){
            var apiUrl = config.apiUrl+api.make_bid+'/'+bid_id;
            $$.get(apiUrl,{access_token:at,
                            price:price,
                            lat:location.lat,
                            lon:location.lon
                            },
            function(data,status){
                var rs = JSON.parse(data);
                
                if(rs.status==1){
                    resolve(true);        
                }else{
                    reject(new Error('cannot bid'));
                }
                
            },function(xhr,status){
                common.handleAjaxError(xhr,status);
            });
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
            
        },function(xhr,status){
            common.handleAjaxError(xhr,status);
        });
    });
}
bidding.notify = function(bid_id){
    return new Promise(function(resolve,reject){

    });
}