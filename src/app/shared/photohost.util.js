/**
 *
 * @param obj
 * @returns {boolean}
 */
function isObject(obj) {
    return obj === Object(obj);
}

/**
 *
 * @param val
 * @returns {boolean}
 */
function isNaN(val) {
    return val !== val;
}

/**
 * Get Image Url
 * @param image
 */
function getImageUrl(image) {

    var url = SERVER_URL;

    if (image.uniqId) {
        url += '/img/' + image.path + '/' + image.uniqId + '.' + image.extension;
    } else {
        url += '/img/' + image.path + '/' + image._id + '.' + image.extension;
    }

    return url;
}