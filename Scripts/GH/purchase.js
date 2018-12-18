/// <reference path="_references.js" />

var GetDownloadedGamesAndGenerateList = function () {
    var uid = $('#uid').val();
    var handsetId = $('#handsetid').val();

    var getDownloadedGameIdsUrl
        = '/rest/predownloadorder?uid=' + uid + '&handsetid=' + handsetId;

    $.getJSON(
        getDownloadedGameIdsUrl,
        null,
        function (data, textStatus, jqXHR) {
            if (data === null) {
                $('#download-list span').text(localizationText.purchaseNoPurchase);
                return;
            }
            $('#download-list span').remove();

            GenerateList(data);
        }
    );
};

var GenerateList = function (data) {

    $.each(data, function (key, val) {
        AddDownloadedGameInDisplayedList(val);
    });

    $('div.content-entry').each(function () {
        var contentId = getContentIdFromElement($(this));
        setText(contentId);
    });
};

var AddDownloadedGameInDisplayedList = function (val) {
    var elementId = getElementIdFromContentId(val.ContentId);

    $('#download-list').append(
        '<div id="' + elementId +
            '" class="content-entry game row-fluid">' +
                getEntryStructure() +
        '</div>');

    HandelButton(val);
};


var moreGames = true;
var loading = true;
$(window).scroll(loadMoreGamesOnScroll);

var HandelButton = function (val) {

    var elementId = getElementIdFromContentId(val.ContentId);
    var buttonsElement = $('#' + elementId + ' div.btns');

    if (val.TransactionId === null || 
        val.DnldCount >= val.MaxDnldCount) {
        buttonsElement.remove();
    }
    else {
        AddDownloadButton(val, buttonsElement);
    }
};

var AddDownloadButton = function (val, buttonsElement) {

    var uid = $('#uid').val();
    var handsetId = $('#handsetid').val();

    var downloadLink =
        '/download?contentid=' + val.ContentId +
        '&transactionId=' + val.TransactionId + '&uid=' + uid + '&handsetid=' + handsetId;

    var pic = '/Images/General/DownloadIconRoundGreen.png';

    buttonsElement.append(
        '<a href="' + downloadLink + '">' +
            '<img src="' + pic + '" alt="' + localizationText.purchaseDownload + '" class="download"/>' +
        '</a>');
};