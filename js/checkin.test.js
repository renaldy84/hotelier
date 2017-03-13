
var $$ = Dom7;
var assert = chai.assert;


var prepareEverything = function(){
    return new Promise(function(resolve,reject){
        var email = Math.ceil(Math.random()*10000)+'@igethotel.com';
        customer.create({ 
            name: 'Jane Doe',
            phone: '123123123123',
            email: email,
            password: '111111',
            address: 'jakarta',
            npwp: '123123123',
            ktp: '443232432432' },
            function(response){
                if(response.status==1){
                    resolve(true);
                }else{
                    reject(new Error('cannot add customer'));
                }
            });
    });
}

var retrievesCustomerID = function(){
    return new Promise(function(resolve,reject){
        customer.list(function(response){
            if(typeof response.data !== 'undefined'){
                resolve({customer_id:response.data[response.data.length-1].id});
            }else{
                reject(new Error('there is no customer yet'));
                
            }
        });
    });
}
var createDummyHotel = function(data){
    return new Promise(function(resolve,reject){
        var hotelName = 'hotel #'+Math.ceil(Math.random()*9999);
        account.getInfo(function(info){
            hotel.create( { name: hotelName,
                address: 'kuningan, jakarta selatan',
                phone: '021-5555656',
                email: 'info@jakarta-hotel.com',
                province_id: '1',
                country_id: '1',
                lat: '-6.229475',
                lon: '106.828156',
                stars: '3',
                description: 'hello world',
                account_id: info.account.id,
                homepage: 'http://www.jakarta-hotel.com'
            } ,function(rs){
               if(rs.status==1){
                   resolve(data);
               }else{
                   reject(new Error('cannot create hotel'));
               }
                
            });
        });
    });
    
}
var createDummyPromo = function(data){
    return new Promise(function(resolve,reject){
        hotel.list(function(response){
            var hotel_id = response.hotel[response.hotel.length-1].id;
            data.hotel_id = hotel_id;
            data.account_id = response.hotel[response.hotel.length-1].account_id;
            promo.create( { name: 'promo 1',
                hotel_id: hotel_id,
                description: 'penawaran terbatas, hanya hari ini !  only Rp 250,000 ',
                regular_price: '900000',
                promo_price: '250000',
                qty: '2',
                early_checkin: '1',
                late_checkout: '1',
                pickup_service: '1',
                breakfast: '1',
                wifi: '1',
            } ,function(rs){
                data.promo_id = rs.data.id;
                if(rs.status==1){
                    resolve(data);
                }else{
                    reject(new Error("cannot create promo"));
                }
                
            });
        });
    });
}
var createDummyBooking = function(data){
    return new Promise(function(resolve,reject){
        console.log('createDummyBooking',data);
        booking.add( { 
                    account_id: data.account_id,
                    hotel_id: data.hotel_id,
                    customer_id: data.customer_id,
                    length_of_stay: '1',
                    final_price: '150000',
                    booking_no: '111222',
                    promo_id: data.promo_id,
                    qty: '1' },
                    function(response){
                        if(response.status==1){
                            console.log('resolve');
                            resolve(data);
                        }else{
                            reject(new Error('cannot create booking'));
                        }
                    });
    });
}
var retrieveBookingId = function(data){
    return new Promise(function(resolve,reject){
        booking.list(function(response){
            console.log('retrieveBookingId',response);
            if(response.status==1){
                
                data.booking_id = response.data[response.data.length-1].id;
                resolve(data);
            }else{
                reject(new Error('cannot get booking_id'));
            }
            
        });
    });
}
describe('checkin',function(){
    it('can generate QRString',function(){
         prepareEverything()
           .then(retrievesCustomerID)
           .then(createDummyHotel)
           .then(createDummyPromo)
           .then(createDummyBooking)
           .then(retrieveBookingId) 
           .then(function(data){
                checkin.toQRString(
                    data.customer_id,
                    data.hotel_id,
                    data.promo_id,
                    data.booking_id
                ).then(function(qrstring){
                    var chunks = qrstring.split("|");
                    assert.equal(chunks.length,4);
                  
                }).catch(function(err){
                    assert.equal(err,null);
                  
                });
           }).catch(function(err){
               assert.equal(err,null);
               
           });
    });
    it('can scan parse qrcode string',
    function(){
        
           prepareEverything()
           .then(retrievesCustomerID)
           .then(createDummyHotel)
           .then(createDummyPromo)
           .then(createDummyBooking)
           .then(retrieveBookingId)
           .then(function(data){
               console.log('the data',data);
               checkin.toQRString(
                   data.customer_id,
                   data.hotel_id,
                   data.promo_id,
                   data.booking_id
               ).then(function(qrstring){
                   console.log('qrstring',qrstring);
                   checkin.scan(qrstring)
                    .then(function(booking_data){
                        assert.property(booking_data,'id');
                        assert.property(booking_data,'hotel_id');
                        assert.property(booking_data,'customer');
                        assert.property(booking_data,'promo');
                        assert.equal(booking_data.id,data.booking_id);
                        assert.equal(booking_data.customer.id,data.customer_id);
                        assert.equal(booking_data.promo.id,data.promo_id);
                        assert.equal(booking_data.id,data.booking_id);
                        assert.equal(booking_data.hotel_id,data.hotel_id);
                        assert.equal(booking_data.booking_status,0);
                        return;
                    }).catch(function(err){
                        console.log(err.message);
                        assert.equal(err,null);
                        return;
                    });
               }).catch(function(err){
                    assert.equal(err,null);
                    return;
               });
                
           }).catch(function(err){
               
               assert.equal(err,null);
               return;
           });
    });
    it('should fail when the qrstring is wrong',
    function(){
              
        console.log('qrstring',qrstring);
        var qrstring = "foobar";
        checkin.scan(qrstring)
        .then(function(booking_data){
            assert.equal(booking_data,false);
            return;
        }).catch(function(err){
            console.log(err.message);
            assert.notEqual(err,null);
            return;
        });
    
                
          
    });
});




