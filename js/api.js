
/*
var api = {
    login:'/v1/login',
    register:'/v1/register',
    forgot_password:'/v1/forgot_password',
    getHotel:'/v1/hotel/get',
    me:'/v1/me',
    listHotels:'/v1/hotel/list',
    addHotel:'/v1/hotel/add',
    updateHotel:'/v1/hotel/update',
    deleteHotel:'/v1/hotel/delete',
    listPromo:'/v1/promo/list',
    addPromo:'/v1/promo/add',
    getPromo:'/v1/promo/get',
    deletePromo:'/v1/promo/delete',
    listBookings:'/v1/booking/list',
    getBooking:'/v1/booking/get',
    updateBooking:'/v1/booking/update',
    availableBiddings:'/v1/biddings/available',
    currentBiddings:'/v1/biddings/list',
    viewBid:'/v1/biddings/view',
    bid:'/v1/bid',
    updateAccount:'/v1/account/update',
};
*/

var api = {
    login:'/auth',
    register:'/api/hotelier/register',
    forgot_password:'/v1/forgot_password',
    getHotel:'/hotelier/hotel',
    me:'/me',
    listHotels:'/hotelier/hotel',
    addHotel:'/hotelier/hotel',
    updateHotel:'/hotelier/hotel/update',
    deleteHotel:'/hotelier/hotel/delete',
    listPromo:'/hotelier/promo',
    addPromo:'/hotelier/promo',
    getPromo:'/hotelier/promo',
    deletePromo:'/hotelier/promo/delete',
    updatePromo:'/hotelier/promo/update',
    listBookings:'/hotelier/bookings',
    getBooking:'/hotelier/bookings',
    updateBooking:'/v1/booking/update',
    //BIDDINGS
    availableBiddings:'/hotelier/biddings/available',
    currentBiddings:'/hotelier/biddings/list',
    viewBid:'/hotelier/biddings/view',
    make_bid:'/hotelier/biddings/bid',
    submitBid:'/hotelier/biddings/submit',
    cancelBid:'/hotelier/biddings/bid_canceled',
    //-->
    updateAccount:'/hotelier/account/update',
    accountGetInfo:'/hotelier/account',
    customerInfo:'/v1/customer',
    addCustomer:'/api/customer/register',
    listCustomer:'/api/customer',
    addBooking:'/hotelier/bookings',
    checkedin:'/hotelier/bookings/checkedin',
    closeBooking:'/hotelier/bookings/close',
};