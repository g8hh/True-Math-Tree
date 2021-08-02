function checkAroundUpg(UPGlayer,place){
    return hasUpgrade(UPGlayer,place-1)||hasUpgrade(UPGlayer,place+1)||hasUpgrade(UPGlayer,place-10)||hasUpgrade(UPGlayer,place+10)
}
function getAPlimit(){
    var limit = new ExpantaNum(50)
    if(hasMilestone("a",8)) limit = limit.pow((player.a.upgrades.length/5)**2+1)
    if(hasUpgrade("a",11)) limit = limit.mul(upgradeEffect("a",11))
    if(hasUpgrade("a",24)) limit = limit.mul(upgradeEffect("a",24))
    limit = limit.mul(buyableEffect("a",11))
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
function getResetUGain(){
    var resetUgain = Math.max(player.a.upgrades.length-1,0)
    if(hasMilestone("a",16)) resetUgain = resetUgain**1.5
    resetUgain = new OmegaNum(resetUgain)
    if(hasMilestone("a",21)) resetUgain = resetUgain.mul(player.a.points.add(10).log10().pow(0.75))
    return resetUgain.floor()
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
        ppbest: new ExpantaNum(0),
        resetU: new ExpantaNum(0),
        resetUsetting: false
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
        var eff0 = `<br>你已经重置了${player.a.resetU.toFixed(0)}个ap升级(ap升级13不计入)(RAU)<br>你的最佳ap为${format(player.a.best,0)}<br>你的ap上限为${format(getAPlimit(),0)}.`
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
            display() {return `重置ap升级<br />这将会进行一次a转,并获得${format(getResetUGain(),0)}被重置的升级(RAU)<br /><br />当前升级价格倍率:${format(player.a.costmult)}`},
            onClick(){                    
                var resetgain = getResetUGain()

                if(player.a.resetUsetting){
                    player.a.resetU = player.a.resetU.add(resetgain);
                    player.a.upgrades=[];player.a.points=player.a.points.max(e(50));player.a.costmult=new ExpantaNum(1);doReset(this.layer)
                    return
                }
                if(confirm("你确定清除升级吗 这不会返还任何ap")){
                    player.a.resetU = player.a.resetU.add(resetgain);
                    player.a.upgrades=[];player.a.points=player.a.points.max(e(50));player.a.costmult=new ExpantaNum(1);doReset(this.layer)
                }
            }
        },
        12: {
            canClick(){return true/*hasMilestone("a",7)&&player.a.costmult.gt(1)*/},
            display() {return `是否禁用重置ap升级的确认框<br /><br />当前状态:${player.a.resetUsetting?"是":"否"}`},
            onClick(){player.a.resetUsetting=!player.a.resetUsetting}
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
                if(hasUpgrade("a",31)) baseEff = baseEff.pow(upgradeEffect("a",31))
                //sc
                //if(baseEff.gt(10)) baseEff = baseEff.log10().pow(1.5).mul(10)
                return baseEff
            },
            effectDisplay(){return `x${format(upgradeEffect("a",11),2)}`},
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        23: {
            description: `你每秒获得1000%的pp.<br><br>价格增长倍率:x1.`,
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        31: {
            description: `最佳ap优化au11.<br><br>价格增长倍率:x25.`,
            cost(){return new OmegaNum("1024").mul(player.a.costmult)},
            costinc(){return 25},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",31)&&hasMilestone("a",13)},
            effect(){
                var baseEff = player.a.best.pow(0.06)
                return baseEff
            },
            effectDisplay(){return `^${format(upgradeEffect("a",31),1)}`},
            onPurchase(){
                player.a.milestones = AUMilestonekeep();
                player.a.points=new OmegaNum(0);
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        32: {
            description: `p34效果^1.5.<br><br>价格增长倍率:x1.`,
            cost(){return new OmegaNum("128").mul(player.a.costmult)},
            costinc(){return 1},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",32)&&hasMilestone("a",13)},
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        33: {
            description: `解锁增量^.自动购买最大.<br><br>价格增长倍率:x25.`,
            cost(){return new OmegaNum("1024").mul(player.a.costmult)},
            costinc(){return 25},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",33)&&hasMilestone("a",13)},
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        34: {
            description: `延迟pp的1e75软上限至1e100.<br><br>价格增长倍率:x10.`,
            cost(){return new OmegaNum("1024").mul(player.a.costmult)},
            costinc(){return 10},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",34)&&hasMilestone("a",13)},
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
        35: {
            description: `解锁新的ap里程碑.里程碑完成后仍然保留.购买时重置最佳ap.<br><br>价格增长倍率:x1024.`,
            cost(){return new OmegaNum("10086").mul(player.a.costmult)},
            costinc(){return 1024},//注：omeganum或数字都行
            unlocked(){return checkAroundUpg("a",35)&&hasMilestone("a",13)},
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
                player.a.best=new OmegaNum(0);
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
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
                player.points=new OmegaNum(0)
                for (let x = 2; x >= 0; x--) rowReset(x, "a")
                player.a.costmult=player.a.costmult.mul(layers[this.layer].upgrades[this.id].costinc())
            },
        },
    },
    buyables: {
        11: {
            cost(x) {
                var c = two.pow(x.add(40).pow(1.2)).root(3).sub(1)
                if(hasMilestone("a",18)) c = c.root(1.1)
                if(hasMilestone("a",19)) c = c.root(1.1)
                return c
            },
            display() { return `基于最高pp倍增b和cmax.这同时影响ap上限.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}ap<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                //if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var basep = player.i.points
                if(hasMilestone("a",18)) basep = basep.pow(1.1)
                if(hasMilestone("a",19)) basep = basep.pow(1.1)
                var c = basep.add(1).pow(3).logBase(2).root(1.2).sub(40).sub(getBuyableAmount(this.layer, this.id)).add(1).min(1/*upgradeEffect("p",31)*/).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = player.a.ppbest.add(1).log10().div(200).add(1).pow(getBuyableAmount(this.layer,this.id).pow(0.33))
                baseEff = baseEff.mul(buyableEffect("a",12))
                if(hasMilestone("a",14)) baseEff = baseEff.pow(2)
                //if(baseEff.gt(2)) baseEff = baseEff.pow(0.75).mul(2**0.25)
                if(this.unlocked()) return baseEff
                return new ExpantaNum(1)
            },
            unlocked(){return hasMilestone("a",14)&&geta().eq(1)},
            abtick:0,
            abdelay(){
                return 1.797e308
            }
        },
        12: {
            cost(x) {
                var c = two.pow(x.add(35).pow(1.35)).root(4).sub(1)
                if(hasMilestone("a",18)) c = c.root(1.1)
                if(hasMilestone("a",19)) c = c.root(1.1)
                return c
            },
            display() { return `基于ap倍增cmax.这同时影响上一个ap可重复购买项.<br />x${format(buyableEffect(this.layer,this.id),2)}.<br />费用:${format(this.cost(getBuyableAmount(this.layer, this.id)))}ap<br>等级:${formatWhole(getBuyableAmount(this.layer, this.id))}` },
            canAfford() { return player[this.layer].points.gte(this.cost().add(1)) },
            buy() {
                //if(hasUpgrade("p",34)){this.buyMax();return}
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax(){
                var basep = player.i.points
                if(hasMilestone("a",18)) basep = basep.pow(1.1)
                if(hasMilestone("a",19)) basep = basep.pow(1.1)
                var c = basep.add(1).pow(4).logBase(2).root(1.35).sub(35).sub(getBuyableAmount(this.layer, this.id)).add(1).min(1/*upgradeEffect("p",31)*/).floor().max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(c))
            },
            effect(){
                var baseEff = player.a.points.add(1).log10().div(20).add(1).pow(getBuyableAmount(this.layer,this.id).pow(0.25))
                if(hasMilestone("a",14)) baseEff = baseEff.pow(2)
                //if(baseEff.gt(2)) baseEff = baseEff.pow(0.75).mul(2**0.25)
                if(this.unlocked()) return baseEff
                return new ExpantaNum(1)
            },
            unlocked(){return hasMilestone("a",14)&&geta().eq(1)},
            abtick:0,
            abdelay(){
                return 1.797e308
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
        player.a.points = player.a.points.min(getAPlimit().floor())
        player.a.pointbest = player.points.max(player.a.pointbest)
        player.a.ppbest = player.p.points.max(player.a.ppbest)
    },
    milestones: {
        0: {
            requirementDescription: "1:3ap",
            effectDescription: "解锁增量+.解锁新的p转升级.pp基于c的获取指数/2,改善p11公式,高德纳箭头要求提升至e10但获取指数更高(^0.125->0.1875),时间速率x5,ap对p的加成x10",
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
            effectDescription: "最后一排升级的效率x3.14.",
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
            effectDescription: "ap上限基于au增加.( = 50^((au/5)^2+1) )",
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
        13: {
            requirementDescription: "14:10au",
            effectDescription: "被重置的au加成ap获取.加成的量等同于au24的立方根.(无论你是否购买au24).允许购买第三行ap升级.",
            done() { return player.a.upgrades.length >= 10 },
            unlocked(){return hasMilestone("a",11)},
        },
        14: {
            requirementDescription: "15:2.5e9ap",
            effectDescription: "解锁两个ap可购买项.箭头数强制等于1.",
            done() { return player.a.points.gte(2.5e9) },
            unlocked(){return hasMilestone("a",12)},
        },
        15: {
            requirementDescription: "16:可购买项11达到6级",
            effectDescription: "可购买项的效果^2.减弱p14的e100软上限.(^0.25->^0.5)",
            done() { return player.a.buyables[11].gte(6) },
            unlocked(){return hasMilestone("a",13)},
        },
        16: {
            requirementDescription: "17:购买升级35",
            effectDescription: "被重置的升级获取量基于重置时你拥有的升级数获得加成.(*(x-1)^0.75)",
            done() { return hasUpgrade("a",35) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        17: {
            requirementDescription: "18:购买升级35的同时获得256 000 000ap",
            effectDescription: "点数的e4000软上限减弱.(^0.2 -> ^0.25).ap可购买项11加成p34.",
            done() { return hasUpgrade("a",35)&&player.a.points.gte(256000000) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        18: {
            requirementDescription: "19:购买升级35的同时获得512 000 000ap",
            effectDescription: "ap可购买项的价格变为原来的1.1次根.",
            done() { return hasUpgrade("a",35)&&player.a.points.gte(512000000) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        19: {
            requirementDescription: "20:购买升级35的同时获得e12800P.",
            effectDescription: "ap可购买项的价格变为原来的1.1次根.",
            done() { return hasUpgrade("a",35)&&player.points.gte("e12000") },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        20: {
            requirementDescription: "21:e39000P.",
            effectDescription: "你每秒获得10%的ap.增量点获取^2.",
            done() { return player.points.gte("e39000") },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        21: {
            requirementDescription: "22:7.5e10AP + e68,000P.",
            effectDescription: "你每秒获得100%的ap.被重置的升级获取量基于重置时你拥有的ap数获得加成.(*log10(x+10)^0.5)",
            done() { return player.points.gte("e68000")&&player.a.points.gte(7.5e10) },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        22: {
            requirementDescription: "23:15au.",
            effectDescription: "你每秒获得1000%的ap.解锁增量双指数(增量d^).你可以购买最大增量d^.",
            done() { return player.a.upgrades.length >= 15 },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
        23: {
            requirementDescription: "24:e100,000P.",
            effectDescription: "ap可重复购买项12加成p可重复购买项11.(无视软上限)",
            done() { return player.points.gte("e100000") },
            unlocked(){return hasMilestone(this.layer,this.id-1)||hasMilestone(this.layer,this.id) },
        },
    },
    passiveGeneration(){
        if(hasMilestone("a",21)) return 10
        if(hasMilestone("a",21)) return 1
        if(hasMilestone("a",20)) return 0.1
        return 0
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
        AP购买项: {
            buttonStyle() {return  {'color': 'lightblue'}},
            unlocked() {return hasMilestone("a",14)},
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
                //"clickables",// "resource-display",
                "buyables",
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