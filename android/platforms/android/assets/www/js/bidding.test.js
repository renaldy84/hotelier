
var $$ = Dom7;
var assert = chai.assert;


describe("bidding",function(){
    it('can post a bid',function(){
        bidding.submit({
            customer_id: '111',
            customer_name: 'Hana',
            customer_pic: 'foo.jpg',
            avg_spending: '250000',
            lat: '-6.2000595',
            lon: '106.8827428',
            budget: '300000',
            bid_status: '0'
        }).then(function(success){
            assert.equal(success,true);
               return;
        }).catch(function(err){
            assert.equal(err,null);
            return;
        });
    });
    it('can retrieve available biddings',function(){
        bidding.available({lat:-6.2000595,lon:106.8827428}).then(function(bids){
            assert.notEqual(bids.length,0);
            return;
        }).catch(function(err){
            return;
        });
    });
  
    it('can bid',function(){
        bidding.available().then(function(bids){
            var bid_id = bids[bids.length-1].id;
            bidding.bid(bid_id,100000).then(function(success){
                assert.equal(success,true);
                return;
            }).catch(function(err){
                assert.equal(err,null);
                return;
            });

        });
    });
    it('can retrieve the current bidding list',function(){

        bidding.list().then(function(bids){
            assert.notEqual(bids.length,0);
            return;
        }).catch(function(err){
            assert.equal(err,null);
            return;
        });
    });

    
});