function calcTickspeed(){
    var tickspeed = new ExpantaNum(1)
    if(hasMilestone("a",0)) tickspeed = tickspeed.mul(5)
    if(hasUpgrade("p",21)) tickspeed = tickspeed.mul(upgradeEffect("p",21))
    if(hasUpgrade("p",41)) tickspeed = tickspeed.mul(upgradeEffect("p",41))
    //token
    tickspeed = tickspeed.pow(tokenEffect(11))
    tickspeed = tickspeed.pow(tokenEffect(12))

    if(tickspeed.gte(1e18)){
        var sc = 3
        if(hasUpgrade("a",15)) sc = 1.25
        tickspeed = tickspeed.root(sc).mul(1e18**(1-1/sc))
    }
    tickspeed = logsoftcap(tickspeed,e("e150000"),hasMilestone("a",28)? 0.175:0.5)
    tickspeed = tickspeed.mul(layers.b.effect())
    tickspeed = tickspeed.mul(layers.g.effect())
    tickspeed = powsoftcap(tickspeed,e("e200000"),e(3))
    tickspeed = logsoftcap(tickspeed,e("e360000"),0.05)
    tickspeed = logsoftcap(tickspeed,e("e400000"),0.1)
    tickspeed = logsoftcap(tickspeed,e("e600000"),0.25)
    return tickspeed
}
function getbp1(){
    var bp = new ExpantaNum(.0001)
    bp = bp.root(layers.p.effect()).add(1)
    bp = bp.mul(buyableEffect("a",11))
    return bp
}
function geta(){
    var a = new ExpantaNum(3)
    if(!hasMilestone("a",2)) a = a.mul(layers.a.effect1())
    else a = ten.div(layers.a.effect1())
    if(hasMilestone("a",14)) a = one
    return a.round().min(6).max(1)
}
function getMaxBP(){
    var cmax = new ExpantaNum(.5)
    cmax = cmax.root(layers.a.effect2()).add(1)
    cmax = cmax.mul(buyableEffect("a",11))
    cmax = cmax.mul(buyableEffect("a",12))
    cmax = powsoftcap(cmax,e(10000),e(5))
    return cmax
}
var proc = new ExpantaNum(0)

addLayer("c", {
    name: "calc", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
        arrows: new ExpantaNum(3),
        basepoints1: new ExpantaNum(1.0001),
        basepoints2: new ExpantaNum(1),
        tbasepoints2: new ExpantaNum(1),
        tickspeed: new ExpantaNum(0),
        tick: new ExpantaNum(0),
    }},
    color: "lime",
    resource: "???", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return false},
    //clickables: {
        //part1
        //11: {
        //    canClick(){return true},
        //    display() {return `Update the game<br />You've updated ${Utimeformat(player.u.updtime)}.<br /><br />Now you are doing:${updtxt[player.u.doing]}`},
        //    onClick(){player.u.doing = "upd"}
        //},
    //},
    /*
    upgrades: {
        11: {
            description: "next update is in 5 hours。",
            cost(){return new OmegaNum(5)},
            unlocked(){return true},
            currencyDisplayName:"hours of update time"
        },
    },
    */
    /*
    challenges: {
        11: {
            name: "AntiLooperrrr",
            challengeDescription: "因为挑战出了bug，devU13被禁用了。刷新后的第一帧时间计数x100。",
            canComplete(){return player.points.gte(1e10)},
            goalDescription(){return format(ExpantaNum(1e10))+"点数"},
            rewardDisplay(){return `你永远保留dev11的效果，同时“刷新后的第一帧时间计数x100。”被保留。`},
            unlocked(){return hasUpgrade("dev",15)}
        },
    },
    */

    //important!!!
    update(diff){        
        player.c.tickspeed = calcTickspeed().max(1)
        if(inChallenge("a",12) || player.t.nerf.AC.eq(2) || player.t.nerf.AC.eq(3)) player.c.tickspeed = player.c.tickspeed.min(10)
        player.c.tick = player.c.tick.add(player.c.tickspeed.mul(diff))
        player.c.basepoints2 = player.c.tick.div(20).add(1).min(getMaxBP())
        player.c.tbasepoints2 = player.c.tick.div(20).add(1)
        /*
        if(player.c.basepoints2.gt(getMaxBP())&&isLastBP2IsMaxed&&player.p.autoReset){
            player.p.points = player.p.points.add(player.c.basepoints2.sub(1))
            player.c.basepoints2 = new ExpantaNum(1)
            isLastBP2IsMaxed = false
        }
        if(player.c.basepoints2.gt(getMaxBP())){
            player.c.basepoints2 = new ExpantaNum(getMaxBP())
            isLastBP2IsMaxed = true
        }
        */
        player.c.basepoints1 = getbp1()
        player.c.arrows = geta()

        if(!hasUpgrade("p",13)) player.points = getPointGen(true)
    }
})