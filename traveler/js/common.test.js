
var $$ = Dom7;
var assert = chai.assert;
describe('common',function(){
    it('can set access_token',function(){
       common.setAccessToken('12345');
        assert.equal(common.getAccessToken(),'12345');
    });
    
    it('it can store something in the localStorage',function(){
        common.setLocal('foo','bar');
        assert.equal(common.getLocal('foo'),'bar');
        common.setLocal('test',{status:1});
        var o = common.getLocal('test');
        
        assert.equal(o.status,1);
    });
});



