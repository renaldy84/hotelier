
var $$ = Dom7;
var assert = chai.assert;
describe('customer',function(){
    it('can create customer account',function(done){
        var email = Math.ceil(Math.random()*10000)+'@igethotel.com';
        customer.create({ 
            name: 'Jane Doe',
            phone: '123123123123',
            email: email,
            password: '111111',
            address: 'jakarta',
            npwp: '123123123',
            ktp: '443232432432' },
            function(response){
                assert.equal(response.status,1);
                done();
            });
    });
    it('can list customer',function(done){
        customer.list(function(response){
            
            assert.property(response,'status');
            assert.property(response,'data');
            assert.notEqual(response.data.length,0);
            done();
        });
    });
});




