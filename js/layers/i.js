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
        if(inChallenge("a",11) || hasChallenge("a",11)) eff = eff.pow(3)
        if(inChallenge("a",21)) eff = one
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
                baseEff = baseEff.pow(buyableEffect("i",13))
                if(hasMilestone("a",20)) baseEff = baseEff.pow(2)
                if((inChallenge("a",11) || hasChallenge("a",11)) && (!inChallenge("a",12) && !player.t.nerf.AC.eq(2) && !player.t.nerf.AC.eq(3))) baseEff = baseEff.pow(1.5)
                if(baseEff.gt(1e600)) baseEff = baseEff.cbrt().mul(1e400)
                if(baseEff.gt(1e1000)){
                    var sc = 5
                    baseEff = baseEff.root(sc).mul(1e1000**(1-1/sc))
                }
                baseEff = powsoftcap(baseEff,e("e3000"),e(3))
                baseEff = powsoftcap(baseEff,e("e400000"),e(5))
                baseEff = logsoftcap(baseEff,e("e2e6"),e(hasMilestone("a",28)? 0.175:0.5))
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
                var c = player.i.points.add(1).pow(2).log10().root(1.6).sub(4).sub(getBuyableAmount(this.layer, this.id)).min(upgradeEffect("p",31).root(3)).floor().max(0)
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
        13: {
            cost(x) {
                var c = ten.pow(x.add(30).pow(2.4)).root(3).sub(1)
                return c
            },
            display() { return `指数增幅增量点产量.(增量^)<br />^${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}增量点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1))&&this.unlocked() },
            buy() {
                this.buyMax();
            },
            buyMax(){
                var c = player.i.points.add(1).pow(3).log10().root(2.4).sub(29).sub(getBuyableAmount(this.layer, this.id)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var level = getBuyableAmount(this.layer,this.id)
                level = level.pow(buyableEffect("i",14))
                var baseEff = level.add(1).pow(0.25)
                baseEff = powsoftcap(baseEff,e("4"),e(1.75))
                return baseEff
            },
            unlocked(){return hasUpgrade("a",33)},
            abtick : 0,
            abdelay(){
                return 0
            }
        },
        14: {
            cost(x) {
                var c = ten.pow(x.add(44).pow(3.3)).sub(1)
                return c
            },
            display() { return `指数增幅前者等级.(增量d^)<br />^${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}增量点<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1))&&this.unlocked() },
            buy() {
                this.buyMax();
            },
            buyMax(){
                var c = player.i.points.add(1).log10().root(3.3).sub(43).sub(getBuyableAmount(this.layer, this.id)).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var level = getBuyableAmount(this.layer,this.id)
                var baseEff = level.add(1).pow(0.25)
                return baseEff
            },
            unlocked(){return hasMilestone("a",22)},
            abtick : 0,
            abdelay(){
                return hasMilestone("b",1)?0:1e308
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
            for(col=1;col<=4;col++){
                if(layers[this.layer].buyables[row*10+col]){
                    layers[this.layer].buyables[row*10+col].abtick += diff
                    if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                        layers[this.layer].buyables[row*10+col].buy()
                        layers[this.layer].buyables[row*10+col].abtick = 0
                    }
                }
            }
        }
    },
    doReset(layer){
        layerDataReset(this.layer,[])
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
        {key: "e", description: "e: 购买增量^", onPress(){if (layers.i.buyables[13].canAfford()) layers.i.buyables[13].buy()}},
        {key: "i", description: "i: 购买所有增量", onPress(){
            if (layers.i.buyables[11].canAfford()) layers.i.buyables[11].buy();
            if (layers.i.buyables[12].canAfford()) layers.i.buyables[12].buy();
            if (layers.i.buyables[13].canAfford()) layers.i.buyables[13].buy();
            if (layers.i.buyables[14].canAfford()) layers.i.buyables[14].buy();
        }},
    ],

})