/// <reference path="_references.js" />

var AddCategory = function (val, languageCode) {

    var href = '/GameCategory?categoryId=' + val.GameCategoryId;
    var pictureLink = 'rest/GameCategoryImage?gameCategoryId=' + val.GameCategoryId +
                                  '&languageCode=' + languageCode;

    $('#category-list tbody').append(
        '<tr id="' + getElementIdFromCategoryId(val.GameCategoryId) + '" class="item">' +
        '        <td class="pic">' +
        '           <a href="' + href + '">' +
        '               <img src="' + pictureLink + '" class="img-rounded" alt="' + val.Name + '"/>' +
        '           </a>' +
        '        </td>' +
        '        <td class="name">'+
        '           <a href="' + href + '">'+
                        val.Name +
        '           </a>' +
        '        </td>' +
        '</tr>');
};

var getCategoryIdFromElementId = function (elementId) {
    return elementId.replace('category-', '');
};

var getElementIdFromCategoryId = function (gameCategoryId) {
    return 'category-' + gameCategoryId;
};
