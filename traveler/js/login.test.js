
var $$ = Dom7;
var assert = chai.assert;
describe('login',function(){
    it('can login',function(done){
        login.login('test@gethotel.com',
                    '111111',
                    function(success,access_token){
                        assert.equal(success,true);
                        assert.notEqual(access_token,false);
                        done();
                    });
    });

    it('should failed when login with wrong creds',function(done){
        login.login('foo',
                    'bar',
                    function(success,access_token){
                        assert.equal(success,false);
                        assert.equal(access_token,false);
                        done();
                    });
    });
   
});



