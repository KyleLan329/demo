function http(url,callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "application/xml"
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (error) {
            console.log(error);
        }
    })
}

module.exports = {
    http:http
}