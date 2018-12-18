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
		'<div class="title row-fluid gradient-home-categories"> ' +
			'<h4> &raquo; ' + title + ' </h4> ' +
		'</div>' +
		'<div class="content-games">' +
		'  <div class="game-list">' +
		'  </div>' +
		'</div>'
		);

    if (moreTitle == null) return;

    // Add "More games" button
    $('#' + category + ' div.content-games').append(
		'<div class="btn-more btn-curved gradient-blue-bright btn-text-1line">' +
			'<a href="List/' + categoryChar + '">' +
			moreTitle +
			'</a>' +
		'</div>'
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

	$.getJSON(
		url,
		null,
		function (data, textStatus, jqXHR) {
			$.each(data, function (key, val) {
				$('#' + category + ' div.game-list').append(
                    '<div id="' + getElementIdFromContentId(val) +
                        '" class="game-entry row-fluid gradient-pale">' +
						'<span class="content-image">' +
						'</span>' +
                        '<div class="content-name"> </div>' +
						'<div class="content-description">' +
							'<small></small>' +
						'</div>' +
						'<div class="btns" align="center">' +
						'</div>' +
					'</div>'
				);
			});

			$('#' + category + ' div.game-list div.game-entry').each(function () {
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
	$('#' + category + ' #' + elementId + ' .content-image')
		.append('<a href="/Detail/' + contentId + '"> ' +
					'<img src="/rest/gameimage/' + contentId + 
					'?key=Square0" class="img-rounded" />' +
				'</a>');
};

var setContentText = function (gameData, category) {
	var elementId = getElementIdFromContentId(gameData.ContentId);

	$('#' + category + ' #' + elementId + ' div.content-name')
		.append(
			'<a href="/Detail/' + gameData.ContentId + '"> ' +
				 gameData.Name + 
			'</a>');
	$('#' + elementId + ' div.content-description small')
		.append(gameData.Wap);
};

var setSearchAutoCompletion = function () {

    $("#search").typeahead({
        minLength: 1,
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

