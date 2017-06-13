var app = getApp();
var http_method = require('../common/http.js');
var stars_score = require('../common/stars-score.js');
var convert = require('../common/convert.js');
Page({
    data: {
        movie: {}
    },
    onLoad: function (options) {
        var movieId = options.id;
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
        http_method.http(url, this.processDoubanData);
    },
    processDoubanData: function (data) {
        if(!data){
            return;
        }
        //兼容老版本API数据
        var director = {
            avatar: "",
            name: "",
            id: ""
        }
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large;
            }
            director.name = data.directors[0].name;
            director.id = data.directors[0].id;
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            originalTitle: data.original_title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: stars_score.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: convert.convertToCastString(data.casts),
            castsInfo: convert.convertToCastInfos(data.casts),
            summary: data.summary
        }
        this.setData({
            movie: movie
        })
    },
    viewMoviePostImg:function(event){
        var src = event.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src]
        })
    }
})