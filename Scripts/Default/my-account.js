/// <reference path="_references.js" />
/// <reference path="/Scripts/layout.js" />

var setUserInfo = function (subscriptionStatus) {
    var uid = $('#uid').val();
    var handsetid = $('#handsetid').val();
    $.ajax({
        type: 'GET',
        url: '/rest/userdetail?uid=' + uid + '&handsetId=' + handsetid,
        data: {},
        success: function (user, textStatus, jqXHR) {

            $('#device span').html(user.HandsetModel);
            setCreditOrSubscriptionButn(user, subscriptionStatus);
        },
        error: function (jqXHR, textStatus, errorThrown) {

            var message = localizationText.myAccountSetUserInfo;
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
    }
    else {
        $('.subscribed-section').hide();
        $('.unsubscribed-section').show();
    }
    if (!user.HasActiveSubscription) {
        $('#join-big-btn').show();
    }
    else {
        $('#join-big-btn').hide();
    }

    if (user.SubscriptionStatus == "Pending" || user.SubscriptionStatus == "Suspended") {
        $('#resubscribe-big-btn').show();
    }
    else {
        $('#resubscribe-big-btn').hide();
    }

    $('.loading').hide();
};

var onUnsubscribe = function () {
    //$.blockUI({ message: 'Please wait...' });
    $.blockUI({ message: localizationText.myAccountOnUnsubscribe });
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

var onUnsubscribeSuccess = function (data, textStatus, jqXHR) {
    $.unblockUI();

    var GameGalaksiPortalId = 387;
    var PolynetPortalId = 393;
    var ViettelPortalId = 19;

    if (data.PortalId == GameGalaksiPortalId || data.PortalId == PolynetPortalId || data.PortalId == ViettelPortalId) {
        window.location = data.RedirectUrl;
        return;
    }

    var message = localizationText.myAccountOnUnsubscribeSuccess;

    showAlertMessage(
        localizationText.messageTitleSuccess,
        message);

    window.location.href = "/MyAccount/UnsubscribeThankYouPage";
    window.location.assign(window.location.href);
};

var onUnsubscribeError = function (jqXHR, textStatus, errorThrown) {
    $.unblockUI();

    var errorMessage = getUnSubscribeErrorMessage(jqXHR);

    showAlertMessage(
        localizationText.messageTitleError,
        errorMessage);
};


var getSubscribeErrorMessage = function (jqXHR) {

    var responseText = $.parseJSON(jqXHR.responseText);

    var generalMessage = localizationText.myAccountGeneralMessage;

    switch (responseText.Message) {

        case 'SubscriptionNotFound':
            return generalMessage + localizationText.myAccountSubscriptionNotFound;

        case 'GeneralError':
        default:
            return generalMessage + localizationText.myAccountGeneralError;
    }
}

