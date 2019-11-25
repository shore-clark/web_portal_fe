function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
    isCompatible = true;
    }
    return isCompatible;
}

function UploadIt(buttonID) {
  var fileUpload = document.getElementById(buttonID);
  var allowedFiles = ['.csv'];
  var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + allowedFiles.join('|') + ")$"); // /^([a-zA-Z0-9()\s_\\.\-:])+(.csv)$/;  
  if (regex.test(fileUpload.value.toLowerCase())) {
      if (typeof (FileReader) != "undefined") {
          var reader = new FileReader();
          reader.onload = function (e) {
              var lines=e.target.result.split('\r');
              for(let i = 0; i<lines.length; i++){
              lines[i] = lines[i].replace(/\n/,'')//delete all blanks
              }
              var result = [];

              var headers=lines[0].split(",");

                $('.nav-tabs').find('.nav-item').each(function(){
                    if($(this).hasClass('active')){
                         var dataAttr = $(this).attr('dataAttr');
                        if($(this).attr('data-attr') == 'occ_description' && headers.indexOf('"OCC Description"')> 1){
                                for(var i=1;i<lines.length;i++){

                                  var obj = {};
                                  var currentline=lines[i].split(",");

                                  for(var j=0;j<headers.length;j++){
                                      obj[headers[j]] = currentline[j];
                                  }
                                  
                                  result.push(obj);
                                  

                              }
                         }
                         else if($(this).attr('data-attr') == 'call_usage_type' && headers.indexOf('"Call & Usage Type"')> 1){
                             for(var i=1;i<lines.length;i++){

                                  var obj = {};
                                  var currentline=lines[i].split(",");

                                  for(var j=0;j<headers.length;j++){
                                      obj[headers[j]] = currentline[j];
                                  }
                                  
                                  result.push(obj);
                                  

                              }
                        }
                         else if($(this).attr('data-attr') == 'charge_type_description' && headers.indexOf('"Charge Type Description"')> 1){
                              for(var i=1;i<lines.length;i++){

                                  var obj = {};
                                  var currentline=lines[i].split(",");

                                  for(var j=0;j<headers.length;j++){
                                      obj[headers[j]] = currentline[j];
                                  }
                                  
                                  result.push(obj);
                                  

                              }
                         }
                         else{
                             alert('Make sure your file matched with active category!');
                             $('input[type=file]').val('');
                         }
                     }
                })
              
              var lastItem = result.pop();

              var parseJson = JSON.stringify(result);
              var strJson = parseJson.replace(/\\"/g, "");

              $('#jsonOutput').append(strJson);
             
              return JSON.stringify(result); //JSON
          }
          reader.readAsText(fileUpload.files[0]);
      } else {
          alert("This browser does not support HTML5.");
      }
  } else {
      alert("Please upload a valid CSV file.");
  }
}

function checkUrlParam(urlParam){
    if(urlParam.indexOf('organization') > -1){
        $('#org').addClass('active');
    }
    else if(urlParam.indexOf('dashboard') > -1){
        $('#dashboard').addClass('active');
    }
    else if(urlParam.indexOf('upload') > -1){
        $('#upload').addClass('active');
    }

}
function alertStatus(status){
    var userformdiv = $('#userformdiv');
    userformdiv.empty();
    userformdiv.prepend(
        '<div class="row form-group">'+
        '<div class="col col-md-12">'+
        '<div class="alert alert-danger" role="alert">' + status.replace(/\n/g, "<br>") + '</div>'+
        '</div></div>'
    );
}
function organizationControls(){
 $("#submitOrganization").click(function(){
    var txtOrg = $('#orgname');
    var org = txtOrg.val();
    //console.log(org + " " + sessionStorage.getItem('token'));
    $.ajax({
        type: 'POST',
        data:{
            name: org,
            token: sessionStorage.getItem('token')
        },

        url: 'http://10.128.251.13/web/web_portal_be/api/organization',
        beforeSend: function( textStatus ) {
           $('#submitOrganization').text('');
           $('#submitOrganization').append('Adding Organization <i class="fa fa-spinner fa-pulse"></i>');

        },
        success: function(data, textStatus ){
            //console.log(JSON.stringify(data));
            alert("Successfully added organization!");

            $.ajax({
                type: 'POST',
                data:{
                    token: sessionStorage.getItem('token'),
                    url: window.location.pathname
                },

                url: 'getData.php',
                success: function(data, textStatus ){
                    $('#data-table').empty();
                    $('#data-table').prepend(data);
                },
                error: function(xhr, textStatus, errorThrown){
                   $('#submitOrganization').text('Submit');

                }
            });
            $('#submitOrganization').text('Submit');
            $('#orgname').val('');

        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');
           $('#orgname').val('');

        }
    });

});

 $("#submitUser").click(function(){
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var userRole = $('#drpdownRole').val();
    var userOrg = $('#drpdownOrg').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var username = $('#username').val();
    var matched = $('#confirmpass').val();
    if(password != matched){
        alertStatus("Password did not match");
    }
    else if($('#drpdownOrg').val() == 0 || $('#drpdownRole').val() == 0){
        if($('#drpdownOrg').val() == 0){
            alertStatus("Organization must not be empty");
        }
        else if($('#drpdownRole').val() == 0){
            alertStatus("User role must not be empty");
        }
    }
    else{
            $.ajax({
                type: 'POST',
                data:{
                    username: username,
                    first_name: firstname,
                    last_name: lastname,
                    email: email,
                    organization_id: userOrg,
                    role: userRole,
                    password: password,
                    token: sessionStorage.getItem('token')
                },

                url: 'http://10.128.251.13/web/web_portal_be/api/user',
                beforeSend: function( textStatus ) {
                   $('#submitUser').text('');
                   $('#submitUser').append('Adding User <i class="fa fa-spinner fa-pulse"></i>');           

                },
                success: function(data, textStatus ){
                    //console.log(JSON.stringify(data)); 
                        alert("User has been successfully added!");
                        $('#submitUser').text('Submit');
                        $('#userModal').find('input[type=text]').val('');
                        $.ajax({
                            type: 'POST',
                            data:{
                                token: sessionStorage.getItem('token'),
                                url: window.location.pathname
                            },
                            url: 'getUsers.php',
                            success: function(data, textStatus){
                                $('#userData').empty();
                                $('#userData').prepend(data);
                                $('#userformdiv').empty();
                            },
                            error: function(xhr, textStatus, errorThrown){
                                console.log(textStatus);
                            }
                        })
                        alert(JSON.stringify(data));
                },
                error: function(xhr, textStatus, errorThrown){
                    alertStatus(xhr.responseJSON.message);
                   $('#submitUser').text('Submit');
                   //$('#orgname').val('');
                }
            }); 

    }
});


}
checkUrlParam(window.location.href);
function pagination(limit){
   var limit = $('#paginator').val();
    
}
$('#paginator').change(function(){
    var pageLimit = $(this).val();
     $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'chargers_and_credit',
            limit: pageLimit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            $('#chargers_and_credit-table').empty();
            $('#chargers_and_credit-table').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });
});
$('#paginator1').change(function(){
    var pageLimit = $(this).val();
    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'call_and_usage',
            limit: pageLimit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            $('#call-and-usage-table').empty();
            $('#call-and-usage-table').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });
})

$('#paginator2').change(function(){
    var pageLimit = $(this).val();
    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'service_and_equipment',
            limit: pageLimit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            $('#service-and-equipment-table').empty();
            $('#service-and-equipment-table').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });
})

$('#homepaginator').change(function(){
    var pageLimit = $(this).val();
    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'all',
            limit: pageLimit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            $('#allTransaction').empty();
            $('#allTransaction').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });
})

function onLoadData(){
    var sessionData = sessionStorage.getItem('role');
    if(sessionData == 'standard' || sessionData == 'basic'){
        $('#drpdownOrg1').remove();
        $('#drpdownOrg2').remove();
        $('#drpdownOrg3').remove();
        $('input[type="file"]').remove();
        $('.tab-pane').find('button').remove();
        $('.userButton').remove();
        $('.orgButton').remove();
    }
    var limit = $('#paginator').val();
    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            url: window.location.pathname
        },

        url: 'getData.php',
        success: function(data, textStatus ){
            //console.log(data);
            $('#data-table').append(data);
            $('#orgCount').append(data);
            $('#drpdownOrg').append(data);
            $('#drpdownOrg1').append(data);
            $('#drpdownOrg2').append(data);
            $('#drpdownOrg3').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });

    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            url: window.location.pathname
        },

        url: 'getUsers.php',
        success: function(data, textStatus ){
            //console.log(data);
            $('#userData').append(data);
            $('#userCount').append(data);
        },
        error: function(xhr, textStatus, errorThrown){

        }
    });

    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'chargers_and_credit',
            limit: limit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            $('#chargers_and_credit-table').append(data);
            console.log($('#chargers_and_credit-table > tr').length);
            
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });

    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'call_and_usage',
            limit: limit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            //console.log(data);
            $('#call-and-usage-table').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });

    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'service_and_equipment',
            limit: limit
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            //console.log(data);
            $('#service-and-equipment-table').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           $('#submitOrganization').text('Submit');

        }
    });

    $.ajax({
        type: 'POST',
        data:{
            token: sessionStorage.getItem('token'),
            type: 'all',
            limit: '10'
        },

        url: 'getTransactions.php',
        success: function(data, textStatus ){
            //console.log(data);
            $('#allTransaction').append(data);
        },
        error: function(xhr, textStatus, errorThrown){
           alert(errorThrown);

        }
    });


function timer(elem, starttime, endtime, speed, funktion, count) {
    if (!endtime) endtime = 0;
    if (!starttime) starttime = 10;
    if (!speed) speed = 1;
    speed = speed * 1000;
    if ($(elem).html() || $(elem).val()) {
        if (count == "next" && starttime > endtime) starttime--;
        else if (count == "next" && starttime < endtime) starttime++;
        if ($(elem).html()) $(elem).html(starttime);
        else if ($(elem).val()) $(elem).val(starttime);
        if (starttime != endtime && $(elem).html()) setTimeout(function() {
            timer(elem, $(elem).html(), endtime, speed / 1000, funktion, 'next');
        }, speed);
        if (starttime != endtime && $(elem).val()) setTimeout(function() {
            timer(elem, $(elem).val(), endtime, speed / 1000, funktion, 'next');
        }, speed);
        if (starttime == endtime && funktion) funktion();
    } else return;
}


}           
function uploadBtn(){
$('#uploadChargers').click(function(){
    var drpDown = $('#drpdownOrg1').val();

    if(drpDown == '0'){
        return false;
    }
    else{
            $.ajax({
                type: 'POST',
                data:{
                    json: $('#jsonOutput').text(),
                    type: 'chargers_and_credit',
                    organization_id: drpDown,
                    limit: '10',
                    token: sessionStorage.getItem('token')
                },

                url: 'http://10.128.251.13/web/web_portal_be/api/transaction',
                beforeSend: function( textStatus ) {
                    $('#uploadChargers').text('');
                    $('#uploadChargers').html('Uploading <i class="fa fa-spinner fa-pulse"></i>');

                },
                success: function(data, textStatus ){                        
                    alert('Upload has been successfully completed!');
                    $.ajax({
                        type: 'POST',
                        data:{
                            type: 'chargers_and_credit',
                            limit: '10',
                            token: sessionStorage.getItem('token')
                        },

                        url: 'getTransactions.php',
                        success: function(data, textStatus ){                                
                            $('#chargers_and_credit-table').empty();
                            $('#chargers_and_credit-table').prepend(data);
                            $('#uploadChargers').text('Upload');
                        },
                        error: function(xhr, textStatus, errorThrown){
                           $('#uploadChargers').text('Upload');

                        }
                    })

                },
                error: function(error ,xml){
                   console.log(error);

                }
            });
        }    
    })
            $('#uploadCall').click(function(){
                var drpDown = $('#drpdownOrg2').val();

                if(drpDown == '0'){
                    return false;
                }
                else{
                    $.ajax({
                            type: 'POST',
                            data:{
                                json: $('#jsonOutput').text(),                                
                                type: 'call_and_usage',
                                organization_id: drpDown,
                                limit: '10',
                                token: sessionStorage.getItem('token')
                            },

                            url: 'http://10.128.251.13/web/web_portal_be/api/transaction',
                            beforeSend: function( textStatus ) {
                               $('#uploadCall').html('Uploading <i class="fa fa-spinner fa-pulse"></i>');

                            },
                            success: function(data, textStatus ){                        
                                alert('Upload has been successfully completed!');
                                $.ajax({
                                    type: 'POST',
                                    data:{
                                        type: 'call_and_usage',
                                        limit: '10',
                                        token: sessionStorage.getItem('token')
                                    },

                                    url: 'getTransactions.php',
                                    success: function(data, textStatus ){
                                       
                                        $('##call_and_usage-table').empty();
                                        $('##call_and_usage-table').prepend(data);
                                        $('#uploadCall').text('Upload');
                                    },
                                    error: function(xhr, textStatus, errorThrown){
                                       $('#uploadCall').text('Upload');

                                    }
                                })

                            },
                            error: function(error ,xml){
                               console.log(error);

                            }
                        });  
                }

                
            })
            $('#uploadService').click(function(){
                 var drpDown = $('#drpdownOrg3').val();

                if(drpDown == '0'){
                    return false;
                }
                else{
                    $.ajax({
                        type: 'POST',
                        data:{
                            json: $('#jsonOutput').text(),
                            type: 'service_and_equipment',
                            organization_id: drpDown,
                            limit: '10',
                            token: sessionStorage.getItem('token')
                        },

                        url: 'http://10.128.251.13/web/web_portal_be/api/transaction',
                        beforeSend: function( textStatus ) {
                           $('#uploadService').html('Uploading <i class="fa fa-spinner fa-pulse"></i>');

                        },
                        success: function(data, textStatus ){                        
                            alert('Upload has been successfully completed!');
                            $.ajax({
                                type: 'POST',
                                data:{
                                    type: 'service_and_equipment',
                                    limit: '10',
                                    token: sessionStorage.getItem('token')
                                },

                                url: 'getTransactions.php',
                                success: function(data, textStatus ){
                                    
                                    $('#service-and-equipment-table').empty();
                                    $('#service-and-equipment-table').prepend(data);
                                    $('#uploadService').text('Upload');
                                },
                                error: function(xhr, textStatus, errorThrown){
                                   $('#uploadService').text('Upload');

                                }
                            })



                        },
                        error: function(error ,xml){
                           console.log(error);

                        }
                    });
                }
                
            })
}
