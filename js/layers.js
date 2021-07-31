function e(num){
    return new ExpantaNum(num)
}
function calcTickspeed(){
    var tickspeed = new ExpantaNum(1)
    if(hasMilestone("a",0)) tickspeed = tickspeed.mul(5)
    if(hasUpgrade("p",21)) tickspeed = tickspeed.mul(upgradeEffect("p",21))
    if(tickspeed.gte(1e18)){
        var sc = 3
        if(hasUpgrade("a",15)) sc = 1.25
        tickspeed = tickspeed.root(sc).mul(1e18**(1-1/sc))
    }
    return tickspeed
}
function getbp1(){
    var bp = new ExpantaNum(.0001)
    bp = bp.root(layers.p.effect())
    return bp.add(1)
}
function geta(){
    var a = new ExpantaNum(3)
    if(!hasMilestone("a",2)) a = a.mul(layers.a.effect1())
    else a = ten.div(layers.a.effect1())
    return a.round().min(6).max(1)
}
function getMaxBP(){
    var cmax = new ExpantaNum(.5)
    cmax = cmax.root(layers.a.effect2())
    return cmax.add(1)
}
function checkAroundUpg(UPGlayer,place){
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
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
        player.c.arrows = geta()

        if(!hasUpgrade("p",13)){
        var points = player.c.basepoints1.arrow(player.c.arrows)(player.c.basepoints2).sub(player.c.basepoints1)
        if(hasUpgrade("p",12)) points = points.mul(upgradeEffect("p",12))
        points = points.mul(layers.a.effect3())
        points = points.mul(layers.i.effect())
        player.points = points
        }
    }
})

addLayer("i", {
    name: "incremental", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "blue",
    resource: "增量点", // Name of prestige currency
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.125,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        //if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasMilestone("a",0)},
    effect(){
        var eff = player[this.layer].points.root(2)
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effectDescription(){return `P -> P*${format(this.effect())}`},
    //clickables: {
        //part1
        //11: {
        //    canClick(){return true},
        //    display() {return `Update the game<br />You've updated ${Utimeformat(player.u.updtime)}.<br /><br />Now you are doing:${updtxt[player.u.doing]}`},
        //    onClick(){player.u.doing = "upd"}
        //},
    //},
    upgrades: {
        /*
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
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}
        },
        */
},
    buyables: {
        11: {
            cost(x) {
                var c = two.pow(x.pow(1.5)).root(2).sub(1)
                if(!hasUpgrade("p",31)) c = c.mul(ten.pow(x))
                return c
            },
            display() { return `增加增量点获取.(增量+)<br />+${format(buyableEffect(this.layer,this.id),2)}.(受点数加成)<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}增量点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1))&&this.unlocked() },
            buy() {
                if(hasUpgrade("p",31)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var c = player.i.points.add(1).pow(2).logBase(2).root(1.5).sub(getBuyableAmount(this.layer, this.id)).add(1).min(upgradeEffect("p",31)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var level = getBuyableAmount(this.layer,this.id)
                level = level.mul(buyableEffect("i",12))
                var baseEff = player.points.mul(1e15).add(1).log10().pow(level.add(1).pow(0.5).sub(1)).sub(1).max(0)
                if(player.points.gt(1)) baseEff = baseEff.mul(player.points.log10().add(1).pow(2))
                if(baseEff.gt(1e600)) baseEff = baseEff.cbrt().mul(1e400)
                if(baseEff.gt(1e1000)){
                    var sc = 5
                    baseEff = baseEff.root(sc).mul(1e1000**(1-1/sc))
                }
                return baseEff
            },
            unlocked(){return true},
            abtick : 0,
            abdelay(){
                return upgradeEffect("p",32)
            }
        },
        12: {
            cost(x) {
                var c = ten.pow(x.add(5).pow(1.6)).root(2).sub(1)
                return c
            },
            display() { return `倍增前者等级.(增量x)<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}增量点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1))&&this.unlocked() },
            buy() {
                if(hasUpgrade("p",31)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var c = player.i.points.add(1).pow(2).log10().root(1.6).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",31).root(3)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(1.25)
                return baseEff
            },
            unlocked(){return hasUpgrade("a",13)},
            abtick : 0,
            abdelay(){
                return upgradeEffect("p",32)*10
            }
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
    update(diff){
        var incproc = buyableEffect("i",11)
        player.i.points = player.i.points.add(incproc.mul(diff).mul(player.c.tickspeed)).max(1)

        //auto
        for(row=1;row<=1;row++){
            for(col=1;col<=2;col++){
                layers[this.layer].buyables[row*10+col].abtick += diff
                if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                    layers[this.layer].buyables[row*10+col].buy()
                    layers[this.layer].buyables[row*10+col].abtick = 0
                }
            }
        }
    },
    /*milestones: {
        0: {
            requirementDescription: "3ap",
            effectDescription: "解锁增量+.解锁新的p转升级.",
            done() { return player.a.points.gte(3) }
        },
    },*/
    /*
    getResetGain(){
        var gain = new ExpantaNum(1)
        gain = gain.mul(this.baseAmount().div(this.requires()).pow(this.exponent)).pow(this.gainExp()).mul(this.gainMult())
        if(gain.gte(10000)) gain = gain.sqrt().mul(100)
        if(gain.gte(1000000)) gain = gain.cbrt().mul(10000)
        return gain
    },
    prestigeButtonText(){
        return "+ "+formatWhole(this.getResetGain())+" "+this.resource
    },*/
    hotkeys: [
        {key: "+", description: "+: 购买增量+", onPress(){if (layers.i.buyables[11].canAfford()) layers.i.buyables[11].buy()}},
        {key: "x", description: "x: 购买增量x", onPress(){if (layers.i.buyables[12].canAfford()) layers.i.buyables[12].buy()}},
        {key: "i", description: "i: 购买所有增量", onPress(){if (layers.i.buyables[11].canAfford()) layers.i.buyables[11].buy();if (layers.i.buyables[12].canAfford()) layers.i.buyables[12].buy()}},
    ],

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
    baseResource: "c",
    baseAmount() {return player.c.tbasepoints2},
    requires(){return new ExpantaNum(1.5)},
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        if(hasMilestone("a",3)) mult = mult.mul(layers.a.effect4())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        if(hasMilestone("a",0)&&!hasUpgrade("a",15)) exp = exp.mul(0.5)
        if(hasUpgrade("a",15)) exp = exp.mul(2)
        return exp
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return true},
    effect(){
        var eff = player.p.points.add(1).root(5)
        if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effectDescription(){return `b -> (b-1)^(1/<text style = "color:green">${format(layers.p.effect(),2)}</text>)+1`},
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
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.5).mul(10)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)){
                    if(!hasMilestone("a",0)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                    else baseEff = ten.pow(baseEff.log10().pow(0.75)).mul(10)
                }
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}
        },
        12: {
            description: "多余的c并不是在做无用功.\nc加成点数.",
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
                if(!hasUpgrade("a",14)) baseEff = baseEff.pow(Math.sin(player.c.tick.pow(1.5).div(10).mod(360).toNumber())**2)
                else baseEff = baseEff.pow(1.5)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                if(hasUpgrade("p",23)) baseEff = baseEff.mul(upgradeEffect("p",23))
                if(baseEff.gt(1e100)){
                    var sc = 4
                    baseEff = baseEff.root(sc).mul(1e100**(1-1/sc))
                }
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
                baseEff = baseEff.pow(buyableEffect("p",13))
                if(baseEff.gt(1e9)) baseEff = baseEff.cbrt().mul(1e6)
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
                if(baseEff.gt(2.5)) baseEff = baseEff.sqrt().mul(2.5**0.5)
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
                if(baseEff.gt(3)) baseEff = baseEff.pow(0.2).mul(3**0.8)
                return baseEff
            },
            effectDisplay(){return `解锁${format(upgradeEffect("p",25),1)}个`}
        },
        31: {
            description: "你可以批量购买增量+.移除增量+的价格线性增长.增量+不再花费增量点.",
            cost(){return new OmegaNum(2e6)},
            unlocked(){return hasUpgrade("p",25)&&hasMilestone("a",0)||hasUpgrade("p",31)},
            effect(){
                var baseEff = new ExpantaNum(3)
                if(hasUpgrade("p",33)) baseEff = baseEff.mul(upgradeEffect("p",33))
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3)
                if(hasMilestone("a",12)) baseEff = baseEff.mul(10)
                return baseEff
            },
            effectDisplay(){return `+${format(upgradeEffect("p",31),1)}`}
        },
        32: {
            description: "自动购买增量+.(倍增该效果改为除以间隔时间,所有自动化不受时间速率影响)",
            cost(){return new OmegaNum(1e7)},
            unlocked(){return hasUpgrade("p",31)&&hasMilestone("a",0)},
            effect(){
                var baseEff = 1
                if(!hasUpgrade("p",32)) baseEff = 1.797e308
                if(hasUpgrade("p",33)) baseEff /= upgradeEffect("p",33).toNumber()
                if(hasMilestone("a",6)) baseEff /= 3
                if(hasMilestone("a",12)) baseEff /=10
                return baseEff
            },
            effectDisplay(){return hasUpgrade("p",32)?`间隔${upgradeEffect("p",32).toFixed(2)}s(${(upgradeEffect("p",32)-(layers.i.buyables[11].abtick)).toFixed(2)}s)`:`间隔1s`}
        },
        33: {
            description: "p节点可重复购买项11和12加成p31和p32.",
            cost(){return new OmegaNum(1e8)},
            unlocked(){return hasUpgrade("p",32)&&hasMilestone("a",0)},
            effect(){
                var baseEff = buyableEffect("p",11).mul(buyableEffect("p",12))
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3)
                if(hasMilestone("a",12)) baseEff = baseEff.mul(10)
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",33),1)}`}
        },
        34: {
            description: "购买p可重复购买项不再花费pp.你可以批量购买p可重复购买项.",
            cost(){return new OmegaNum(1e8)},
            unlocked(){return hasUpgrade("p",33)&&hasMilestone("a",0)},
            effect(){
                var baseEff = new ExpantaNum(3)
                if(hasUpgrade("p",35)) baseEff = baseEff.mul(upgradeEffect("p",33))
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3)
                if(hasMilestone("a",12)) baseEff = baseEff.mul(10)
                return baseEff
            },
            effectDisplay(){return `+${format(upgradeEffect("p",34),1)}`}
        },
        35: {
            description: "自动购买p可重复购买项.p33加成p34和p35.同时p可重复购买项的价格变为原来的1.25次根.",
            cost(){return new OmegaNum(1e8)},
            unlocked(){return hasUpgrade("p",34)&&hasMilestone("a",0)},
            effect(){
                var baseEff = new ExpantaNum(5)
                if(!hasUpgrade("p",35)) baseEff = 1.797e308
                baseEff /= upgradeEffect("p",33).toNumber()
                if(hasMilestone("a",6)) baseEff /= 3
                if(hasMilestone("a",12)) baseEff /=10
                return baseEff
            },
            effectDisplay(){return hasUpgrade("p",35)?`间隔${upgradeEffect("p",35).toFixed(2)}s(${(upgradeEffect("p",35)-(layers.p.buyables[11].abtick)).toFixed(2)}s)` : `间隔5s`}
        },
},
    buyables: {
        11: {
            cost(x) {
                var c = new OmegaNum(1.797e308).pow(x.add(1).root(125).sub(1))
                if(hasUpgrade("p",35)) c = c.root(1.25)
                return c
            },
            display() { return `倍增前10个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                var c = p.logBase(1.797e308).add(1).pow(125).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.25)
                if(baseEff.gt(2)) baseEff = baseEff.pow(0.75).mul(2**0.25)
                if(baseEff.gt(10)) baseEff = baseEff.pow(0.3333).mul(10**0.6666)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(1)},
            abtick:0,
            abdelay(){
                return upgradeEffect("p",35)
            }
        },
        12: {
            cost(x) {
                var c = new OmegaNum(1.797e308).pow(x.add(1).root(100).sub(1))
                if(hasUpgrade("p",35)) c = c.root(1.25)
                return c
            },
            display() { return `倍增前9个升级效果.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                var c = p.logBase(1.797e308).add(1).pow(100).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.2)
                if(baseEff.gt(5)) baseEff = baseEff.pow(0.3333).mul(5**0.6666)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(2)},
            abtick:0,
            abdelay(){
                return upgradeEffect("p",35)
            }
        },
        13: {
            cost(x) {
                var c = new OmegaNum(1.797e308).pow(x.add(1).root(64).sub(1))
                if(hasUpgrade("p",35)) c = c.root(1.25)
                return c
            },
            display() { return `指数加成p21.(按顺序触发可重复购买项加成)<br />^${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                var c = p.logBase(1.797e308).add(1).pow(64).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.1)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(3)},
            abtick:0,
            abdelay(){
                return upgradeEffect("p",35)
            }
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
    update(diff){
        //auto
        for(row=1;row<=1;row++){
            for(col=1;col<=3;col++){
                layers[this.layer].buyables[row*10+col].abtick += diff
                if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                    layers[this.layer].buyables[row*10+col].buy()
                    layers[this.layer].buyables[row*10+col].abtick = 0
                }
            }
        }
    },
    getResetGain(){
        var gain = new ExpantaNum(1)
        gain = gain.mul(layers.p.baseAmount().div(layers.p.requires()).pow(layers.p.exponent)).pow(layers.p.gainExp()).mul(layers.p.gainMult())
        if(gain.gte(10000)) gain = gain.sqrt().mul(100)
        if(gain.gte(1000000)) gain = gain.sqrt().mul(1000)
        if(gain.gt(1e20)){
            var sc = 3
            if(hasUpgrade("a",21)) sc-=1
            gain = gain.root(sc).mul(1e20**(1-1/sc))
        }
        return gain.floor()
    },
    prestigeButtonText(){
        return "+ "+formatWhole(layers.p.getResetGain())+" 重置点(pp)"
    },
    hotkeys: [
        {key: "p", description: "P: p转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration(){
        if(hasUpgrade("a",23)) return 10
        if(hasMilestone("a",5)) return 1
        if(hasMilestone("a",2)) return 0.1
        return 0
    },
    doReset(layer){
        if(layer == "a"){
            var kp = []
            if(hasMilestone("a",4)) kp.push("upgrades")
            layerDataReset("p", kp)
            if(hasMilestone("a",3)&&!hasMilestone("a",4)) player.p.upgrades = [31,32,33,34,35]
        }
    }
})

function getAPlimit(){
    var limit = new ExpantaNum(50)
    if(hasMilestone("a",8)) limit = limit.pow((player.a.upgrades.length/5)**2+1)
    if(hasUpgrade("a",11)) limit = limit.mul(upgradeEffect("a",11))
    if(hasUpgrade("a",24)) limit = limit.mul(upgradeEffect("a",24))
    if(limit.gt(1000)) limit = limit.cbrt().mul(1000**0.66)
    return limit.floor()
}
function AUMilestonekeep(){
    if(hasMilestone("a",11)) return player.a.milestones
    var kp = [0,7]
    if(hasMilestone("a",8)) kp.push(8)
    if(hasMilestone("a",9)) kp.push(9)
    if(hasMilestone("a",10)) kp.push(10)
    if(hasMilestone("a",12)) kp.push(12)
    return kp
}

addLayer("a", {
    name: "arrow", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
        costmult: new ExpantaNum(1),
        pointbest: new ExpantaNum(0),
        resetU: new ExpantaNum(0),
    }},
    color: "lightblue",
    resource: "高德纳箭头点(ap)", // Name of prestige currency
    baseResource: "pp",
    baseAmount() {return player.p.points},
    requires(){
        var req = new ExpantaNum(1e8)
        if(hasMilestone("a",0)) req = new ExpantaNum(1e10)
        return req
    },
    branches:["p"],
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.125,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasMilestone("a",13)) mult = mult.mul(upgradeEffect("a",24).cbrt())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        if(hasMilestone("a",0)) exp = exp.mul(1.5)
        if(hasUpgrade("a",25)) exp = exp.add(1)
        return exp
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return hasUpgrade("p",25)||player.a.unlocked},
    effect1(){
        var eff = player[this.layer].points.mul(10).add(1).root(8)
        if(hasMilestone("a",7)) eff = player[this.layer].best.mul(10).add(1).root(8)
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effect2(){
        var eff = player[this.layer].points.mul(10).add(1).root(8)
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        if(hasMilestone("a",7)) eff = player[this.layer].best.mul(10).add(1).root(8)
        return eff
    },    
    effect3(){
        var eff = player[this.layer].points.mul(10).add(1).root(8).pow(12.56)
        if(hasMilestone("a",7)) eff = player[this.layer].best.mul(10).add(1).root(8).pow(12.56)
        if(hasMilestone("a",1)) eff = eff.pow(player.p.points.add(1).log10().add(1).log10().add(1).pow(2))
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        if(hasMilestone("a",0)) eff = eff.mul(10)
        return eff
    },
    effect4(){
        var eff = this.effect3()
        eff = eff.add(1).log10().add(1).pow(4).div(1000).add(1)
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effect5(){
        var eff = player[this.layer].best.div(10).add(10).log10().pow(0.75)
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effectDescription(){
        var eff0 = `<br>你已经重置了${player.a.resetU}个ap升级(ap升级13不计入)<br>你的最佳ap为${format(player.a.best,0)}<br>你的ap上限为${format(getAPlimit(),0)}.`
        if(!hasMilestone("a",7)) eff0 = ``
        var eff1 = `<br>a -> Min(round(a*<text style = "color:green">${format(this.effect1(),2)}</text>),10)`
        if(hasMilestone("a",2)) eff1 = `<br>a -> Max(round(10/<text style = "color:green">${format(this.effect1(),2)}</text>),1)`
        var eff2 = `<br>cmax -> 0.5^(1/<text style = "color:green">${format(this.effect2(),2)}</text>)+1`
        var eff3 = `<br>P -> P*<text style = "color:green">${format(this.effect3())}</text>`
        if(hasMilestone("a",1)) eff3 = `<br>P -> P*<text style = "color:green">${format(this.effect1().pow(12.56))}</text>^(log10(log10(pp+1)+1)+1)^2(=${format(this.effect3())})`
        var eff4 = `<br>pp -> pp*${format(this.effect4())}`
        if(!hasMilestone("a",3)) eff4 = ""
        var eff5 = `<br>P -> P^<text style = "color:green">${format(this.effect5())}</text>`
        if(!hasMilestone("a",9)) eff5 = ""
        var eff6 = `<br>ap里程碑14使你的ap获取x<text style = "color:orange">${format(upgradeEffect("a",24).cbrt(),2)}</text>`
        if(!hasMilestone("a",13)) eff6 = ``
        return eff0+eff1+eff2+eff3+eff4+eff5+eff6
    },
    clickables: {
        11: {
            canClick(){return true/*hasMilestone("a",7)&&player.a.costmult.gt(1)*/},
            display() {return `重置ap升级<br />这将会进行一次a转<br /><br />当前升级价格倍率:${format(player.a.costmult)}`},
            onClick(){if(confirm("你确定清除升级吗 这不会返还任何ap")){player.a.resetU = player.a.resetU.add(player.a.upgrades.length-1);player.a.upgrades=[];player.a.points=player.a.points.max(e(50));player.a.costmult=new ExpantaNum(1);doReset(this.layer)}}
        },
    },
    upgrades: {
        11: {
            description: `最佳点数加成ap上限.(软上限前)<br><br>价格增长倍率:x5.`,
            cost(){return new OmegaNum(256).mul(player.a.costmult)},
            costinc(){return 5},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",11)},
            effect(){
                var baseEff = player.a.pointbest.add(1).log10().add(1).log10().pow(2)
                //sc
                //if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("a",11),2)}`},
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        12: {
            description: `减弱e100点数软上限(^0.25 -> ^0.33).<br><br>价格增长倍率:x1.25.`,
            cost(){return new OmegaNum(50).mul(player.a.costmult)},
            costinc(){return 1.25},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",12)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        13: {
            description: "解锁增量x.还有,欢迎再一次来到起点.升级31的效果以其3次根的效果加成增量x,升级32的时间x10后作用于增量x.<br><br>价格增长倍率:x1.",
            cost(){return new OmegaNum(50).mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return hasMilestone("a",7)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        14: {
            description: "p转的sin函数被替换为1.5.<br><br>价格增长倍率:x1.5.",
            cost(){return new OmegaNum(75).mul(player.a.costmult)},
            costinc(){return 1.5},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",14)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        15: {
            description: `减弱1e18时间速率软上限(^0.33 -> ^0.8).ap里程碑1的'pp基于c的获取指数/2'效果被反转.<br><br>价格增长倍率:x4.`,
            cost(){return new OmegaNum("256").mul(player.a.costmult)},
            costinc(){return 4},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",15)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        21: {
            description: `pp1e20软上限被减弱.(^0.33 -> ^0.5)<br><br>价格增长倍率:x3.`,
            cost(){return new OmegaNum("308").mul(player.a.costmult)},
            costinc(){return 3},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",21)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        22: {
            description: `再次减弱点数e100软上限.(^0.25->^0.33或^0.33->^0.5)<br><br>价格增长倍率:x3.`,
            cost(){return new OmegaNum("308").mul(player.a.costmult)},
            costinc(){return 3},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",22)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        23: {
            description: `你每秒获得1000%的pp.<br><br>价格增长倍率:x1.25.`,
            cost(){return new OmegaNum(50).mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",23)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        24: {
            description: `总计的被重置了的ap升级加成ap上限.(?<br><br>价格增长倍率:x2.`,
            cost(){return new OmegaNum("308").mul(player.a.costmult)},
            costinc(){return 2},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",24)},
            effect(){
                var baseEff = player.a.resetU.add(1).pow(1.5)
                //sc
                if(baseEff.gt(100)) baseEff = baseEff.root(4).mul(100**0.75)
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("a",24),1)}`},
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        25: {
            description: `提高ap获取指数.(^0.125->^0.25或^0.1875->0.3125)<br><br>价格增长倍率:x2.`,
            cost(){return new OmegaNum("308").mul(player.a.costmult)},
            costinc(){return 2},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",25)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        31: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",31)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        32: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",32)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        33: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",33)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        34: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",34)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        35: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",35)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        41: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",41)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        42: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",42)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        43: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",43)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        44: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",44)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        45: {
            description: `咕咕咕.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("10{2}10").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",45)},
            /*effect(){
                var baseEff = ten.pow(player.points.mul(100)).pow(2).sub(1).mul(100000).add(1)
                if(hasUpgrade("p",24)) baseEff = baseEff.pow(upgradeEffect("p",24))
                baseEff = baseEff.mul(buyableEffect("p",11))
                baseEff = baseEff.mul(buyableEffect("p",12))
                //sc
                if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                if(baseEff.gt(100)) baseEff = baseEff.pow(0.2).mul(1000**0.8)
                if(baseEff.gt(1000)) baseEff = baseEff.pow(0.35).mul(1000**0.65)
                if(baseEff.gt(1e4)) baseEff = baseEff.log10().pow(2).mul(1e4/16)
                //p22:sin to p11
                if(hasUpgrade("p",22)) baseEff = baseEff.mul(upgradeEffect("p",22))
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("p",11),1)}`}*/
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
    },
    buyables: {
        /*
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
        */
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
    update(diff){    
        player.a.points = player.a.points.min(getAPlimit().floor())
        player.a.pointbest = player.points.max(player.a.pointbest)
    },
    milestones: {
        0: {
            requirementDescription: "1:3ap",
            effectDescription: "解锁增量+.解锁新的p转升级.pp基于c的获取指数/2,改善p11公式,高德纳箭头要求提升至e10但获取指数更高(^0.125->0.1825),时间速率x5,ap对p的加成x10",
            done() { return player.a.points.gte(3) }
        },
        1: {
            requirementDescription: "2:4ap",
            effectDescription: "改善ap对P的加成.Tip:你可以试着一轮拿两个ap!",
            done() { return player.a.points.gte(4) },
            unlocked(){return hasMilestone("a",0)},
        },
        2: {
            requirementDescription: "3:5ap",
            effectDescription: "反转a转效果1.每秒获得10%的pp.",
            done() { return player.a.points.gte(5) },
            unlocked(){return hasMilestone("a",1)},
        },
        3: {
            requirementDescription: "4:10ap",
            effectDescription: "保留自动化升级.ap对P的加成以一定程度影响p点获取.",
            done() { return player.a.points.gte(10) },
            unlocked(){return hasMilestone("a",2)},
        },
        4: {
            requirementDescription: "5:20ap",
            effectDescription: "保留p升级.",
            done() { return player.a.points.gte(20) },
            unlocked(){return hasMilestone("a",3)},
        },
        5: {
            requirementDescription: "6:25ap",
            effectDescription: "每秒获得100%的pp,而不是10%.",
            done() { return player.a.points.gte(25) },
            unlocked(){return hasMilestone("a",4)},
        },
        6: {
            requirementDescription: "7:40ap",
            effectDescription: "最后一排升级的效率x3.",
            done() { return player.a.points.gte(40) },
            unlocked(){return hasMilestone("a",5)},
        },
        7: {
            requirementDescription: "8:50ap",
            effectDescription: "解锁ap升级(au).你的ap上限为50.购买ap升级会进行一次a转,消耗你所有的ap,并重置你的里程碑.里程碑1和8及以后的里程碑被保留.箭头数永远不会高于6.ap效果基于最佳ap.<br>注:你每购买一个ap升级,其他ap升级的价格都会更贵.你必须购买一个升级附近的其中一个升级才能解锁该升级.",
            done() { return player.a.points.gte(50) },
            unlocked(){return hasMilestone("a",6)||hasMilestone("a",7)},
        },
        8: {
            requirementDescription: "9:2au",
            effectDescription: "ap上限基于au增加.",
            done() { return player.a.upgrades.length >= 2 },
            unlocked(){return hasMilestone("a",7)},
        },
        9: {
            requirementDescription: "10:5au",
            effectDescription: "ap获得一个额外效果.",
            done() { return player.a.upgrades.length >= 5 },
            unlocked(){return hasMilestone("a",8)},
        },
        10: {
            requirementDescription: "11:5000ap",
            effectDescription: "e500点数软上限被移除.",
            done() { return player.a.points.gte(5000) },
            unlocked(){return hasMilestone("a",7)},
        },
        11: {
            requirementDescription: "12:升级价格倍率大于等于25",
            effectDescription: "保留里程碑.",
            done() { return player.a.costmult.gte(25) },
            unlocked(){return hasMilestone("a",9)},
        },
        12: {
            requirementDescription: "13:10000ap",
            effectDescription: "最后一排升级的效率x10.",
            done() { return player.a.points.gte(10000) },
            unlocked(){return hasMilestone("a",10)},
        },
        //13: {
        //    requirementDescription: "14:10au",
        //    effectDescription: "被重置的au加成ap获取.加成的量等同于au24的立方根.(无论你是否购买au24)",
        //    done() { return player.a.upgrades.length >= 10 },
        //    unlocked(){return hasMilestone("a",11)},
        //},
    },
    getResetGain(){
        var gain = new ExpantaNum(1)
        gain = gain.mul(this.baseAmount().div(this.requires()).pow(this.exponent)).pow(this.gainExp()).mul(this.gainMult())
        //if(gain.gte(5)) gain = gain.pow(0.75).mul(5**0.25)
        if(gain.gte(100000)) gain = gain.cbrt().mul(100000**0.66666666666)
        if(player.a.points.add(gain).gt(getAPlimit())) return getAPlimit().sub(player.a.points).max(0)
        return gain.floor()
    },
    prestigeButtonText(){
        return "+ "+formatWhole(this.getResetGain())+" "+this.resource
    },
    hotkeys: [
        {key: "a", description: "A: a转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: {
        AP里程碑: {
            buttonStyle() {return  {'color': 'lightblue'}},
            content:
                ["main-display",
                //["display-text", function() {
                //    var basestr = "你的增益点为 "+HARDformat(player.v.buffp)+" / "+HARDformat(player.v.points)
                //    if(player.v.buffp.gt(player.v.points)) basestr+=` <warning style="color:red";>(WARNING:增益点大于上限!)</warning>`
                //    return basestr
                //}],
                //["display-text", function() {
                //    var basestr = "你的减益点为 "+HARDformat(player.v.nerfp)+" / "+HARDformat(player.v.points)
                //    if(player.v.nerfp.lt(player.v.points)) basestr+=` <warning style="color:red">(WARNING:减益点未达到目标!你的游戏暂停!)</warning>`
                //   return basestr
                //}],
                "prestige-button", "resource-display",
                "milestones",
                //["blank", "5px"], // Height
                //"h-line",
                //["display-text", function() {return "增益升级"}],
                //["blank", "5px"],
                //"buyables",
                //["blank", "5px"], // Height
                //"h-line",
                //["display-text", function() {return "减益升级"}],
                //"upgrades",
                ],},
        AP升级树: {
            buttonStyle() {return  {'color': 'lightblue'}},
            unlocked() {return hasMilestone("a",7)},
            content:
                ["main-display",
                //["display-text", function() {
                //    var basestr = "你的增益点为 "+HARDformat(player.v.buffp)+" / "+HARDformat(player.v.points)
                //    if(player.v.buffp.gt(player.v.points)) basestr+=` <warning style="color:red";>(WARNING:增益点大于上限!)</warning>`
                //    return basestr
                //}],
                //["display-text", function() {
                //    var basestr = "你的减益点为 "+HARDformat(player.v.nerfp)+" / "+HARDformat(player.v.points)
                //    if(player.v.nerfp.lt(player.v.points)) basestr+=` <warning style="color:red">(WARNING:减益点未达到目标!你的游戏暂停!)</warning>`
                //   return basestr
                //}],
                "clickables",// "resource-display",
                "upgrades",
                //["blank", "5px"], // Height
                //"h-line",
                //["display-text", function() {return "增益升级"}],
                //["blank", "5px"],
                //"buyables",
                //["blank", "5px"], // Height
                //"h-line",
                //["display-text", function() {return "减益升级"}],
                //"upgrades",
                ],},
    },
})
