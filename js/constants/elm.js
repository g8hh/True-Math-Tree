const ELM_TABS = {
	fermions: function () {
		return true;
	},
	bosons: function () {
		return player.elementary.times.gte(2)||hasMltMilestone(3);
	},
	theory: function () {
		return player.elementary.theory.unl||(mltActive(1)&&player.mlt.mlt1selected.length<2);
	},
	hc: function () {
		return player.elementary.hc.unl||(mltActive(1)&&player.mlt.mlt1selected.length<2);
	},
	foam: function() {
		return player.elementary.foam.unl||(mltActive(1)&&player.mlt.mlt1selected.length<2);
	},
	sky: function() {
		return player.elementary.sky.unl||(mltActive(1)&&player.mlt.mlt1selected.length<2);
	},
};

const FULL_ELM_NAMES = {
	fermions: "费米子",
	bosons: "玻色子",
	theory: "学说",
	hc: "强子挑战",
	foam: "量子泡沫",
	sky: "斯格明子",
}

const QUARK_NAMES = ["上", "下", "粲", "奇", "顶", "底"];
const QUARK_DESCS = {
	上: "增加火箭的获取量。",
	下: "增加残骸的获取量。",
	粲: "增加知识的获取量。",
	奇: "根据费米子数值，增加病原体的获取量。",
	顶: "增加轻子的获取量。",
	底: "增加飞升能量的获取量。"
};

const LEPTON_NAMES = ["电", "缪", "陶", "中微", "振荡", "普西"];
const LEPTON_DESCS = {
	电: "增加特权效果。",
	缪: "增加残骸效果。",
	陶: "根据知识数值，增加知识的获取量。",
	中微: "增加病原体升级效果。",
	振荡: "增加导数提升效果。",
	普西: "增加夸克的获取量。"
};

const PHOTON_UPGS = 4;
const PH_CST_SCLD = {
	1: function(exp, s) { return ExpantaNum.pow(5, player.elementary.bosons.gauge.photons.upgrades[0].pow(exp).div(s.pow(exp.sub(1))).pow(2)).times(25) },
	2: function(exp, s) { return ExpantaNum.pow(4, player.elementary.bosons.gauge.photons.upgrades[1].pow(exp).div(s.pow(exp.sub(1))).pow(2)).times(40) },
	3: function(exp, s) { return ExpantaNum.pow(10, player.elementary.bosons.gauge.photons.upgrades[2].pow(exp).div(s.pow(exp.sub(1)))).times(1e4) },
	4: function(exp, s) { return ExpantaNum.pow(2, player.elementary.bosons.gauge.photons.upgrades[3].pow(exp).div(s.pow(exp.sub(1))).pow(1.1).times(ExpantaNum.pow(1.01, player.elementary.bosons.gauge.photons.upgrades[3]))).times(6e4) },
}

const GLUON_COLOURS = ["r", "g", "b", "ar", "ag", "ab"];

const HIGGS_UPGS_EXTR_DESCS = {
	"0;0;0": {
		desc: {
			extreme: "Always keep TR Upgrades, the Pathogen Upgrade automator, the Dark Core automator, & Furnace Challenge completions. You also start with Automation unlocked.",
			hikers: "Always keep TR Upgrades, the Pathogen Upgrade automator, the Dark Core automator, and all energy upgrades. You also start with Automation unlocked.",
		},
		active: () => modeActive("extreme") ? "extreme" : (modeActive("hikers_dream") ? "hikers" : false),
	},
	"1;0;0": {
		desc: {
			hikers: "Unlock Auto-Robots, and your best motivation is not reset upon elementary.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
	"0;0;1": {
		desc: {
			hikers: "You start with 10 Endorsements on reset and raise Consistency to the 1.8th power.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
	"2;0;0": {
		desc: {
			hikers: "Unlock Auto-Endorsements and boost Meta Omnipotence based on the square root of Higgs Upgrades.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
	"1;2;0": {
		desc: {
			hikers: "Unlock Auto-Spectral Gem Distribution, you keep Purge Power on reset, and super energy multiplies photons gain.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
	"1;3;0": {
		desc: {
			hikers: "Angels & Demons boost the Gauge Force effect and the second super energy effect.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
	"0;3;1": {
		desc: {
			hikers: "Purge Power boosts Quark & Lepton gain and passive energy gain is squared.",
		},
		active: () => modeActive("hikers_dream") ? "hikers" : false,
	},
}

const DE_HIGGS_UPGS = ["5;0;0", "0;0;5", "5;0;5", "4;1;0", "0;1;4", "1;1;1", "3;2;2"]

const HIGGS_UPGS = {
	"0;0;0": {
		cost: new ExpantaNum(4e4),
		desc: "Always keep TR Upgrades, the Pathogen Upgrade automator, & the Dark Core automator. You also start with Automation unlocked.",
		unl: function() { return true },
	},
	"1;0;0": {
		cost: new ExpantaNum(1e5),
		desc: "Unlock Auto-Robots.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;0") },
	},
	"0;1;0": {
		cost: new ExpantaNum(1e5),
		desc: "Unlock Auto-Infinity Upgrades, and Infinity Upgrades are never repealed.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;0") },
	},
	"0;0;1": {
		cost: new ExpantaNum(1e5),
		desc: "You start with 10 Endorsements on reset.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;0") },
	},
	"2;0;0": {
		cost: new ExpantaNum(1e7),
		desc: "Unlock Auto-Endorsements.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("1;0;0") },
	},
	"0;2;0": {
		cost: new ExpantaNum(1e7),
		desc: "Unlock Auto-Enlightenments.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;1;0") },
	},
	"1;1;0": {
		cost: new ExpantaNum(1.5e5),
		desc: "Quarks, Leptons, Photons, Gravitons, & Higgs Bosons boost Elementary Particle gain.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;1;0")||player.elementary.bosons.scalar.higgs.upgrades.includes("1;0;0") },
	},
	"1;0;1": {
		cost: new ExpantaNum(1.5e5),
		desc: "Perks last 900% longer.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;1")||player.elementary.bosons.scalar.higgs.upgrades.includes("1;0;0") },
	},
	"0;0;2": {
		cost: new ExpantaNum(1e7),
		desc: "Unlock Auto-Perks & the Perk Accelerator.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;1") },
	},
	"0;1;1": {
		cost: new ExpantaNum(1.5e5),
		desc: "Endorsements beyond 36 boost Higgs Boson gain.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;1;0")||player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;1") },
	},
	"3;0;0": {
		cost: new ExpantaNum(2.5e7),
		desc: "Keep Stadium Challenges on reset, and Elementary Particle gain & Higgs Boson gain are increased by 10% for each Higgs Upgrade bought.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("2;0;0") },
	},
	"0;0;3": {
		cost: new ExpantaNum(5e7),
		desc: "Unlock Auto-Derivative Shifts/Boosts, Auto-Endorsements buy max, and you gain Knowledge 200% faster.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;2") },
	},
	"1;2;0": {
		cost: new ExpantaNum(1e8),
		desc: "Unlock Auto-Spectral Gem Distribution, and you keep Purge Power on reset.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;2;0") },
	},
	"0;2;1": {
		cost: new ExpantaNum(2e8),
		desc: "Derivative Boosts are stronger based on your Higgs Bosons.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;2;0") },
	},
	"4;0;0": {
		cost: new ExpantaNum(2e9),
		desc: "Unlock 1 new row & column of Infinity Upgrades.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("3;0;0") },
	},
	"0;0;4": {
		cost: new ExpantaNum(2e9),
		desc: "Knowledge gain & Ascension Power gain are faster based on the Perk Accelerator's speed.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;3") },
	},
	"1;3;0": {
		cost: new ExpantaNum(1e12),
		desc: "Angels & Demons boost the Gauge Force effect.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("1;2;0") },
	},
	"0;3;1": {
		cost: new ExpantaNum(1e12),
		desc: "Purge Power boosts Quark & Lepton gain.",
		unl: function() { return player.elementary.bosons.scalar.higgs.upgrades.includes("0;2;1") },
	},
	"5;0;0": {
		cost: new ExpantaNum(5e20),
		desc: "inf10;4 uses a better formula.",
		unl: function() { return hasDE(3) },
	},
	"0;0;5": {
		cost: new ExpantaNum(5e20),
		desc: "Atomic Rank scaling starts later based on your Higgs Bosons.",
		unl: function() { return hasDE(3) },
	},
	"5;0;5": {
		cost: new ExpantaNum(1e21),
		desc: "inf10;10 uses a better formula.",
		unl: function() { return hasDE(3) },
	},
	"4;1;0": {
		cost: new ExpantaNum(2e20),
		desc: "Gain 666x more Gluons.",
		unl: function() { return hasDE(3) },
	},
	"0;1;4": {
		cost: new ExpantaNum(2e20),
		desc: "The softcap to Pathogen Upgrade 1's effect is nerfed, and Pathogen Upgrade 1's formula is better.",
		unl: function() { return hasDE(3) },
	},
	"6;0;0": {
		cost: new ExpantaNum(5e9),
		desc: "Unlock a new Furnace Challenge.",
		unl: function() { return modeActive("extreme")&&player.elementary.bosons.scalar.higgs.upgrades.includes("1;0;0") },
	},
	"0;0;6": {
		cost: new ExpantaNum(5e9),
		desc: "Both Molten Brick effects use better formulas.",
		unl: function() { return modeActive("extreme")&&player.elementary.bosons.scalar.higgs.upgrades.includes("1;0;0") },
	},
	"6;1;0": {
		cost: new ExpantaNum(1e12),
		desc: "The final Enhanced Furnace Upgrade is stronger based on its level.",
		unl: function() { return modeActive("extreme")&&player.elementary.bosons.scalar.higgs.upgrades.includes("6;0;0") },
	},
	"0;1;6": {
		cost: new ExpantaNum(1e12),
		desc: "Your Molten Bricks are doubled.",
		unl: function() { return modeActive("extreme")&&player.elementary.bosons.scalar.higgs.upgrades.includes("0;0;6") },
	},
	"1;1;1": {
		cost: new ExpantaNum(1.5e24),
		desc: "The Magma Search requirement scales half as fast, and Magma's effect uses a better formula.",
		unl: function() { return hasDE(3) && modeActive("extreme") },
	},
	"2;2;1": {
		cost: new ExpantaNum(1e11),
		desc: "Raise Optimization effect to the power of the number of Higgs Boson upgrades and energy multiples Knowledge gain.",
		unl: function() { return modeActive("hikers_dream") && player.elementary.bosons.scalar.higgs.upgrades.includes("1;2;0") },
	},
	"2;2;2": {
		cost: new ExpantaNum(5e10),
		desc: "Raise Storage to the tenth power and it also boosts Motivation.",
		unl: function() { return modeActive("hikers_dream") && player.elementary.bosons.scalar.higgs.upgrades.includes("0;2;1") },
	},
	"3;2;2": {
		cost: new ExpantaNum(5e22),
		desc: "Square each Omnipotence and Storage",
		unl: function() { return modeActive("hikers_dream") && hasDE(3) },
	},
}

const THEORY_REQ = [new ExpantaNum("1e4000000").times(DISTANCES.宇宙), new ExpantaNum(1000)]

const TH_TABS = {
	tv: function () {
		return true;
	},
	ss: function () {
		return true
	},
	tree: function() {
		return player.elementary.theory.supersymmetry.unl
	},
	strings: function() {
		return player.elementary.theory.tree.unl
	},
	preons: function() {
		return player.elementary.theory.strings.unl
	},
	accelerons: function() {
		return player.elementary.theory.preons.unl
	},
	inflatons: function() {
		return (modeActive("extreme")?player.elementary.foam.unl:player.elementary.hc.unl)&&player.elementary.theory.accelerons.unl
	},
};

const TREE_UPGS = {
	1: {
		cost: function(bought) { return bought.plus(1) },
		target: function(points) { return points.floor() },
		cap: new ExpantaNum(100),
		desc: "根据希格斯玻色子数值，增加超对称粒子的获取量。",
		effect: function(bought) { 
			let exp = new ExpantaNum(0.1)
			if ((player.elementary.theory.tree.upgrades[26]||new ExpantaNum(0)).gte(1)) exp = new ExpantaNum(0.4)
			let ret = player.elementary.bosons.scalar.higgs.amount.times(new ExpantaNum(bought).pow(2)).plus(1).pow(exp) 
			if (ret.gte(50)) ret = ret.sqrt().times(Math.sqrt(50))
			if (ret.gte(100)) ret = ret.log10().pow(new ExpantaNum(100).logBase(2)).min(ret.cbrt().times(Math.pow(100, 2/3)))
			return ret
		},
		effD: function(e) { return showNum(e)+" 倍" },
	},
	2: {
		cost: function(bought) { return bought.pow(2).plus(1) },
		target: function(points) { return points.sub(1).sqrt().plus(1).floor() },
		cap: new ExpantaNum(50),
		desc: "增加知识的获取量和希格斯玻色子的获取量。",
		effect: function(bought) { return ExpantaNum.pow(100, new ExpantaNum(bought).sqrt()) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	3: {
		cost: function(bought) { return bought.pow(3).plus(1) },
		target: function(points) { return points.sub(1).cbrt().plus(1).floor() },
		cap: new ExpantaNum(20),
		desc: "根据成就完成数量，使无限4;10升级的效果变得更好。",
		effect: function(bought) { return ExpantaNum.mul(player.achievements.length, ExpantaNum.mul(0.0001, bought)) },
		effD: function(e) { return "效果指数："+showNum(5)+" -> "+showNum(e.plus(5)) },
	},
	4: {
		cost: function(bought) { return ExpantaNum.pow(5, bought).times(4) },
		target: function(points) { return points.div(4).max(1).logBase(5).plus(1).floor() },
		cap: new ExpantaNum(10),
		desc: "使学说宇宙的减成更加缓和。",
		effect: function(bought) { return new ExpantaNum(bought).plus(1).times(10).slog(10).sub(1).times(7.6).max(0) },
		effD: function(e) { return "-"+showNum(e)+" 深度" },
	},
	5: {
		cost: function(bought) { return ExpantaNum.pow(2, bought).times(4) },
		target: function(points) { return points.div(4).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(15),
		desc: "超对称粒子的获取量变为三倍。",
		effect: function(bought) { return ExpantaNum.pow(3, bought) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	6: {
		unl: function() { return player.elementary.theory.strings.unl },
		cost: function(bought) { return ExpantaNum.add(bought.times(2), 6) },
		target: function(points) { return points.sub(6).div(2).plus(1).floor() },
		cap: new ExpantaNum(40),
		desc: "根据基本重置次数，增加纠缠弦的获取量。",
		effect: function(bought) { return player.elementary.times.plus(1).pow(new ExpantaNum(bought).pow(0.15).div(5)) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	7: {
		unl: function() { return player.elementary.theory.strings.unl },
		cost: function(bought) { return ExpantaNum.add(bought.times(3), 2) },
		target: function(points) { return points.sub(2).div(3).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "根据一维弦数值，使折算的认可延迟出现，且在学说宇宙中增加知识的获取量。",
		effect: function(bought) { return player.elementary.theory.strings.amounts[0].plus(1).times(10).slog(10).log10().div(5).times(new ExpantaNum(bought).times(75)) },
		effD: function(e) { return "延迟："+showNum(e)+" 次出现，知识的获取量："+showNum(e.plus(1).pow(10))+" 倍" },
	},
	8: {
		unl: function() { return player.elementary.theory.preons.unl },
		cost: function(bought) { return ExpantaNum.add(10, bought.pow(2).times(2)) },
		target: function(points) { return points.sub(10).div(2).sqrt().plus(1).floor() },
		cap: new ExpantaNum(16),
		desc: "超级折算的火箭燃料花费提升速度减少。",
		effect: function(bought) { 
			if (new ExpantaNum(bought).gte(16)) bought = ExpantaNum.sub(20, ExpantaNum.div(20, ExpantaNum.sub(bought, 11)));
			return ExpantaNum.mul(0.05, bought) 
		},
		effD: function(e) { return "减少 "+showNum(e.times(100))+"%" },
	},
	9: {
		unl: function() { return player.elementary.theory.preons.unl },
		cost: function(bought) { return ExpantaNum.add(9, bought.times(3)) },
		target: function(points) { return points.sub(9).div(3).plus(1).floor() },
		cap: new ExpantaNum(90),
		desc: "根据费米子数值，增加前子的获取量。",
		effect: function(bought) { return player.elementary.fermions.amount.pow(0.2).times(new ExpantaNum(bought).pow(2)).plus(1) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	10: {
		unl: function() { return player.elementary.theory.preons.unl },
		cost: function(bought) { return ExpantaNum.add(14, bought.pow(3).times(7)) },
		target: function(points) { return points.sub(14).div(7).cbrt().plus(1).floor() },
		cap: new ExpantaNum(10),
		desc: "学说增强器花费更少。",
		effect: function(bought) { return ExpantaNum.pow(ExpantaNum.add(bought, 1), 3) },
		effD: function(e) { return "便宜 "+showNum(e)+" 倍" },
	},
	11: {
		unl: function() { return player.elementary.theory.preons.unl },
		cost: function(bought) { return ExpantaNum.mul(20, bought.div(2).plus(1)) },
		target: function(points) { return points.div(20).sub(1).times(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "使上方的升级根据前子数值，额外增加其生效的等级。",
		altDesc: "使之前的升级根据前子数值，额外增加其生效的等级。",
		effect: function(bought) { return player.elementary.theory.preons.amount.plus(1).times(10).slog(10).times(bought) },
		effD: function(e) { return "额外 "+showNum(e)+" 级" },
	},
	12: {
		unl: function() { return player.elementary.theory.accelerons.unl },
		cost: function(bought) { return ExpantaNum.mul(100, bought.sqrt().plus(1)).floor() },
		target: function(points) { return points.div(100).sub(1).pow(2).plus(1).floor() },
		cap: new ExpantaNum(12),
		desc: "根据超对称波长度，使加速子的产量变得更多。",
		effect: function(bought) { return tmp.elm.theory.ss.wavelength.plus(1).pow(0.04).pow(bought) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	13: {
		unl: function() { return player.elementary.theory.accelerons.unl },
		cost: function(bought) { return ExpantaNum.mul(5, bought.pow(2).plus(1)).plus(75) },
		target: function(points) { return points.sub(75).div(5).sub(1).sqrt().plus(1).floor() },
		cap: new ExpantaNum(10),
		desc: "根据玻色子数值，使病原体升级的效果变得更好。",
		effect: function(bought) { return player.elementary.bosons.amount.plus(1).log10().plus(1).log10().times(ExpantaNum.sqrt(bought)) },
		effD: function(e) { return "+"+showNum(e.times(100))+"%" },
	},
	14: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加二维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	15: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加三维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	16: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加四维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	17: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加五维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	18: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加六维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	19: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return ExpantaNum.pow(2, ExpantaNum.pow(2, bought)).times(25) },
		target: function(points) { return points.div(25).max(1).logBase(2).max(1).logBase(2).plus(1).floor() },
		cap: new ExpantaNum(5),
		desc: "增加七维弦的效果。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return "^"+showNum(e.plus(1)) },
	},
	20: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(240) },
		cap: new ExpantaNum(1),
		desc: "基本粒子获取量的软上限效果减少50%。",
		effect: function(bought) { return new ExpantaNum(0.5).times(bought) },
		effD: function(e) { return "减少 "+showNum(e.times(100))+"%" },
	},
	21: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(240) },
		cap: new ExpantaNum(1),
		desc: "引力子的加成效果翻倍。",
		effect: function(bought) { return new ExpantaNum(2).times(bought).max(1) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	22: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(50) },
		cap: new ExpantaNum(1),
		desc: "超轻子还可以增加超夸克的获取量。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	23: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(50) },
		cap: new ExpantaNum(1),
		desc: "超中性子还可以增加超轻子的获取量。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	24: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(50) },
		cap: new ExpantaNum(1),
		desc: "带电微子还可以增加超中性子的获取量。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	25: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(250) },
		cap: new ExpantaNum(1),
		desc: "病原体升级效果增加150%(叠加)。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	26: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(250) },
		cap: new ExpantaNum(1),
		desc: "学说树最上方升级效果的公式变得更好。",
		altDesc: "学说树超对称理论的第一个升级效果的公式变得更好。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	27: {
		unl: function() { return hasDE(5) },
		cost: function(bought) { return new ExpantaNum(50) },
		cap: new ExpantaNum(1),
		desc: "坍缩里程碑 10的公式变得更好。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	28: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return ExpantaNum.mul(400, ExpantaNum.pow(bought, 2).times(1.5).plus(1)).round() },
		target: function(points) { return points.div(400).sub(1).div(1.5).sqrt().plus(1).floor() },
		cap: new ExpantaNum(10),
		desc: "不进行净化也能获得净化能量，但获取量减少。",
		effect: function(bought) { return ExpantaNum.mul(0.1, bought) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	29: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return ExpantaNum.pow(bought, 5).plus(25) },
		target: function(points) { return points.sub(25).pow(0.2).plus(1).floor() },
		cap: new ExpantaNum(20),
		desc: "根据净化能量数值，增加天堂碎片和恶魔灵魂的产量。",
		effect: function(bought) { return ExpantaNum.pow(ExpantaNum.mul(0.001, bought).plus(1), player.inf.pantheon.purge.power).times(ExpantaNum.pow(player.inf.pantheon.purge.power.max(1), ExpantaNum.sqrt(bought))) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	30: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return ExpantaNum.mul(750, ExpantaNum.add(bought, 1)) },
		target: function(points) { return points.div(750).floor() },
		cap: new ExpantaNum(5),
		desc: "根据强子数值，增加纠缠弦的获取量。",
		effect: function(bought) { return ExpantaNum.pow(player.elementary.hc.hadrons.plus(1), ExpantaNum.sqrt(bought).div(2)) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	31: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return ExpantaNum.pow(bought, 2).plus(1).times(1e3) },
		target: function(points) { return points.div(1e3).sub(1).sqrt().plus(1).floor() },
		cap: new ExpantaNum(4),
		desc: "根据最高的认可数值，增加强子的获取量。",
		effect: function(bought) { return ExpantaNum.pow(ExpantaNum.add(1, ExpantaNum.mul(0.05, bought)), player.bestEnd) },
		effD: function(e) { return showNum(e)+" 倍" },
	},
	32: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return new ExpantaNum(100) },
		cap: new ExpantaNum(1),
		desc: "所有夸克和轻子的效果同时生效。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	33: {
		unl: function() { return player.elementary.hc.unl },
		cost: function(bought) { return new ExpantaNum(1.5e3) },
		cap: new ExpantaNum(1),
		desc: "强子获取学说点数的间隔减半。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	34: {
		unl: function() { return (modeActive("extreme+hikers_dream")?hasDE(5):player.elementary.hc.unl)&&modeActive("extreme") },
		cost: function(bought) { return ExpantaNum.mul(100, ExpantaNum.pow(bought, 2)).plus(50) },
		target: function(points) { return points.sub(50).div(100).sqrt().plus(1).floor() },
		cap: new ExpantaNum(4),
		desc: "重构岩浆花费岩浆的公式变得更缓和。",
		effect: function(bought) { return ExpantaNum.pow(0.9, ExpantaNum.div(bought, 2)) },
		effD: function(e) { return "^"+showNum(e) },
	},
	35: {
		unl: function() { return (modeActive("extreme+hikers_dream")?hasDE(5):player.elementary.hc.unl)&&modeActive("extreme") },
		cost: function(bought) { return new ExpantaNum(150) },
		cap: new ExpantaNum(1),
		desc: "重构岩浆效果的公式变得更好。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	36: {
		unl: function() { return (modeActive("extreme+hikers_dream")?hasDE(5):player.elementary.hc.unl)&&modeActive("extreme") },
		cost: function(bought) { return ExpantaNum.mul(100, ExpantaNum.pow(bought, 2)).plus(50) },
		target: function(points) { return points.sub(50).div(100).sqrt().plus(1).floor() },
		cap: new ExpantaNum(4),
		desc: "重构岩浆花费知识的公式变得更缓和。",
		effect: function(bought) { return ExpantaNum.pow(0.75, ExpantaNum.div(bought, 2)) },
		effD: function(e) { return "^"+showNum(e) },
	},
	37: {
		unl: function() { return player.elementary.foam.unl&&modeActive("extreme") },
		cost: function(bought) { return new ExpantaNum(2.3e6) },
		cap: new ExpantaNum(1),
		desc: "极限模式基本粒子之前内容的产量减成变得更缓和。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"^0.9 -> ^0.95":"^0.9 -> ^0.9" },
	},
	38: {
		unl: function() { return player.elementary.entropy.unl&&modeActive("extreme") },
		cost: function(bought) { return new ExpantaNum(4e10) },
		cap: new ExpantaNum(1),
		desc: "熵的基础获取量变为原来的平方，且前5个泡沫加成在45点以后不再受极限模式的产量减成影响。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	39: {
		unl: function() { return player.elementary.entropy.unl&&modeActive("extreme") },
		cost: function(bought) { return new ExpantaNum(4e10) },
		cap: new ExpantaNum(1),
		desc: "熵的获取量增加50%。",
		effect: function(bought) { return new ExpantaNum(1).times(bought) },
		effD: function(e) { return e.eq(1)?"已激活":"无效果" },
	},
	40: {
		unl: function() { return hasDE(6) },
		cost: function(bought) { return ExpantaNum.pow(1.1, ExpantaNum.pow(bought, 1.025)).times(1e15) },
		target: function(points) { return points.div(1e15).max(1).logBase(1.1).root(1.025).plus(1).floor() },
		cap: new ExpantaNum(200),
		desc: "学说增强器的花费提升速度减少1%。",
		effect: function(bought) { return ExpantaNum.pow(0.99, bought) },
		effD: function(e) { return "减少 "+showNum(e.pow(-1).sub(1).times(100))+"%" },
	},
	41: {
		unl: function() { return hasDE(6) },
		cost: function(bought) { return new ExpantaNum(1.2e20) },
		cap: new ExpantaNum(1),
		desc: "根据基本重置次数，使规范作用力产生资源的速度变得更快。",
		effect: function(bought) { 
			let e = player.elementary.times;
			return e.times(bought).plus(1).pow(1.4) 
		},
		effD: function(e) { return showNum(e)+" 倍" },
	},
	42: {
		unl: function() { return hasDE(6) },
		cost: function(bought) { return new ExpantaNum(1.1e20) },
		cap: new ExpantaNum(1),
		desc: "根据距离的数量级，使基础知识和所有量子泡沫的获取量变得更多。",
		effect: function(bought) { 
			let log = player.distance.plus(1).log10()
			if (log.gte(1e11)) log = log.log10().times(1e12/12)
			if (log.gte(1e9)) log = ExpantaNum.pow(1e9, log.logBase(1e9).root(10))
			return log.times(bought).plus(1).pow(1.6) 
		},
		effD: function(e) { return showNum(e)+" 倍" },
	},
}
const TREE_AMT = Object.keys(TREE_UPGS).length
const G_TREE_SECTS = {
	1: function() { return true },
	2: function() { return true },
	3: function() { return true },
	4: function() { return player.elementary.theory.strings.unl },
	5: function() { return player.elementary.theory.preons.unl },
	6: function() { return player.elementary.theory.preons.unl },
	7: function() { return player.elementary.theory.accelerons.unl },
	8: function() { return player.elementary.theory.accelerons.unl },
	9: function() { return hasDE(5) },
	10: function() { return hasDE(5) },
	11: function() { return hasDE(5) },
	12: function() { return player.elementary.hc.unl },
	13: function() { return player.elementary.hc.unl },
	14: function() { return (modeActive("extreme+hikers_dream")?hasDE(5):player.elementary.hc.unl)&&modeActive("extreme") },
	15: function() { return player.elementary.entropy.unl&&modeActive("extreme") },
}

const UNL_STR = function() { 
	if (mltRewardActive(4)) return 10;
	else if (hasDE(2)) return 7
	else return 5 
}
const TOTAL_STR = 10
const STR_REQS = {
	1: new ExpantaNum(0),
	2: new ExpantaNum(0.5),
	3: new ExpantaNum(100),
	4: new ExpantaNum(1e4),
	5: new ExpantaNum(1e7),
	6: new ExpantaNum(1e14),
	7: new ExpantaNum(DISTANCES.秒差距),
	8: new ExpantaNum(DISTANCES.宇宙).times("1e800"),
	9: new ExpantaNum(DISTANCES.宇宙).times("1e2650"),
	10: new ExpantaNum(DISTANCES.宇宙).times("1e3000"),
}
const STR_NAMES = {
	1: "一维",
	2: "二维",
	3: "三维",
	4: "四维",
	5: "五维",
	6: "六维",
	7: "七维",
	8: "八维",
	9: "九维",
	10: "十维",
}

const MAX_DARK_EXPANDERS = 5
const MAX_DARK_EXPANDERS_MLT_3 = 10
const DARK_EXPANDER_COSTS = {
	1: new ExpantaNum(40),
	2: new ExpantaNum(250),
	3: new ExpantaNum(600),
	4: new ExpantaNum(2e3),
	5: new ExpantaNum(4e3),
	6: new ExpantaNum("1.1111111111111111111111e1111"),
	7: new ExpantaNum("1e39000"),
	8: new ExpantaNum("1e46500"),
	9: new ExpantaNum("1e81725"),
	10: new ExpantaNum("1e108000"),
}
const EXTREME_DE_COSTS = {
	9: new ExpantaNum("1e68500"),
	10: new ExpantaNum("1e80500"), 
}
const HD_DE_COSTS = {
	7: new ExpantaNum("1e38750"),
	8: new ExpantaNum("1e44350"),
}
const DARK_EXPANDER_DESCS = {
	1: "解锁第三个胶子升级。",
	2: "解锁两个弦。",
	3: "解锁新的希格斯升级。",
	4: "解锁引力子加成。",
	5: "解锁新的学说树升级，学说增强器花费的公式更缓和。",
	6: "解锁新的学说树升级，且引力子加成低于60时，使它的需求提升速率减半。",
	7: "加速子可以减少强子获取学说点数的时间间隔。",
	8: "一维弦的效果变为原来的平方。",
	9: "每有一个学说增强器，净化能量的效果就除以1.01。另外，八维弦、九维弦和十维弦的效果变为原来的平方。",
	10: "解锁两行新的熵升级。",
}

const ach198check = function() { return tmp.ach?tmp.ach[198].has:false };
const HC_REQ = [new ExpantaNum("e2e7").times(DISTANCES.宇宙), new ExpantaNum(64)]
const HC_DATA = {
	goal: ["text", [function() { return getHCSelector("goalMlt")?new ExpantaNum(1):Number.MAX_VALUE }, function() { return (tmp.ach?tmp.ach[198].has:false)?(getHCSelector("goalMlt")?player.bestDistance.max(1).log(DISTANCES.多宇宙).div(ExpantaNum.log(DISTANCES.多宇宙)).max(1):player.bestDistance.min("e1e9")):"e1e7" }], "main", true], // Index 0: Type, Index 1: Min/Max, Index 2: Tab, Index 3: Unlocked
	goalMlt: ["checkbox", undefined, "main", ach198check],
	rockets: ["checkbox", undefined, "pre", ach198check],
	rf: ["checkbox", undefined, "pre", ach198check],
	noTRU: ["checkbox", undefined, "pre", true],
	noCad: ["checkbox", undefined, "col", true],
	noPU: ["checkbox", undefined, "col", true],
	noDC: ["checkbox", undefined, "col", true],
	noIU: ["checkbox", undefined, "inf", true],
	spaceon: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	solaris: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	infinity: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	eternity: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	reality: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	drigganiz: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl }],
	flamis: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	cranius: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	spectra: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	aqualon: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	nullum: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	quantron: ["range", [0, 6], "inf", function() { return player.elementary.theory.inflatons.unl&&modeActive("extreme") }],
	noGems: ["checkbox", undefined, "inf", true],
	purge: ["checkbox", undefined, "inf", true],
	noDS: ["checkbox", undefined, "inf", true],
	noDB: ["checkbox", undefined, "inf", true],
	elm: ["checkbox", undefined, "elm", ach198check],
	fermbos: ["checkbox", undefined, "elm", ach198check],
	tv: ["range", [-1, function() { return (tmp.ach?tmp.ach[198].has:false)?player.elementary.theory.bestDepth.min(100).toNumber():10}], "elm", true],
	sprsym: ["checkbox", undefined, "elm", ach198check],
	tree: ["checkbox", undefined, "elm", ach198check],
	string: ["range", [0, function() { return UNL_STR() }], "elm", ach198check],
	preontb: ["checkbox", undefined, "elm", ach198check],
	aclron: ["checkbox", undefined, "elm", ach198check],
	de: ["range", [0, function() { return mltCompleted(3)?MAX_DARK_EXPANDERS_MLT_3:MAX_DARK_EXPANDERS}], "elm", ach198check],
	infl: ["checkbox", undefined, "elm", ach198check],
	rfrm: ["range", [0, 5], "elm", ach198check],
	etrpy: ["checkbox", undefined, "elm", ach198check],
	sky: ["checkbox", undefined, "elm", ach198check],
	q1: ["checkbox", undefined, "mlt", ach198check],
	q2: ["checkbox", undefined, "mlt", ach198check],
	q3: ["checkbox", undefined, "mlt", ach198check],
	mlt1: ["checkbox", undefined, "mlt", ach198check],
	mlt2: ["checkbox", undefined, "mlt", ach198check],
	mlt3: ["checkbox", undefined, "mlt", ach198check],
	mlt4: ["checkbox", undefined, "mlt", ach198check],
	mlt5: ["checkbox", undefined, "mlt", ach198check],
}
const HC_TITLE = {
	goal: "挑战目标(以宇宙为单位)",
	goalMlt: "挑战目标(以多宇宙为单位)",
	rockets: "无法获得火箭", 
	rf: "无法获得火箭燃料",
	noTRU: "时间反演升级失效",
	noCad: "无法获得残骸",
	noPU: "病原体升级失效",
	noDC: "无法购买黑暗核心",
	noIU: "无法购买无限升级",
	spaceon: "强制进行天奥挑战(设为0则此项失效)",
	solaris: "强制进行索拉里斯挑战(设为0则此项失效)",
	infinity: "强制进行无限挑战(设为0则此项失效)",
	eternity: "强制进行永恒挑战(设为0则此项失效)",
	reality: "强制进行现实挑战(设为0则此项失效)",
	drigganiz: "强制进行德里格尼兹挑战(设为0则此项失效)",
	flamis: "强制进行弗拉米斯挑战(设为0则此项失效)",
	cranius: "强制进行克劳尼乌斯挑战(设为0则此项失效)",
	spectra: "强制进行光谱挑战(设为0则此项失效)",
	aqualon: "强制进行阿奎纶挑战(设为0则此项失效)",
	nullum: "强制进行无效化挑战(设为0则此项失效)",
	quantron: "强制进行康诚挑战(设为0则此项失效)",
	noGems: "无法获得幽冥宝石",
	purge: "强制进行净化",
	noDS: "导数变换失效",
	noDB: "导数提升失效",
	elm: "无法获得基本重置次数和基本粒子(进入时重置相应数值)",
	fermbos: "无法获得费米子和玻色子(进入时重置相应数值)",
	tv: "强制进入学说宇宙深度(设为-1则此项失效)",
	sprsym: "超对称粒子和超对称波失效",
	tree: "无法购买学说树升级(进入时重置学说树升级)",
	string: "最下面的相应数量弦失效(设为0则此项失效)",
	preontb: "无法获得前子和学说增强器(进入时重置相应数值)",
	aclron: "无法获得加速子(进入时重置相应数值)",
	de: "最下面的相应数量黑暗拓展器失效(设为0则此项失效)",
	infl: "无法获得暴胀子(进入时重置相应数值)",
	rfrm: "最多只能重构到从下往上数相应数量的量子泡沫(设为0则此项失效，进入时重置相应数值)",
	etrpy: "无法获得熵(进入时重置相应数值，以及相应升级)",
	sky: "无法获得斯格明子，π介子和旋量(进入时重置相应数值)",
	q1: "多元织物1失效",
	q2: "多元织物2失效",
	q3: "多元织物3失效",
	mlt1: "强制进入多宇宙1(强子挑战直接解锁)",
	mlt2: "强制进入多宇宙2",
	mlt3: "强制进入多宇宙3",
	mlt4: "强制进入多宇宙4(与学说宇宙选择器相叠加)",
	mlt5: "强制进入多宇宙5",
}
const HC_CHALLS = ["spaceon","solaris","infinity","eternity","reality","drigganiz"]
const HC_EXTREME_CHALLS = ["flamis","cranius","spectra","aqualon","nullum","quantron"]
const DYNAMIC_RANGE_HC_SELECTORS = Object.keys(HC_DATA).filter(a => ((HC_DATA[a][1]!==undefined)?(isFunc(HC_DATA[a][1][0])||isFunc(HC_DATA[a][1][1])):false));
const DYNAMIC_UNLOCK_HC_SELECTORS = Object.keys(HC_DATA).filter(a => HC_DATA[a][3] !== true);

const FOAM_REQ = new ExpantaNum("1e42000000")
const FOAM_TABS = {
	foamBoosts: function() { return true },
	qf1: function() { return true },
	entropy: function() { return player.elementary.entropy.unl },
}
const FOAM_BOOST_COSTS = {
	1: {
		1: {
			start: new ExpantaNum(10),
			base: new ExpantaNum(2.5),
			exp: new ExpantaNum(1.2),
		},
		2: {
			start: new ExpantaNum(30),
			base: new ExpantaNum(3),
			exp: new ExpantaNum(1.25),
		},
		3: {
			start: new ExpantaNum(75),
			base: new ExpantaNum(3.5),
			exp: new ExpantaNum(1.3),
		},
	},
	2: {
		1: {
			start: new ExpantaNum(40),
			base: new ExpantaNum(4),
			exp: new ExpantaNum(1.35),
		},
		2: {
			start: new ExpantaNum(250),
			base: new ExpantaNum(4.5),
			exp: new ExpantaNum(1.4),
		},
		3: {
			start: new ExpantaNum(500),
			base: new ExpantaNum(5),
			exp: new ExpantaNum(1.45),
		},
	},
	3: {
		1: {
			start: new ExpantaNum(100),
			base: new ExpantaNum(5.5),
			exp: new ExpantaNum(1.5),
		},
		2: {
			start: new ExpantaNum(400),
			base: new ExpantaNum(6),
			exp: new ExpantaNum(1.55),
		},
		3: {
			start: new ExpantaNum(1e3),
			base: new ExpantaNum(6.5),
			exp: new ExpantaNum(1.6),
		},
	},
	4: {
		1: {
			start: new ExpantaNum(200),
			base: new ExpantaNum(7),
			exp: new ExpantaNum(1.65),
		},
		2: {
			start: new ExpantaNum(750),
			base: new ExpantaNum(7.5),
			exp: new ExpantaNum(1.7),
		},
		3: {
			start: new ExpantaNum(1.2e3),
			base: new ExpantaNum(8),
			exp: new ExpantaNum(1.75),
		},
	},
	5: {
		1: {
			start: new ExpantaNum(250),
			base: new ExpantaNum(8.5),
			exp: new ExpantaNum(1.8),
		},
		2: {
			start: new ExpantaNum(1e3),
			base: new ExpantaNum(9),
			exp: new ExpantaNum(1.85),
		},
		3: {
			start: new ExpantaNum(5e3),
			base: new ExpantaNum(9.5),
			exp: new ExpantaNum(1.9),
		},
	},
}
const QF_NEXTLAYER_COST = {
	1: new ExpantaNum(1e4),
	2: new ExpantaNum(5e3),
	3: new ExpantaNum(1e4),
	4: new ExpantaNum(1.75e3),
	5: new ExpantaNum(1e6),
}
const QFB17_TARGETS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12]
const ENTROPY_UPGS = 35
const ENTROPY_UPG_COSTS = {
	1: new ExpantaNum(4),
	2: new ExpantaNum(10),
	3: new ExpantaNum(25),
	4: new ExpantaNum(100),
	21: new ExpantaNum(104),
	
	5: new ExpantaNum(135),
	6: new ExpantaNum(150),
	7: new ExpantaNum(215),
	8: new ExpantaNum(235),
	22: new ExpantaNum(525),
	
	9: new ExpantaNum(550),
	10: new ExpantaNum(700),
	11: new ExpantaNum(1500),
	12: new ExpantaNum(1750),
	23: new ExpantaNum(6000),
	
	13: new ExpantaNum(1800),
	14: new ExpantaNum(2350),
	15: new ExpantaNum(2425),
	16: new ExpantaNum(2475),
	24: new ExpantaNum(9000),
	
	17: new ExpantaNum(11111),
	18: new ExpantaNum(12e3),
	19: new ExpantaNum(17500),
	20: new ExpantaNum(18250),
	25: new ExpantaNum(30000),
	
	26: new ExpantaNum(250000),
	27: new ExpantaNum(282500),
	28: new ExpantaNum(420000),
	29: new ExpantaNum(482500),
	34: new ExpantaNum(5e8),
	
	30: new ExpantaNum(580000),
	31: new ExpantaNum(1.03e6),
	32: new ExpantaNum(1.125e6),
	33: new ExpantaNum(1.133e6),
	35: new ExpantaNum(7.75e8),
}
const ENTROPY_UPG_EFFS = {
	2: function() { return ExpantaNum.pow(1.5, player.elementary.theory.depth) },
	3: function() { return ExpantaNum.pow(1.0015, player.rf) },
	4: function() { return (tmp.elm?tmp.elm.entropy.omega:false)?(tmp.elm.entropy.omega.times(2)):new ExpantaNum(0) },
	5: function() { return ExpantaNum.pow(1.03, player.elementary.theory.preons.boosters) },
	7: function() { return player.elementary.hc.hadrons.plus(1).times(10).slog(10).times(modeActive("extreme")?75:25) },
	8: function() { return player.elementary.theory.accelerons.amount.plus(1).times(player.elementary.theory.inflatons.amount.plus(1)).log10().plus(1).log10().plus(1).sqrt() },
	9: function() { return player.elementary.sky.amount.plus(1).logBase(2).times(3).plus(1) },
	14: function() { return player.elementary.entropy.best.plus(1).log10().sqrt().div(6).plus(1) },
	19: function() { return player.elementary.hc.hadrons.plus(1).log10().plus(1).log10().plus(1).pow(10) },
	21: function() { return modeActive("extreme")?player.magma.amount.cbrt().times(75):new ExpantaNum(0) },
	24: function() { return player.elementary.entropy.best.plus(1).root(14) },
	26: function() { return ExpantaNum.pow(10, player.elementary.entropy.amount.plus(1).log10().root(4)) },
	27: function() { return player.elementary.entropy.best.plus(1).log10().plus(1) },
	28: function() { return player.elementary.hc.claimed.plus(1) },
	29: function() { return (tmp.elm?tmp.elm.entropy.omega:false)?(tmp.elm.entropy.omega.plus(1)):new ExpantaNum(1) },
	30: function() { return player.elementary.foam.amounts[0].plus(1).log10().pow(.8) },
	31: function() { return ExpantaNum.pow(player.elementary.entropy.upgrades.length+1, Math.sqrt(player.elementary.entropy.upgrades.length*2)) },
}
const ENTROPY_UPG_AUTO_ORDER = [1,2,3,4,21,
								5,6,7,8,22,
								9,10,11,12,
								13,14,15,16,
								23,24,
								17,18,19,20,25,
								26,27,28,29,
								30,31,32,33,
								34,35];

const SKY_REQ = [
	"4.4e108000026",
	"1e575",
	"1e550"
]
const SKY_TABS = {
	skyrmions() { return true },
	pions() { return true },
	spinors() { return true },
}
const KEEP_ENTUPGS_SKY = [1, 10, 11, 12, 13, 16, 17, 20]
const SKY_FIELD_UPGS_REQS = [1, 5, 20, 100, 750, 2500, 4000]
const SKY_FIELDS = {
	upgs: 13,
	placements: [[8],[10,2,3,11],[6,1,7],[12,4,5,13],[9]],
	1: {
		req: 1,
		pionDesc: "All Rank/Tier scalings start later based on your Pions.",
		spinorDesc: "Add to all Foam Boosts based on your Spinors.",
		baseCost: new ExpantaNum(100),
		costMult: new ExpantaNum(5),
		pionEff(bought) { return player.elementary.sky.pions.amount.plus(1).log10().div(5).pow(0.8).times(25).times(ExpantaNum.sqrt(bought)) },
		spinorEff(bought) { return player.elementary.sky.spinors.amount.plus(1).log10().plus(1).log10().times(ExpantaNum.pow(bought, 1/4)) },
		desc(eff) { return "+"+showNum(eff) },
	},
	2: {
		req: 5,
		pionDesc: "Pathogen Upgrades are stronger (unaffected by softcap).",
		spinorDesc: "Graviton Boosts are stronger.",
		baseCost: new ExpantaNum(1e4),
		costMult: new ExpantaNum(20),
		pionEff(bought) { return ExpantaNum.mul(ExpantaNum.sqrt(bought), 0.15).plus(1).pow(0.8) },
		spinorEff(bought) { return ExpantaNum.mul(ExpantaNum.sqrt(bought), 0.4).plus(1).pow(0.9) },
		desc(eff) { return "增加 "+showNum(eff.sub(1).times(100))+"%" },
	},
	3: {
		req: 5,
		pionDesc: "Skyrmions boost Purge Power gain.",
		spinorDesc: "Skyrmions boost Entropy gain.",
		baseCost: new ExpantaNum(1e4),
		costMult: new ExpantaNum(100),
		pionEff(bought) { return player.elementary.sky.amount.plus(1).log10().plus(1).log10().times(ExpantaNum.sqrt(bought)).sqrt().plus(1) },
		spinorEff(bought) { return player.elementary.sky.amount.plus(1).log10().times(ExpantaNum.sqrt(bought)).plus(1).sqrt() },
		desc(eff) { return showNum(eff)+" 倍" },
	},
	4: {
		req: 20,
		pionDesc: "The Cadaver effect is stronger.",
		spinorDesc: "The Skyrmion effect is stronger.",
		baseCost: new ExpantaNum(1e5),
		costMult: new ExpantaNum(10),
		pionEff(bought) { return ExpantaNum.mul(ExpantaNum.sqrt(bought), .2).plus(1) },
		spinorEff(bought) { return ExpantaNum.mul(ExpantaNum.pow(bought, .4), .25).plus(1) },
		desc(eff) { return "增加 "+showNum(eff.sub(1).times(100))+"%" },
	},
	5: {
		req: 20,
		pionDesc: "Skyrmions boost Dark Flow.",
		spinorDesc: "Skyrmions boost Supersymmetric Particle gain.",
		baseCost: new ExpantaNum(1e5),
		costMult: new ExpantaNum(10),
		pionEff(bought) {
			let base = player.elementary.sky.amount.plus(1).pow(bought);
			if (base.gte(1e60)) base = ExpantaNum.pow(10, base.log10().times(60).sqrt())
			return base.pow(400) 
		},
		spinorEff(bought) { 
			let base = player.elementary.sky.amount.plus(1).pow(bought)
			if (base.gte(1e60)) base = ExpantaNum.pow(10, base.log10().times(60).sqrt())
			return base.pow(10) 
		},
		desc(eff) { return showNum(eff)+" 倍" },
	},
	6: {
		req: 100,
		pionDesc: "Ranks boost Pion & Spinor gain.",
		spinorDesc: "Elementary Particles boost Pion & Spinor gain.",
		baseCost: new ExpantaNum(1e6),
		costMult: new ExpantaNum(1e3),
		pionEff(bought) { return player.rank.max(1).pow(bought) },
		spinorEff(bought) { return player.elementary.particles.plus(1).log10().times(50).plus(1).pow(bought) },
		desc(eff) { return showNum(eff)+" 倍" },
	},
	7: {
		req: 100,
		pionDesc: "Derivative Boosts are stronger based on their amount.",
		spinorDesc: "&Omega; Particles are stronger based on their amount.",
		baseCost: new ExpantaNum(1e6),
		costMult: new ExpantaNum(15),
		pionEff(bought) { return player.inf.derivatives.unlocks.div(10).times(bought).plus(1).sqrt() },
		spinorEff(bought) { return tmp.elm.entropy.omega.div(10).times(bought).plus(1).sqrt() },
		desc(eff) { return "增加 "+showNum(eff.sub(1).times(100))+"%" },
	},
	8: {
		req: 750,
		pionDesc: "All Spinor Upgrades are cheaper.",
		spinorDesc: "All Pion Upgrades are cheaper.",
		baseCost: new ExpantaNum(1e20),
		costMult: new ExpantaNum(1e5),
		pionEff(bought) { return ExpantaNum.pow(100, bought) },
		spinorEff(bought) { return ExpantaNum.pow(100, bought) },
		desc(eff) { return "便宜 "+showNum(eff)+" 倍" },
	},
	9: {
		req: 750,
		pionDesc: 'The "Time Doesnt Exist" effect is raised to an exponent.',
		spinorDesc: "The Entropy effect is raised to an exponent.",
		baseCost: new ExpantaNum(1e24),
		costMult: new ExpantaNum(1e6),
		pionEff(bought) { return ExpantaNum.add(bought, 1).log10().times(10).plus(1) },
		spinorEff(bought) { return ExpantaNum.add(bought, 1).log10().times(2).plus(1) },
		desc(eff) { return "^"+showNum(eff) },
	},
	10: {
		req: 2500,
		pionDesc: "Tiers use a weaker cost formula, but only if they're not scaled in any way.",
		spinorDesc: "Entropy uses a weaker requirement formula.",
		baseCost: new ExpantaNum(1e38),
		costMult: new ExpantaNum(1e5),
		pionEff(bought) { return ExpantaNum.sub(.8, ExpantaNum.div(.8, ExpantaNum.add(ExpantaNum.mul(bought, 2), 1).log10().div(2).plus(1))) },
		spinorEff(bought) { return ExpantaNum.sub(.75, ExpantaNum.div(.75, ExpantaNum.add(ExpantaNum.mul(bought, 2), 1).log10().plus(1))) },
		desc(eff) { return "缓和 "+showNum(eff.times(100))+"%" },
	},
	11: {
		req: 2500,
		pionDesc: "Pathogen Upgrade 1's effect is multiplied.",
		spinorDesc: "Gauge Speed is raised to an exponent.",
		baseCost: new ExpantaNum(1e38),
		costMult: new ExpantaNum(1e5),
		pionEff(bought) { return ExpantaNum.add(ExpantaNum.mul(bought, 2), 1).log10().times(5).plus(1) },
		spinorEff(bought) { return ExpantaNum.add(ExpantaNum.mul(bought, 2), 1).log10().times(2).plus(1) },
		desc(eff) { return showNum(eff) },
	},
	12: {
		req: 4000,
		pionDesc: "The Cadaver effect is raised to an exponent.",
		spinorDesc: "The Skyrmion effect is multiplied.",
		baseCost: new ExpantaNum(1e43),
		costMult: new ExpantaNum(1e12),
		pionEff(bought) { 
			if (bought.gte(3)) bought = bought.logBase(3).plus(2);
			return ExpantaNum.add(ExpantaNum.cbrt(bought), 1).pow(11) 
		},
		spinorEff(bought) { 
			if (bought.gte(2)) bought = bought.logBase(2).plus(1).root(5)
			return ExpantaNum.add(bought, 1).pow(1.65) 
		},
		desc(eff) { return showNum(eff) },
	},
	13: {
		req: 4000,
		pionDesc: "The Perk Accelerator is stronger based on your Inflatons.",
		spinorDesc: "The second Inflaton effect is stronger based on your Ascension Power.",
		baseCost: new ExpantaNum(1e43),
		costMult: new ExpantaNum(1e12),
		pionEff(bought) { return player.elementary.theory.inflatons.amount.plus(1).log10().div(1e3).sqrt().times(bought).plus(1).root(5) },
		spinorEff(bought) { return player.inf.ascension.power.plus(1).log10().div(1e3).sqrt().times(bought).plus(1).sqrt() },
		desc(eff) { return "增加 "+showNum(eff.sub(1).times(100))+"%" },
	},
}
const GREEK_LETTERS = [null, "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa", "lambda", "mu", "nu", "xi", "omicron", "pi", "rho", "sigmaf", "sigma", "tau", "upsilon", "phi", "chi", "psi", "omega"];