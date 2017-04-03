/*
* checkin module will try to parse the qrcode string
* and then match the booking information.
* if the booking is valid, then we process the checkin.
*/
var checkin = {};


//the format : 
//customer_id|hotel_id|promo_id|booking_id

checkin.toQRString = function(customer_id,hotel_id,promo_id,booking_id){
    return new Promise(function(resolve,reject){
        if(typeof customer_id === 'undefined') reject(new Error('you must define customer_id'));
        if(typeof hotel_id === 'undefined') reject(new Error('you must define hotel_id'));
        if(typeof promo_id === 'undefined') reject(new Error('you must define promo_id'));
        if(typeof booking_id === 'undefined') reject(new Error('you must define booking_id'));
        resolve(customer_id+'|'+hotel_id+'|'+promo_id+'|'+booking_id);
    });
}
checkin.scan = function(qrstring){
    if(typeof qrstring === 'undefined'){
        return false;
    }
    return new Promise(function(resolve,reject){
        var chunks = qrstring.split("|");
        if(chunks.length == 4){
            var customer_id = chunks[0];
            var hotel_id = chunks[1];
            var promo_id = chunks[2];
            var booking_id = chunks[3];
            booking.get(booking_id,function(response){
                if(response.status==1){
                    var data = response.data;
                    console.log('booking_data',data);
                    if(customer_id != data.customer.id) return reject(new Error('invalid booking code'));
                    else if(hotel_id != data.hotel_id) return reject(new Error('invalid booking code'));
                    else if(booking_id != data.id) return reject(new Error('invalid booking code'));
                    else if(promo_id != data.promo.id) return reject(new Error('invalid booking code'));
                    else if(data.booking_status !=0 ) return reject(new Error('these booking is already been checked in before'));
                    else resolve(data);
                }else{
                    reject(new Error("sorry, these booking code is not available. Please re-scan again !"));
                }
                
            });
        }else{
            reject(new Error("QRCode is not valid"));
        }
    });
}