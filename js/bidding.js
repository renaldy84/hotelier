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
bidding.bid = function(bid_id,formData){
    if(typeof bid_id === 'undefined') return false;
    if(typeof formData.price === 'undefined') return false;
    if(typeof formData.early_checkin === 'undefined') return false;
    if(typeof formData.late_checkout === 'undefined') return false;
    if(typeof formData.breakfast === 'undefined') return false;
    if(typeof formData.wifi === 'undefined') return false;
    if(typeof formData.pickup_service === 'undefined') return false;

    if(isNaN(formData.price)) return false

    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        common.getLocation().then(function(location){
            var apiUrl = config.apiUrl+api.make_bid+'/'+bid_id;
            $$.get(apiUrl,{
                access_token:at,
                price:formData.price,
                lat:location.lat,
                lon:location.lon,
                early_checkin:formData.early_checkin[0],
                late_checkout:formData.late_checkout[0],
                breakfast:formData.breakfast[0],
                wifi:formData.wifi[0],
                pickup_service:formData.pickup_service[0]
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
bidding.get = function(bid_id,lat,lon){
    return new Promise(function(resolve,reject){
        var at = common.getAccessToken();
        var apiUrl = config.apiUrl+api.viewBid+'/'+bid_id+'?lat='+lat+'&lon='+lon;
        $$.get(apiUrl,{access_token:at},
        function(data,status){
            var rs = JSON.parse(data);
            if(status==200){
                resolve(rs.data);        
            }else{
                reject(new Error('cannot retrieve bidding info'));
            }
        });
    });
}

/* getting the current biddings */
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