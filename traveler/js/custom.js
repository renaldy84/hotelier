
var _location = {lat: 0, lng: 0};
//templates
var tplTopHotel = Template7.compile($$("#tpl-top-hotel").html());
var tplOtherHotel = Template7.compile($$("#tpl-other-hotel").html());
var tplHotelDetail = Template7.compile($$("#tpl-hotel-detail").html());
var tplBookingDetail = Template7.compile($$("#tpl-booking-detail").html());
var tplBookingInfo = Template7.compile($$('#tpl-booking-info').html());
var tplBookingList = Template7.compile($$('#tpl-booking-list').html());
var tplMyBiddings = Template7.compile($$('#tpl-my-biddings').html());
//-->
myApp.onPageInit('nearhotel', function (page) {
  //watchLocation
  common.watchLocation();
  
  //init map
  $$(".location-notice").html('Detecting location..');
  common.getLocation().then(function(myLocation){
      
        $$(".location-notice").html('Found your location');
        _location = {lat: myLocation.lat, lng: myLocation.lon};
        console.log(_location);
        var map = new google.maps.Map(document.getElementById('locationmap'), {
        zoom: 15,
        center: _location
        });
        //init marker
        var marker = new google.maps.Marker({
          map:map,
          position: _location,
          title:'Location'
        });
        
        //set initial location
        $$("input[name=lat]").val(_location.lat);
        $$("input[name=lon]").val(_location.lng);
        
        // add listener
        google.maps.event.addListener(map, 'click', function(event) {
          setMarker(event.latLng);
        });

        //callback listener
        function setMarker(_location) {
          //add marker
          marker.setMap(null);
          marker = new google.maps.Marker({
              position: _location,
              map: map,
          });
          map.setCenter(_location);
          map.setZoom(15);
         
          //change value
          
           $$("input[name=lat]").val(_location.lat);
            $$("input[name=lon]").val(_location.lng);
          
        }
  }).catch(function(err){
    myApp.alert('Cannot find your location. Please make sure the GPS is enabled !','');
  });
});


myApp.onPageInit('finding-progress',function(page){
    var formData = myApp.formToData('#find-form');
    console.log(formData);
    hotel.find(formData.lat, formData.lon).then(function(hotels){
        if(hotels.length > 0){
            setTimeout(function(){
                mainView.router.loadPage('nearhotel.html');
            },3000);  
        }else{
            
            setTimeout(function(){
                mainView.router.loadPage('findhotel_failed.html');
            },3000);    
        }
        
    }).catch(function(){
        
        setTimeout(function(){
            mainView.router.loadPage('findhotel_failed.html');
        },3000);
    });
});

myApp.onPageInit('find-hotel-failed',function(page){
    setTimeout(function(){
            mainView.router.loadPage('index.html');
        },3000);
});

myApp.onPageInit('tophotels',function(page){
    var hotels = common.getLocal("hotel_found");
    var n = 0;
    var topHotels= [];
    while(n<6 && hotels.length>0){
        topHotels.push(hotels.shift());
        n++;
    }
    console.log(topHotels);
    var html  = tplTopHotel({tophotels:topHotels});
    
    $$(".hotel-list").html(html);
});
myApp.onPageInit('otherhotel',function(page){
     var hotels = common.getLocal("hotel_found");
     var html  = tplOtherHotel({hotels:hotels});
     $$(".other-hotel").html(html);
});
myApp.onPageInit('hoteldetail',function(page){
    if(typeof page.query.id === 'undefined'){
        setTimeout(function(){
            mainView.router.loadPage('index.html');
        },3000);
    }
    var promo_id = page.query.id;
    promo.get(promo_id,function(response){
        if(response.status == 1){
            //save it to local, so we dont have to request again.
            common.setLocal('current_promo',response.data);
            var html = tplHotelDetail({
                                        promo:response.data,
                                        hotelData:response.data.hotel,
                                        stars:response.data.hotel.stars
                                    });
            $$(".hotel-detail").html(html);
            $$(".pageTitle").html(response.data.hotel.name);
        }
    });
});
myApp.onPageInit('bookhotel',function(page){
    //check if the user is already logged in or not.
    var customer_account = common.getLocal('customer_account');
    if(!customer_account){
        setTimeout(function(){
             mainView.router.loadPage('signin.html');
        },500);

    }else{
        var current_promo = common.getLocal('current_promo');
        var html = tplBookingDetail({
                            promo:current_promo,
                            hotelData:current_promo.hotel,
                            stars:current_promo.hotel.stars
                        });
        $$('.booking-detail-content').html(html);
    }
    
});


myApp.onPageInit('payment-progress',function(page){
    
    setTimeout(function(){
        mainView.router.loadPage('payment-success.html');
    },3000);
});
myApp.onPageInit('payment-success',function(page){
    var current_promo = common.getLocal('current_promo');
    var customer_account = common.getLocal('customer_account');
    var hotel_id = current_promo.hotel_id;
        booking.add( { 
            account_id: current_promo.account_id,
            hotel_id: hotel_id,
            customer_id: customer_account.id,
            length_of_stay: '1',
            final_price: current_promo.promo_price,
            booking_no: current_promo.account_id+''+customer_account.id
                            +''+current_promo.id+''+hotel_id+'-'+Math.ceil(Math.random()*999999),
            promo_id: current_promo.id,
            qty: '1' },
            function(response){
               if(response.status==1){
                    common.setLocal('recent_booking',response.data);
                    setTimeout(function(){
                        mainView.router.loadPage('bookingdetail.html');
                    },3000);
               }else{
                    setTimeout(function(){
                        mainView.router.loadPage('booking_failed.html');
                    },3000);
               }
            });

});
myApp.onPageInit('signup',function(page){
    
});
myApp.onPageInit('signup-progress',function(page){
    var formData = myApp.formToData('#register-form');
    console.log(formData);
    register.register(formData,function(success){
        if(success){
            setTimeout(function(){
                mainView.router.loadPage('register-success.html');
            },3000);
        }else{
            setTimeout(function(){
                mainView.router.loadPage('register-failed.html');
            },3000);   
        }
    });
});
myApp.onPageInit('register-success',function(page){
    setTimeout(function(){
        mainView.router.loadPage('signin.html');
    },3000);

});
myApp.onPageInit('register-failed',function(page){
    setTimeout(function(){
        mainView.router.loadPage('signin.html');
    },3000);

});

myApp.onPageInit('login-progress',function(page){
    var formData = myApp.formToData('#login-form');
    console.log(formData);
     login.login(formData.email,
                    formData.password,
                    function(success,access_token){
                        if(success){
                            console.log('login success');
                            var current_promo = common.getLocal('current_promo');
                            account.me(function(info){
                                        console.log('account',info);
                                        if(info.status==1){
                                            common.setLocal('customer_account',info.me);
                                            if(typeof current_promo !== 'undefined'){
                                                    setTimeout(function(){
                                                        mainView.router.loadPage('bookhotel.html');
                                                    },3000);
                                                }else{
                                                    setTimeout(function(){
                                                        mainView.router.loadPage('index.html');
                                                    },3000);
                                                }
                                        }else{
                                            console.log('/me account not found');
                                            setTimeout(function(){
                                                mainView.router.loadPage('signin.html');
                                            },3000);
                                        }
                                });
                            
                        }else{
                            console.log('login failed');
                            setTimeout(function(){
                                mainView.router.loadPage('signin.html');
                            },3000);
                        }
                    });
});
myApp.onPageInit('mybooking',function(page){
    booking.list(function(response){
        if(response.status==1){
            for(var i in response.data){
                var chunk = response.data[i].booking_datetime.split(" ");
                response.data[i].booking_date = chunk[0];
                response.data[i].booking_time = chunk[1];
                response.data[i].hotel_name = response.data[i].hotel.name;
            }
            var html = tplBookingList({bookings:response.data});
            $$('.bookings').html(html);
        }
    });
    
});


myApp.onPageInit('bookingdetail',function(page){
    var recent_booking = common.getLocal("recent_booking");
    var booking_id = 0;
    console.log(page.query);
    if(typeof page.query.id !== 'undefined'){
        booking_id = page.query.id;
    }else{
        booking_id = recent_booking.id;
    }
    booking.get(booking_id,function(response){
       if(response.status==1){
        var html = tplBookingInfo({
            bookingData:response.data,
            customerData:response.data.customer,
            promoData:response.data.promo,
            hotelData:response.data.hotel,

        });
        $$(".booking-data").html(html);
        checkin.toQRString(
                    response.data.customer_id,
                    response.data.hotel_id,
                    response.data.promo_id,
                    response.data.id
                ).then(function(qrstring){
                    console.log(qrstring);
                    var qr = new QRious({
                    element: document.getElementById('qr'),
                    value: qrstring
                    });
                  
                    
                }).catch(function(err){
                    
                  console.log(err.message);
                });
        
        
       }
    });
    
});

myApp.onPageInit('submit-bid',function(page){
    var formData = myApp.formToData('#bid-form');
    var customer_account = common.getLocal('customer_account');

     bidding.submit({
            customer_id: customer_account.id,
            customer_name: customer_account.name,
            customer_pic: 'foo.jpg',
            avg_spending: Math.round((formData.start_price+formData.max_price)/2),
            lat: _location.lat,
            lon: _location.lon,
            budget: formData.max_price,
            bid_status: '0'
        }).then(function(success){
            if(success){
                 setTimeout(function(){
                    mainView.router.loadPage('bidresponse.html');
                },3000);
            }else{
                 setTimeout(function(){
                    mainView.router.loadPage('bidfailed.html');
                },3000);
            }
               
        }).catch(function(err){
             setTimeout(function(){
                    mainView.router.loadPage('bidfailed.html');
                },3000);
        });
});

myApp.onPageInit('bidresponse',function(page){
    setTimeout(function(){
                    mainView.router.loadPage('mybidding.html');
                },3000);
});

myApp.onPageInit('mybidding',function(page){
    console.log('mybidding');
    //watchLocation
    common.watchLocation();
    
    bidding.my_biddings(common.location).then(function(bids){
        console.log('bids',bids);
        var html = tplMyBiddings({bids:bids});
        
        $$(".bid-list").html(html);
        return;
    }).catch(function(err){
        return false;
    })
   
    
});

myApp.onPageInit('bidselect',function(page){
    setTimeout(function(){
        mainView.router.loadPage('paybid.html?id='+page.query.id);
    },3000);
   
});
myApp.onPageInit('paybid',function(page){
     bidding.select(page.query.id).then(function(response){
        if(response.status==1){
            setTimeout(function(){
                mainView.router.loadPage('mybooking.html');
            },3000);
        }else{
             setTimeout(function(){
                mainView.router.loadPage('bidselect_failed.html');
            },3000);
        }
    });
});
myApp.onPageInit('bidselect-failed',function(page){
   setTimeout(function(){
    mainView.router.loadPage('mybidding.html');
    },3000);
});
