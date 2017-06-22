var vm = new Vue({
	el:"#app",
	data: {
		totalMoney: 0,
		productList: [],
		checkAllFlag:false,
		delFlag: false
	},
	filters: {
		formatMoney: function (value) {
			return "¥"+value.toFixed(2);
		}
	},
	mounted: function () {
		this.$nextTick(function () {
			this.cartView();
		});
	},
	methods: {
        cartView: function () {
            var _this = this;
            this.$http.get("data/cartData.json").then(function (res) {
                _this.productList = res.data.result.list;
            });
        },
        changeMoney: function (product, way) {
            if (way > 0) {
                product.productQuantity++;
            } else {
                product.productQuantity--;
                if (product.productQuantity < 2) {
                    product.productQuantity = 1;
                }
            }
            this.calcTotalMoney();

        },
        selectedProduct: function (item) {
            if (typeof item.checked == 'undefined') {
                Vue.set(item, "checked", true);
                //this.$set()
            } else {
                item.checked = !item.checked;
            }
            this.calcTotalMoney();
        },
        checkAll: function (flag) {
            this.checkAllFlag = flag;
            var _this = this;
			this.productList.forEach(function (item, index) {
				if (typeof item.checked == 'undefined') {
					_this.$set(item, "checked", _this.checkAllFlag);
					//this.$set()
				} else {
					item.checked = _this.checkAllFlag;
				}
			})
            this.calcTotalMoney();
		},
		calcTotalMoney: function () {
        	var _this = this;
        	this.totalMoney = 0;
            this.productList.forEach(function (item, index) {
                if(item.checked){
                	_this.totalMoney += item.productPrice * item.productQuantity;
				}
            })
        },
        delConfirm: function (item) {
        	this.delFlag = true;
        	this.curProduct = item;
		},
		delProduct: function () {
        	var index = this.productList.indexOf(this.curProduct);
        	this.productList.splice(index,1);
            this.delFlag = false;
		}
    }
});