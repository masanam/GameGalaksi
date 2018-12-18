function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	}
	return "";
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function isEmpty(str) {
	return (!str || 0 === str.length);
}
var partnerReferer = getParameterByName('PartnerReferer');

var flag = getCookie("flag");

if (flag == "" || flag == null) {
	setCookie("flag", "true", 1);
}
if (flag != "" && flag != null && flag == "true") {
	setCookie("flag", "false", 1);
	window.location = "http://vms.sieugame.8elements.mobi/subscribe/subscribe/?PartnerReferer=" + partnerReferer;
} else {
	if (flag == "false") {
		setCookie("flag", "true", 1);
		window.location = "http://vms.sieugame.8elements.mobi";
	}
}