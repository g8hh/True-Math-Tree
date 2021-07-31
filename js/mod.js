let modInfo = {
	name: "True Math Tree",
	id: "True Math Tree",
	author: "QwQ(QwQe308,qq3174905334)",
	pointsName: "点数(P)",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 10,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.5",
	name: "",
}

let changelog = `<h1>更新:</h1><br>
	<h3>v0.5</h3><br>
		- 添加四个ap升级和一个ap里程碑,当前endgame:约1e300点数,1e800增量点,1e20pp,611高德纳箭头点.<br><br>
	<h3>v0.41</h3><br>
		- 加速3ap以后的进度.<br><br>
	<h3>v0.4</h3><br>
		- 添加内容,当前endgame:约1e110点数,1e26增量点,1e13pp,50高德纳箭头点.<br><br>
	<h3>v0.31</h3><br>
		- 修复一个bug.<br><br>
	<h3>v0.3</h3><br>
		- 修复一个bug.<br>
		- 添加内容,当前endgame:1e70点数,1e10pp,3ap.<br><br>
	<h3>v0.23</h3><br>
		- 修复一个bug.<br><br>
	<h3>v0.22</h3><br>
		- 再次修改公式的显示.<br>
		- 高亮显示公式中的变量.<br><br>
	<h3>v0.21</h3><br>
		- 修改公式的显示.<br><br>
	<h3>v0.2</h3><br>
		- 添加3个升级.<br>
		- 添加两个可购买项.<br>
		- 重新平衡.<br>
		- 添加endgame.当前endgame:1e25点数,1e8pp.<br><br>
	<h3>v0.1</h3><br>
		- 添加p节点.<br>
		- 添加7个升级.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasUpgrade("p",13)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints) return new ExpantaNum(0)
	var gain = player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1).mul(player.c.tickspeed)
	gain = gain.div(upgradeEffect("p",13))
	if(hasUpgrade("p",12)) gain = gain.mul(upgradeEffect("p",12))
	if(hasUpgrade("p",14)) gain = gain.mul(upgradeEffect("p",14))
	gain = gain.mul(layers.a.effect3())
	gain = gain.mul(layers.i.effect())
	if(gain.gt(1e100)){
		var sc = 4
		if(hasUpgrade("a",12)) sc -= 1
		gain = gain.root(sc).mul(1e100**(1-1/sc))
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return `P `+(hasUpgrade("p",13)?"+":"=")+` <text style="color: lime">b</text>↑<sup style="color: lime">a</sup>Min(<text style="color: lime">c</text>,<text style="color: lime">cmax</text>)-<text style="color: lime">b</text> (= ${format(player.c.basepoints1,5)}↑<sup>${format(player.c.arrows,3)}</sup>${format(player.c.basepoints2,2)}-${format(player.c.basepoints1,5)})`+(hasUpgrade("p",13)?`/s = +${format(player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1),5)}/s`:"")},
	function(){return `a=${format(player.c.arrows,2)}(3) , b=${format(player.c.basepoints1,5)}(1.0001) , c=t/20+1=${format(player.c.tbasepoints2)}(1) , cmax=${format(getMaxBP(),2)} , t = ${format(player.c.tick)}(0)`},
	function(){return `时间速率 = ${format(player.c.tickspeed)}`},
	function(){return `当前endgame:约1e300点数,1e800增量点,1e20pp,611高德纳箭头点`},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(1e300)&&player.i.points.gte("1e800")&&player.p.points.gte(1e20)&&player.a.points.gte(611)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}