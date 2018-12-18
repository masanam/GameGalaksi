/// <reference path="_references.js" />

var loadMoreGamesOnScroll = function () {
    if (moreGames && !loading &&
         $(window).scrollTop() >= $(document).height() - $(window).height() - 200) {
        loadMoreEntries();
    }
}

var loadMoreEntries = function () {
    loading = true;
    $('div.show-more-entry').remove();
    setLoading('#games-list');

    var pageSize = parseInt($('#PageSize').val());
    var pageNumber = parseInt($('#PageNumber').val());
    
    var handset = $('#handsetid').val();

    var handsetId = parseInt($('#handsetid').val());
    if (handset == null) {
        setText(localizationText.gameListHandsetNotDetected);
        //setText("Handset Not Detected");
        return;
    }

    var url = getUrl(pageSize, pageNumber);


    var altRow = false;
    $.getJSON(
        url,
        null,
        function (data, textStatus, jqXHR) {
            $.each(data, function (key, contentId) {
                var altClass = (altRow === true) ? ' game--alternate' : '';
                altRow = !altRow;
                $('#games-list').append(
                    '<div id="' + getElementIdFromContentId(contentId) +'" class="game ' + altClass + '">' +
                    '</div>');
            });
            removeLoading();

            $('div.game:empty').each(function () {
                var contentId = getContentIdFromElement($(this));
                getGame(contentId);
            });

            $('#PageNumber').val(pageNumber + 1);

            if (data.length >= pageSize) {
                setLoadMoreEntry();
            }
            else if (data.length === 0) {
                setNoData(pageNumber);
            }
            loading = false;
        }
    );
};

var getGameIdsListUrl = function (listType, pageSize, pageNumber) {
    var handsetid = parseInt($('#handsetid').val());
    return '/rest/gameids?groupid=' + listType +
     '&pageNumber=' + pageNumber + '&itemCount=' + pageSize + '&handsetid=' + handsetid;
};

var getGameIdsListUrlFromKeyword = function (keyword, pageSize, pageNumber) {
    var handsetid = parseInt($('#handsetid').val());
    return '/rest/gameids?keyword=' + keyword +
     '&pageNumber=' + pageNumber + '&itemCount=' + pageSize + '&handsetid=' + handsetid;
};

var getGameIdsListUrlByCategory = function (categoryId, pageSize, pageNumber) {
    var handsetid = parseInt($('#handsetid').val());
    return '/rest/gameids?category=' + categoryId +
     '&pageNumber=' + pageNumber + '&itemCount=' + pageSize + '&handsetid=' + handsetid;
};

var getUrl = function (pageSize, pageNumber) {

    switch ($('#ListSource').val()) {

        case "search":
            var Keyword = $('#Keyword').val();
            return getGameIdsListUrlFromKeyword(Keyword, pageSize, pageNumber);

        case "listTypeList":
            var listType = $('#ListType').val();
            return getGameIdsListUrl(listType, pageSize, pageNumber);

        case "category":
            var categoryId = $('#CategoryId').val();
            return getGameIdsListUrlByCategory(categoryId, pageSize, pageNumber);

        default:
            return "";
    }
};

var getGame = function (contentId) {

    var entry = $('#' + getElementIdFromContentId(contentId));
    var structure = getEntryStructure(contentId);
    entry.append(structure);
    setText(contentId);
    setBuySubscribeButtons(contentId, null);
};


var getEntryStructure = function (contentId) {

    var isSubscribed = $('#isSubscribed').val();
    var button =
        (isSubscribed === 'True')
            ? '<a class="game__buy-button-link" href="/purchase/buy?contentId=' + contentId + '&ppd=false">' +
                 '<img class="game__buy-button-image" src="/Images/General/D1GC/download-button.png" alt="Join Now!"/>' +
              '</a>'
            : '<a class="game__buy-button-link" href="/subscribe/subscribe">' +
                '<img class="game__buy-button-image" src="/Images/General/D1GC/get-button.png" alt="Join Now!"/>' +
              '</a>';
    
    return '<div class="game__image-container"></div>' +
           '<div class="game__title"></div>' +
           '<div class="game__category"></div>' +
           '<div class="game__buy-button">' +
                button +
           '</div>';
};

var setText = function (contentId) {

    var languageCode = $('html').attr('lang');

    $.ajax({
        type: 'GET',
        url: '/rest/game/' + contentId + '?languageCode=' + languageCode,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            setContent(data);
        }
    });
    $.ajax({
        type: 'GET',
        url: '/rest/categories/' + contentId + '?languageCode=' + languageCode,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            setContentCategory(data);
        }
    });
};

var setContent = function (gameData) {
    var languageCode = $('html').attr('lang');
    var elementId = getElementIdFromContentId(gameData.ContentId);
    var detailsLink = '/Detail/' + gameData.ContentId;
    
    setPicture(elementId, detailsLink, gameData, languageCode, 'game__image-container', 'Square0');

    $('#' + elementId + ' .game__title')
        .append('<a class="game__title-link" href="' + detailsLink + '"> ' +
                     gameData.Name +
                '</a>');
};

var setPicture = function (elementId, detailsLink, gameData, languageCode, 
                            divClass, picFormat) {

    $('#' + elementId + ' .' + divClass)
        .append('<a href="' + detailsLink + '"> ' +
                    '<image src="/rest/gameimage/' + gameData.ContentId +
                    '?key=' + picFormat + '&languageCode=' + languageCode + '" class="game__image img-rounded" />' +
                '</a>');
}

var setContentCategory = function (categoryData) {
    var elementId = getElementIdFromContentId(categoryData.ContentId);
    $('#' + elementId + ' .game__category')
        .append(categoryData.Name);
};

var setNoData = function (pageNumber) {

    moreGames = false;
    var text = pageNumber === 0 ?
                localizationText.gameListNoGameFound : 
                localizationText.gameListNoMoreGame;
    setMessage(text);
};

var setMessage = function (text) {

    $('#games-list').append(
        '<div class="message">' +
            '<strong>' + text + '<strong> ' +
            '<a onclick="history.go(-1); return false;" href="#"> <div class="btn"> ' + localizationText.gameListBack + ' </div> </a>' +
        '</div>');
};


var setLoadMoreEntry = function () {
    $('#games-list').append(
        '<div class="show-more-entry btn-curved gradient-blue-bright btn-text-1line">' +
            '<strong>' + localizationText.gameListShowMore + '<strong>' +
        '</div>');
    $('div.show-more-entry').click(loadMoreEntries);
};

var getElementIdFromContentId = function (contentId) {
    return 'content-' + contentId;
};

var getContentIdFromElement = function (element) {
    var elementId = element.attr('id');
    return elementId.replace('content-', '');
};

var setLoading = function (location) {

    $(location).append(
        '<div id="loading-anim-container2" class="row-fluid">' +
            '<div class="loading-anim-container">' +
                '<div id="loading-anim">' +
                    '<div class="bar1"></div>' +
                    '<div class="bar2"></div>' +
                    '<div class="bar3"></div>' +
                    '<div class="bar4"></div>' +
                    '<div class="bar5"></div>' +
                    '<div class="bar6"></div>' +
                    '<div class="bar7"></div>' +
                    '<div class="bar8"></div>' +
                '</div>' +
            '</div>' +
        '</div>');

//TODO    window.setTimeout(loadingRotate, 180);
};

var removeLoading = function () {

    //TODO    clearTimeout(loadingRotate);
    $('#loading-anim-container2').remove();
};

var loadingAngle = 0;

function loadingRotate() {
    var elem = document.getElementById('loading-anim');
    elem.style.MozTransform = 'scale(0.5) rotate(' + loadingAngle + 'deg)';
    elem.style.WebkitTransform = 'scale(0.5) rotate(' + loadingAngle + 'deg)';
    if (loadingAngle === 360) { loadingAngle = 0 }
    loadingAngle += 45;
    if (loading)
        window.setTimeout(loadingRotate, 180);
    else
        $('#loading-anim-container2').remove();
};
