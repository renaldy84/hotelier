
var $$ = Dom7;
var assert = chai.assert;

describe('promo',function(){
    var promo_id = 0;
    before(function() {
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
                hotel_id = rs.id;
                assert.equal(rs.status,1);
                
            });
        });
    });
    it('can add new promo',function(done){
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
                done();
            });
        });
        
    });
    it('can get promo list',function(done){
        login.login(
            'test@gethotel.com',
            '111111',
            function(success,access_token){
                console.log(access_token);
               promo.list(function(rs){
                   assert.equal(rs.status,1);
                   assert.notEqual(rs.promos.length,0);
                   done();
               }); 
            });
    });

    it('can retrieve a promo',function(done){
        promo.list(function(rs){
            var promo_id = rs.promos[rs.promos.length-1].id;
            promo.get(promo_id,function(response){
                assert.equal(response.status,1);
                assert.equal(response.data.id,promo_id);
                done();
            });
        });
        
    });
    it('can update the promo',function(done){
        var new_name = 'prod'+Math.ceil(Math.random()*1000);
        promo.list(function(response){
          var promo_id = response.promos[response.promos.length-1].id
          promo.update(promo_id,
         { name: new_name,
            description: 'lorem ipsum dolor sit amet',
            regular_price: '1500000',
            promo_price: '250000',
            qty: '1',
            early_checkin: '1',
            late_checkout: '1',
            pickup_service: '1',
            wifi: '1',
            breakfast: '1' }
        ,function(rs){
            assert.equal(rs.status,1);
            promo.get(promo_id,function(response){
                assert.equal(response.data.name, new_name);
                done();
            });
            
        });
        });
        
    });

    it('can delete promo',function(done){
         promo.list(function(response){
          var promo_id = response.promos[response.promos.length-1].id;
          promo.delete(promo_id,function(success){
              assert.equal(success,true);
              done();
          });
         });
    });
});



