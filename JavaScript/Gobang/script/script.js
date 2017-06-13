
var gobangBoard = [];
var wins = [];
var me = true;
var over = false;

// 棋牌标记，防止重复落子
for(var i=0; i<15; i++) {
	gobangBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		gobangBoard[i][j] = 0;
	}
}
// 记录胜利的落子模型
for(var i=0; i<15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
	wins[i][j]= [];
	}
} 
// 记录胜利的落子模型-竖排
var count = 0;
var myWin = [];
var pcWin = [];

for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k <5; k++) {
			wins[i][j+k][count] = true;
		}
		count++;	
	}
}
// 记录胜利的落子模型-横排
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k <5; k++) {
			wins[j+k][i][count] = true;
		}
		count++;	
	}
}
// 记录胜利的落子模型-斜线
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k <5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;	
	}
}

// 记录胜利的落子模型-反斜线
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k <5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;	
	}
}

console.log(count);

for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	pcWin[i] = 0;
}

var gobang = document.getElementById('gobang');
var context = gobang.getContext('2d');

context.strokeStyle = "#BFBFBF";
// 棋盘初始化
var logo = new Image();
logo.src = "img/timg.jpg";
logo.onload = function(){
	context.drawImage(logo, 0, 0, 450, 450);
	drawGoBangBoard();
}
// 画出15*15的棋盘
var drawGoBangBoard = function(){
for (var i = 0; i < 15; i++) {
	context.moveTo(15 + i*30, 15);
	context.lineTo(15 + i*30, 435);
	context.stroke();
	context.moveTo(15, 15 + i*30);
	context.lineTo(435, 15 + i*30);
	context.stroke();
	}
}
// 每一步落子的实现，黑白交替
var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 - 2, 13, 15 + i*30 + 2, 15 + j*30 - 2, 0);
	if (me) {
		gradient.addColorStop(0, "#0A0A0A");
		gradient.addColorStop(1, "#636766");
	} else {
		gradient.addColorStop(0, "#CCCCCC");
		gradient.addColorStop(1, "#FFFFFF");
	}
	context.fillStyle = gradient;
	context.fill();
}
// 鼠标点击棋盘事件，在最近的一个交叉点落子
gobang.onclick = function(e) {
	if (over) {
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX; // 获取鼠标相对棋盘的X坐标
	var y = e.offsetY; // 获取鼠标相对棋盘的Y坐标
	var i = Math.floor(x / 30); //棋盘每列间隔 30px
	var j = Math.floor(y / 30); //棋盘每行间隔 30px
	if(gobangBoard[i][j] == 0) {
		oneStep(i, j, me);
		gobangBoard[i][j] = 1;		
		for(var k=0; k<count; k++){
			if(wins[i][j][k]){
				myWin[k]++;
				pcWin[k] = 6;
				if (myWin[k] == 5) {
					//window.alert("You win！(＾ω＾)");
					setTimeout("renew(1)",500);
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			pcAI();
		}

	}	
}
// PC落子规则
var pcAI = function(){
	var myScore = [];
	var pcScore = [];
	var max = 0;
	var u = 0, v = 0;
	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		pcScore[i] = [];
		for (var j = 0; j < 15; j++) {
				myScore[i][j] = 0;
				pcScore[i][j] = 0;
		}	
	}
		for (var i = 0; i < 15; i++) {
			for (var j = 0; j < 15; j++) {
				if(gobangBoard[i][j] == 0){
					for (var k = 0; k < count; k++) {
						if (wins[i][j][k]) {
							if(myWin[k] == 1) {
								myScore[i][j] += 200;
							} else if (myWin[k] == 2) {
								myScore[i][j] += 400;
							} else if (myWin[k] == 3) {
								myScore[i][j] += 2000;
							} else if (myWin[k] == 4) {
								myScore[i][j] += 10000;
							}
							if(pcWin[k] == 1) {
								pcScore[i][j] += 400;
							} else if (pcWin[k] == 2) {
								pcScore[i][j] += 800;
							} else if (pcWin[k] == 3) {
								pcScore[i][j] += 4000;
							} else if (pcWin[k] == 4) {
								pcScore[i][j] += 20000;
							}
						}
					}
					if (myScore[i][j] > max) {
						max = myScore[i][j];
						u = i;
						v = j;
					} else if (myScore[i][j] == max) {
						if (pcScore[i][j] > pcScore[u][v]) {
							u = i;
							v = j;
						}
					}
					if (pcScore[i][j] > max) {
						max = pcScore[i][j];
						u = i;
						v = j;
					} else if (pcScore[i][j] == max) {
						if (myScore[i][j] > myScore[u][v]) {
							u = i;
							v = j;
						}
					}
				}
			}
		}
	
	oneStep(u, v, false);
	gobangBoard[u][v] = 2;
	for(var k=0; k<count; k++){
		if(wins[u][v][k]){
			pcWin[k]++;
			myWin[k] = 6;
			if (pcWin[k] == 5) {

				//setTimeout("alert('PC win！You lose... T^T')",1000);
				setTimeout("renew(2)",500);
				over = true;
				}
			}
		}  
    
    if (!over) {
		me = !me;
	} 
}


var btn = document.getElementById('btn');
btn.onclick = function(){
	renew();
}

function renew(a){
	if (a == 2) {
		var response = confirm("PC win！You lose... T^T,Renew the game?");
	}else if (a == 1) {
		var response = confirm("You win！(＾ω＾),Renew the game?");
	} else if (!a) {
		var response = confirm("Renew the game?");
	}

	if(response){
		 window.location.reload();
	}
}