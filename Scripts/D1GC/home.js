/// <reference path="_references.js" />

window.onresize = function (event) {

    //  resizeSearchBar();//TODO put back 
};

var loadCategory = function (category, categoryChar, title, moreTitle) {
	loadCategoryStructure(category, categoryChar, title, moreTitle);
	loadGamesDetails(category, categoryChar);
};


var loadCategoryStructure = function (category, categoryChar, title, moreTitle) {

	$('#displayed-in-home-categories').append(
		'<div id="' + category + '" class="category"> ' +
		'</div>'
		);

	$('#' + category).append(
        '<div class="game-list__header">' +
		    '<div class="game-list__title"> ' + title + '</div>' +
            '<div class="game-list__show-more">' +
                '<a class="game-list__show-more-link" href="List/' + categoryChar + '">' + moreTitle + '</a>' +
            '</div>' +
        '</div>' +
		'<div class="game-list__content">' + '</div>'
		);
};

var homeGetUrl = function (listType, pageSize, pageNumber) {
    var handsetid = parseInt($('#handsetid').val());
	return '/rest/gameids?groupid=' + listType +
	 '&pageNumber=' + pageNumber + '&itemCount=' + pageSize + '&handsetid=' + handsetid;
};

var loadGamesDetails = function (category, categoryChar) {

	var pageSize = 3;
	var pageNumber = 0;
	var url = homeGetUrl(categoryChar, pageSize, pageNumber);
    var altRow = false;
	$.getJSON(
		url,
		null,
		function (data, textStatus, jqXHR) {
		    $.each(data, function (key, val) {
		        var altClass = (altRow === true) ? ' game--alternate' : '';
		        altRow = !altRow;

		        var isSubscribed = $('#isSubscribed').val();
		        var button = 
                    (isSubscribed === 'True')
		            ? '<a class="game__buy-button-link" href="/purchase/buy?contentId=' + val +'&ppd=false">' +
		                 '<img class="game__buy-button-image" src="/Images/General/D1GC/download-button.png" alt="Join Now!"/>' +
		              '</a>'
		            : '<a class="game__buy-button-link" href="/subscribe/subscribe">' +
		                 '<img class="game__buy-button-image" src="/Images/General/D1GC/get-button.png" alt="Join Now!"/>' +
		              '</a>';

				$('#' + category + ' div.game-list__content').append(
                    '<div id="' + getElementIdFromContentId(val) + '" class="game' + altClass + '">' +
						'<div class="game__image-container"></div>' +
                        '<div class="game__title"></div>' +
						'<div class="game__category"></div>' +
						'<div class="game__buy-button">' +
                            button +    
                        '</div>' +
					'</div>'
				);
			});

			$('#' + category + ' .game-list__content .game').each(function () {
			    var contentId = getContentIdFromElement($(this));
			    homeGetGame(contentId, category);
			});

		}
	);
};

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
	$('#' + category + ' #' + elementId + ' .game__category')
		.append(gameData.Category);
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

