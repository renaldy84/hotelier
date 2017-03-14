// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;


//GPS Coordinate
var myLocation = {
  lat:'-6.1995475',
  lon:'106.8660916'
};

//compile templates
var tplPromoItem = Template7.compile($$("#tpl-promo-item").html());
var tplHotelItem = Template7.compile($$("#tpl-hotel-item").html());
var tplAccount = Template7.compile($$("#tpl-account").html());
var tplAddHotel = Template7.compile($$("#tpl-add-hotel").html());
var tplConfirmList = Template7.compile($$("#tpl-confirm-list").html());
var tplBookingInfo = Template7.compile($$("#tpl-booking-info").html());
var tplBidList = Template7.compile($$("#tpl-bid-list").html());
var tplCurrentBidList = Template7.compile($$("#tpl-currentbid-list").html());


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false
});


//set init view
mainView.router.load({
//  url: "dummy-menu.html",
url: "splash.html",
  reload: true
});

//SPLASH
myApp.onPageInit('splash',function(page){
  /*setTimeout(function(){
    //mainView.router.loadPage('login.html');
  },3000);
  */
  account.getInfo(function(info){
    if(info.status==1){
      mainView.router.loadPage('promo.html');
    }else{
      mainView.router.loadPage('login.html');
    }   
  });
});

//LOGIN
myApp.onPageInit('login',function (page){
  $$('.button-fb').on('click',function(){
    myApp.alert('Invalid email address or password. Please try again','');
  });
});

//auth
myApp.onPageInit('auth-loading',function(page){
  var loginData = myApp.formGetData('loginform');
  if(typeof loginData.email !== 'undefined' && typeof loginData.password !== 'undefined'){
    login.login(loginData.email,loginData.password,function(success,access_token){
      console.log(success,access_token);
      
      if(success){
        console.log('go to promo');
        setTimeout(function(){
          mainView.router.loadPage('promo.html');
        },2000);
        
      }else{
        console.log('goto login');
        setTimeout(function(){
          mainView.router.loadPage('login.html');
        },2000);
      }
    });
  }else{
    setTimeout(function(){
          mainView.router.loadPage('login.html');
        },2000);
  }
  
});

//registration submission
myApp.onPageInit('register-loading',function(page){
  var formData = myApp.formGetData('registerform');
  var result = register.validateInputs(formData);
  if(result.ok){
   register.register(formData,
        function(success){
            if(success){
              setTimeout(function(){
                mainView.router.loadPage('register_success.html');
              },2000);          
            }else{
              setTimeout(function(){
                mainView.router.loadPage('register_failed.html');
              },2000);
            }
        });
  }else{
    setTimeout(function(){
      mainView.router.loadPage('register.html');
    },2000);
  }
  
  
});
myApp.onPageInit('register-success',function(page){
  setTimeout(function(){
      mainView.router.loadPage('login.html');
    },3000);
});
myApp.onPageInit('register-failed',function(page){
  setTimeout(function(){
      mainView.router.loadPage('login.html');
    },3000);
});


myApp.onPageInit('promo',function(page){

  promo.list(function(rs){
        if(rs.status==1){
          var html = tplPromoItem({promo:rs.promos});
            $$(".promo-items").html(html);
        }
      
    }); 

});
myApp.onPageInit('hotel',function(page){
  hotel.list(function(rs){
    if(rs.status==1){
      var html = tplHotelItem({hotel:rs.hotel});
      $$(".hotel-items").html(html);
    }
  });
});
//ACCOUNT
myApp.onPageInit('account',function(page){
  var myAccount = common.getLocal('account');
  var html = tplAccount(myAccount);
  $$("#account-form").html(html);
});

//UPDATE ACCOUNT
myApp.onPageInit('update-account',function(page){
  var formData = myApp.formGetData('account-form');
  var myAccount = common.getLocal('account');
  account.update(myAccount.id,
                formData,
    function(success){
        if(success){
          setTimeout(function(){
             mainView.router.loadPage('update_account_success.html');
          },1000);
        }else{
          setTimeout(function(){
             mainView.router.loadPage('update_account_failed.html');
          },1000);
        }
        
    });
});

myApp.onPageInit('update-account-success',function(page){
  setTimeout(function(){
    mainView.router.loadPage("promo.html");
  },3000);
});
myApp.onPageInit('update-account-failed',function(page){
  setTimeout(function(){
    mainView.router.loadPage("promo.html");
  },3000);
});

//NEW PROMO
myApp.onPageInit("new-promo",function(page){
  myApp.alert('Waktu Promo tidak boleh lebih dari 12 jam','');
  hotel.list(function(response){
    var pickerValues = [];
    var pickerDisplayValues = [];
    for(var i in response.hotel){
      pickerValues.push(response.hotel[i].id);
      pickerDisplayValues.push(response.hotel[i].name);
    }
    var pickerHotel = myApp.picker({
      input: '#hotel-picker',
      cols: [
          {
              textAlign: 'center',
              values: pickerValues,
              displayValues: pickerDisplayValues,
              
          }
      ],
      /*formatValue: function(p,values,displayValues){
          return displayValues[0];
      }*/
    });
  });
  

  var time = [
      {
          textAlign: 'center',
          values: ['01.00','02.00','03.00','04.00','05.00','06.00','07.00','08.00','09.00','10.00','11.00','12.00']
      }
  ];

  var ampm = [
    {
      textAlign:'center',
      values : ['AM','PM']
    }
  ];

  var pickerStart= myApp.picker({
    input:'#start-picker',
    rotateEffect: true,
    cols:time
  });

  var pickerStartAm = myApp.picker({
    input:'#start-am',
    rotateEffect:true,
    cols:ampm
  });

  var pickerEnd = myApp.picker({
    input:'#end-picker',
    rotateEffect: true,
    cols:time
  });

  var pickerEndAm = myApp.picker({
    input:'#end-am',
    rotateEffect:true,
    cols:ampm
  });
});

myApp.onPageInit("save-promo",function(page){
  var formData = myApp.formGetData('promo-form');
  if(typeof formData.breakfast !== 'undefined'){
    formData.breakfast = formData.breakfast[0];
  }
  if(typeof formData.early_checkin !== 'undefined'){
    formData.early_checkin = formData.early_checkin[0];
  }
  if(typeof formData.late_checkout !== 'undefined'){
    formData.late_checkout = formData.late_checkout[0];
  }
  if(typeof formData.wifi !== 'undefined'){
    formData.wifi = formData.wifi[0];
  }
  if(typeof formData.pickup_service !== 'undefined'){
    formData.pickup_service = formData.pickup_service[0];
  }
  if(typeof formData.expired_hour !== 'undefined'){
    var dt = new Date();
    var d = dt.getDate();
    var m = dt.getMonth();
    var y = dt.getFullYear();
    if(d<10){
      d = '0'+d;
    }
    if(m<10){
      m += 1;
      m = '0'+m;
    }
    formData.expired_time = y+'-'+m+'-'+d+' '+formData.expired_hour.split('.').join(':');

  }
  promo.create( formData,
            function(rs){
              if(rs.status==1){
                setTimeout(function(){
                  mainView.router.loadPage({
                    url:'save_promo_success.html',
                  });
                },3000);
                
              }else{
                setTimeout(function(){
                  mainView.router.loadPage({
                    url:'save_promo_failed.html',
                  });
                },3000);
              }
            });
});
myApp.onPageInit("save-promo-success",function(page){
  setTimeout(function(){
      mainView.router.loadPage({
        url:'promo.html',
      });
    },3000);
});
myApp.onPageInit("save-promo-failed",function(page){
  setTimeout(function(){
      mainView.router.loadPage({
        url:'promo.html',
      });
    },3000);
});

myApp.onPageInit('confirm',function(page){
  booking.list(function(response){
    var bookings = response.data;
    for(var i in bookings){
      
      bookings[i].pending = false;
      bookings[i].checkedIn = false;
      bookings[i].checkedOut = false;
      if(bookings[i].booking_status==0){
        bookings[i].pending = true;
      }
      if(bookings[i].booking_status==1){
        bookings[i].checkedIn = true;
      }
      if(bookings[i].booking_status==2){
        bookings[i].checkedOut = true;
      }
      var chunks = bookings[i].booking_datetime.split(' '); 
      bookings[i].booking_date = chunks[0].trim();
      bookings[i].booking_time = chunks[1].trim();

      bookings[i].customer_name = bookings[i].customer.name;
      console.log(bookings[i]);
    }
    
    var html = tplConfirmList({bookings:bookings});
    
    $$(".confirm-items").html(html);
  });
});


//checkin
myApp.onPageInit("checkin",function(page){
  var booking_id = page.query.booking_id;
  if(typeof booking_id !== 'undefined'){
    common.setLocal('scan_booking_id',booking_id);
  }else{
    setTimeout(function(){
      mainView.router.loadPage({
        url:'confirm.html',
        animatePages:false
      });
    },1000);
  }
});

//scanning
myApp.onPageInit("scan",function(page){
  if(typeof cordova !== 'undefined'){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        console.log(result.text);
        checkin.scan(result.text)
                .then(function(booking_data){
                  var scan_booking_id = common.getLocal("scan_booking_id");
                  if(booking_data.id == scan_booking_id){
                      common.setLocal("current_booking_data",booking_data);                        
                      setTimeout(function(){
                        mainView.router.loadPage({
                          url:'confirm-checkin.html',
                          animatePages:false
                        });
                      },1000);
                  }else{
                    myApp.alert('Invalid Booking Code','');
                    setTimeout(function(){
                        mainView.router.loadPage({
                          url:'checkin.html?booking_id='+common.getLocal("scan_booking_id"),
                          animatePages:false
                        });
                      },3000);
                  }
                }).catch(function(err){
                  myApp.alert('Invalid Booking Code','');
                  setTimeout(function(){
                        mainView.router.loadPage({
                          url:'checkin.html?booking_id='+common.getLocal("scan_booking_id"),
                          animatePages:false
                        });
                      },3000);
                });
      },
      function (error) {
          alert("Scanning failed: " + error);
          setTimeout(function(){
                        mainView.router.loadPage({
                          url:'checkin.html?booking_id='+common.getLocal("scan_booking_id"),
                          animatePages:false
                        });
                      },3000);
      },
      {
          preferFrontCamera : true, // iOS and Android
          showFlipCameraButton : true, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: true, // Android, launch with the torch switched on (if available)
          prompt : "Place a barcode inside the scan area", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS
      }
   );
  }else{
    /*
    myApp.alert('These device does not support QRCode scanner','');
    setTimeout(function(){
      mainView.router.loadPage({
        url:'promo.html',
        animatePages:false
      });
    },1000);*/

    /* STUB */
    checkin.scan("164|166|136|50")
                .then(function(booking_data){
                     common.setLocal("current_booking_data",booking_data);                        
                      setTimeout(function(){
                        mainView.router.loadPage({
                          url:'confirm-checkin.html',
                          animatePages:false
                        });
                      },1000);
                });

    /*/STUB */

    
  }
});
//CONFIRM CHECKIN
myApp.onPageInit("confirm-checkin",function(page){
  /*
  myApp.modal({
    title:  '',
    text: '<p style="padding:10px 20px 10px 20px;font-size:20px;">Can\'t Recognize QR Code</p>',
    buttons: [
      {
        text: 'Try Again',
        onClick: function() {
          mainView.router.loadPage('confirm-loading.html');
        }
      },
      {
        text: '<span class="gray">Cancel</span>',
        onClick: function() {

        }
      },
    ]
  });*/

  var current_booking_data = common.getLocal('current_booking_data');
  var chunks = current_booking_data.booking_datetime.split(' '); 
      current_booking_data.booking_date = chunks[0].trim();
      current_booking_data.booking_time = chunks[1].trim();
  
  var html = tplBookingInfo({
                            booking:current_booking_data,
                            customer:current_booking_data.customer,
                            promo:current_booking_data.promo
                          });

  $$('.confirm-checkin').html(html);
});


myApp.onPageInit("confirm-loading",function(page){

  //@TODO clean up current_booking_data and scan_booking_id from localStorage

  booking.checkedin(common.getLocal("scan_booking_id"),function(response){
      if(response.status==1){
        setTimeout(function(){
          mainView.router.loadPage({
            url:'confirm.html',
            animatePages:false
          });
        },3000);
      }else{
        setTimeout(function(){
          mainView.router.loadPage({
            url:'checkin_failed.html',
            animatePages:false
          });
        },3000);
      }
      
  });
  
});
//add hotel

myApp.onPageInit("add-hotel",function(page){
  //watchLocation
  common.watchLocation();

  var html = tplAddHotel();
  $$("#hotel-form").html(html);


  //init map
  common.getLocation().then(function(myLocation){
        var location = {lat: myLocation.lat, lng: myLocation.lon};
        var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: location
        });
        //init marker
        var marker = new google.maps.Marker({
          map:map,
          title:'Location'
        });

        // add listener
        google.maps.event.addListener(map, 'click', function(event) {
          setMarker(event.latLng);
        });

        //callback listener
        function setMarker(location) {
          //add marker
          marker.setMap(null);
          marker = new google.maps.Marker({
              position: location,
              map: map,
          });
          map.setCenter(location);
          map.setZoom(15);

          //change value
          $$(".lat").children('p').text(location.lat());
          $$(".lat").children('input').val(location.lat());
          $$(".lng").children('p').text(location.lng());
          $$(".lng").children('input').val(location.lng());
        }
  }).catch(function(err){
    myApp.alert('Cannot find your location. Please make sure the GPS is enabled !','');
  });
  



  // Widget Bintang
  var starinput = $$('#star-input');
  var input = $$('#star-input').children('input');
  var stars = starinput.children('.stars').children('.star');

  //grab all stars
  for(i=0;i<stars.length;i++){
    (function(i){
      stars[i].addEventListener('click',function(){
        changeStar(i);
      },false);
    }(i));
  }

  //change star color
  function changeStar(i){
    console.log('bintang ke '+i+' di klik');
    input.val(i);
    for(j=0;j<stars.length;j++){
      if(j<=i){
        $$(stars[j]).removeClass('gray');
        $$(stars[j]).addClass('yellow');
      }else{
        $$(stars[j]).removeClass('yellow');
        $$(stars[j]).addClass('gray');
      }
    }
  }

});

//saving hotel information
myApp.onPageInit("save-hotel",function(page){
  var formData = myApp.formGetData('hotel-form');
  
  var myAccount = common.getLocal('account');
  
  formData.account_id = myAccount.id;
  
  hotel.create( formData ,function(rs){
        
        if(rs.status==1){
          setTimeout(function(){
            mainView.router.loadPage("save_hotel_success.html");
          },3000);
        }else{
          setTimeout(function(){
            mainView.router.loadPage("save_hotel_failed.html");
          },3000);
        }
    });
  

});
  
myApp.onPageInit('save-hotel-success',function(page){
  setTimeout(function(){
    console.log('back to hotel list');
      mainView.router.loadPage("hotel.html");
  },3000);  
});
myApp.onPageInit('save-hotel-failed',function(page){
  setTimeout(function(){
    console.log('back to hotel list');
      mainView.router.loadPage("hotel.html");
  },3000);  
});

//saving hotel information

//BIDDINGS
myApp.onPageInit('bids',function(page){
  common.getLocation()
  .then(bidding.available)
  .then(function(bids){
    var has_bids = false;
    if(bids.length > 0){
      has_bids = true;
    }
    var html = tplBidList({
      bids:bids,
      has_bids:has_bids
    });
    $$(".bid-list").html(html);
  
}).catch(function(err){
    myApp.alert('Sorry, there is no bidding at the  moment','');
     setTimeout(function(){
        mainView.router.loadPage("promo.html");
    },3000); 
  });  
  
});
myApp.onPageInit('make_bid',function(page){
  var bid_id = page.query.id;
  common.setLocal('selected_bid_id',bid_id);

});
myApp.onPageInit('save-bid',function(page){
  var bid_id = common.getLocal("selected_bid_id");
  var formData = myApp.formGetData('bid-form');
  bidding.bid(bid_id,formData.price).then(function(success){
    if(success){
      setTimeout(function(){
        mainView.router.loadPage("save_bid_success.html");
      },3000);
    }else{
      setTimeout(function(){
        mainView.router.loadPage("save_bid_failed.html");
      },3000);
    }
    return;
  }).catch(function(err){
    setTimeout(function(){
        mainView.router.loadPage("save_bid_failed.html");
      },3000);
    return;
  });
  
});
myApp.onPageInit("save-bid-success",function(page){
   setTimeout(function(){
        mainView.router.loadPage("bids.html");
      },3000);
});
myApp.onPageInit("save-bid-failed",function(page){
   setTimeout(function(){
        mainView.router.loadPage("bids.html");
      },3000);
});


myApp.onPageInit('bids-current',function(page){
   bidding.list().then(function(bids){
        var has_bids = false;
        if(bids.length > 0){
          has_bids = true;
        }
        var html = tplCurrentBidList({
          bids:bids,
          has_bids:has_bids
        });
        $$(".currentbid-list").html(html);
    }).catch(function(err){
       setTimeout(function(){
          mainView.router.loadPage("bids.html");
        },3000);
    });  
  
});
//-Biddings