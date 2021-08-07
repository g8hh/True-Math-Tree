let modInfo = {
	name: "True Math Tree",
	id: "True Math Tree",
	author: "QwQ(QwQe308,qq3174905334)",
	pointsName: "点数(P)",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.1-beta",
	name: "",
}

let changelog = `<h1>更新:</h1><br>
	<h3>v1.1-beta</h3><br>
		- 添加亿点内容,重新平衡部分内容,当前endgame:约e100 000 000(e1e8)点数,e20 000 000(e2e7)增量点,e2e6pp,2e23高德纳箭头点.<br><br>
	<h3>v1.02</h3><br>
		- 修复ac11无法完成的问题.<br><br>
	<h3>v1.01</h3><br>
		- 添加1个g里程碑,重新平衡部分内容,当前endgame:约e23 826 000点数,e9 925 000增量点,e8740pp,2e22高德纳箭头点.<br><br>
	<h3>v1.0</h3><br>
		- 添加1个ap挑战,5个p升级,5个里程碑,重新平衡部分内容,当前endgame:约e8 120 000点数,e5 714 000增量点,e2765pp,4e21高德纳箭头点.<br><br>
	<h3>v0.91</h3><br>
		- 又一次平衡,改正endgame为: 约e2 000 000点数,e7 459 000增量点,e1310pp,3e20高德纳箭头点.<br><br>
	<h3>v0.9</h3><br>
		- 添加ap挑战,五个p升级,两个ap里程碑,成吨的log级软上限(?),重新平衡部分内容,当前endgame:约e1 485 000点数,e7 447 800增量点,e1290pp,4e16高德纳箭头点.<br><br>
	<h3>v0.81</h3><br>
		- 修复bug.<br><br>
	<h3>v0.8</h3><br>
		- 添加两个层级,对应的内容和两个ap里程碑,重新平衡部分内容,当前endgame:约e508500点数,e900000增量点,1e970pp,6e14高德纳箭头点.<br><br>
	<h3>v0.7</h3><br>
		- 添加5个升级和9个里程碑,当前endgame:约e70000点数,e315000增量点,1e215pp,7.5e10高德纳箭头点.*欢迎来到第三排ap升级<br><br>
	<h3>v0.61</h3><br>
		- 你现在可以禁用重置ap升级按钮的确认框.<br><br>
	<h3>v0.6</h3><br>
		- 添加六个ap升级和四个ap里程碑,当前endgame:约1e3800点数,1e2850增量点,1e50pp,750000高德纳箭头点(约50个被重置升级达到该上限).<br><br>
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
function getPointGen(calc = false) {
	if(!canGenPoints && !calc) return new ExpantaNum(0)
	var gain = player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1).mul(player.c.tickspeed)
	
	if(hasUpgrade("p",12)) gain = gain.mul(upgradeEffect("p",12))
	if(hasUpgrade("p",14)) gain = gain.mul(upgradeEffect("p",14))
	/*(if(hasUpgrade("p",42)) gain = gain.mul(upgradeEffect("p",42))
	else*/ gain = gain.div(upgradeEffect("p",13))
	
	gain = gain.mul(layers.a.effect3())
	gain = gain.mul(layers.i.effect())
	if(hasMilestone("a",9)) gain = gain.pow(layers.a.effect5())
	//token
	gain = gain.pow(tokenEffect(11))
	
	if(inChallenge("a",11) || player.t.nerf.AC.eq(1) || player.t.nerf.AC.eq(3)) gain = gain.pow(0.33)
	if(inChallenge("a",12) || player.t.nerf.AC.eq(2) || player.t.nerf.AC.eq(3)) gain = gain.pow(0.5)
	if(inChallenge("a",21)) gain = gain.pow(0.25)
	gain = gain.root(player.t.nerf.point)

	if(gain.gt(1e100)){
		var sc = 4
		if(hasUpgrade("a",12)) sc -= 1
		if(hasUpgrade("a",22)) sc -= 1
		gain = gain.root(sc).mul(1e100**(1-1/sc))
	}	
	if(!hasMilestone("a",10)) gain = powsoftcap(gain,e("e500"),e(2))
	var e4ksc = 5
	if(hasMilestone("a",17)) e4ksc-=1
	gain = powsoftcap(gain,e("e4000"),e(e4ksc))
	gain = powsoftcap(gain,e("e20000"),e(4))
	gain = powsoftcap(gain,e("e100000"),e(5))
	gain = logsoftcap(gain,e("e1e7"),e(0.25))
	
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return `P `+(hasUpgrade("p",13)?"+":"=")+` <text style="color: lime">b</text>↑<sup style="color: lime">a</sup>Min(<text style="color: lime">c</text>,<text style="color: lime">cmax</text>)-<text style="color: lime">b</text> (= ${format(player.c.basepoints1,5)}↑<sup>${format(player.c.arrows,3)}</sup>${format(player.c.basepoints2,2)}-${format(player.c.basepoints1,5)})`+(hasUpgrade("p",13)?`/s = +${format(player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1),5)}/s`:"")},
	function(){return `a=${format(player.c.arrows,2)}(3) , b=${format(player.c.basepoints1,5)}(1.0001) , c=t/20+1=${format(player.c.tbasepoints2)}(1) , cmax=${format(getMaxBP(),2)} , t = ${format(player.c.tick)}(0)`},
	function(){
		var basestr = `时间速率(ts) = ${format(player.c.tickspeed)}`
		if(inChallenge("a",12) || player.t.nerf.AC.eq(2) || player.t.nerf.AC.eq(3)) basestr = basestr + `(${format(calcTickspeed())})`
		return basestr
	},
	function(){return `当前endgame:约e100 000 000(e1e8)点数,e20 000 000(e2e7)增量点,e2e6pp,2e23高德纳箭头点.(你不一定要刷到endgame,这只是beta版)`},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("e1e8")&&player.i.points.gte("e2e7")&&player.p.points.gte("e2e6")&&player.a.points.gte(2e23)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(1) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}