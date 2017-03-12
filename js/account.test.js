
var $$ = Dom7;
var assert = chai.assert;

describe('account',function(){
  it('can retrieve /me',function(done){
    account.me(function(info){
      assert.equal(info.status,1);
      assert.property(info,'me');
      assert.property(info.me,'id');
      assert.property(info.me,'name');
      done();
    });
  });
  it('can retrieve account information',function(done){
    account.getInfo(function(info){
      assert.equal(info.status,1);
      assert.property(info,'account');
      assert.property(info.account,'id');
      assert.property(info.account,'name');
      assert.property(info.account,'hotel');
      done();
    });
  });

  it('can update the account information',function(done){
      var newName = 'customer '+Math.ceil(Math.random()*9999);
      account.getInfo(function(info){
        account.update(info.account.id,{
            name:newName,
            email:info.account.email,
            phone:info.account.phone,
            address:info.account.address,
        },function(success){
            assert.equal(success,true);
            account.getInfo(function(info){
                assert(info.account.name,newName);
                done();
            });
            
        });
      });
      
  });

});


