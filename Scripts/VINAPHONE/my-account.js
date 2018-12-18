/// <reference path="_references.js" />
/// <reference path="/Scripts/Default/layout.js" />
var setUserInfo = function (subscriptionStatus) {
    var uid = $('#uid').val();
    var handsetid = $('#handsetid').val();
    $.ajax({
        type: 'GET',
        url: '/rest/userdetail?uid=' + uid + '&handsetId=' + handsetid,
        data: {},
        success: function (user) {

            $('#device span').html(user.HandsetModel);
            setCreditOrSubscriptionButn(user, subscriptionStatus);
        },
        error: function () {

            var message = window.localizationText.myAccountSetUserInfo;
            $('#msisdn span').html(message);
            $('#device span').html(message);
            $('.my-subscription').remove();
            $('.btn-my-downloads').remove();
        }
    });
};

var setCreditOrSubscriptionButn = function (user, subscriptionStatus) {
    if (user.HasSubscription) {
        $('#credit-text').text(user.Credits);
        $('#point-text').text(user.Points);
        $('#status-text').text(subscriptionStatus);
        $('#purchase-date-text').text(user.SubscriptionCreateDateStr);
        $('#renewal-date-text').text(user.SubscriptionExpiryDateStr);
        $('.unsubscribed-section').hide();
        $('.subscribed-section').show();
    } else {
        $('.subscribed-section').hide();
        $('.unsubscribed-section').show();
    }
    if (!user.HasActiveSubscription) {
        $('#join-big-btn').show();
    } else {
        $('#join-big-btn').hide();
    }

    if (user.SubscriptionStatus == "Pending" || user.SubscriptionStatus == "Suspended") {
        $('#resubscribe-big-btn').show();
    } else {
        $('#resubscribe-big-btn').hide();
    }

    $('.loading').hide();
};

var onUnsubscribe = function () {
    //$.blockUI({ message: 'Please wait...' });
    $.blockUI({ message: window.localizationText.myAccountOnUnsubscribe });
    var uid = $('#uid').val();
    $.ajax({
        type: "DELETE",
        url: '/rest/subscription?uid=' + uid,
        data: null,
        success: onUnsubscribeSuccess,
        error: onUnsubscribeError,
        dataType: 'json'
    });
};

var onUnsubscribeSuccess = function (data) {
    $.unblockUI();

    var vinaphonePortalId = 388;

    if (data.PortalId == vinaphonePortalId && data.RedirectUrl != "") {
        window.location = data.RedirectUrl;
        return;
    }

    var message = window.localizationText.myAccountOnUnsubscribeSuccess;

    showAlertMessage(
        window.localizationText.messageTitleSuccess,
        message);

    window.location.href = "/MyAccount/UnsubscribeThankYouPage";
    window.location.assign(window.location.href);
};

var onUnsubscribeError = function (jqXhr) {
    $.unblockUI();

    var errorMessage = window.getUnSubscribeErrorMessage(jqXhr);

    showAlertMessage(
        window.localizationText.messageTitleError,
        errorMessage);
};


var getSubscribeErrorMessage = function (jqXhr) {

    var responseText = $.parseJSON(jqXhr.responseText);

    var generalMessage = window.localizationText.myAccountGeneralMessage;

    switch (responseText.Message) {

        case 'SubscriptionNotFound':
            return generalMessage + window.localizationText.myAccountSubscriptionNotFound;

        case 'GeneralError':
        default:
            return generalMessage + responseText.Message;
    }
};