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
                    if(hasMilestone("a",14)) sc-=2
                    baseEff = baseEff.root(sc).mul(1e100**(1-1/sc))
                }
                if(baseEff.gt(1e10000)){
                    var sc = 3
                    baseEff = baseEff.root(sc).mul(1e10000**(1-1/sc))
                }
                if(baseEff.gt(1e50000)) baseEff = baseEff.log10().mul(2).pow(50000)
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
                if(baseEff.gt(36)) baseEff = baseEff.pow(0.2).mul(36**0.8)
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
                if(baseEff.gt(3)) baseEff = baseEff.add(17).div(2).log10().mul(3)
                if(baseEff.gt(4)) baseEff = baseEff.div(2).add(2)
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
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3.14)
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
                if(hasMilestone("a",6)) baseEff /= 3.14
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
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3.14)
                if(hasMilestone("a",12)) baseEff = baseEff.mul(10)
                baseEff = baseEff.pow(buyableEffect("p",21))
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
                if(hasMilestone("a",17)) baseEff = baseEff.mul(buyableEffect("a",11))
                if(hasMilestone("a",6)) baseEff = baseEff.mul(3.14)
                if(hasMilestone("a",12)) baseEff = baseEff.mul(10)
                if(hasUpgrade("a",32)) baseEff = baseEff.pow(1.5)
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
                if(hasMilestone("a",6)) baseEff /= 3.14
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
                if(baseEff.gt(25)) baseEff = baseEff.pow(0.5).mul(5)
                if(hasMilestone("a",23)) baseEff = baseEff.mul(buyableEffect("a",12))
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
                if(baseEff.gt(25)) baseEff = baseEff.pow(0.15).mul(25**0.85)
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
                if(baseEff.gt(25)) baseEff = baseEff.pow(0.25).mul(25**0.75)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(3)},
            abtick:0,
            abdelay(){
                return upgradeEffect("p",35)
            }
        },
        21: {
            cost(x) {
                var c = new OmegaNum(1.797e308).pow(x.add(1).root(16).sub(1))
                if(hasUpgrade("p",35)) c = c.root(1.25)
                return c
            },
            display() { return `指数增幅p33效果.<br />^${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}pp<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var p = hasUpgrade("p",35)? player.p.points.pow(1.25) : player.p.points
                var c = p.logBase(1.797e308).add(1).pow(16).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",34)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = getBuyableAmount(this.layer,this.id).add(1).pow(0.1)
                if(baseEff.gt(2)) baseEff = baseEff.pow(0.75).mul(2**0.25)
                if(baseEff.gt(5)) baseEff = baseEff.pow(0.3333).mul(5**0.6666)
                return baseEff
            },
            unlocked(){return hasUpgrade("p",25)&&upgradeEffect("p",25).gte(4)},
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
        for(row=1;row<=2;row++){
            for(col=1;col<=3;col++){
                if(layers[this.layer].buyables[row*10+col]){
                layers[this.layer].buyables[row*10+col].abtick += diff
                if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                    layers[this.layer].buyables[row*10+col].buy()
                    layers[this.layer].buyables[row*10+col].abtick = 0
                }}
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
        gain = powsoftcap(gain,e(hasUpgrade("a",34)?1e100:1e75),e(5))
        gain = powsoftcap(gain,e("e500"),e(10))
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
        if(layer != "i"){
            if(layer == "b" && hasMilestone("g",2)) return
            var kp = []
            if(hasMilestone("a",4)) kp.push("upgrades")
            layerDataReset("p", kp)
            if(hasMilestone("a",3)&&!hasMilestone("a",4)) player.p.upgrades = [31,32,33,34,35]
        }
    }
})