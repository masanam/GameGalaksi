
/// <reference path="_references.js" />
/// <reference path="/Scripts/layout.js" />

var subscribeAction = function (ContentId) {
    trackSubscribe();
    if (typeof (ContentId) === 'undefined') ContentId = -1;

    var pleaseWaitText = localizationText.subscribePleaseWait;
    $.blockUI({ message: pleaseWaitText });
    var uid = $('#uid').val();
    $.ajax({
        type: "POST",
        url: '/rest/subscription?uid=' + uid + '&ContentId=' + ContentId,
        data: null,
        success: onSubscribeSuccess,
        error: onSubscribeError,
        dataType: 'json'
    });
}

var subscribeButton = function () {
    var ContentId = -1;
    var path = window.location.pathname;
    if (path.toLowerCase().indexOf("detail") >= 0) {
        ContentId = path.replace(/\D+/, '');
    }
    if ($('#deactivateOneClickSubscribe').val() === 'True') {
        window.location.href = "/Subscribe?ContentId=" + ContentId;
    }
    else {
        subscribeAction(ContentId);
    }

}

var onSubscribeSuccess = function (data, textStatus, jqXHR) {
    $.unblockUI();

    var SmartPortalId = 335;
    var GameGalaksiPortalId = 387;
    var PolynetPortalId = 393;
    var XhttVinaphonePortalId = 395;
    var GamerHeavenOxygen8PortalId = 399;
    var GamerHeavenDigitalTurbinePortalId = 400;
    var NextNationPortalId = 410;
    var ViettelPortalId = 19;
    var MaxisAGL = 354;
    var MaxisGGC = 331;

    if (data.PortalId == GameGalaksiPortalId ||
        data.PortalId == PolynetPortalId ||
        data.PortalId == XhttVinaphonePortalId ||
        data.PortalId == ViettelPortalId ||
        data.PortalId == GamerHeavenOxygen8PortalId ||
        data.PortalId == GamerHeavenDigitalTurbinePortalId ||
        data.PortalId == NextNationPortalId ||
        data.PortalId === SmartPortalId ||
        data.PortalId == MaxisAGL ||
        data.PortalId == MaxisGGC) 
    {
        window.location = data.RedirectUrl;
        return;
    }

    var message = localizationText.subscribeOnSubscribeSuccess;

    //    showAlertMessage(
    //        localizationText.messageTitleSuccess,
    //        message);

    redirect(data.ContentId);
};

var onSubscribeError = function (jqXHR, textStatus, errorThrown) {
    $.unblockUI();

    var errorMessage = getSubscribeErrorMessage(jqXHR);

    if (errorMessage == localizationText.subscribeCanNotSubscribeWithWifiConnection) {
        redirectToSubscribePage();
        return;
    }

    if (errorMessage == localizationText.subscribeBalanceNotEnough) {
        redirectToErrorBalanceNotEnough();
        return;
    }

    showAlertMessage(
        localizationText.messageTitleError,
        errorMessage);
    //commented out because redirection is too fast on old phone
    //and caanot show subscribe error
    //redirect();
};

var redirectToErrorBalanceNotEnough = function () {
    window.location.href = "/Subscribe/Pending";
    window.location.replace(window.location.href);
    setInterval(function () { location.reload(true); }, 8000);
}

var redirectToSubscribePage = function () {
    window.location.href = "/Subscribe";
    window.location.assign(window.location.href);
    setInterval(function () { location.reload(true); }, 8000);
}

var redirect = function (ContentId) {
    if (typeof (ContentId) === 'undefined') ContentId = -1;
    window.location.href = "/Subscribe/RedirectSubscribeUser?ContentId=" + ContentId;
    window.location.assign(window.location.href);
    setInterval(function () { location.reload(true); }, 8000);
}


var getSubscribeErrorMessage = function (jqXHR) {

    var responseText = $.parseJSON(jqXHR.responseText);

    var generalMessage = localizationText.subscribeGeneralMessage;

    switch (responseText.Message) {

        case 'SubscriptionAlreadyExists':
            return localizationText.subscribeSubscriptionAlreadyExists;

        case 'SubscribeTemporarilyBlocked':
            return generalMessage +
                   localizationText.subscribeSubscribeTemporarilyBlocked +
                   localizationText.subscribeTryAgain;

        case 'SubscribedForLessThanAWeek':
            return generalMessage +
                   localizationText.subscribeSubscribedForLessThanAWeek +
                   localizationText.subscribeTryAgain;

        case 'ChargingError':
            return localizationText.subscribeChargingError;

        case 'SubscriptionCreatedButBalanceNotEnough':
            return localizationText.subscribeBalanceNotEnough;

        case 'BalanceNotEnoughPendingNotAllowed':
            return localizationText.subscribeNotCreatedBalanceNotEnough;

        case 'CanNotSubscribeWithWifiConnection':
            return localizationText.subscribeCanNotSubscribeWithWifiConnection;

        default:
            return generalMessage + localizationText.subscribeTryAgain;
    }
}

var resubscribeAction = function () {
    var pleaseWaitText = localizationText.subscribePleaseWait;
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
}

var onResubscribeSuccess = function (data, textStatus, jqXHR) {
    $.unblockUI();

    var message = localizationText.subscribeOnSubscribeSuccess;

    showAlertMessage(
        localizationText.messageTitleSuccess,
        message);

    redirect();
};

var onResubscribeError = function (jqXHR, textStatus, errorThrown) {
    $.unblockUI();

    var errorMessage = getSubscribeErrorMessage(jqXHR);

    if (errorMessage == localizationText.subscribeChargingError) {
        redirectToErrorBalanceNotEnough();
        return;
    }

    showAlertMessage(
        localizationText.messageTitleError,
        errorMessage);
    //commented out because redirection is too fast on old phone
    //and caanot show subscribe error
    //redirect();
};

var trackSubscribe = function() {
    _gaq.push(['_trackEvent', 'subscribe', 'clicked']);
}