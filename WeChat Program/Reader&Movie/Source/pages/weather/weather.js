Page({
    data:{
        city:"",
        district: ""
    },
    onLoad: function () {
        this.loadInfo();    
    },
    loadInfo: function () {
        var _that = this;
        wx.getLocation({
            type: 'wgs84', 
            success: function (res) {
                var latitude = res.latitude;
                var longitude = res.longitude;
                console.log(latitude,longitude);
                _that.loadCity(latitude,longitude);
            }
        })
    },
    loadCity: function (latitude, longitude) {
        var _that = this;
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+latitude+','+longitude+'&coord_type=5&key=LCMBZ-NMFWS-XUTOR-6CNF5-TNN3Q-X3FAG', 
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
                var city = res.data.result.ad_info.city;
                var district = res.data.result.ad_info.district;
                _that.setData({
                    city: city,
                    district: district 
                });
                _that.localWeather(city);
            }
        })
    },
    localWeather: function (city) {
        var _that = this;
        wx.request({
            url: 'https://free-api.heweather.com/v5/weather?city='+city+'&key=67ce7726d23b45318d8e3b5c07fbf0c7',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data);
            }
        });
    }
})