var stars_score = require('../movies/common/stars-score.js');
var app = getApp();

Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        text: "",
        searchResult: {},
        containerShow: true,
        searchPanelShow: false,
        totalCount: 0,
        isSearchEmpty: true
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在上映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "Top250");

    },
    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "application/xml"
            },
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function (error) {
                console.log(error);
            }
        })
    },
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult: {}
        })
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true,
        })
    },
    onBindConfirm: function (event) {
        var text = event.detail.value;
        this.data.text = text;
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
        wx.showNavigationBarLoading();
    },
    onReachBottom: function () {
        var nextUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + this.data.text + "&start=" + this.data.totalCount + "&count=20";
        this.getMovieListData(nextUrl, "searchResult", "");
        wx.showNavigationBarLoading();
    },
    onPullDownRefresh: function () {
        var refreshUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + this.data.text + "&start=0&count=20";
        this.data.searchResult = {};
        this.data.isSearchEmpty = true;
        this.data.totalCount = 0;
        this.getMovieListData(refreshUrl, "searchResult", "");
        wx.showNavigationBarLoading();
    },
    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
        if (settedKey !== "searchResult") {
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
            var readyData = {};
            readyData[settedKey] = {
                categoryTitle: categoryTitle,
                movies: movies
            };
            this.setData(readyData);
        } else {
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
            var totalMovies = {};
            if (!this.data.isSearchEmpty) {
                totalMovies = this.data.searchResult.movies.concat(movies);
            } else {
                totalMovies = movies;
                this.data.isSearchEmpty = false;
            }
            var readyData = {};
            readyData[settedKey] = {
                categoryTitle: categoryTitle,
                movies: totalMovies
            };
            this.setData(readyData);
            this.data.totalCount += 20;
            wx.hideNavigationBarLoading();
        }

    },
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: "more-movies/more-movies?category=" + category
        });
    },
    onMoiveTap: function (event) {
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
            url: "movie-detail/movie-detail?id=" + movieId
        });
    }

})