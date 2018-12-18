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
                    $(".section__header").append(val.Name);
                }
            });
        }
    );

};