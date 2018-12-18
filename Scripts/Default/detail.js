/// <reference path="_references.js" />

var setCarousel = function (contentId) {

    var maxPic = 4;
    var key = screen.width < 500 ? "Tall" : "High";
    for (i = 0; i < maxPic; i++) {
        $(".carousel-inner").append(
            '<div class="item">' +
            '<img src="/rest/gameimage/' + contentId + '?key=' + key + i + '"' +
            '     class="img-polaroid" alt="game-picture' + (i + 1) + '" />' +
            '</div>');
    }
    $(".carousel-inner .item:eq(1)").addClass("active");
}

var detailSetContent = function (gameData) {
    var elementId = getElementIdFromContentId(gameData.ContentId);
    $('#' + elementId + ' div#content-name')
        .append('<h3>' + gameData.Name + '</h3>');

    $('div.content-description small')
        .append(gameData.LongDescription);
};

var detailSetContentCategory = function (categoryData) {
    $('#content-category')
        .append(categoryData.Name);
};

var detailSetContentProvider = function (providerData) {
    $('div.content-provider')
        .append('<strong>' + providerData.Name + '</strong>');

    var handsetid = parseInt($('#handsetid').val());
    $.ajax({
        type: 'GET',
        url: '/rest/gameids?provider=' + providerData.GameProviderId + '&handsetid=' + handsetid,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            detailSetContentPicturesAndLinks(providerData.ContentId, data, 'other-content');
        }
    });
};

var detailSetContentPicturesAndLinks = function (contentId, contentIds, divName) {

    var count = 0;
    var languageCode = $('html').attr('lang');

    if ((contentIds.length === 1) && (divName === 'other-content')) {
        $("#other-content").remove();
        return true;
    }

    $.each(contentIds, function (key, val) {
        if (count >= 4)
            return false;

        if (contentId === val)
            return true;

        $('#' + divName + " .items").append(
            '<div id="' + getElementIdFromContentId(val) +
				'" class="small-pic"><a href="/Detail/' + val + '"> ' +
                '<img class="img-rounded" src="/rest/gameimage/' + val +
                    '?key=Square0&languageCode=' + languageCode + '" /> ' +
                '<br> <div class="content-name"> </div>' +
            '</a> </div>');
        count++;

        $.ajax({
            type: 'GET',
            url: '/rest/game/' + val + '?languageCode=' + languageCode,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                detailSetContentSmall(data, divName);
            }
        });

    });
};

var detailSetContentSmall = function (gameData, divName) {
    var maxLenght = 8;
    var elementId = getElementIdFromContentId(gameData.ContentId);
    var displayedName = gameData.Name;
    if (gameData.Name.length > maxLenght)
        displayedName = displayedName.substring(0, maxLenght) + ".";

    $('#' + divName +  ' #' + elementId + ' .content-name')
        .append(displayedName);
};
