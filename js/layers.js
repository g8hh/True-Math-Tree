function calcTickspeed(){
    var tickspeed = new ExpantaNum(1)
    if(hasUpgrade("p",21)) tickspeed = tickspeed.mul(upgradeEffect("p",21))
    return tickspeed
}
function getbp1(){
    var bp = new ExpantaNum(.0001)
    bp = bp.root(layers.p.effect())
    return bp.add(1)
}
function getMaxBP(){
    return new ExpantaNum(1.5)
}
var isLastBP2IsMaxed = false
var one = new ExpantaNum(1)
var two = new ExpantaNum(2)
var ten = new ExpantaNum(10)
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
        player.c.tickspeed = calcTickspeed()
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

        if(!hasUpgrade("p",13)){
        var points = player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1)
        if(hasUpgrade("p",12)) points = points.mul(upgradeEffect("p",12))
        player.points = points
        }
    }
})

addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
    }},
    color: "lime",
    resource: "重置点(pp)", // Name of prestige currency
    baseResource: "数字2",
    baseAmount() {return player.c.tbasepoints2},
    requires(){return new ExpantaNum(1.5)},
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return true},
    effect(){
        var eff = player.p.points.add(1).root(5)
        if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effectDescription(){return `数字1 -> (数字1-1)^(1/<text style = "color:green">${format(layers.p.effect(),2)}</text>)+1`},
    //clickables: {
        //part1
        //11: {
        //    canClick(){return true},
        //    display() {return `Update the game<br />You've updated ${Utimeformat(player.u.updtime)}.<br /><br />Now you are doing:${updtxt[player.u.doing]}`},
        //    onClick(){player.u.doing = "upd"}
        //},
    //},
    upgrades: {
        11: {
            description: "点数并不是在做无用功.\n点数加成pp获取.",
            cost(){return new OmegaNum(4)},
            unlocked(){return true},
            effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.25).mul(1000)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "多余的数字2并不是在做无用功.\n数字2加成点数.",
            cost(){return new OmegaNum(256)},
            unlocked(){return hasUpgrade("p",11)},
            effect(){
                var baseEff = player.c.tbasepoints2.pow(2)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                if(baseEff.gt(8)) baseEff = baseEff.root(3).mul(4)
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",12),1)}`}
        },
        13: {
            description: "点数/5,但改为每秒生产.",
            cost(){return new OmegaNum(1024)},
            unlocked(){return hasUpgrade("p",12)},
            effect(){
                var baseEff = new ExpantaNum(5)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff
            },
            effectDisplay(){return `/${format(upgradeEffect("p",13),1)}`}
        },
        14: {
            description: "点数产量<br>x(pp^0.25+1)^<br>(sin(t^1.5/10)^2).",
            cost(){return new OmegaNum(2048)},
            unlocked(){return hasUpgrade("p",13)},
            effect(){
                var baseEff = player.p.points.pow(0.25).add(1)
                baseEff = baseEff.pow(Math.sin(player.c.tick.pow(1.5).div(10).mod(360).toNumber())**2)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                if(hasUpgrade("p",23)) baseEff = baseEff.mul(upgradeEffect("p",23))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",14),1)}`}
        },
        15: {
            description: "你的点数被t倍增.",
            cost(){return new OmegaNum(4096)},
            unlocked(){return hasUpgrade("p",14)},
            effect(){
                var baseEff = player.c.tick.add(1).sqrt()
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",15),1)}`}
        },
        21: {
            description: "来点有意思的.p14一定程度上加成时间速率.",
            cost(){return new OmegaNum(8192)},
            unlocked(){return hasUpgrade("p",15)},
            effect(){
                var baseEff = upgradeEffect("p",14)
                baseEff = baseEff.log10().add(1).pow(1.5)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",21),1)}`}
        },
        22: {
            description: "来点更有意思的.p14一定程度上加成p11.",
            cost(){return new OmegaNum(10086)},
            unlocked(){return hasUpgrade("p",21)},
            effect(){
                var baseEff = upgradeEffect("p",21)
                baseEff = baseEff.log10().add(1).pow(2)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",22),1)}`}
        },
        23: {
            description: "p21,p22加成p14...?",
            cost(){return new OmegaNum(16384)},
            unlocked(){return hasUpgrade("p",22)},
            effect(){
                var baseEff = upgradeEffect("p",21)
                baseEff = baseEff.mul(upgradeEffect("p",22))
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",23),1)}`}
        },
        24: {
            description: "前边所有升级的效果+^0.2.所有.最先计算.",
            cost(){return new OmegaNum(131072)},
            unlocked(){return hasUpgrade("p",23)},
            effect(){
                var baseEff = new ExpantaNum(.2)
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                return baseEff.add(1)
            },
            effectDisplay(){return `^${format(upgradeEffect("p",24),2)}`}
        },
        25: {
            description: "升级已经没意思了.解锁一个可重复购买项.",
            cost(){return new OmegaNum(262144)},
            unlocked(){return hasUpgrade("p",24)},
            effect(){
                var baseEff = new ExpantaNum(1)
                baseEff = baseEff.mul(buyableEffect("p",11))
                return baseEff
            },
            effectDisplay(){return `+${format(upgradeEffect("p",25),1)}`}
        },
},
    buyables: {
        11: {
            cost(x) { return new OmegaNum(1.797e308).pow(x.add(1).root(125).sub(1)) },
            display() { return `倍增前10个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.25)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(1)}
        },
        12: {
            cost(x) { return new OmegaNum(1.797e308).pow(x.add(1).root(100).sub(1)) },
            display() { return `倍增前9个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.2)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(2)}
        },
    },

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
    //update(diff){        
    //}
    getResetGain(){
        var gain = new ExpantaNum(1)
        gain = gain.mul(layers.p.baseAmount().div(layers.p.requires()).pow(layers.p.exponent)).pow(layers.p.gainExp()).mul(layers.p.gainMult())
        if(gain.gte(10000)) gain = gain.sqrt().mul(100)
        if(gain.gte(1000000)) gain = gain.cbrt().mul(10000)
        return gain
    },
    prestigeButtonText(){
        return "+ "+formatWhole(layers.p.getResetGain())+" 重置点(pp)"
    },
    hotkeys: [
        {key: "p", description: "P: p转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

})