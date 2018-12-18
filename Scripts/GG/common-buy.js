/// <reference path="_references.js" />
/// <reference path="/Scripts/layout.js" />

$(document).ready(function () {
    $('.buy-button').live('click', null, buyWithCreditClick);
    $('.buy-button-ppd').live('click', null, buyPPdClick);
});

var setBuySubscribeButtons = function (contentId, category) {
    var uid = $('#uid').val();
    var handsetId = $('#handsetid').val();
    $.ajax({
        type: 'GET',
        url: '/rest/gameprice?contentId=' + contentId + '&uid=' + uid + '&handsetid=' + handsetId,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            setBuySubscribeButtonsInner(data, category);
        }
    });
};

var setBuySubscribeButtonsInner = function (priceData, category) {
    var elementId = getElementIdFromContentId(priceData.ContentId);
    var user = new Object();
    user.HasSubscription = $('#isSubscribed').val() === 'True';
    user.NonSub = $('#NonSub').val() === 'True';
    user.Credits = $('#credits').val();
    user.MsisdnNotDetected = $('#isMsisdnNotDetected').val() === 'True';
    addBuyWithCreditButton(user, elementId, category, priceData);
    addSubscribeButton(user, elementId, category);
    addBuyPPDButton(user, elementId, category, priceData);
};

var getBuyText = function (user, priceData, useCreditMessageIfPossible) {
    if (priceData.Amount === 0) {
        var buyText = localizationText.commonBuyDownload;
        if (priceData.IsFree == true) {
            buyText = localizationText.commonBuyDownloadFree;
        }
    } else {
        //        if ((user.HasSubscription) && (user.Credits > 0)) 
        if (useCreditMessageIfPossible && user.Credits > 0) {
            buyText = localizationText.commonBuyUseCredit;
        } else {
            var currency =
                ((priceData.Currency == 'AUD') ||
                 (priceData.Currency == 'USD')) ?
                 '$' : priceData.Currency;
            buyText = localizationText.commonBuy.format(currency, priceData.Amount);
        }
    }

    return buyText;
};

var addBuyPPDButton = function (user, elementId, category, priceData) {
//    if (user.HasSubscription && user.Credits > 0 && priceData.Amount !== 0) return;
    
    addBuyButton(user, elementId, category, priceData, true);
};

var addBuyWithCreditButton = function (user, elementId, category, priceData) {

    if (priceData.Amount === 0 || user.Credits == 0)
        return;

    addBuyButton(user, elementId, category, priceData, false);
};

var addBuyButton = function (user, elementId, category, priceData, ppd) {

    //do not add buy button if user is using wifi connection
    if (user.MsisdnNotDetected) {
        return;
    }

    var buyText = getBuyText(user, priceData, !ppd);
    
    var ppdText = '';
    if (ppd) ppdText = '-ppd';
    
    var buyBtn =
		'<div class="btn-curved gradient-blue-bright btn-text-1line">' +
            '<a href="#" class="buy-button' + ppdText + '" data-content-id="' + priceData.ContentId + '">' +
				buyText +
            '</a>' +
		'</div>';

    if (category != null) {
        $('#' + category + ' #' + elementId + ' div.btns' + ', ' +
        '#' + category + ' #' + elementId + ' div.btns-firstEntry').append(buyBtn);
    }
    else {
        $('#' + elementId + ' div.btns' + ', ' +
              '#' + elementId + ' div.btns-firstEntry').append(buyBtn);
    }
};

var addSubscribeButton = function (user, elementId, category) {

    if (!user.NonSub)
        return;

    var subscribeText = localizationText.commonBuyFree;

    if (user.MsisdnNotDetected) {
        subscribeText = localizationText.commonBuyFreeWifi;
    }

    var subscribeBtn =
		'<div class="btn-curved gradient-green-bright btn-text-1line" >' +
            '<a href="#" onclick="subscribeButton();">' + subscribeText + '</a>' +
        '</div>';

    if (category != null) {
        $('#' + category + ' #' + elementId + ' div.btns' + ', ' +
        '#' + category + ' #' + elementId + ' div.btns-firstEntry').append(subscribeBtn);
    }
    else {
        $('#' + elementId + ' div.btns' + ', ' +
              '#' + elementId + ' div.btns-firstEntry').append(subscribeBtn);

        $('#' + elementId + ' div.subscribe-button').append(subscribeBtn);
    }

};

var buyPPdClick = function () {
    var contentId = $(this).data('content-id');

    onBuyButtonClick(contentId, true);
};

var buyWithCreditClick = function () {
    var contentId = $(this).data('content-id');

    onBuyButtonClick(contentId, false);
};

var onBuyButtonClick = function (contentId, ppd) {

    $.blockUI({ message: localizationText.commonBuyPleaseWait });

    var uid = $('#uid').val();
    var handsetid = $('#handsetid').val();
    var ppdInt = 0; if (ppd) ppdInt = 1;
    var downloadLink = '/rest/predownloadorder?' +
                       'contentId=' + contentId +
                       '&uid=' + uid + 
                       '&handsetId=' + handsetid + 
                       '&forceUsePpd=' + ppdInt;

    $.ajax({
        type: 'POST',
        url: downloadLink,
        dataType: 'json',
        success: onBuySuccess,
        error: onBuyFailed
    });
};

var onBuySuccess = function (data, textStatus, jqXHR) {

    $.unblockUI();

    var GameGalaksiPortalId = 387;

    if (data.PortalId == GameGalaksiPortalId && data.ForceUsePpd == 1) {
        window.location = data.RedirectUrl;
        return;
    }

    var ContentName = $('#content-' + data.ContentId + ' .content-name a').text();
    showAlertMessage(localizationText.MessageTitleSuccess,
    localizationText.commonBuySuccessMessage.format(ContentName));
    //Redirect to gamefile url
    var uid = $('#uid').val();
    var handsetId = $('#handsetid').val();

    window.location = '/download?contentId=' + data.ContentId +
        '&transactionId=' + data.TransactionId + '&uid=' + uid + '&handsetid=' + handsetId;

    setInterval(function () { location.reload(true); }, 30000);
};

var onBuyFailed = function (jqXHR, textStatus, errorThrown) {
    $.unblockUI();

    var errorMessage = getPurchaseErrorMessage(jqXHR);

    if (errorMessage == "MsisdnNotDetected") {
        window.location = '/Error?code=2023';
        return;
    }

    showAlertMessage(
        localizationText.messageTitleError,
        errorMessage);
};

var getPurchaseErrorMessage = function (jqXHR) {

    var responseText = $.parseJSON(jqXHR.responseText);

    var generalMessage = localizationText.commonBuyGeneralMessage;

    switch (responseText.Message) {
        case 'HandsetNotDetected':
            return generalMessage + localizationText.commonBuyHandsetNotDetected;

        case 'FileNotFoundForThisHandset':
            return generalMessage + localizationText.commonBuyFileNotFoundForThisHandset;

        case 'PurchaseTemporarilyBlocked':
            return generalMessage + localizationText.commonBuyPurchaseTemporarilyBlocked;

        case 'ChargingFailed':
            return generalMessage + localizationText.commonBuyChargingFailed;

        case 'MsisdnNotDetected':
            return "MsisdnNotDetected";

        case 'NotEnoughCredits':
            return generalMessage + localizationText.commonBuyNotEnoughCredits;

        default:
            return generalMessage + localizationText.commonBuyTryAgain;
    }
};
