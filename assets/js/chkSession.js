$(document).ready(function(){
	var sesUser = sessionStorage.getItem('username');
	var sesToken = sessionStorage.getItem('token');
	var sesRole = sessionStorage.getItem('role');
	var orgname = sessionStorage.getItem('orgName');
	if(sesUser != null && sesToken != null && sesRole != null && orgname != null){
		$('#userName').html(sesUser);
		console.log(sessionStorage.token);
		$('.userRole').find('.email').text(sesRole.toUpperCase() + ' ' +'user'.toUpperCase());
		$('.orgname').find('.organization').text(orgname.replace(/_/g, ' ').toUpperCase());

	}
	else{
		window.location.href="http://10.128.251.25/schepisi/";
	}
	

	$('#logout').click(function(){
		 sessionStorage.removeItem('token');
		 sessionStorage.removeItem('username');
		 sessionStorage.removeItem('role');
		 window.location.href="http://10.128.251.25/schepisi/";
	})
});