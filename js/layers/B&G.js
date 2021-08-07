addLayer("b", {
    name: "booster", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "blue",
    resource: "倍增器", // Name of prestige currency
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    baseResource: "t",
    baseAmount() {return player.c.tbasepoints2},
    requires(){return new ExpantaNum("e4500")},
    base:2,
    exponent: 1.01,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        //if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasMilestone("a",23)},
    effect(){
        var eff = two.pow(player[this.layer].points)
        if(!hasMilestone("a",32)) eff = powsoftcap(eff,e("e100000"),e(hasMilestone("g",0) ? hasMilestone("g",3)? 4 : 5 : 10))
        //if(eff.gte(4)) eff = eff.sqrt().mul(2)
        return eff
    },
    effectDescription(){return `ts -> ts*${format(this.effect())}`},
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
    /*buyables: {
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
                baseEff = baseEff.pow(buyableEffect("i",13))
                if(hasMilestone("a",20)) baseEff = baseEff.pow(2)
                if(baseEff.gt(1e600)) baseEff = baseEff.cbrt().mul(1e400)
                if(baseEff.gt(1e1000)){
                    var sc = 5
                    baseEff = baseEff.root(sc).mul(1e1000**(1-1/sc))
                }
                baseEff = powsoftcap(baseEff,e("e3000"),e(3))
                baseEff = powsoftcap(baseEff,e("e400000"),e(5))
                return baseEff
            },
            unlocked(){return true},
            abtick : 0,
            abdelay(){
                return upgradeEffect("p",32)
            }
        },
    },*/

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
        var tick = diff
        if(hasMilestone("a",27)) tick *= 100
        if(hasMilestone("g",4)) player.b.points = player.b.points.add(this.getResetGain().mul(Math.min(tick,1)))
        //var incproc = buyableEffect("i",11)
        //player.i.points = player.i.points.add(incproc.mul(diff).mul(player.c.tickspeed)).max(1)

        //auto
        /*
        for(row=1;row<=1;row++){
            for(col=1;col<=3;col++){
                if(layers[this.layer].buyables[row*10+col]){
                    layers[this.layer].buyables[row*10+col].abtick += diff
                    if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                        layers[this.layer].buyables[row*10+col].buy()
                        layers[this.layer].buyables[row*10+col].abtick = 0
                    }
                }
            }
        }
        */
    },
    milestones: {
        0: {
            requirementDescription: "3倍增器",
            effectDescription: "我相信你厌倦了这玩意.你可以购买最大倍增器.",
            done() { return player.b.points.gte(3) }
        },
        1: {
            requirementDescription: "100倍增器",
            effectDescription: "自动增量d^.",
            done() { return player.b.points.gte(100) }
        },
    },
    canBuyMax(){return hasMilestone("b",0)},
    resetsNothing(){return hasMilestone("g",4)},
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
        {key: "b", description: "B: B转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    //static gain
    getResetGain(){
        //cost = (base^(x^exp)*req/gainMult)^(1/gainExp) 注：原公式是*gainMult 但因为OmegaNum精确度问题改为除以.
        var base = this.base
        if(!this.base) base = new ExpantaNum(2)
        if(this.baseAmount().lt(this.requires())) return new ExpantaNum(0)
        var gain = this.baseAmount().pow(this.gainExp()).mul(this.gainMult()).div(this.requires()).logBase(this.base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
        if(!this.canBuyMax()) return new ExpantaNum(1)
        return gain
        /*
        if(tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return OmegaNumZero
        if ((!tmp[this.layer].canBuyMax)) return OmegaNumOne
		let gain = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).div(tmp[this.layer].gainMult).max(1).log(tmp[this.layer].base).times(tmp[this.layer].gainExp).pow(OmegaNum.pow(tmp[layer].exponent, -1))
		gain = gain.times(tmp[this.layer].directMult)
		return gain.floor().sub(player[this.layer].points).add(1).max(0);
        */
    },
    doReset(layer){
        if(layer != "p" && layer != 'b'){
            var kp = []
            if(hasMilestone("g",1)) kp.push("milestones")
            layerDataReset("b", kp)
        }
    }
})






addLayer("g", {
    name: "generator", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: -1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        power: new ExpantaNum(0)
    }},
    color: "green",
    resource: "发生器", // Name of prestige currency
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already 
    baseResource: "t",
    baseAmount() {return player.c.tbasepoints2},
    requires(){return new ExpantaNum("e128000")},
    base:"1e500",
    exponent: 1.05,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        //if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    branches:["p"],
    layerShown(){return hasMilestone("a",23)},
    proc(){
        var eff = player[this.layer].points.add(1).pow(0.25)
        if(hasUpgrade("p",44)) eff = eff.pow(upgradeEffect("p",44))
        if(hasMilestone("a",27)) eff = eff.pow(1.25)
        return eff.sub(1)
    },
    effect(){
        var eff = two.pow(player[this.layer].power.root(3))
        eff = logsoftcap(eff,e("e40000"),0.125)
        eff = logsoftcap(eff,e("e7500000"),0.5)
        eff = logsoftcap(eff,e("e125e5"),0.375)
        //eff = logsoftcap(eff,e("e2e7"),1)
        return eff
    },
    effect2(){
        //power降低ap可购买项价格
        var eff = player[this.layer].power.add(1).root(3)
        //eff = logsoftcap(eff,e("e40000"),0.125)
        return eff
    },
    effectDescription(){return `产生${format(this.proc())}能量/log10(t/e128000)^2(仅当t>e128000时)<br>你有${format(player.g.power)}能量,能量使得ts -> ts*${format(this.effect())}`},
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
    /*buyables: {
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
                baseEff = baseEff.pow(buyableEffect("i",13))
                if(hasMilestone("a",20)) baseEff = baseEff.pow(2)
                if(baseEff.gt(1e600)) baseEff = baseEff.cbrt().mul(1e400)
                if(baseEff.gt(1e1000)){
                    var sc = 5
                    baseEff = baseEff.root(sc).mul(1e1000**(1-1/sc))
                }
                baseEff = powsoftcap(baseEff,e("e3000"),e(3))
                baseEff = powsoftcap(baseEff,e("e400000"),e(5))
                return baseEff
            },
            unlocked(){return true},
            abtick : 0,
            abdelay(){
                return upgradeEffect("p",32)
            }
        },
    },*/

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
        if(player.c.tick.gte("e128000")) player.g.power = this.proc().mul(player.c.tick.div("e128000").log10().pow(2)).max(player.g.power)
        //var incproc = buyableEffect("i",11)
        //player.i.points = player.i.points.add(incproc.mul(diff).mul(player.c.tickspeed)).max(1)

        //auto
        /*
        for(row=1;row<=1;row++){
            for(col=1;col<=3;col++){
                if(layers[this.layer].buyables[row*10+col]){
                    layers[this.layer].buyables[row*10+col].abtick += diff
                    if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                        layers[this.layer].buyables[row*10+col].buy()
                        layers[this.layer].buyables[row*10+col].abtick = 0
                    }
                }
            }
        }
        */
    },
    milestones: {
        0: {
            requirementDescription: "2发生器",
            effectDescription: "让B层级的软上限更软一点.(? (^0.1 -> ^0.2)",
            done() { return player.g.points.gte(2) }
        },
        1: {
            requirementDescription: "3发生器",
            effectDescription: "保留b层级里程碑.",
            done() { return player.g.points.gte(3) }
        },
        2: {
            requirementDescription: "4发生器",
            effectDescription: "b层级不会重置p层级.",
            done() { return player.g.points.gte(4) }
        },
        3: {
            requirementDescription: "5发生器",
            effectDescription: "我相信你厌倦了这玩意.你可以购买最大发生器.b层级软上限更软一点.(->^0.25)",
            done() { return player.g.points.gte(5) }
        },
        4: {
            requirementDescription: "6发生器",
            effectDescription: "b层级不再重置任何东西.每秒获得100%的倍增器.",
            done() { return player.g.points.gte(6) }
        },
    },
    canBuyMax(){return hasMilestone("g",3)},
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
        {key: "g", description: "G: G转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
        //static gain
        getResetGain(){
            //cost = (base^(x^exp)*req/gainMult)^(1/gainExp) 注：原公式是*gainMult 但因为OmegaNum精确度问题改为除以.
            var base = this.base
            if(!this.base) base = new ExpantaNum(2)
            if(this.baseAmount().lt(this.requires())) return new ExpantaNum(0)
            var gain = this.baseAmount().div(this.requires()).logBase(base).root(this.exponent).add(1).sub(player[this.layer].points).floor().max(0)
            if(!this.canBuyMax() && gain.gte(1)) return new ExpantaNum(1)
            return gain
            /*
            if(tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return OmegaNumZero
            if ((!tmp[this.layer].canBuyMax)) return OmegaNumOne
            let gain = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).div(tmp[this.layer].gainMult).max(1).log(tmp[this.layer].base).times(tmp[this.layer].gainExp).pow(OmegaNum.pow(tmp[layer].exponent, -1))
            gain = gain.times(tmp[this.layer].directMult)
            return gain.floor().sub(player[this.layer].points).add(1).max(0);
            */
        },
})