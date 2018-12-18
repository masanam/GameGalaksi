/// <reference path="_references.js" />
var setTitle = function () {
    var title = '';
    var listType = $('#ListType').val();
    if (listType === 'T')
        title = localizationText.listTopGame;
    else if (listType === 'N')
        title = localizationText.listNewGame;
    else if (listType === 'M')
        title = localizationText.listAllGame;

    $(".page-title").append("<h3>" + title + "</h3>");

};