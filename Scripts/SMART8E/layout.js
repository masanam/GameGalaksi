/// <reference path="_references.js" />

$(document).ready(function () {        
    loadLogo();
    setSubscribButtons();
});

var loadLogo = function () {

    var pictureSize = 360;

    $("#logo").append('<img src="/Images/' + pictureSize + '/8eLogo_360x280.gif" />');

};

var showAlertMessage = function (type, text) {
    $('header').append('<div class="alert alert-' + type + '">' + text + '</div>');
    window.setTimeout(function () { $('.alert').remove(); }, 8000);
};

var setSubscribButtons = function () {

    var uid = $('#uid').val();
    var handsetid = $('#handsetid').val();
    $.getJSON(
		'/rest/userdetail?uid=' + uid + '&handsetId=' + handsetid,
		null,
		function (user, textStatus, jqXHR) {

		    if (user.HasActiveSubscription) {
		        return;
		    }

		    $("#first-categories div.category").removeClass("span6").addClass("span4");

		    $("#home-subscribe-btn").removeAttr("style");

		    var price = "";
		    if (localizationText.subscribePrice != "" && localizationText.subscribePrice != null) {
		        price = " at " + localizationText.subscribePrice;
		    }

		    $("#join").append(
			    '<div class="btn-curved gradient-green-bright btn-text-1line">' +
                    '<a href="/Subscribe">' + localizationText.layoutSetSubscribButtons + price +
		            '</a>' +
            	'</div>'
            );
		} //function
	);
};