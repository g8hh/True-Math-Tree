function calcTotalTokenCNerf(){
    var nerf = {
        point : new ExpantaNum(1),
        AP: new ExpantaNum(1),
        APL: new ExpantaNum(1),
        pp : new ExpantaNum(1),
        ts : new ExpantaNum(1),
        APU : new ExpantaNum(1),
        RAU : new ExpantaNum(1),
        au31 : false,
        AC : new ExpantaNum(0)
    }
    //^(1/Max((log10(P)/1e7)^2,1))
    var cha = calcChaNow()
    nerf.point = nerf.point.mul(ExpantaNum(1.66).pow(cha[2]))
    nerf.AP = nerf.AP.mul(ExpantaNum(1.33).pow(cha[2].pow(4)))
    if(cha[2].gte(2)){
        nerf.AP = nerf.AP.mul(5)
        nerf.APL = nerf.APL.mul(ExpantaNum(1.25).pow(cha[2].sub(1).pow(2)))
    }
    nerf.pp = nerf.pp.mul(ExpantaNum(4).pow(cha[3].pow(1.5)))
    nerf.ts = nerf.ts.mul(ExpantaNum(2).pow(cha[3]))
    nerf.APU = nerf.APU.mul(ExpantaNum(3.5).pow(cha[3].pow(0.6)))
    nerf.RAU = nerf.RAU.mul(ExpantaNum(3).pow(cha[3]))
    if(!cha[2].eq(0)) nerf.au31 = true
    nerf.AC = cha[4]
    return nerf
}
function calcChaNow(){
    var Chall = {
        2:new ExpantaNum(0),
        3:new ExpantaNum(0),
        4:new ExpantaNum(0)
    }
    var C = player.t.currentC % 10
    var C2 = (player.t.currentC - C)/10
    if(C>=2) for(i=C;i>=2;i--) Chall[i] = Chall[i].add(1)
    if(C2>=2) for(i=C2;i>=2;i--) Chall[i] = Chall[i].add(2)
    return Chall
}
function tokenEffect(id){
    return layers.t.clickables[id].effect()
}

addLayer("t", {
    name: "token", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "✦", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new ExpantaNum(0),
        tokens:{
            11:new ExpantaNum(0),12:new ExpantaNum(0),13:new ExpantaNum(0),14:new ExpantaNum(0),
            21:new ExpantaNum(0),22:new ExpantaNum(0),23:new ExpantaNum(0),24:new ExpantaNum(0),
            31:new ExpantaNum(0),32:new ExpantaNum(0),33:new ExpantaNum(0),34:new ExpantaNum(0),
            41:new ExpantaNum(0),42:new ExpantaNum(0),43:new ExpantaNum(0),44:new ExpantaNum(0),
        },
        currentC:11,
        nerf:{
            point : new ExpantaNum(1),
            AP: new ExpantaNum(1),
            pp : new ExpantaNum(1),
            ts : new ExpantaNum(1),
            AC : new ExpantaNum(0)
        }
    }},
    color: "CC66CC",
    resource: "奖牌(medal)", // Name of prestige currency
    baseResource: "P的指数",
    baseAmount() {return player.points.add(1).log10()},
    requires(){return new ExpantaNum("6e7")},
    exponent: 3,
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        //if(hasUpgrade("p",11)) mult = mult.mul(upgradeEffect("p",11))
        //if(hasMilestone("a",3)) mult = mult.mul(layers.a.effect4())
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        var exp = new ExpantaNum(1)
        //if(hasMilestone("a",0)&&!hasUpgrade("a",15)) exp = exp.mul(0.5)
        //if(hasUpgrade("a",15)) exp = exp.mul(2)
        return exp
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    layerShown(){return inChallenge("a",21) || hasChallenge("a",21)},
    effect(){
        var eff = two.pow(player.t.points)
        eff = logsoftcap(eff,e("e10"),0.25)
        return eff
    },
    onPrestige(gain){player.t.tokens[player.t.currentC] = player.t.tokens[player.t.currentC].add(gain);doACreset(false)},
    effectDescription(){return `使pp*${format(this.effect(),0)}`},
    clickables: {
        11: {
            canClick(){return true},
            display() {var baseSTR = "C" + this.id;if(player.t.currentC == this.id) baseSTR += "<br>您在该挑战中!";baseSTR += `<br>您有${player.t.tokens[this.id]}个${this.id}代币(token)`;baseSTR += this.effDesp();return baseSTR},
            effect(){
                var eff = player.t.tokens[this.id].div(10).add(1).pow(0.75)
                eff = eff.pow(tokenEffect(12))
                eff = powsoftcap(eff,e(1.5),2)
                eff = powsoftcap(eff,e(3),4)
                eff = logsoftcap(eff,e(20),0.33)
                return eff
            },
            effDesp(){
                return "使得点数获取和时间速率^"+format(this.effect(),2)
            },
            onClick(){doACreset(false,this.id);player.t.currentC = this.id}
        },
        12: {
            canClick(){return true},
            display() {var baseSTR = "C" + this.id;if(player.t.currentC == this.id) baseSTR += "<br>您在该挑战中!";baseSTR += `<br>您有${player.t.tokens[this.id]}个${this.id}代币(token)`;baseSTR += this.effDesp();return baseSTR},
            effect(){
                var eff = player.t.tokens[this.id].div(3).add(1).pow(0.75)
                eff = powsoftcap(eff,e(1.5),3)
                eff = powsoftcap(eff,e(2),3)
                return eff
            },
            effDesp(){
                return "使得c11效果和时间速率^"+format(this.effect(),2)
            },
            onClick(){doACreset(false,this.id);player.t.currentC = this.id}
        },
        13: {
            canClick(){return true},
            display() {var baseSTR = "C" + this.id;if(player.t.currentC == this.id) baseSTR += "<br>您在该挑战中!";baseSTR += `<br>您有${player.t.tokens[this.id]}个${this.id}代币(token)`;baseSTR += this.effDesp();return baseSTR},
            effect(){
                var eff = player.t.tokens[this.id].mul(31.4).add(1).pow(0.616)
                //eff = powsoftcap(eff,e(4),3)
                //eff = powsoftcap(eff,e(10),5)
                eff = logsoftcap(eff,e(1000),0.2)
                eff = powsoftcap(eff,e(1000),2)
                return eff
            },
            effDesp(){
                return "使得增量点效果^"+format(this.effect(),2)
            },            
            onClick(){doACreset(false,this.id);player.t.currentC = this.id}
        },
        21: {
            canClick(){return true},
            display() {var baseSTR = "C" + this.id;if(player.t.currentC == this.id) baseSTR += "<br>您在该挑战中!";baseSTR += `<br>您有${player.t.tokens[this.id]}个${this.id}代币(token)`;baseSTR += this.effDesp();return baseSTR},
            effect(){
                var eff = player.t.tokens[this.id].add(1).pow(0.616)
                eff = powsoftcap(eff,e(4),3)
                eff = powsoftcap(eff,e(10),5)
                return eff
            },
            effDesp(){
                return "使得倍增器效果^"+format(this.effect(),2)
            },
            onClick(){doACreset(false,this.id);player.t.currentC = this.id}
        },
        /*
        22: {
            canClick(){return true},
            display() {var baseSTR = "C" + this.id;if(player.t.currentC == this.id) baseSTR += "<br>您在该挑战中!";baseSTR += `<br>您有${player.t.tokens[this.id]}个${this.id}代币(token)`;baseSTR += this.effDesp();return baseSTR},
            effect(){
                var eff = player.t.tokens[this.id].add(1).pow(0.616)
                eff = powsoftcap(eff,e(4),3)
                eff = powsoftcap(eff,e(10),5)
                return eff
            },
            effDesp(){
                return "使得倍增器效果^"+format(this.effect(),2)
            },
            onClick(){doACreset(false,this.id);player.t.currentC = this.id}
        },
        */
    },
    /*upgrades: {
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
    },*/
    /*buyables: {
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
    milestones: {
        0: {
            requirementDescription: "1:1medal",
            effectDescription: "自动p升级.",
            done() { return player.t.points.gte(1) },
        },
        1: {
            requirementDescription: "2:2medal",
            effectDescription: "保留第三排p升级.",
            done() { return player.t.points.gte(2) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        2: {
            requirementDescription: "3:3medal",
            effectDescription: "保留au13.",
            done() { return player.t.points.gte(3) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        3: {
            requirementDescription: "4:4medal",
            effectDescription: "保留am24.(a里程碑24)",
            done() { return player.t.points.gte(4) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        4: {
            requirementDescription: "5:5medal",
            effectDescription: "g层级不重置任何东西.",
            done() { return player.t.points.gte(5) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        5: {
            requirementDescription: "6:6medal",
            effectDescription: "保留g里程碑.",
            done() { return player.t.points.gte(6) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        6: {
            requirementDescription: "7:8medal",
            effectDescription: "每秒获得1%的rau.",
            done() { return player.t.points.gte(8) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        7: {
            requirementDescription: "8:10medal",
            effectDescription: "允许购买最大a可购买项.",
            done() { return player.t.points.gte(10) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        8: {
            requirementDescription: "9:5 C12token",
            effectDescription: "你开始时保留100个发生器,发生器效果改为立即起效,发生器产生间隔的指数增加.(^2->^5)",
            done() { return player.t.tokens[12].gte(5) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        9: {
            requirementDescription: "10:20medal",
            effectDescription: "发生器能量效果e1.25e7软上限减弱(0.5次根->0.3次根),ap上限+medal.",
            done() { return player.t.points.gte(20) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        10: {
            requirementDescription: "11:50medal",
            effectDescription: "再次减弱ap上限的软上限(0.2次log->0.1次log),自动ap购买项.保留am15.",
            done() { return player.t.points.gte(50) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        11: {
            requirementDescription: "12:1 C21token",
            effectDescription: "倍增器效果^10,每秒获得10%的发生器.",
            done() { return player.t.tokens[21].gte(1) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        12: {
            requirementDescription: "13:100medal",
            effectDescription: "如果你在对应挑战中达到1token,那么进入对应挑战保留ap升级和里程碑.",
            done() { return player.t.points.gte(100) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        13: {
            requirementDescription: "14:500medal",
            effectDescription: "点数^2.保留ap里程碑14.",
            done() { return player.t.points.gte(500) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        14: {
            requirementDescription: "15:2500c13token",
            effectDescription: "增量点^1.5.软上限后.每秒获得100%的发生器.",
            done() { return player.t.tokens[13].gte(2500) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
    },
    //important!!!
    update(diff){
        player.t.nerf = calcTotalTokenCNerf()
        //auto
        /*for(row=1;row<=2;row++){
            for(col=1;col<=3;col++){
                if(layers[this.layer].buyables[row*10+col]){
                layers[this.layer].buyables[row*10+col].abtick += diff
                if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked()){
                    layers[this.layer].buyables[row*10+col].buy()
                    layers[this.layer].buyables[row*10+col].abtick = 0
                }}
            }
        }*/
    },
    getResetGain(){
        var gain = new ExpantaNum(1)
        gain = gain.mul(this.baseAmount().div(this.requires()).pow(this.exponent)).pow(this.gainExp()).mul(this.gainMult())
        //if(gain.gte(5)) gain = gain.pow(0.75).mul(5**0.25)
        gain = powsoftcap(gain,e(10),2)
        gain = logsoftcap(gain,e(1000),0.2)
        //if(player.a.points.add(gain).gt(getAPlimit())) return getAPlimit().sub(player.a.points).max(0)
        return gain.floor()
    },
    prestigeButtonText(){
        return "+ "+formatWhole(layers.t.getResetGain())+" 代币&奖牌"+"<br>基础公式: (x/6e7)^3"
    },
    hotkeys: [
        {key: "t", description: "T: 代币转", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    //passiveGeneration(){
    //    if(hasUpgrade("a",23)) return 10
    //    if(hasMilestone("a",5) || hasMilestone("a",26)) return 1
    //    if(hasMilestone("a",2)) return 0.1
    //    return 0
    //},
    //doReset(layer){
    //    if(layer != "i" && layer != "p"){
    //        if(layer == "b" && hasMilestone("g",2)) return
    //        var kp = []
    //        if(hasMilestone("a",4)) kp.push("upgrades")
    //        layerDataReset("p", kp)
    //        if(hasMilestone("a",3)&&!hasMilestone("a",4)) player.p.upgrades = [31,32,33,34,35]
    //    }
    //}
    tabFormat: {
        Token挑战表: {
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
                "clickables",
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
        Token挑战规则: {
            buttonStyle() {return  {'color': 'lightblue'}},
            content:
                ["main-display",
                ["display-text", function() {return "token挑战中一共有四种挑战,效果分别是:"}],
                ["display-text", function() {return "C1^n(n代表次数) : 无效果."}],
                ["display-text", function() {return "C2^n : 点数^0.6^n , AP ^0.75^n^4,若n>=2则再次ap^0.2,并使ap上限^0.8^(n-1)^2.(软上限后)"}],
                ["display-text", function() {return "C3^n : pp^0.25^n^1.5 , ts ^0.5^n , AP升级价格增长^3.5^n^0.6 RAU^0.33^n , au31只计算当前ap + C2^n."}],
                ["display-text", function() {return "C4^n : n=1:开启AC11 n=2:开启AC12. n=3:同时获得前两个效果. + C3^n"}],
                ["blank", "30px"],
                ["display-text", function() {return "Cab = Ca^2 + Cb"}],
                ["display-text", function() {return "如c24 = C2^2 + C4"}],
                ["blank", "30px"],
                ["display-text", function() {return "当前减益："}],
                ["display-text", function() {return `点数变为其${format(player.t.nerf.point)}次根`}],
                ["display-text", function() {return `AP变为其${format(player.t.nerf.AP)}次根`}],
                ["display-text", function() {return `AP上限变为其${format(player.t.nerf.APL)}次根`}],
                ["display-text", function() {return `pp变为其${format(player.t.nerf.pp)}次根`}],
                ["display-text", function() {return `ts变为其${format(player.t.nerf.ts)}次根`}],
                ["display-text", function() {return `AP升级价格增长变为其${format(player.t.nerf.APU)}次方`}],
                ["display-text", function() {return `RAU变为其${format(player.t.nerf.RAU)}次根`}],
                ["display-text", function() {return `au31是否只计算当前ap:${format(player.t.nerf.au31)?"是":"否"}`}],
                ["display-text", function() {
                    if(player.t.nerf.AC.eq(1)) return `开启AC11`
                    if(player.t.nerf.AC.eq(2)) return `开启AC12`
                    if(player.t.nerf.AC.eq(3)) return `开启AC11,12`
                    return ``
                }],
                //"clickables",// "resource-display",
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
        Token里程碑: {
            buttonStyle() {return  {'color': 'lightblue'}},
            content:
                ["main-display",
                "milestones",// "resource-display",
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
    }
})