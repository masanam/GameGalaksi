/// <reference path="_references.js" />
var setCategoryTitle = function () {

    var languageCode = $('html').attr('lang');

    $.getJSON(
        '/rest/categories?languageCode=' + languageCode,
        null,
        function (data, textStatus, jqXHR) {

            var categoryId = parseInt($('#CategoryId').val());

            $.each(data, function (key, val) {
                if (val.GameCategoryId === categoryId) {
                    $(".page-title").append("<h3>" + val.Name + "</h3>");
                }
            });
        }
    );

};