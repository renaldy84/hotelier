var $$ = Dom7;
var assert = chai.assert;

describe('hotel',function(){
    var hotel_id = 0;
    var account_id = 0;
    
     it('can add new hotel',function(done){
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
                done();
            });
        });
        
    });
    
    it('can get hotel list',function(done){
        login.login(
            'test@gethotel.com',
            '111111',
            function(success,access_token){
                console.log(access_token);
               hotel.list(function(rs){
                   assert.equal(rs.status,1);
                   assert.notEqual(rs.hotel.length,0);
                   assert.property(rs,'hotel');
                   
                   done();
               }); 
            });
    });
    
   
    it('can retrieve a hotel',function(done){
       hotel.list(function(rs){
                  var hotel_id = rs.hotel[rs.hotel.length-1].id;
                  hotel.get(hotel_id,function(response){
                    console.log(response);
                      assert.property(response,'status');
                      assert.property(response,'data');
                      assert.property(response.data,'id');
                      assert.property(response.data,'name');
                      assert.equal(response.status,1);
                      assert.equal(response.data.id,hotel_id);
                      done();
                  });          
               }); 
        
    });
    
    it('can update the hotel',function(done){
        var new_name = 'hotel '+Math.ceil(Math.random()*1000);
        hotel.list(function(response){
          var hotel_id = response.hotel[response.hotel.length-1].id
          hotel.update(hotel_id,
         { name: new_name,
     address: 'kuningan, jakarta selatan',
     phone: '021-5555656',
     email: 'info@jakarta-hotel.com',
     province_id: '1',
     country_id: '1',
     lat: '-6.229475',
     lon: '106.828156',
     stars: '3',
     description: 'hello world !',
     homepage: 'http://www.jakarta-hotel.com' }
        ,function(rs){
            assert.equal(rs.status,1);
            hotel.get(hotel_id,function(response){
                assert.equal(response.data.name, new_name);
                done();
            });
            
        });
        });
        
    });
    
    it('can delete hotel',function(done){
         hotel.list(function(response){
          var hotel_id = response.hotel[response.hotel.length-1].id;
          hotel.delete(hotel_id,function(success){
              assert.equal(success,true);
              hotel.get(hotel_id,function(response){
                  assert.equal(response.status,0);
                  done();
              });
          });
         });
    });
});



