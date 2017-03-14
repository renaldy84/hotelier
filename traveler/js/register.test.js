
var $$ = Dom7;
var assert = chai.assert;
describe('register',function(){
    it('can validates the inputs',function(){
        var result = register.validateInputs({
            name:'Hotel A',
            phone:'5555656',
            email:'foo@gmail.com',
            password:'111111',
            address:'Lorem Ipsum Street'
        });
        
        assert.equal(result.ok,true);
    });

    it('should fail when the password is less than 6 chars',function(){
        var result = register.validateInputs({
            name:'Hotel A',
            phone:'5555656',
            email:'foo@gmail.com',
            password:'123',
            address:'Lorem Ipsum Street'
        });
        assert.equal(result.ok,false);
    });
    it('should fail when the name is empty',function(){
        var result = register.validateInputs({
            name:'',
            phone:'5555656',
            email:'foo@gmail.com',
            password:'123456',
            address:'Lorem Ipsum Street'
        });
        assert.equal(result.ok,false);
    });
    it('should fail when the email is empty',function(){
        var result = register.validateInputs({
            name:'Hello',
            phone:'5555656',
            email:'',
            password:'123456',
            address:'Lorem Ipsum Street'
        });
        assert.equal(result.ok,false);
    });
    it('should fail when the phone is empty',function(){
        var result = register.validateInputs({
            name:'Hello',
            phone:'',
            email:'foo@gmail.com',
            password:'123456',
            address:'Lorem Ipsum Street'
        });
        assert.equal(result.ok,false);
    });

    it('should fail when address  is empty',function(){
        var result = register.validateInputs({
            name:'Hello',
            phone:'5555656',
            email:'foo@gmail.com',
            password:'123456',
            address:''
        });
        assert.equal(result.ok,false);
    });

    it('can register new account',function(done){
        register.register({
            name:'Test',
            email:Math.ceil(Math.random()*10000)+'@gethotel.com',
            password:'111111',
            phone:Math.ceil(Math.random()*10000),
            address:'jakarta'
        },function(success){
            assert.equal(success,true);
            done();
        });
    });
    it('should fail when registering using the same email',function(done){
        var email = Math.ceil(Math.random()*10000)+'@gethotel.com';
        register.register({
            name:'Test',
            email:email,
            password:'111111',
            phone:Math.ceil(Math.random()*10000),
            address:'jakarta'
        },function(success){
            assert.equal(success,true);
            register.register({
                name:'Test',
                email:email,
                password:'111111',
                phone:Math.ceil(Math.random()*10000),
                address:'jakarta'
            },function(success){
                assert.equal(success,false);
                done();
            });
        });
    });

    
   
});



