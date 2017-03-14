
var $$ = Dom7;
var assert = chai.assert;

var createCustomer = function(){
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
                    resolve(response);
                }else{
                    reject(new Error('cannot create customer'));
                }
                
            });
    });
}

var getDummyCustomerID = function(){
    var data = {};
    console.log('foo');
    return new Promise(function(resolve,reject){
        customer.list(function(response){
            data.customer_id =response.data[0].id;
            console.log('getDummyCustomerID',data);
            resolve(data);
         });
    });
    
}
var createDummyPromo = function(data){
    return new Promise(function(resolve,reject){
         hotel.list(function(response){
            var hotel_id = response.hotel[response.hotel.length-1].id;
            console.log('hotelID',hotel_id);
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
                promo_id = rs.id;
                assert.equal(rs.status,1);
                resolve(data);
            });
        });
    });
}
var getDummyPromo = function(data){
    console.log('getDummyPromo',data);
    return new Promise(function(resolve,reject){
        
        promo.list(function(rs){ 
            console.log('promolist',rs);
            data.promo_id = rs.promos[rs.promos.length-1].id;
            console.log('getDummyPromo',data);
            resolve(data);
        });
    });
}
var getAccountID = function(data){
    return new Promise(function(resolve,reject){
        account.me(function(info){
            data.account_id = info.me.id;
            console.log('getAccountID',data);
            resolve(data);
        });
    });
}
var getDummyData = function(callback){
    //create customer account
    createCustomer().then(function(response){
        assert.equal(response.status,1);
    })
    .then(getDummyCustomerID)
    .then(createDummyPromo)
    .then(getDummyPromo)
    .then(getAccountID)
    .then(function(data){
        console.log('the fucking data',data);
        
        callback(data);
    });
}
describe('booking',function(){
  
    it('can add new booking',function(done){
        getDummyData(function(data){
            hotel.list(function(response){
                var hotel_id = response.hotel[response.hotel.length-1].id;
                booking.add( { 
                    account_id: data.account_id,
                    hotel_id: hotel_id,
                    customer_id: data.customer_id,
                    length_of_stay: '1',
                    final_price: '150000',
                    booking_no: '111222',
                    promo_id: data.promo_id,
                    qty: '1' },
                    function(response){
                        console.log(response);
                        assert.equal(response.status,1);
                        done();
                    });
            });
        }); 
    });

    it('can get booking list',function(done){
        booking.list(function(response){
            assert.property(response,'status');
            assert.property(response,'data');
            assert.equal(response.status,1);
            assert.notEqual(response.data.length,0);
            done();
        });
    });
    it('can get booking info',function(done){
         booking.list(function(response){
            var booking_id = response.data[response.data.length-1].id;
            booking.get(booking_id,function(response){
                assert.property(response,'status');
                assert.property(response,'data');
                assert.property(response.data,'customer');
                assert.property(response.data,'promo');
                assert.property(response.data,'account_id');
                assert.equal(response.data.id,booking_id);
                assert.equal(response.status,1);
                done();
            });
        });
    });
    it('has open status',function(done){
         booking.list(function(response){
            var booking_id = response.data[response.data.length-1].id;
            booking.get(booking_id,function(response){
                assert.equal(response.data.booking_status,0);
                assert.equal(response.status,1);
                done();
            });
        });
    });
    it('can checked in the booking',function(done){
         booking.list(function(response){
            console.log(response);
            var booking_id = response.data[response.data.length-1].id;
            booking.checkedin(booking_id,function(response){
                assert.equal(response.status,1);
                booking.get(booking_id,function(response){
                    assert.equal(response.data.booking_status,1);
                    done();
                });
                
            });
        });
    });
    it('can close the booking',function(done){
         booking.list(function(response){
            console.log(response);
            var booking_id = response.data[response.data.length-1].id;
            booking.closeBooking(booking_id,function(response){
                assert.equal(response.status,1);
                booking.get(booking_id,function(response){
                    assert.equal(response.data.booking_status,2);
                    done();
                });
                
            });
        });
    });
    /*
    it('can close the booking data',function(done){
        booking.list(function(response){
            var booking_id = response.data[response.data.length-1].id;
            booking.update(booking_id,{

            },function(response){
                assert.property(response,'status');
                assert.equal(response.status,1);
                done();
            });
        });
        
    });*/
});




