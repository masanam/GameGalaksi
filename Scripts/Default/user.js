/// <reference path="_references.js" />

$(document).ready(function () {
    var uid = $('#uid').val();
    var handsetid = $('#handsetid').val();
    $.getJSON(
        '/rest/userdetail?uid=' + uid + '&handsetId=' + handsetid,
        null,
        function (data, textStatus, jqXHR) {
            $('#msisdn').text(data.Msisdn);
            $('#handset').text(data.HandsetModel);
        });
});