/// <reference path="_references.js" />

window.onresize = function (event) {

    //  resizeSearchBar();//TODO put back 
};

var loadCategory = function (category, categoryChar, title, moreTitle, itemCount) {
	loadCategoryStructure(category, categoryChar, title, moreTitle);
	loadGamesDetails(category, categoryChar, itemCount);
};

var loadBannerCategory = function(category, categoryChar, title, moreTitle, itemCount) {
    loadCategoryStructure(category, categoryChar, title, moreTitle);
    loadBannerDetail(category, categoryChar, itemCount);
}

var loadCategoryStructure = function (category, categoryChar, title, moreTitle) {
	$('#' + category).append(
        '<div class="section__header">' + title + '</div>' +
		'<div class="section__content">' + '</div>' +
        '<div class="section__footer">' +
            '<a class="section__footer-link" href="List/' + categoryChar + '">' + moreTitle + '</a>' +
        '</div>' 
    );
};


var homeGetUrl = function (listType, pageSize, pageNumber) {
    var handsetid = parseInt($('#handsetid').val());
	return '/rest/gameids?groupid=' + listType +
	 '&pageNumber=' + pageNumber + '&itemCount=' + pageSize + '&handsetid=' + handsetid;
};


var loadGamesDetails = function (category, categoryChar, itemCount) {
    
	var pageNumber = 0;
	var url = homeGetUrl(categoryChar, itemCount, pageNumber);
    
	$.getJSON(
		url,
		null,
		function (data, textStatus, jqXHR) {
		    $.each(data, function (key, val) {
		        $('#' + category + ' .section__content').append(
                    '<div id="' + getElementIdFromContentId(val) + '" class="game">' +
						'<div class="game__image-container"></div>' +
                        '<div class="game__title"></div>' +
                        '<div class="game__action"></div>' +
					'</div>'
				);
			});

		    $('#' + category + ' .section__content .game').each(function () {
			    var contentId = getContentIdFromElement($(this));
			    homeGetGame(contentId, category);
			});
		}
	);
};


var loadBannerDetail = function(category, categoryChar, itemCount) {
    
    var pageNumber = 0;
    var url = homeGetUrl(categoryChar, itemCount, pageNumber);
    
    $.getJSON(
		url,
		null,
		function (data, textStatus, jqXHR) {
		    $.each(data, function (key, val) {
		        
		        $('#' + category + ' .section__content').append(
                    '<div id="' + getElementIdFromContentId(val) + '" class="game game--banner">' +
						'<div class="game__banner-container"></div>' +
					'</div>'
				);
		    });

            $('#' + category + ' .section__content .game').each(function () {
			    var contentId = getContentIdFromElement($(this));
			    setBannerImage(contentId, category);
			});
		    
		}
	);
}


var setBannerImage = function(contentId, category)
{
    var elementId = getElementIdFromContentId(contentId);
    var $container = $('#' + category + ' #' + elementId + ' .game__banner-container');
    //$('#' + category + ' #' + elementId + ' .game__banner-container')

    $container.append('<a href="/Detail/' + contentId + '"> ' +
					'<img src="/rest/gameimage/' + contentId + '?key=Banner2" class="game__image--banner img-rounded" />' +
				'</a>');

    $container.click(function() {
        ga('send', 'event', 'home', 'click', 'game_of_the_week');
    });

}


var homeGetGame = function (contentId, category) {

    var languageCode = $('html').attr('lang');

    setContentImage(contentId, category);

    $.ajax({
        type: 'GET',
        url: '/rest/game/' + contentId + '?languageCode=' + languageCode,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            setContentText(data, category);
        }
    });

    setBuySubscribeButtons(contentId, category);
};

var setContentImage = function (contentId, category) {
	var elementId = getElementIdFromContentId(contentId);
	$('#' + category + ' #' + elementId + ' .game__image-container')
		.append('<a href="/Detail/' + contentId + '"> ' +
					'<img src="/rest/gameimage/' + contentId + 
					'?key=Square0" class="game__image img-rounded" />' +
				'</a>');
};

var setContentText = function (gameData, category) {
	var elementId = getElementIdFromContentId(gameData.ContentId);

	$('#' + category + ' #' + elementId + ' .game__title')
		.append(
			'<a class="game__title-link" href="/Detail/' + gameData.ContentId + '"> ' +
				 gameData.Name + 
			'</a>');
};

var setSearchAutoCompletion = function () {

    $("#search").typeahead({
        minLength: 1,
        hint: false,
        highlight: false,
        source: function (keyword, process) {

            var handsetid = parseInt($('#handsetid').val());
            if (handsetid == null)
                return;

            var getNamesUrl =
                'rest/gamenames?keyword=' + keyword + '&handsetid=' + handsetid;

            $.getJSON(getNamesUrl, null, function (data) {
                var newData = [];
                $.each(data, function (key, val) {
                    newData.push(val);
                });
                return process(newData);
            });
        }
    });
};

var resizeSearchBar = function () {

    var sizeTxt = $("#multilayers").css("width").replace("px", "");
    var paddingLeft = $("#search").css("padding-left").replace("px", "");
    var paddingRight = $("#search").css("padding-right").replace("px", "");
    var size = parseInt(sizeTxt)
              - parseInt(paddingLeft)
              - parseInt(paddingRight)
    $("#search").css("width", size);
};

