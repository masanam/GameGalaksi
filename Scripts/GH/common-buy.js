/// <reference path="_references.js" />            

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
    user.PpdDisabled = $('#PpdDisabled').val() === 'True';

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
    if (user.PpdDisabled) {
        return;
    }
    addBuyButton(user, elementId, category, priceData, true);
};

var addBuyWithCreditButton = function (user, elementId, category, priceData) {

    if (priceData.Amount === 0 || user.Credits == 0)
        return;

    addBuyButton(user, elementId, category, priceData, false);
};

var addBuyButton = function (user, elementId, category, priceData, ppd) {
    
    var buyText = getBuyText(user, priceData, !ppd);
    
    var buyButton =
        '<div class="game__action-button">' +
		    '<a class="game__action-button-link" href="/purchase/buy?contentId=' + priceData.ContentId + '&ppd=' + ppd + '">' +
                buyText +
            '</a>' +
        '</div>';
                    

    if (category != null) {
        $('#' + category + ' #' + elementId + ' .game__action' + ', ' +
        '#' + category + ' #' + elementId + ' .game__action--firstEntry').append(buyButton);
    }
    else {
        $('#' + elementId + ' .game__action' + ', ' +
              '#' + elementId + ' .game__action--firstEntry')
              .append(buyButton);
    }
};


var addSubscribeButton = function (user, elementId, category) {

    if (!user.NonSub)
        return;

    var subscribeButton =
        '<div class="game__action-button">' +
            '<a class="game__action-button-link" href="/subscribe/SubscribeButton">' +
		        localizationText.commonBuyDirectSubscribe +
		    '</a>' +
        '</div>';
   
    if (category != null) {
        $('#' + category + ' #' + elementId + ' .game__action' + ', ' +
          '#' + category + ' #' + elementId + ' .game__action--firstEntry')
          .append(subscribeButton);
    }
    else {
        $('#' + elementId + ' .game__action' + ', ' +
          '#' + elementId + ' .game__action--firstEntry')
          .append(subscribeButton);
    }
};

var buyPPdClick = function () {
    var portalId = $('#PortalId').val();
    var contentId = $(this).data('content-id');

    if (portalId == 999999) { //DigitalTurbine -> disable index page
        window.location.replace("/purchase/index?contentId=" + contentId);
    } else {        
        onBuyButtonClick(contentId, true);
    }
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
    var downloadLink = '/rest/predownloadorder?contentId=' + contentId +
                       '&uid=' + uid + 
                       '&handsetId=' + handsetid + 
                       '&forceUsePpd=' + ppdInt;
    //console.log(downloadLink); return false;
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
   // console.log(data.RedirectUrl);
   // return false;
    var GameGalaksiPortalId = 387;
    var VinaphonePortal = 388;
    var PolynetPortalId = 393;
    var XhttVinaphone = 395;
    var GamerHeavenOxygen8PortalId = 399;
    var MaxisAGL = 354;
    var MaxisGGC = 331;
    var ViettelPortalId = 19;

    if (data.RedirectToGooglePlay != null && data.RedirectToGooglePlay == true) {
        window.location = data.RedirectUrl;
        return;
    }

    if ((data.PortalId == GameGalaksiPortalId ||
         data.PortalId == PolynetPortalId ||
         data.PortalId == ViettelPortalId ||
         data.PortalId == VinaphonePortal ||
         data.PortalId == GamerHeavenOxygen8PortalId ||
         data.PortalId == MaxisAGL ||
         data.PortalId == MaxisGGC) &&
        data.ForceUsePpd == 1)
    {
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
    //console.log(textStatus);
    //return false;
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
