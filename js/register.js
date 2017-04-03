
var register = {};

register.register = function(data,callback){
    var check = this.validateInputs(data);

    
    if(check.ok){
        var apiUrl = config.apiUrl+api.register;
        $$.post(apiUrl,data,function(body,status,xhr){
            var rs = JSON.parse(body);
            if(rs.status==1){
                callback(true);
            }else{
                callback(false);
            }
        },function(xhr,status){
            common.handleAjaxError(xhr,status).then(function(){
                callback(false);
            });
            
        });
    }else{
        callback(false);
    }
}
register.validateInputs = function(data){
    
    if(data.name.length == 0) return {ok:false,reason:'Nama Anda harus diisi !'};
    if(data.email.length == 0) return {ok:false,reason:'Email Anda harus diisi !'};;
    if(data.password.length < 6)  return {ok:false,reason:'Password  harus diisi minimal 6 karakter!'};
    if(data.phone.length == 0)  return {ok:false,reason:'Nomor Telepon yang bisa dihubungi harus diisi !'};
    if(data.address.length == 0)  return {ok:false,reason:'Mohon isi alamat anda !'};

    return {ok:true,reason:''};
}