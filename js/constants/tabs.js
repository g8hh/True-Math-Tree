const TABBTN_SHOWN = {
	main: function () {
		return true;
	},
	options: function () {
		return true;
	},
	statistics: function () {
		return true;
	},
	achievements: function () {
		return true;
	},
	energy: function() {
		return modeActive("hikers_dream");
	},
	rockets: function () {
		return tmp.rockets ? tmp.rockets.canRocket || player.rockets.gt(0) || player.rf.gt(0) : false;
	},
	furnace: function () {
		return modeActive("extreme") ? player.rf.gt(0) : false;
	},
	auto: function () {
		return player.automation.unl;
	},
	tr: function () {
		return player.tr.unl;
	},
	collapse: function () {
		return player.collapse.unl;
	},
	civi: function () {
		return player.civi.unl;
	},
	pathogens: function () {
		return player.pathogens.unl;
	},
	dc: function () {
		return player.dc.unl;
	},
	inf: function () {
		return player.inf.unl || (player.mlt.times.gt(0)&&tmp.inf.can);
	},
	elementary: function () {
		return (tmp.elm ? tmp.elm.can : false) || player.elementary.times.gt(0) || player.elementary.theory.active || player.elementary.hc.active;
	},
};

const FULL_TAB_NAMES = {
	main: "主界面",
	options: "选项",
	statistics: "统计",
	achievements: "成就",
	energy: "能量",
	rockets: "火箭",
	furnace: "熔炉",
	auto: "自动化",
	tr: "时间反演",
	collapse: "全体坍缩",
	civilization: "文明",
	pathogens: "病原体",
	dc: "黑暗圆环",
	inf: "无限",
	elementary: "基本粒子",
}

const HIDE_WHITELIST = ["main","options"]

const STAT_TABBTN_SHOWN = {
	mainStats() { return true },
	scalings() { return statScalingsShown },
	rankTiers() { return player.rank.gt(1)||player.tier.gt(0) },
}