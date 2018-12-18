String.prototype.format = function () {
    arguments = arguments || [];
    var args = [];
    for (var i = 0, len = arguments.length; i < len; i++)
        args[i] = arguments[i];
    return this.replace(/\{(\d+)\}/g, function (m, i) {
        return args[i];
    });
};