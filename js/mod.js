let modInfo = {
	name: "True Math Tree",
	id: "True Math Tree",
	author: "QwQ(QwQe308,qq3174905334)",
	pointsName: "点数",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 10,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

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
	var gain = player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1).div(5).mul(player.c.tickspeed)
	if(hasUpgrade("p",12)) gain = gain.mul(upgradeEffect("p",12))
	if(hasUpgrade("p",14)) gain = gain.mul(upgradeEffect("p",14))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function(){return `点数`+(hasUpgrade("p",13)?"基础产量":"")+`= 数字1{箭头数}Min(数字2,1.5)-数字1 (= ${format(player.c.basepoints1,5)}{${format(player.c.arrows),3}}${format(player.c.basepoints2,2)}-${format(player.c.basepoints1,5)})`+(hasUpgrade("p",13)?` = ${format(player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1),5)}`:"")},
	function(){return `t = ${format(player.c.tick)}`},
	function(){return `时间速率 = ${format(player.c.tickspeed)}`},
]

// Determines when the game "ends"
function isEndgame() {
	return false
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