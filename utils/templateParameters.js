module.exports = function (message, parameters) {
    let msg = message;
    let re = /•--((?:(?!--•).)+)--•/g,
        str = message;
    while ((match = re.exec(str)) != null) {
        if (parameters[match[1]] !== undefined) {
            msg=msg.replace(match[0], parameters[match[1]]);
        }
        else {
            msg=msg.replace(match[0], " Not specified. ");
        }
    }

return msg;

}