const MLT_TABS = {
	mltMap: function() {
		return true;
	},
	mltMilestones: function() {
		return true;
	},
	quilts: function() {
		return true;
	},
};

const MULIVERSE_ENERGY_BASE = 2;

const MULTIVERSES = 5;

const MLT_DATA = {
	0: {
		desc: "您已经习惯的正常多宇宙。",
		req: new ExpantaNum(0),
	},
	1: {
		desc: "以下的游戏内容您只能解锁其中2个：学说，强子挑战，量子泡沫，斯格明子<b>(解锁方法为开启它们的界面)</b>。普通的竞技场挑战完成情况也将被重置。",
		reward: "普通的竞技场挑战奖励更好，但它们的目标也将变得更高。根据距离数值，增加斯格明子的获取量。",
		effect: function() { return player.distance.plus(1).log10().plus(1).logBase(3).plus(1) },
		effectDesc: function(e) { return showNum(e)+"倍" },
		req: new ExpantaNum(5),
	},
	2: {
		desc: "最大速度强制生效，π介子场和旋量场的效果减少40%，时间速度和最大速度变为原来的1.3次方根。",
		reward: "每3次导数提升让您额外获得1次导数变换(最高为6次变换)。",
		req: new ExpantaNum(20),
	},
	3: {
		desc: "以下的游戏内容您只能解锁其中1个：飞升，竞技场，万神殿，导数<b>(解锁方法为开启它们的界面)</b>。夸克和轻子的指数总是为0，熵无法使用。",
		reward: "解锁5个新的黑暗拓展器",
		req: new ExpantaNum(100),
	},
	4: {
		desc: "强制进入学说宇宙深度4.5(不受任何减少深度的影响)，这同样会影响π介子和旋量的获取量。",
		extremeDesc: "强制进入学说宇宙深度4.25(不受任何减少深度的影响)，这同样会影响π介子和旋量的获取量。",
		reward: "解锁三个弦。",
		req: new ExpantaNum(400),
	},
	5: {
		desc: "时间速度变为原来的3.6次方根。",
		extremeDesc: "时间速度变为原来的2.7次方根。",
		reward: "净化能量的效果可以为负数，并解锁幻象(新的万神殿可选项)。天堂芯片和恶魔灵魂的效果大大增强。",
		req: new ExpantaNum(2e3),
	},
}

const MLT_MILESTONE_NUM = 24;

const MLT_MILESTONES = [
	{
		req: new ExpantaNum(1),
		desc: "重置时保留希格斯升级(除了需要通过黑暗拓展器解锁的以外)",
		extremeDesc: "重置时保留希格斯升级(除了需要通过黑暗拓展器解锁的以外)，并解锁自动岩浆。",
	}, {
		req: new ExpantaNum(2),
		desc: "重置时保留熵升级(只保留可以在斯格明子重置时保留的升级)，并以一次基本重置开始",
	}, {
		req: new ExpantaNum(3),
		desc: "开始时直接解锁玻色子升级，并且重置时保留解锁的学说，黑暗拓展器，和所有的希格斯升级",
		hdDesc: "开始时直接解锁玻色子升级，并且重置时保留解锁的学说，黑暗拓展器，所有的希格斯升级，和能量升级",
	}, {
		req: new ExpantaNum(4),
		desc: "解锁自动学说宇宙，但也将无法手动进入学说宇宙。自动量子泡沫直接解锁，重构泡沫不再重置任何东西，并可以批量进行。",
	}, {
		req: new ExpantaNum(5),
		desc: "重置时保留最高的强子分数",
	}, {
		req: new ExpantaNum(6),
		desc: "多元织物 II的第二个效果也对π介子和旋量的获取量生效。",
	}, {
		req: new ExpantaNum(7),
		desc: "每秒获得当前产量100%的基本重置次数",
	}, {
		req: new ExpantaNum(8),
		desc: "解锁自动π介子场",
		extremeDesc: "解锁自动π介子场和自动等离子体提升",
	}, {
		req: new ExpantaNum(9),
		desc: "解锁自动旋量场",
	}, {
		req: new ExpantaNum(10),
		desc: "每秒获得当前产量100%的斯格明子",
		extremeDesc: "每秒获得当前产量100%的斯格明子，煤的效果变为原来的平方。",
	}, {
		req: new ExpantaNum(12),
		desc: "根据未花费的多元能量数值，减少斯格明子的基础需求。",
		effect: function() { 
			let e = player.mlt.energy
			if (e.gte(100)) e = ExpantaNum.pow(10, e.log10().times(2).sqrt())
			return e.plus(1).logBase(1.6).plus(1).sqrt().min(1e3);
		},
		effectDesc: function() { return "距离："+formatDistance(SKY_REQ[0])+" -> "+formatDistance(getSkyReqData(0, "mlt"))+"<br>夸克需求："+showNum(SKY_REQ[1])+" -> "+showNum(getSkyReqData(1, "mlt"))+"<br>轻子需求："+showNum(SKY_REQ[2])+" -> "+showNum(getSkyReqData(2, "mlt")) },
	}, {
		req: new ExpantaNum(16),
		desc: "根据多元能量总数数值，使Ω 粒子需求提升速度减少。",
		effect: function() { return player.mlt.totalEnergy.plus(1).log10().plus(1).log10().plus(1) },
		effectDesc: function() { return "目前："+showNum(2)+" -> "+showNum(ExpantaNum.root(2, tmp.mlt.mil12reward||1)) },
	}, {
		req: new ExpantaNum(25),
		desc: "能够增加弦效果的学说树升级，其购买上限增加5。引力子的效果变为原来的15次方。",
		extremeDesc: "能够增加弦效果的学说树升级，其购买上限增加5。引力子的效果变为原来的15次方。根据导数提升次数，增加等离子体的基础指数。",
	}, {
		req: new ExpantaNum(40),
		desc: "所有夸克和轻子的效果永远生效，并且总是自动获得净化能量。",
		extremeDesc: "所有夸克和轻子的效果永远生效，并且总是自动获得净化能量。白色火焰获取量变为原来的10倍。",
	}, {
		req: new ExpantaNum(100),
		desc: "根据阶层数值，减少原子折算的花费提升速度。",
		effect: function() { return ExpantaNum.div(1, player.tier.plus(1).logBase(6).plus(1)) },
		effectDesc: function() { return "目前：-"+showNum(ExpantaNum.sub(1, tmp.mlt.mil15reward).times(100)||0)+"%" },
	}, {
		req: new ExpantaNum(180),
		desc: "无限10;1升级总是对最后一个导数生效，并且它效果的公式变得更好。",
	}, {
		req: new ExpantaNum(300),
		desc: "根据距离数值，使多元织物升级的效果变得更好。",
		extremeDesc: "根据距离数值，使多元织物升级的效果变得更好。白色火焰获取量变为原来的100倍。",
		effect: function() { return player.distance.max(1).logBase(DISTANCES.多宇宙).plus(1).logBase(2).times(0.01) },
		effectDesc: function() { return "目前：+"+showNum(tmp.mlt.mil17reward.times(100)||0)+"%" },
	}, {
		req: new ExpantaNum(1.25e3),
		desc: "量子泡沫效果的指数增加0.05。",
		extremeDesc: "量子泡沫效果的指数增加0.05。从此成就起，每再获得一个多宇宙里程碑，白色火焰获取量就变为原来的20倍。",
	}, {
		req: new ExpantaNum(1.75e3),
		desc: "一维弦的效果也对加速子获取量生效。",
		extremeDesc: "所有弦和超对称粒子的效果也对加速子获取量生效。",
	}, {
		req: new ExpantaNum(5e3),
		desc: "根据纠缠弦数值，增加π介子的获取量。根据量子泡沫数值，增加旋量的获取量。",
		effect: function() {
			return {
				pion: ExpantaNum.pow(10, player.elementary.theory.strings.entangled.plus(1).log10().root(4)),
				spinor: ExpantaNum.pow(10, player.elementary.foam.amounts[0].plus(1).log10().root(4)),
			}
		},
		effectDesc: function() { return "π介子： "+showNum(tmp.mlt.mil20reward.pion)+" 倍<br>旋量： "+showNum(tmp.mlt.mil20reward.spinor)+" 倍" },
	}, {
		req: new ExpantaNum(1e4),
		desc: "自动量子泡沫解锁从每秒发生一次变为每个时刻发生一次。重构太初泡沫的花费提升速度减少20%。",
	}, {
		req: new ExpantaNum(2e5),
		desc: "根据量子泡沫升级购买总量数值，减少量子泡沫升级的花费。",
		effect: function() { 
			let total = player.elementary.foam.upgrades.reduce((a,c) => ExpantaNum.add(a, c));
			return ExpantaNum.pow(10, total.plus(1).log10().pow(4));
		},
		effectDesc: function() { return "目前：/"+showNum(tmp.mlt.mil22reward) },
	}, {
		req: new ExpantaNum(1e6),
		desc: "如果您在主宇宙，则究级折算的级别延迟250次出现。",
	}, {
		req: new ExpantaNum(2.5e7),
		desc: "根据多元能量总数数值，减少熵升级的花费。",
		effect: function() { return player.mlt.totalEnergy.plus(1).log10().plus(1).root(5) },
		effectDesc: function() { return "目前：/"+showNum(tmp.mlt.mil24reward) },
	},
]

const MLT_1_STADIUM_REWARDS = {
	spaceon: "根据火箭和火箭燃料数值，使无限1;1升级的效果变得更好。",
	solaris: "根据残骸数值，使超级折算的级别和病原体升级延迟出现。",
	infinity: "火箭燃料的效果变为原来的10倍，且公式变得更好。",
	eternity: "根据认可和飞升能量数值，使级别可以加快时间速度。",
	reality: "火箭，时间方盒和黑暗核心的效果变为8倍。",
	drigganiz: "根据成就获取总数数值，使病原体升级的效果变得更好。",
	effects: {
		spaceon: function () {
			let mult = tmp.inf.pantheon.chipBoost;
			let ret = player.rockets.plus(1).log10().plus(1).log().pow(2.25).plus(1);
			if (ret.gte(30)) ret = ret.logBase(30).times(30).min(ret);
			ret = ret.times(mult);
			if (player.modes.includes("extreme")) ret = ret.plus(1).log10().plus(1).log10().div(10).plus(1)
			return ret.times(player.rf.times(10).plus(1));
		},
		solaris: function () {
			let mult = tmp.inf.pantheon.chipBoost;
			let ret = player.collapse.cadavers.plus(1).log10().plus(1).log10().pow(3.25);
			if (ret.gte(15)) ret = ret.logBase(15).times(15).min(ret);
			ret = ret.times(mult);
			return ret;
		},
		eternity: function () {
			let mult = tmp.inf.pantheon.chipBoost;
			let base = player.inf.endorsements.plus(1).times(player.inf.ascension.power.plus(1).log10().plus(1).sqrt());
			let exp = player.inf.endorsements.div(10).plus(1).logBase(1.75).plus(1).pow(9);
			let totalExp = base.pow(exp);
			if (totalExp.gte("1e50000"))
				totalExp = totalExp.log10().times(ExpantaNum.div("1e50000", ExpantaNum.log10("1e50000")));
			let ret = player.rank.pow(totalExp.logBase(2));
			ret = ret.pow(mult);
			return ret.times(ExpantaNum.pow(10, 1e6)).max(1);
		},
		drigganiz: function () {
			let ret = ExpantaNum.mul(0.015+0.0001*player.achievements.length, player.achievements.length);
			return ret;
		}
	},
	disp: {
		spaceon: function () {
			return "^" + showNum(STADIUM_REWARDS.effects.spaceon());
		},
		solaris: function () {
			return "+" + showNum(STADIUM_REWARDS.effects.solaris());
		},
		eternity: function () {
			return "x" + showNum(STADIUM_REWARDS.effects.eternity());
		},
		drigganiz: function () {
			return "+" + showNum(STADIUM_REWARDS.effects.drigganiz().times(100)) + "%";
		}
	}
}

const MLT_1_ETERNITY_GOAL_EXP = new ExpantaNum(8e3)
const MLT_1_STADIUM_GOAL_EXP = new ExpantaNum(1.5e5)