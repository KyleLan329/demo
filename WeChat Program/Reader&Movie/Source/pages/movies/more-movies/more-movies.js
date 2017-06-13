// pages/movies/more-movies/more-movies.js
var app = getApp();
var common = require('../common/http.js');
var stars_score = require('../common/stars-score.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        this.data.navigateTitle = category;
        var dataUrl = "";
        switch (category) {
            case "正在上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
                break;
        }
        this.data.requestUrl = dataUrl;
        common.http(dataUrl, this.processDoubanData);
    },
    onReachBottom: function () {
        var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count = 20";
        common.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },
    onPullDownRefresh: function(){
        var refreshUrl = this.data.requestUrl + "?start=0&count = 20";
        this.data.movies = {};
        this.data.isEmpty = true;
        common.http(refreshUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },
    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            }
            var temp = {
                stars: stars_score.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);
        }
        // 判断是否需要叠加获取到的电影数据
        var totalMovies = {};
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.totalCount += 20;
        wx.hideNavigationBarLoading();
    },
    onReady: function (event) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
        })
    },
    onMoiveTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "../movie-detail/movie-detail?id=" + movieId
        });
    }
})