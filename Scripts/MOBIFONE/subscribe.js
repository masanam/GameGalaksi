/// <reference path="_references.js" />
/// <reference path="/Scripts/Default/layout.js" />
var subscribeAction = function(contentId) {
    if (typeof (contentId) === 'undefined') contentId = -1;

    var pleaseWaitText = window.localizationText.subscribePleaseWait;
    $.blockUI({ message: pleaseWaitText });
    var uid = $('#uid').val();
    $.ajax({
        type: "POST",
        url: '/rest/subscription?uid=' + uid + '&ContentId=' + contentId,
        data: null,
        success: onSubscribeSuccess,
        error: onSubscribeError,
        dataType: 'json'
    });
};
var subscribeButton = function() {
    var contentId = -1;
    var path = window.location.pathname;
    if (path.toLowerCase().indexOf("detail") >= 0) {
        contentId = path.replace(/\D+/, '');
    }
    if ($('#deactivateOneClickSubscribe').val() === 'True') {
        window.location.href = "/Subscribe?ContentId=" + contentId;
    } else {
        subscribeAction(contentId);
    }

};
var onSubscribeSuccess = function(data) {
    $.unblockUI();

    var mobifonePortalId = 390;

    if (data.PortalId == mobifonePortalId && data.RedirectUrl != "") {
        window.location = data.RedirectUrl;
        return;
    }

    //var message = window.localizationText.subscribeOnSubscribeSuccess;

//    showAlertMessage(
//        localizationText.messageTitleSuccess,
//        message);

    redirect(data.ContentId);
};

var onSubscribeError = function(jqXhr) {
    $.unblockUI();

    var errorMessage = getSubscribeErrorMessage(jqXhr);

    if (errorMessage == window.localizationText.subscribeCanNotSubscribeWithWifiConnection) {
        redirectToSubscribePage();
        return;
    }

    if (errorMessage == window.localizationText.subscribeBalanceNotEnough) {
        redirectToErrorBalanceNotEnough();
        return;
    }

    showAlertMessage(
        window.localizationText.messageTitleError,
        errorMessage);
    //commented out because redirection is too fast on old phone
    //and caanot show subscribe error
    //redirect();
};

var redirectToErrorBalanceNotEnough = function() {
    window.location.href = "/Subscribe/Pending";
    window.location.replace(window.location.href);
    setInterval(function() { location.reload(true); }, 8000);
};
var redirectToSubscribePage = function() {
    window.location.href = "/Subscribe";
    window.location.assign(window.location.href);
    setInterval(function() { location.reload(true); }, 8000);
};
var redirect = function(contentId) {
    if (typeof (contentId) === 'undefined') contentId = -1;
    window.location.href = "/Subscribe/RedirectSubscribeUser?ContentId=" + contentId;
    window.location.assign(window.location.href);
    setInterval(function() { location.reload(true); }, 8000);
};
var getSubscribeErrorMessage = function(jqXhr) {

    var responseText = $.parseJSON(jqXhr.responseText);

    var generalMessage = window.localizationText.subscribeGeneralMessage;

    switch (responseText.Message) {

    case 'SubscriptionAlreadyExists':
        return window.localizationText.subscribeSubscriptionAlreadyExists;

    case 'SubscribeTemporarilyBlocked':
        return generalMessage +
            window.localizationText.subscribeSubscribeTemporarilyBlocked +
            window.localizationText.subscribeTryAgain;

    case 'SubscribedForLessThanAWeek':
        return generalMessage +
            window.localizationText.subscribeSubscribedForLessThanAWeek +
            window.localizationText.subscribeTryAgain;

    case 'ChargingError':
        return window.localizationText.subscribeChargingError;

    case 'SubscriptionCreatedButBalanceNotEnough':
        return window.localizationText.subscribeBalanceNotEnough;

    case 'BalanceNotEnoughPendingNotAllowed':
        return window.localizationText.subscribeNotCreatedBalanceNotEnough;

    case 'CanNotSubscribeWithWifiConnection':
        return window.localizationText.subscribeCanNotSubscribeWithWifiConnection;

    default:
        return generalMessage + window.localizationText.subscribeTryAgain;
    }
};
var resubscribeAction = function() {
    var pleaseWaitText = window.localizationText.subscribePleaseWait;
    $.blockUI({ message: pleaseWaitText });
    var uid = $('#uid').val();
    $.ajax({
        type: "POST",
        url: '/rest/Resubscribe?uid=' + uid,
        data: null,
        success: onResubscribeSuccess,
        error: onResubscribeError,
        dataType: 'json'
    });
};
var onResubscribeSuccess = function() {
    $.unblockUI();

    var message = window.localizationText.subscribeOnSubscribeSuccess;

    showAlertMessage(
        window.localizationText.messageTitleSuccess,
        message);

    redirect();
};

var onResubscribeError = function(jqXhr) {
    $.unblockUI();

    var errorMessage = getSubscribeErrorMessage(jqXhr);

    if (errorMessage == window.localizationText.subscribeChargingError) {
        redirectToErrorBalanceNotEnough();
        return;
    }

    showAlertMessage(
        window.localizationText.messageTitleError,
        errorMessage);
    //commented out because redirection is too fast on old phone
    //and caanot show subscribe error
    //redirect();
};