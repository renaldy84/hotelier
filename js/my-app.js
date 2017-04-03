// Initialize your app
var myApp = new Framework7(
  {template7Pages: true }
);

// Export selectors engine
var $$ = Dom7;



//GPS Coordinate
var myLocation = {
  lat:'-6.1995475',
  lon:'106.8660916'
};

var is_first_timer = false;

//compile templates
var tplPromoItem = Template7.compile($$("#tpl-promo-item").html());
var tplHotelItem = Template7.compile($$("#tpl-hotel-item").html());
var tplAccount = Template7.compile($$("#tpl-account").html());
var tplAddHotel = Template7.compile($$("#tpl-add-hotel").html());
var tplEditHotel = Template7.compile($$("#tpl-edit-hotel").html());
var tplConfirmList = Template7.compile($$("#tpl-confirm-list").html());
var tplBookingInfo = Template7.compile($$("#tpl-booking-info").html());
var tplBidList = Template7.compile($$("#tpl-bid-list").html());
var tplCurrentBidList = Template7.compile($$("#tpl-currentbid-list").html());


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: false
});


common.myApp = myApp;
common.mainView = mainView;

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
  },2000);
  */
  /*
  account.getInfo(function(info){
    setTimeout(function(){
      if(info.status==1){
        mainView.router.loadPage('promo.html');
      }else{
        mainView.router.loadPage('login.html');
      } 
    },1000);
  });*/
});
myApp.onPageInit("init-app",function(page){
  account.getInfo(function(info){
    setTimeout(function(){
      if(info.status==1){
        if(info.account.hotel.length > 0){
          mainView.router.loadPage('promo.html');
        }else{
          mainView.router.loadPage('add-hotel.html');
        }
      }else{
        mainView.router.loadPage('login.html');
      } 
    },1000);
  });
});
//LOGIN
myApp.onPageInit('login',function (page){
  $$('.button-fb').on('click',function(){
    myApp.alert('Facebook Connect is not enabled yet.','');
  });
});
//LOGOUT
myApp.onPageInit('logout',function(page){
  common.setLocal('access_token',null);
  common.setLocal('account',null);
  setTimeout(function(){
    mainView.router.loadPage('login.html');
  },2000);
});
//auth
myApp.onPageInit('auth-loading',function(page){
  var loginData = myApp.formGetData('loginform');
  if(typeof loginData.email !== 'undefined' && typeof loginData.password !== 'undefined'){
    login.login(loginData.email,loginData.password,function(success,access_token){
      console.log(success,access_token);
      
      if(success && access_token.length > 0){
        common.setLocal('account',null);
        account.getInfo(function(info){
          setTimeout(function(){
            if(info.status==1){
              if(info.account.hotel.length > 0){
                is_first_timer = false;
                mainView.router.loadPage('promo.html');
              }else{
                mainView.router.loadPage('add-hotel.html');
                is_first_timer = true;
              }
            }else{
              mainView.router.loadPage('login.html');
            } 
          },1000);
        });
       
        
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
    },2000);
});
myApp.onPageInit('register-failed',function(page){
  setTimeout(function(){
      mainView.router.loadPage('login.html');
    },2000);
});


myApp.onPageInit('promo',function(page){
  common.currentPageUrl = page.url;

  promo.list(function(rs){
        if(rs.status==1){
          var html = tplPromoItem({promo:rs.promos});
            $$(".promo-items").html(html);
        }
      
    }); 

});
myApp.onPageInit('hotel',function(page){
  common.currentPageUrl = page.url;
  hotel.list(function(rs){
    if(rs.status==1){
      var html = tplHotelItem({hotel:rs.hotel});
      $$(".hotel-items").html(html);
      
    }
  });
});
//ACCOUNT
myApp.onPageInit('account',function(page){
  common.currentPageUrl = page.url;
  var myAccount = common.getLocal('account');
  var html = tplAccount(myAccount);
  $$("#account-form").html(html);
});

//UPDATE ACCOUNT
myApp.onPageInit('update-account',function(page){
  common.currentPageUrl = page.url;
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
  },2000);
});

myApp.onPageInit('update-account-failed',function(page){
  common.currentPageUrl = page.url;
  setTimeout(function(){
    mainView.router.loadPage("promo.html");
  },2000);
});

//NEW PROMO
myApp.onPageInit("new-promo",function(page){
  common.currentPageUrl = page.url;
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
  common.currentPageUrl = page.url;
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
                },2000);
                
              }else{
                setTimeout(function(){
                  mainView.router.loadPage({
                    url:'save_promo_failed.html',
                  });
                },2000);
              }
            });
});
myApp.onPageInit("save-promo-success",function(page){
  common.currentPageUrl = page.url;
  setTimeout(function(){
      mainView.router.loadPage({
        url:'promo.html',
      });
    },2000);
});
myApp.onPageInit("save-promo-failed",function(page){
  common.currentPageUrl = page.url;
  setTimeout(function(){
      mainView.router.loadPage({
        url:'promo.html',
      });
    },2000);
});

myApp.onPageInit('confirm',function(page){
  common.currentPageUrl = page.url;
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
  common.currentPageUrl = page.url;
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
  common.currentPageUrl = page.url;
  if(typeof cordova !== 'undefined'){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        console.log('scan result',result.text);
        checkin.scan(result.text)
                .then(function(booking_data){
                  console.log('scan success',booking_data);
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
                      },2000);
                  }
                }).catch(function(err){
                  console.log(err);
                  myApp.alert('Invalid Booking Code','');
                  setTimeout(function(){
                        mainView.router.loadPage({
                          url:'checkin.html?booking_id='+common.getLocal("scan_booking_id"),
                          animatePages:false
                        });
                      },2000);
                });
      },
      function (error) {
          alert("Scanning failed: " + error);
          setTimeout(function(){
                        mainView.router.loadPage({
                          url:'checkin.html?booking_id='+common.getLocal("scan_booking_id"),
                          animatePages:false
                        });
                      },2000);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : false, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
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
                }).catch(function(err){
                   console.log(err);
                    myApp.alert('Invalid Booking Code','');
                    setTimeout(function(){
                          mainView.router.loadPage({
                            url:'confirm.html?booking_id='+common.getLocal("scan_booking_id"),
                            animatePages:false
                          });
                        },2000);
                });

    /*/STUB */

    
  }
});
//CONFIRM CHECKIN
myApp.onPageInit("confirm-checkin",function(page){
  common.currentPageUrl = page.url;
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
common.currentPageUrl = page.url;
  //@TODO clean up current_booking_data and scan_booking_id from localStorage

  booking.checkedin(common.getLocal("scan_booking_id"),function(response){
      if(response.status==1){
        setTimeout(function(){
          mainView.router.loadPage({
            url:'confirm.html',
            animatePages:false
          });
        },2000);
      }else{
        setTimeout(function(){
          mainView.router.loadPage({
            url:'checkin_failed.html',
            animatePages:false
          });
        },2000);
      }
      
  });
  
});
//add hotel
var closeMap = function(){
  $$(".view-main").show();
  $$(".panel").show();
  $$(".view-map").hide();
}
myApp.onPageInit("add-hotel",function(page){
  common.currentPageUrl = page.url;
  //watchLocation
  //common.watchLocation();

  var html = tplAddHotel();
  $$("#hotel-form").html(html);
  $$(".panel").show();
  if(is_first_timer){
    $$(".btn-back-hotel").hide();
  }else{
    $$(".btn-back-hotel").show();
  }
  $$(".set-hotel-location").click(function(){
    
    //hide the mainview, and display the map view
    $$(".view-main").hide();
    $$(".panel").hide();
    $$(".view-map").show();
    $$("#map-block").css('height',$$(window).height()+'px');
    //then we detect the GPS location and render the map.
    common.getLocation()
      .then(function(myLocation){
        map.isAvailable('map-block',function(err,id){
          map.loadMap(id,function(err,mapReady){

            //register MAP_CLICK event
             map.mapInstance.addEventListener(plugin.google.maps.event.MAP_CLICK,
              function(clickLocation){
                  map.setLocation({lat:clickLocation.lat,lon:clickLocation.lng},
                  function(err,newLocation){
                    console.log('new location');
                    if(!err){
                      $$(".lat").children('p').text(newLocation.lat);
                      $$(".lat").children('input').val(newLocation.lat);
                      $$(".lng").children('p').text(newLocation.lng);
                      $$(".lng").children('input').val(newLocation.lng);    
                    }else{
                      console.log('error:',err.message);
                    }
                  });
              });

              //setlocation at once
              map.setLocation(myLocation,function(err,newLocation){
                console.log('tell location');
                $$(".lat").children('p').text(newLocation.lat);
                $$(".lat").children('input').val(newLocation.lat);
                $$(".lng").children('p').text(newLocation.lng);
                $$(".lng").children('input').val(newLocation.lng);
              });
          });
        });
     
     }).catch(function(err){
       myApp.alert('Cannot find your location. Please make sure the GPS is enabled !','');
     });
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
  common.currentPageUrl = page.url;
  var formData = myApp.formGetData('hotel-form');
  
  var myAccount = common.getLocal('account');
  
  formData.account_id = myAccount.id;
  if(formData.lat==0 || formData.lon == 0){
    //fallback if the user failed to mark a location / load gps location
    setTimeout(function(){
            mainView.router.loadPage("add-hotel.html");
            myApp.alert("Sorry, you must specify your hotel location ! Please wait until the map is loading, it may take a litle while depending on your GPS Signal.");
    },2000);
  }else{
    hotel.create( formData ,function(rs){
        
        if(rs.status==1){
          setTimeout(function(){
            mainView.router.loadPage("save_hotel_success.html");
          },2000);
        }else{
          setTimeout(function(){
            mainView.router.loadPage("save_hotel_failed.html");
          },2000);
        }
    });
  }
  
  

});
  
myApp.onPageInit('save-hotel-success',function(page){
  common.currentPageUrl = page.url;
  setTimeout(function(){
    console.log('back to hotel list');
      mainView.router.loadPage("hotel.html");
  },2000);  
});
myApp.onPageInit('save-hotel-failed',function(page){
  setTimeout(function(){
    console.log('back to hotel list');
      mainView.router.loadPage("hotel.html");
  },2000);  
});

//saving hotel information

//edit hotel
myApp.onPageInit('edit-hotel',function(page){
  common.currentPageUrl = page.url;

  var formData = myApp.formDeleteData('edithotel-form');
  
  if(typeof page.query.id === 'undefined'){
    myApp.alert('The hotel data is not exist !');
      setTimeout(function(){
          mainView.router.loadPage("hotel.html");
      },2000);  
    return;
  }
  
  
  hotel.get(page.query.id,function(response){
    
    if(response.status==1){
      response.data.screenwidth = $$(window).width();
      response.data.screenheight = $$(window).height();
      if($$(window).width() < 640){
        response.data.imageSize = 'large';
      }else{
        response.data.imageSize = 'original';
      }
      response.data.imgUrl = config.imgUrl+'/'+response.data.imageSize+'/';
      var html = tplEditHotel(response.data);
      $$(".edithotel-form-content").html(html);  
        response.data.hotel_id = response.data.id;
        
        myApp.formStoreData('edithotel-form',response.data);    
        
        setupEditHotelContent(response.data);    
    }else{
      myApp.alert('Cannot retrieve hotel information !');
      setTimeout(function(){
        
          mainView.router.loadPage("hotel.html");
      },2000);  
    }
  });   
  
  
});

myApp.onPageInit('update-hotel',function(page){
  var formData = myApp.formGetData('edithotel-form');
  console.log(formData);
  
  
  hotel.update(formData.hotel_id,
                formData
        ,function(rs){
            if(rs.status){
              setTimeout(function(){
                mainView.router.loadPage("update_hotel_success.html");
              },2000);
            }else{
              setTimeout(function(){
                mainView.router.loadPage("update_hotel_failed.html");
              },2000);
            }    
        });
});
myApp.onPageInit('update-hotel-success',function(page){
  setTimeout(function(){
                mainView.router.loadPage("hotel.html");
              },2000);
});
myApp.onPageInit('update-hotel-failed',function(page){
  setTimeout(function(){
                mainView.router.loadPage("hotel.html");
              },2000);
});
var setupEditHotelContent = function(data){
  //init map
  //common.getLocation().then(function(myLocation){
        if (data.stars == 0) data.stars = 1;

        $$(".set-hotel-location").click(function(){
    
          //hide the mainview, and display the map view
          $$(".view-main").hide();
          $$(".panel").hide();
          $$(".view-map").show();
          $$("#map-block").css('height',$$(window).height()+'px');
          //then we detect the GPS location and render the map.
          
              map.isAvailable('map-block',function(err,id){
                map.loadMap(id,function(err,mapReady){

                  //register MAP_CLICK event
                  map.mapInstance.addEventListener(plugin.google.maps.event.MAP_CLICK,
                    function(clickLocation){
                        map.setLocation({lat:clickLocation.lat,lon:clickLocation.lng},
                        function(err,newLocation){
                          console.log('new location');
                          if(!err){
                            $$(".lat").children('p').text(newLocation.lat);
                            $$("input[name=lat]").val(newLocation.lat);
                            $$(".lng").children('p').text(newLocation.lng);
                            $$("input[name=lon]").val(newLocation.lng); 
                            
                            //hidden fields cannot trigger the formStoreData, so we do it manually
                            myApp.formStoreData("edithotel-form",myApp.formToData("#edithotel-form"));
                            
                          }else{
                            console.log('error:',err.message);
                          }

                        });
                    });

                    //setlocation at once
                    map.setLocation({lat:data.lat,lon:data.lon},function(err,newLocation){
                      console.log('tell location');
                      $$(".lat").children('p').text(newLocation.lat);
                      $$("input[name=lat]").val(newLocation.lat);
                      $$(".lng").children('p').text(newLocation.lng);
                      $$("input[name=lon]").val(newLocation.lng);
                      //hidden fields cannot trigger the formStoreData, so we do it manually
                      console.log('formToData',myApp.formToData("#edithotel-form"));
                      
                     
                    });
                });
              });
        });

          
         
        
 // }).catch(function(err){
    //myApp.alert('Cannot find your location. Please make sure the GPS is enabled !','');
  //});
  



  // Widget Bintang
  var starinput = $$('#star-input');
  var input = $$('#star-input').children('input');
  var stars = $$('.star.star-item');

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
    $$('input[name=stars]').val(i+1);
    for(j=0;j<stars.length;j++){
      if(j<=i){
        $$(stars[j]).removeClass('gray');
        $$(stars[j]).addClass('yellow');
      }else{
        $$(stars[j]).removeClass('yellow');
        $$(stars[j]).addClass('gray');
      }
    }
    //hidden fields cannot trigger the formStoreData, so we do it manually
    myApp.formStoreData("edithotel-form",myApp.formToData("#edithotel-form"));
  }
  changeStar(data.stars-1);
}
//-->

//add hotel photo
myApp.onPageInit("add-hotel-photo",function(page){
  $$(".btn-camera").on("click",function(){
    common.setLocal("current_hotel_id",page.query.id);
    hotel_photo.take_photo_from_camera(page.query.id,myApp,mainView)
    .then(function(){
      console.log('success photo');
    }).catch(function(err){
      console.log('photo failed ',err.message);
    });
  
  });
  $$(".btn-gallery").on("click",function(){
    common.setLocal("current_hotel_id",page.query.id);
    hotel_photo.take_photo_from_gallery(page.query.id,myApp,mainView)
    .then(function(){
      console.log('success photo');
    }).catch(function(err){
      console.log('photo failed ',err.message);
    });
  
  });
});
myApp.onPageInit("upload-hotel-photo-failed",function(page){
  var hotel_id = common.getLocal("current_hotel_id");
  if(typeof hotel_id !== 'undefined'){
    setTimeout(function(){
        mainView.router.loadPage("edit_hotel.html?id="+hotel_id);
    },3000); 
  }else{
    setTimeout(function(){
        mainView.router.loadPage("hotel.html");
    },3000); 
  }
  
});

//BIDDINGS
myApp.onPageInit('bids',function(page){
  common.currentPageUrl = page.url;
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
    },2000); 
  });
  
});
myApp.onPageInit('make_bid',function(page){
  common.currentPageUrl = page.url;
  var bid_id = page.query.id;
  common.setLocal('selected_bid_id',bid_id);

});
myApp.onPageInit('save-bid',function(page){
  common.currentPageUrl = page.url;
  var bid_id = common.getLocal("selected_bid_id");
  var formData = myApp.formGetData('bid-form');
  bidding.bid(bid_id,formData.price).then(function(success){
    if(success){
      setTimeout(function(){
        mainView.router.loadPage("save_bid_success.html");
      },2000);
    }else{
      setTimeout(function(){
        mainView.router.loadPage("save_bid_failed.html");
      },2000);
    }
    return;
  }).catch(function(err){
    setTimeout(function(){
        mainView.router.loadPage("save_bid_failed.html");
      },2000);
    return;
  });
  
});
myApp.onPageInit("save-bid-success",function(page){
  common.currentPageUrl = page.url;
   setTimeout(function(){
        mainView.router.loadPage("bids.html");
      },2000);
});
myApp.onPageInit("save-bid-failed",function(page){
  common.currentPageUrl = page.url;
   setTimeout(function(){
        mainView.router.loadPage("bids.html");
      },2000);
});


myApp.onPageInit('bids-current',function(page){
  common.currentPageUrl = page.url;
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
        },2000);
    });  
  
});
//-Biddings