Page({
    onTap: function (event) {
        wx.switchTab({
            url: "../posts/post"
        });
        
        // wx.navigateTo({
        //     url: "../posts/post"
        // });

        // wx.redirectTo({
        //     url: "../posts/post"
        // });  
    }
})