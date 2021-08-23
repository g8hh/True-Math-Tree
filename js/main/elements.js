function calcModeAndBalanceName(modes) {
	modeName = ""
	balanceName = ""
	// Naming order: Absurd AAU/NA Easy (or Easy-) Hard/Extreme Dream
	if(modes.includes("absurd")) {
		modeName += "荒诞 ";
		balanceName += "absurd_";
	}
	if (modes.includes("aau")) {
		if(modes.includes("na")) modeName += "全成就/";
		else modeName += "全成就 ";
		balanceName += "aau_";
	}
	if (modes.includes("na")) {
		modeName += "无成就 ";
		balanceName += "na_";
	}
	if (modes.includes("easy")) {
		if (modes.includes("hard")) modeName += "容易-";
		else modeName += "容易";
		balanceName += "easy_";
	}	
	if (modes.includes("hard")) {
		if (modes.includes("extreme")) {
			modeName += "极限";
			balanceName += "extreme_";
		} else {
			modeName += "困难";
			balanceName += "hard_";
		}
		}	
	if (modes.includes("hikers_dream")) {
		if(!modes.includes("easy") && !modes.includes("hard")) modeName += "旅人";
		modeName += "之梦";
		balanceName += "hikers_dream_";
	}
	if (modes.includes("reality")) {
		if (modes.includes("easy") || modes.includes("aau")) modeName = "伪现实";
		else modeName = "现实";
		balanceName += "reality_";
	}	
	if(balanceName != "") balanceName = balanceName.substring(0,balanceName.length -1);
	if(modeName == "") modeName = "普通";
	return {modeName: modeName, balanceName: balanceName}
}

function updateModesHTML() {
	tmp.el.mcta.setDisplay(player.options.modeComboTableActive);
	tmp.el.mctna.setDisplay(!player.options.modeComboTableActive);
	
	let data = calcModeAndBalanceName(modesSelected);

	tmp.el.selectedMode.setTxt("选择模式："+(data.modeName));
	tmp.el.selectedModeBalancing.setTxt("Balancing: "+ (MODEBALANCES[data.balanceName]?MODEBALANCES[data.balanceName].balancing:"Unknown! Proceed at your own risk."));
}

function updateOptionsHTML(){
	if (player.tab == "options") {
		if (player.options.modeComboTableActive) {
			let data = MODE_TABLE_DATA;
			tmp.el.modeComboCompletions.setTxt("完成情况："+completedModeCombos.length+"/"+Object.keys(MODEBALANCES).length)
			for (let r=0;r<data.left.length;r++) {
				for (let c=0;c<data.top.length;c++) {
					let o = data.left[r][0].concat(data.top[c][0]);
					let nameData = calcModeAndBalanceName(o);
					let id = nameData.balanceName;
					let name = nameData.modeName;
					let selID = calcModeAndBalanceName(modesSelected).balanceName;
					let comp = completedModeCombos.includes(id);
					
					tmp.el[id+"modeCombo"].setClasses({btn: true, tb: true, sel: id==selID, bought: (id!=selID&&comp)})
					tmp.el[id+"modeCombo"].setTxt((id==selID)?"Selected":(comp?"Completed":"Activate"))
				}
			}
		} else {
			for (let i = 0; i < Object.keys(MODES).length; i++) {
				tmp.el[Object.keys(MODES)[i] + "Mode"].setClasses({
					btn: true,
					tb: true,
					opt: !modesSelected.includes(Object.keys(MODES)[i]),
					ob: true,
					optSelected: modesSelected.includes(Object.keys(MODES)[i])
				});
				tmp.el[Object.keys(MODES)[i] + "Mode"].setTooltip(MODES[Object.keys(MODES)[i]].desc)
			}
		}
		tmp.el.ingamebtn.setDisplay(player.dc.unl||player.elementary.unl||player.mlt.times.gt(0))
		tmp.el.sf.setTxt("Significant Figures: " + player.options.sf.toString());
		tmp.el.not.setTxt("Notation: " + capitalFirst(player.options.not));
		tmp.el.theme.setTxt("Theme: " + capitalFirst(player.options.theme));
		tmp.el.autoSave.setTxt("Auto-Save: " + (player.options.autoSave ? "ON" : "OFF"));
		tmp.el.newst.setTxt("News Ticker: " + (player.options.newst ? "ON" : "OFF"));
		tmp.el.elc.changeStyle("visibility", (player.elementary.times.gt(0)?"visible":"hidden"))
		tmp.el.elc.setTxt("Elementary Confirmation: "+ (player.options.elc ? "ON" : "OFF"));
		tmp.el.mltnc.changeStyle("visibility", (player.mlt.times.gt(0)?"visible":"hidden"))
		tmp.el.mltnc.setTxt("Multiverse Confirmation: "+ (player.options.mltnc ? "OFF" : "ON"));
		tmp.el.mltforcetab.changeStyle("visibility", (player.mlt.times.gt(0)?"visible":"hidden"))
		tmp.el.mltforcetab.setTxt("Multiverse Tab Shown on Reset: "+ ((player.options.mltforcetab||(player.options.mltforcetab===undefined)) ? "ON" : "OFF"));
		tmp.el.hideMltBtn.changeStyle("visibility", (player.mlt.times.gt(0)?"visible":"hidden"));
		tmp.el.hideMltBtn.setTxt("Multiverse Reset Button: "+(player.options.hideMltBtn ? "MULTIVERSE TAB" : "TOP OF SCREEN"))
		tmp.el.saveImp.setTxt("Imports: "+ capitalFirst(player.options.saveImp));
		tmp.el.hot.setTxt("Hotkeys: "+(player.options.hot?"ON":"OFF"))
		tmp.el.dcPulse.changeStyle("visibility", ((player.dc.unl||player.inf.endorsements.gt(0)||player.elementary.times.gt(0))?"visible":"hidden"))
		tmp.el.dcPulse.setTxt("Dark Circle Pulsing: "+(player.options.dcPulse ? "ON" : "OFF"));
		tmp.el.featPerc.setTxt("Feature Percentage: "+capitalFirst(player.options.featPerc))
		tmp.el.fonts.setTxt("Font: "+capitalFirst(player.options.fonts))
		tmp.el.hideAch.setTxt("Hide Completed Ach Rows: "+(player.options.hideAch ? "ON" : "OFF"))
		tmp.el.visUpd.setTxt("Visual Updates: "+capitalFirst(player.options.visUpd))
		tmp.el.hcc.setTxt("Exit Hadronic Chall Confirmation: "+(player.options.hcc ? "ON" : "OFF"))
		tmp.el.hcc.changeStyle("visibility", (player.elementary.hc.unl)?"visible":"hidden")
		tmp.el.tht.setTxt("Theory Tree Display: "+(player.options.tht?"GROUPS":"TREE"))
		tmp.el.tht.changeStyle("visibility", (player.elementary.theory.tree.unl)?"visible":"hidden")
		tmp.el.modeComboTableActive.setTxt("Mode Combination Table: "+(player.options.modeComboTableActive?"ON":"OFF"));
		
		updateModesHTML()
	}
}

function updatePreRanksHTML(){
	tmp.el.distance.setTxt(
		formatDistance(player.distance) +
			" " + formatGain(player.distance, player.velocity.times(nerfActive("noTS") ? 1 : tmp.timeSpeed).times(modeActive("hikers_dream")?tmp.hd.enEff:1), "dist", true)
	);
	tmp.el.velocity.setTxt(
		formatDistance(player.velocity.times(modeActive("hikers_dream")?tmp.hd.enEff:1)) +
			"/秒 " + formatGain(player.velocity.times(modeActive("hikers_dream")?tmp.hd.enEff:1), tmp.acc.times(nerfActive("noTS") ? 1 : tmp.timeSpeed), "vel", true)
	);
	tmp.el.maxVel.setTxt(formatDistance(tmp.maxVel));
	tmp.el.acceleration.setTxt(formatDistance(tmp.acc));
}

function updateRanksHTML(){
	let chs = "";
	chs = getScalingName("rank");
	chs = chs.replace("Scaled","折算");
	chs = chs.replace("Superscaled","超级折算");
	chs = chs.replace("Hyper","究级折算");
	chs = chs.replace("Atomic","原子折算");
	tmp.el.rank.setTxt(showNum(player.rank));
	tmp.el.rankUp.setClasses({ btn: true, locked: !tmp.ranks.canRankUp });
	tmp.el.rankDesc.setTxt(tmp.ranks.desc);
	tmp.el.rankReq.setTxt(formatDistance(tmp.ranks.req));
	tmp.el.rankName.setTxt(chs + "级别");
}

function updateTiersHTML(){
	let chs = "";
	chs = getScalingName("tier");
	chs = chs.replace("Scaled","折算");
	chs = chs.replace("Superscaled","超级折算");
	chs = chs.replace("Hyper","究级折算");
	chs = chs.replace("Atomic","原子折算");
	tmp.el.tier.setTxt(showNum(player.tier));
	tmp.el.tierUp.setClasses({ btn: true, locked: !tmp.tiers.canTierUp });
	tmp.el.tierDesc.setTxt(tmp.tiers.desc);
	tmp.el.tierReq.setTxt(showNum(tmp.tiers.req.ceil()));
	tmp.el.tierName.setTxt(chs + "阶层");
}

function updateMainHTML(){
	if (player.tab == "main") {
		updatePreRanksHTML()
		updateRanksHTML()		
		updateTiersHTML()
		// Misc
		tmp.el.mvName.setTxt(nerfActive("maxVelActive") ? "最大速度：" : "速度能量：");
		tmp.el.accEn.setHTML(tmp.accEn.gt(0) ? " (加速能量：" + formatDistance(tmp.accEn) + "/秒<sup>2</sup>)" : "");
		
		// Hiker's Dream
		let t = ""
		if (modeActive("hikers_dream")){
			let start = tmp.hd.incline.gt(89.999) ? "斜度的正割为：" + showNum(tmp.hd.secant) : "目前斜度："+showNum(tmp.hd.incline)+"&deg;"
			t = start + ((tmp.hd.inclineRed.gt(0)&&tmp.hd.inclineRed.lt(0.001))?("，使加速能量和最大速度变为"+showNum(tmp.hd.inclineRed.pow(-1))+"次方根"):("，使加速度和最大速度变为^"+showNum(tmp.hd.inclineRed)))+"，而且使能量损耗变为 "+showNum(tmp.hd.inclineRed.pow(getEnergyLossExp()))+" 倍。<br>"
		}
		tmp.el.incline.setHTML(t)
		tmp.el.quickReset.setDisplay(modeActive("hikers_dream"))
	}
}

function updateRocketsHTML(){
	if (player.tab == "rockets") {
		let chs = "";
		chs = getScalingName("rf");
		chs = chs.replace("Scaled","折算");
		chs = chs.replace("Superscaled","超级折算");
		chs = chs.replace("Hyper","究级折算");
		chs = chs.replace("Atomic","原子折算");
		// Rockets
		tmp.el.rocketReset.setClasses({ btn: true, locked: !tmp.rockets.canRocket, rckt: tmp.rockets.canRocket });
		tmp.el.rocketGain.setTxt(showNum(tmp.rockets.layer.gain));
		tmp.el.rocketsAmt.setTxt(
			showNum(player.rockets) +
				" 火箭 " +
				(((tmp.ach[95].has||hasCollapseMilestone(9))&&!nerfActive("noRockets")) ? formatGain(player.rockets, tmp.rockets.layer.gain.div(tmp.ach[95].has?1:100)) : "")
		);
		tmp.el.rocketsEff.setTxt(showNum(getRocketEffect()));

		// Rocket Fuel
		tmp.el.rf.setTxt(showNum(player.rf) + (getFreeFuel().gt(0) ? " + " + showNum(getFreeFuel()) : ""));
		tmp.el.rfReset.setClasses({ btn: true, locked: !tmp.rf.can, rckt: tmp.rf.can });
		tmp.el.rfReq.setTxt(showNum(tmp.rf.req));
		tmp.el.rfEff.setTxt(showNum(getFuelEff().sub(1).times(100)));
		tmp.el.rfName.setTxt(chs + "火箭燃料");
		tmp.el.rf2.setTxt(showNum(getFuelEff2()));
	}
}

function updateAchievementsHTML(){
	if (player.tab == "achievements") {
		tmp.el.achDesc.setHTML(tmp.ga + "/" + tmp.ta + "<br>");
		let all = tmp.ga == tmp.ta && !modeActive("aau");
		let rowsActive = Math.floor(tmp.ta/8)
		for (let r = 1; r <= ACH_DATA.rows; r++) {
			let rc = rowComplete(r)
			tmp.el["achR"+r].setDisplay(!(player.options.hideAch&&rc))
			if (rc && player.options.hideAch) rowsActive--
			for (let c = 1; c <= ACH_DATA.cols; c++) {
				let id = r * 10 + c;
				tmp.el["ach" + id].setTxt(id);
				tmp.el["ach" + id].setClasses({
					achCont: true,
					gld: all,
					dgn: player.achievements.includes(id) && ACH_DATA.descs[id] !== undefined && !all,
					blocked: ACH_DATA.descs[id] === undefined
				});
				tmp.el["ach" + id].changeStyle("visibility", (getAllAchievements().includes(id)) ? "visible" : "hidden");
				tmp.el["ach" + id].setAttr("widetooltip", tmp.ach[id].desc)
			}
		}
		tmp.el.achFin.setTxt(rowsActive==0?"All Achievements are completed!":"")
	}
}

function updateRobotsHTML(){
	tmp.el.scraps.setTxt(
		showNum(player.automation.scraps) +
			" 碎屑 " + formatGain(player.automation.scraps, getScrapGain().times(nerfActive("noTS") ? 1 : tmp.timeSpeed), "scraps")
	);
	tmp.el.intAmt.setTxt(
		showNum(player.automation.intelligence) +
			" 智慧 " + formatGain(player.automation.intelligence, getIntelligenceGain().times(nerfActive("noTS") ? 1 : tmp.timeSpeed), "intel")
	);
	for (let i = 0; i < Object.keys(ROBOT_REQS).length; i++) {
		tmp.el[Object.keys(ROBOT_REQS)[i]].setTxt(tmp.auto[Object.keys(ROBOT_REQS)[i]].btnTxt);
		tmp.el[Object.keys(ROBOT_REQS)[i]].setClasses({
			btn: true,
			locked:
				player.automation.scraps.lt(Object.values(ROBOT_REQS)[i]) &&
				!Object.keys(player.automation.robots).includes(Object.keys(ROBOT_REQS)[i]),
			rckt: !(
				player.automation.scraps.lt(Object.values(ROBOT_REQS)[i]) &&
				!Object.keys(player.automation.robots).includes(Object.keys(ROBOT_REQS)[i])
			)
		});
	}
	tmp.el.rankCheapbot.setDisplay(modeActive("extreme"));
	tmp.el.fuelbot.setDisplay(
		hasCollapseMilestone(5) ||
			(player.automation.robots.fuelbot ? player.automation.robots.fuelbot[1].gt(0) : false)
	);
	tmp.el.robotTab.setDisplay(player.automation.open != "none");
	tmp.el.robotName.setTxt(
		capitalFirst(player.automation.open == "rankCheapbot" ? "Rank Cheapener-bot" : player.automation.open)
	);
	tmp.el.robotInterval.setTxt(
		player.automation.open == "none" ? "" : formatTime(tmp.auto[player.automation.open].interval)
	);
	tmp.el.robotMagnitude.setTxt(
		player.automation.open == "none" ? "" : showNum(tmp.auto[player.automation.open].magnitude)
	);
	tmp.el.buyRobotInterval.setHTML(
		player.automation.open == "none"
			? ""
			: "Upgrade Interval<br>花费： " + showNum(tmp.auto[player.automation.open].intCost) + " 智慧。"
	);
	tmp.el.buyRobotMagnitude.setHTML(
		player.automation.open == "none"
			? ""
			: "Upgrade Magnitude<br>花费： " + showNum(tmp.auto[player.automation.open].magCost) + " 智慧。"
	);
	if (player.automation.open != "none") {
		tmp.el.buyRobotInterval.setClasses({
			btn: true,
			locked: player.automation.intelligence.lt(tmp.auto[player.automation.open].intCost),
			rckt: player.automation.intelligence.gte(tmp.auto[player.automation.open].intCost)
		});
		tmp.el.buyRobotMagnitude.setClasses({
			btn: true,
			locked: player.automation.intelligence.lt(tmp.auto[player.automation.open].magCost),
			rckt: player.automation.intelligence.gte(tmp.auto[player.automation.open].magCost)
		});
		tmp.el.robotToggle.setTxt("Currently: "+((!player.automation.robots[player.automation.open][2])?"Active":"Inactive"))
	}
	tmp.el.robotMax.setDisplay(tmp.ach[48].has);
}

function updateAutomationHTML(){
	if (player.tab == "auto") updateRobotsHTML()

	// Automators
	for (let i = 0; i < Object.keys(AUTOMATORS).length; i++) {
		tmp.el["automatorDiv-" + Object.keys(AUTOMATORS)[i]].setDisplay(Object.values(AUTOMATORS)[i]());
		player.automators[Object.keys(AUTOMATORS)[i]] =
			tmp.el["automator-" + Object.keys(AUTOMATORS)[i]].isChecked() && Object.values(AUTOMATORS)[i]();
		let name = Object.keys(AUTOMATORS)[i]
	}
}

function updateTimeReversalHTML(){
	if (player.tab == "tr") {
		tmp.el.rt.setTxt(tmp.tr.txt);
		tmp.el.tc.setTxt(
			showNum(player.tr.cubes) +
				" 时间方盒 " + formatGain(player.tr.cubes, getTimeCubeGain().times(nerfActive("noTS") ? 1 : tmp.timeSpeed), "tc")
		);
		tmp.el.frf.setTxt(showNum(tmp.tr.eff));
		for (let i = 1; i <= TR_UPG_AMT; i++) {
			let upg = TR_UPGS[i];
			let desc = upg.desc;
			if (!tr2Pow().eq(1) && i == 2) desc += "<span class='grossminitxt'>(^" + showNum(tr2Pow()) + ")</span>";
			if (!tr11Pow().eq(1) && i == 11)
				desc += "<span class='grossminitxt'>(^" + showNum(tr11Pow()) + ")</span>";
			tmp.el["tr" + i].setHTML(desc + "<br>花费： " + showNum(upg.cost()) + " 时间方盒。");
			if (upg.current !== undefined && (i > 15 ? modeActive("extreme") : true))
				tmp.el["tr" + i].setTooltip("目前： " + upg.disp(upg.current()));
			tmp.el["tr" + i].setClasses({
				btn: true,
				locked: !player.tr.upgrades.includes(i) && player.tr.cubes.lt(upg.cost()),
				bought: player.tr.upgrades.includes(i),
				rt: !player.tr.upgrades.includes(i) && player.tr.cubes.gte(upg.cost())
			});
		}
		tmp.el.trRow3.setDisplay(player.dc.unl || tmp.inf.upgs.has("1;4"));
		tmp.el.trRow4.setDisplay(modeActive("extreme"));
		tmp.el.trRow5.setDisplay(modeActive("extreme") && player.collapse.unl);
		tmp.el.trRow6.setDisplay(modeActive("extreme") && player.dc.unl);
		tmp.el.trRow7.setDisplay(modeActive("extreme") && player.inf.endorsements.gt(0))
	}
}

function updateCollpaseHTML(){
	if (player.tab == "collapse") {
		tmp.el.collapseReset.setClasses({ btn: true, locked: !tmp.collapse.can, btndd: tmp.collapse.can });
		tmp.el.cadaverGain.setTxt(showNum(tmp.collapse.layer.gain));
		tmp.el.cadavers.setHTML(
			"<span class='dead'>" +
				showNum(player.collapse.cadavers) +
				"</span> 残骸<span class='dead'> " +
				(((tmp.ach[96].has||tmp.inf.upgs.has("2;4"))&&!nerfActive("noCadavers"))?(formatGain(player.collapse.cadavers, tmp.collapse.layer.gain.div(tmp.ach[96].has?1:100))):"")+
				"</span>"
		);
		tmp.el.cadaverEff.setTxt(showNum(getCadaverEff()));
		tmp.el.sacrificeCadavers.setClasses({
			btn: true,
			locked: player.collapse.cadavers.eq(0),
			btndd: player.collapse.cadavers.gt(0)
		});
		tmp.el.lifeEssence.setHTML(
			"<span class='alive'>" +
				showNum(player.collapse.lifeEssence) +
				"</span> 生命精华 <span class='alive'>" +
				(((tmp.ach[97].has||tmp.inf.upgs.has("5;3"))&&!nerfActive("noLifeEssence"))?formatGain(player.collapse.lifeEssence, player.collapse.cadavers.times(tmp.collapse.sacEff).max(1).div(tmp.ach[97].has?1:100)):"")+"</span>"
		);
		for (let i = 1; i <= EM_AMT; i++) {
			let ms = ESSENCE_MILESTONES[i];
			tmp.el["lem" + i].setHTML(ms.desc + "<br>需要： " + showNum(ms.req) + " 生命精华。");
			if (ms.disp !== undefined) tmp.el["lem" + i].setTooltip("目前： " + ms.disp());
			tmp.el["lem" + i].setClasses({ msCont: true, r: !hasCollapseMilestone(i) });
		}
	}
}

function upadtePathogenUpgradesHTML(){
	for (let i = 1; i <= PTH_AMT; i++) {
		let chs = "";
		chs = getScalingName("pathogenUpg", i);
		chs = chs.replace("Scaled","折算");
		chs = chs.replace("Superscaled","超级折算");
		chs = chs.replace("Hyper","究级折算");
		chs = chs.replace("Atomic","原子折算");
		let hidden = PTH_UPGS[i].unl ? !PTH_UPGS[i].unl() : false;
		tmp.el["pth" + i].setDisplay(!hidden);
		tmp.el["pth" + i].setClasses({
			btn: true,
			locked: player.pathogens.amount.lt(tmp.pathogens[i].cost),
			gross: player.pathogens.amount.gte(tmp.pathogens[i].cost)
		});
		tmp.el["pth" + i].setHTML(
			PTH_UPGS[i].desc +
				"<br>" +
				chs +
				"等级： " +
				showNum(player.pathogens.upgrades[i]) +
				(tmp.pathogens.extra(i).gt(0) ? " + " + showNum(tmp.pathogens.extra(i)) : "") +
				"<br>目前： " +
				tmp.pathogens.disp(i) +
				(player.pathogens.upgrades[i].gte(getPathogenUpgSoftcapStart(i))
					? "<span class='sc'>(已达软上限)</span>"
					: "") +
				"<br>花费： " +
				showNum(tmp.pathogens[i].cost) +
				" 病原体。"
		);
	}
}

function upadtePathogenHTML(){
	if (player.tab == "pathogens") {
		tmp.el.pathogensAmt.setHTML(
			"<span class='grosstxt'>" +
				showNum(player.pathogens.amount) +
				"</span> 病原体 <span class='grosstxt'>" +
				formatGain(player.pathogens.amount, tmp.pathogens.gain, "pathogens") +
				"</span>"
		);
		upadtePathogenUpgradesHTML()
		tmp.el.pthUpgPow.setHTML(
			!tmp.pathogens.upgPow.eq(1) ? ("升级效果：" + showNum(tmp.pathogens.upgPow.times(100)) + "%"+(tmp.pathogens.upgPow.gte(10)?" <span class='sc'>(已达软上限)</span>":"")+"<br>") : ""
		);
		tmp.el.tdeEff.setHTML(
			tmp.ach[63].has
				? "时骨无存倍率：" +
					showNum(ach63Eff()) +
					" 倍 " +
					(ach63Eff().gte(ach63SC()) ? "<span class='sc'>(已达软上限)</span>" : "") +
					"<br><br>"
				: ""
		);
	}
}

function updateSoftcapsHTML(){
	for (let i = 0; i < Object.keys(tmp.sc).length; i++) {
		let name = Object.keys(tmp.sc)[i];
		let reached = Object.values(tmp.sc)[i];
		tmp.el[name + "SC"].setTxt(reached ? "(已达软上限)" : "");
		tmp.el[name + "SC"].setClasses({ sc: true });
	}
}

function updateDarkCircleRssHTML(){
	tmp.el.darkMatter.setHTML(
		"Dark Matter<br>数量： " +
			showNum(player.dc.matter) +
			"<br>获取量： " +
			formatGain(player.dc.matter, tmp.dc.dmGain, "dc", false, tmp.dc.flow) +
			"<br>效果：多获取 " +
			showNum(tmp.dc.dmEff) +
			" 倍火箭。"
	);
	tmp.el.darkEnergy.setHTML(
		"Dark Energy<br>数量： " +
			showNum(player.dc.energy) +
			"<br>获取量： " +
			formatGain(player.dc.energy, tmp.dc.deGain, "dc", false, tmp.dc.flow) +
			"<br>效果：多获取 " +
			showNum(tmp.dc.deEff) +
			" 倍时间方盒。"
	);
	tmp.el.darkFluid.setHTML(
		"Dark Fluid<br>数量： " +
			showNum(player.dc.fluid) +
			"<br>获取量： " +
			formatGain(player.dc.fluid, tmp.dc.dfGain, "dc", false, tmp.dc.flow) +
			"<br>效果：折算的火箭燃料延迟 " +
			showNum(tmp.dc.dfEff) +
			" 火箭燃料出现。"
	);
}

function updateDarkCircleHTML(){
	if (player.tab == "dc") {
		let chs = "";
		chs = getScalingName("darkCore");
		chs = chs.replace("Scaled","折算");
		chs = chs.replace("Superscaled","超级折算");
		chs = chs.replace("Hyper","究级折算");
		chs = chs.replace("Atomic","原子折算");
		updateDarkCircleRssHTML()
		tmp.el.darkCore.setHTML(
			chs +
				"黑暗核心<br>数量： " +
				showNum(player.dc.cores) +
				"<br>花费： " +
				showNum(tmp.dc.coreCost) +
				" 残骸" +
				(tmp.dc.coreEff.gt(0)
					? "<br>效果：+" + showNum(tmp.dc.coreEff.times(100)) + "%病原体升级的效果"
					: "")
		);
		tmp.el.darkMatter.setClasses({darkcircle: true, dcAnim: player.options.dcPulse})
		tmp.el.darkEnergy.setClasses({darkcircle: true, dcAnim: player.options.dcPulse})
		tmp.el.darkFluid.setClasses({darkcircle: true, dcAnim: player.options.dcPulse})
		tmp.el.darkCore.setClasses({
			darkcore: true,
			locked: player.collapse.cadavers.lt(tmp.dc.coreCost),
			inactive: tmp.dc.dmGain.eq(0),
			dcAnim: player.options.dcPulse
		});
		tmp.el.arrowToDarkMatter.setHTML(tmp.dc.dmGain.gt(0) ? "&#8593;" : "");
		tmp.el.darkFlow.setTxt(showNum(tmp.dc.flow));
	}
}

function updateInfinityEndorsementStuffHTML(){
	tmp.el.endorsementManual.setDisplay(
		player.inf.endorsements.gte(10) && ((tmp.inf.can && !player.automators["endorsements"]) || tmp.inf.stadium.canComplete)
	);
	tmp.el.emInner.setHTML(
		tmp.inf.stadium.canComplete
			? "Complete this Stadium challenge."
			: '允许 <span class="infinity">Infinity</span> 认可您。'
	);
	let nextUnl;
	for (let i=0;i<Object.keys(INF_UPGS.dispReqs).length;i++) {
		let key = Object.keys(INF_UPGS.dispReqs)[i]
		if (player.inf.endorsements.lt(INF_UPGS.dispReqs[key])) {
			nextUnl = key
			break;
		}
	}
	tmp.el.nextIUs.setTxt(nextUnl ? ("到达认可 "+showNum(INF_UPGS.dispReqs[nextUnl])+" 后可解锁下一组无限升级。") : "")
	tmp.el.forceInf.setDisplay(player.inf.endorsements.gte(10));
}

function updateInfinitySubtabHTML(){
	if (infTab == "infinity") {
		tmp.el.endorsements.setTxt(showNum(player.inf.endorsements));
		tmp.el.knowledgeBase.setTxt(showNum(tmp.inf.knowledgeBase));
		tmp.el.nextEndorsement.setTxt(formatDistance(tmp.inf.req));
		tmp.el.knowledge.setTxt(showNum(player.inf.knowledge));
		tmp.el.knowledgeGain.setTxt(formatGain(player.inf.knowledge, tmp.inf.knowledgeGain, "knowledge"));
		for (let r = 1; r <= INF_UPGS.rows; r++) {
			for (let c = 1; c <= INF_UPGS.cols; c++) {
				let state = "";
				if (tmp.inf.upgs.repealed(r+";"+c) && !modeActive("easy")) state = "repealed";
				else if (!tmp.inf.upgs.canBuy(r+";"+c)) state = "locked";
				else if (player.inf.upgrades.includes(r+";"+c)) state = "bought";
				else if (player.inf.knowledge.gte(ExpantaNum.mul(INF_UPGS.costs[r+";"+c], tmp.inf.upgCostMult(r+";"+c)))) state = "unbought";
				else state = "locked";
				tmp.el["inf" + (r+";"+c)].setDisplay(tmp.inf.upgs.shown(r+";"+c));
				tmp.el["inf" + (r+";"+c)].setClasses({
					btn: true,
					inf: state == "unbought",
					locked: state == "locked",
					bought: state == "bought",
					repealed: state == "repealed"
				});
			}
		}
		tmp.el.endorsementName.setTxt(getScalingName("endorsements") + " ");
		
		let ach112 = ach112Eff()
		tmp.el.tudeEff.setHTML(
			tmp.ach[112].has ? "宇之不存倍率：" + showNum(ach112) + " 倍"+(ach112.gte(1e160)?" <span class='sc'>(已达软上限)</span>":"")+"<br><br>" : ""
		);
	}
}

function updateAscensionHTML(){
	if (infTab == "ascension") {
			for (let i = 1; i <= 4; i++) {
				tmp.el["perk" + i].setClasses({
					btn: true,
					perk: tmp.inf.asc.perkActive(i),
					inf: !(tmp.inf.asc.perksActive() >= tmp.inf.asc.maxPerks) && !tmp.inf.asc.perkActive(i),
					locked: tmp.inf.asc.perksActive() >= tmp.inf.asc.maxPerks && !tmp.inf.asc.perkActive(i)
				});
				tmp.el["perk" + i].setHTML(
					capitalFirst(PERK_NAMES[i - 1]) +
						"特权" +
						(tmp.inf.asc.perkActive(i) ? (": " + formatTime(player.inf.ascension.time[i - 1])+(player.automators["perks"]?"":"<br>(点击以取消)")) : "")
				);
				tmp.el["perkEff" + i].setTxt(showNum(tmp.inf.asc.perkEff(i)));
				tmp.el["enl" + i].setTxt(showNum(player.inf.ascension.enlightenments[i - 1]));
				tmp.el["enleff" + i].setTxt(showNum(tmp.inf.asc.enlEff(i).times(100)));
				tmp.el["buyEnl" + i].setTxt("花费： " + showNum(tmp.inf.asc.enlCost(i)) + " 飞升能量");
				tmp.el["buyEnl" + i].setClasses({
					btn: true,
					inf: player.inf.ascension.power.gte(tmp.inf.asc.enlCost(i)),
					locked: player.inf.ascension.power.lt(tmp.inf.asc.enlCost(i))
				});
				let name = getScalingName("enlightenments", i);
				tmp.el["enlScale" + i].setTxt(name == "" ? "" : name + " ");
			}
			tmp.el.perkPower.setTxt("特权效果：" + showNum(tmp.inf.asc.perkStrength.times(100)) + "%");
			tmp.el.perkPower.setDisplay(!tmp.inf.asc.perkStrength.eq(1));
			tmp.el.ascPower.setHTML(
				"飞升能量： <span style='font-size: 25px; color: red;'>" +
					showNum(player.inf.ascension.power) +
					"</span> "+formatGain(player.inf.ascension.power, tmp.inf.asc.powerGain, "ascension")
			);
			tmp.el.perkAccel.setHTML(tmp.elm.pa.active?("您"+(tmp.elm.pa.state==""?"":(capitalFirst(tmp.elm.pa.state)))+"的特权加速器使特权的时间流逝速度变为 <span style='font-size: 25px; color: red;'>"+showNum(tmp.elm.pa.speedBoost)+"</span> 倍，但同时特权的效果也变为原来的 <span style='font-size: 25px; color: red;'>"+showNum(tmp.elm.pa.boost)+"</span> 倍。"):"")
		}
}

function updateNormalStadiumHTML(){
	for (let i = 0; i < Object.keys(STADIUM_DESCS).length; i++) {
		let name = Object.keys(STADIUM_DESCS)[i];
		tmp.el[name + "Div"].setTooltip(tmp.inf.stadium.tooltip(name));
		tmp.el[name + "Div"].setClasses({
			stadiumChall: true,
			comp: player.inf.stadium.completions.includes(name)
		});
		let active = player.inf.stadium.current == name;
		let trapped = !active && tmp.inf.stadium.active(name) && !modeActive("extreme");
		let comp = player.inf.stadium.completions.includes(name);
		tmp.el[name + "Chall"].setTxt(trapped ? "Trapped" : active ? "Active" : comp ? "Completed" : "Start");
		tmp.el[name + "Chall"].setClasses({
			btn: true,
			bought: trapped || active,
			locked: player.inf.stadium.current != "" && !(trapped || active),
			inf: !(trapped || active || player.inf.stadium.current != "")
		});
		let data = mltRewardActive(1)?MLT_1_STADIUM_REWARDS:STADIUM_REWARDS
		let showCurrent = data.effects[name] !== undefined;
		tmp.el[name + "Btm"].setHTML(
			"目标： " +
				formatDistance(tmp.inf.stadium.goal(name)) +
				"<br>奖励: " +
				data[name] +
				"<br>" +
				(showCurrent ? "目前: " + data.disp[name]() : "")
		);
	}
	tmp.el.exitStad.setDisplay(player.inf.stadium.current != "");
	tmp.el.stadiumProg.setTxt(player.inf.stadium.current==""?"":"完成进度的比例："+showNum(tmp.inf.stadium.progress())+"%")
}

function updateExtremeStadiumHTML(){
	tmp.el.extremeStadDesc.setTxt(modeActive("extreme")?" in the same row":"")
	tmp.el.extremeStadium.setDisplay(modeActive("extreme"))
	if (modeActive("extreme")) {
		for (let i=0;i<Object.keys(EXTREME_STADIUM_DATA).length;i++) {
			let name = Object.keys(EXTREME_STADIUM_DATA)[i]
			tmp.el[name+"Div"].setTooltip(extremeStadiumTooltip(name));
			tmp.el[name+"Div"].setClasses({
				stadiumChall: true,
				comp: player.extremeStad.includes(name),
			})
			let active = player.inf.stadium.current == name;
			let trapped = !active && extremeStadiumActive(name);
			let comp = player.extremeStad.includes(name);
			tmp.el[name + "Chall"].setTxt(trapped ? "Trapped" : active ? "Active" : comp ? "Completed" : "Start");
			tmp.el[name + "Chall"].setClasses({
				btn: true,
				bought: trapped || active,
				locked: player.inf.stadium.current != "" && !(trapped || active),
				inf: !(trapped || active || player.inf.stadium.current != "")
			});
			let showCurrent = EXTREME_STADIUM_DATA[name].effect !== undefined;
			tmp.el[name + "Btm"].setHTML(
				"目标： " +
					formatDistance(extremeStadiumGoal(name)) + // extremeStadiumGoal
					"<br>奖励： " +
					EXTREME_STADIUM_DATA[name].reward +
					"<br>" +
					(showCurrent ? "目前： " + EXTREME_STADIUM_DATA[name].disp() : "")
			);
		}
	}
	tmp.el.extremeStadReset.setDisplay(modeActive("extreme"));
}

function updatePurgeHTML(){
	tmp.el.purgeDiv.setDisplay(player.inf.pantheon.purge.unl);
	tmp.el.purgeBtn.setTxt(
		HCCBA("purge")?"强制进行净化":(player.inf.pantheon.purge.active
			? "退出净化" +
				(tmp.inf.pantheon.purgeGain.gt(0)
					? "并获得 " + showNum(tmp.inf.pantheon.purgeGain) + " 净化能量。"
					: "。您需要到达 " +
					formatDistance(tmp.inf.pantheon.purgeNext) +
					" 后才能获得更多净化能量。")
			: "进行净化")
	);
	tmp.el.purgePower.setTxt(showNum(player.inf.pantheon.purge.power)+(player.inf.pantheon.purge.power.gte(600)?(" (已达软上限)"):""));
	tmp.el.purgePowerEff.setTxt(showNum(tmp.inf.pantheon.ppe));
}

function updateAngelsChipsHTML(){
	tmp.el.spectralGems.setTxt(showNum(player.inf.pantheon.gems));
	tmp.el.nextSpectralGem.setTxt(showNum(tmp.inf.pantheon.next.ceil()));
	let name = getScalingName("spectralGems");
	tmp.el.spectralGemName.setTxt(name == "" ? "" : name + " ");
	tmp.el.respecSpectralGems.setClasses({
		btn: true,
		inf: player.inf.pantheon.angels.plus(player.inf.pantheon.demons).gt(0),
		locked: !player.inf.pantheon.angels.plus(player.inf.pantheon.demons).gt(0)
	});
	tmp.el.angels.setTxt(showNum(player.inf.pantheon.angels));
	tmp.el.demons.setTxt(showNum(player.inf.pantheon.demons));
	tmp.el.transferAngels.setClasses({
		btn: true,
		inf: player.inf.pantheon.gems.gte(1),
		locked: player.inf.pantheon.gems.lt(1)
	});
	tmp.el.transferDemons.setClasses({
		btn: true,
		inf: player.inf.pantheon.gems.gte(1),
		locked: player.inf.pantheon.gems.lt(1)
	});
	tmp.el.chips.setTxt(showNum(player.inf.pantheon.heavenlyChips));
	tmp.el.chipGain.setTxt(formatGain(player.inf.pantheon.heavenlyChips, tmp.inf.pantheon.chipGain, "heavenlyChips"));
	tmp.el.chipBoost.setTxt(showNum(tmp.inf.pantheon.chipBoost.sub(1).times(100)));
	let mltr5 = mltRewardActive(5)
	tmp.el.soulNerf.setHTML(mltr5?("乘以 <span class='spectral'>"+showNum(player.inf.pantheon.demonicSouls.pow(tmp.inf.pantheon.ppe.times(-1)).plus(1))+"</span>"):("除以 <span class='spectral'>"+showNum(player.inf.pantheon.demonicSouls.pow(tmp.inf.pantheon.ppe).plus(1))+"</span>"))
	tmp.el.souls.setTxt(showNum(player.inf.pantheon.demonicSouls));
	tmp.el.soulGain.setTxt(formatGain(player.inf.pantheon.demonicSouls, tmp.inf.pantheon.soulGain, "demonicSouls"));
	tmp.el.soulBoost.setTxt(showNum(tmp.inf.pantheon.soulBoost.sub(1).times(100)));
	tmp.el.chipNerf.setHTML(mltr5?("乘以 <span class='spectral'>"+showNum(player.inf.pantheon.heavenlyChips.pow(tmp.inf.pantheon.ppe.times(-1)).plus(1))+"</span>"):("除以 <span class='spectral'>"+showNum(player.inf.pantheon.heavenlyChips.pow(tmp.inf.pantheon.ppe).plus(1))+"</span>"))
	tmp.el.phantomDiv.setDisplay(mltr5);
	if (mltr5) {
		tmp.el.phantoms.setTxt(showNum(tmp.inf.pantheon.phantoms));
		tmp.el.hauntingEnergy.setTxt(showNum(player.inf.pantheon.hauntingEnergy||0));
		tmp.el.hauntingEnergyGain.setTxt(formatGain(player.inf.pantheon.hauntingEnergy, tmp.inf.pantheon.hauntingEnergyGain, "hauntingEnergy"))
		tmp.el.hauntingEnergyBoost.setTxt(showNum(tmp.inf.pantheon.hauntingEnergyBoost.sub(1).times(100)));
		tmp.el.hauntingEnergyBoost2.setTxt(showNum(tmp.inf.pantheon.hauntingEnergyBoost2))
	}
}

function updateDerivativeHTML(){
	let chs = "";
	chs = getScalingName("dervBoost");
	chs = chs.replace("Scaled","折算");
	chs = chs.replace("Superscaled","超级折算");
	chs = chs.replace("Hyper","究级折算");
	chs = chs.replace("Atomic","原子折算");
	let de = getDervNames();
	for (let i = 0; i < de.length; i++) {
		let name = de[i];
		tmp.el["dervDiv" + name].setDisplay(tmp.inf.derv.unlocked(name));
		tmp.el["derv" + name].setTxt(formatDistance(tmp.inf.derv.amt(name)));
		tmp.el["dervgain" + name].setTxt(formatGain(tmp.inf.derv.amt(name), tmp.inf.derv.gain(name), "derv", true));
	}
	let dervName = player.inf.derivatives.unlocks.gte(tmp.inf.derv.maxShifts) ? "提升" : "变换";
	tmp.el.dervUnlock.setHTML(
		chs +
			"导数" +
			dervName +
			" (" +
			showNum(player.inf.derivatives.unlocks) +
			")<br>花费： " +
			showNum(tmp.inf.derv.unlCost) +
			" 知识"
	);
	tmp.el.dervUnlock.setClasses({
		btn: true,
		locked: player.inf.knowledge.lt(tmp.inf.derv.unlCost),
		inf: player.inf.knowledge.gte(tmp.inf.derv.unlCost)
	});
}

function updateAllInfinityHTML(){
	if (player.tab == "inf") {
		updateInfinityEndorsementStuffHTML()
		updateInfinitySubtabHTML()
		updateAscensionHTML()

		// The Stadium
		if (infTab == "stadium") {
			updateNormalStadiumHTML()
			updateExtremeStadiumHTML()
		}

		// The Pantheon
		if (infTab == "pantheon") {
			updateAngelsChipsHTML()
			updatePurgeHTML()
		}

		// Derivatives
		if (infTab == "derivatives") {
			updateDerivativeHTML()
		}
	}
}

function updateRankCheapenersHTML(){
	let chs = "";
	chs = getScalingName("rankCheap");
	chs = chs.replace("Scaled","折算");
	chs = chs.replace("Superscaled","超级折算");
	chs = chs.replace("Hyper","究级折算");
	chs = chs.replace("Atomic","原子折算");
	tmp.el.rankCheap.setTxt(
		showNum(player.rankCheap) + (tmp.rankCheap.free.eq(0) ? "" : " + " + showNum(tmp.rankCheap.free))
	);
	tmp.el.rankCheapUp.setClasses({ btn: true, locked: !tmp.rankCheap.can });
	tmp.el.rankCheapReq.setTxt(formatDistance(tmp.rankCheap.req));
	tmp.el.rankCheapName.setTxt(chs + "级别降价器");
}

function updateNormalFurnace(){
	if (fnTab=="nfn") {
		tmp.el.coal.setTxt(
			showNum(player.furnace.coal) +
				" 煤 " + formatGain(player.furnace.coal, tmp.fn.gain, "fn")
		);
		tmp.el.coalEff.setTxt(showNum(tmp.fn.eff));
		for (let i = 1; i <= 5; i++) {
			tmp.el["fnu" + i].setClasses({
				btn: true,
				locked: player.furnace.coal.lt(tmp.fn.upgs[i].cost),
				fn: player.furnace.coal.gte(tmp.fn.upgs[i].cost)
			});
			tmp.el["fnu" + i + "cost"].setTxt(showNum(tmp.fn.upgs[i].cost));
			tmp.el["fnu" + i + "name"].setTxt(getScalingName("fn", i));
			tmp.el["fnu" + i + "lvl"].setTxt(showNum(player.furnace.upgrades[i - 1]));
		}
		tmp.el.fnu4.setDisplay(player.tr.upgrades.includes(31))
		tmp.el.fnu5.setDisplay(FCComp(5))
		tmp.el.bf.setClasses({
			btn: true,
			locked: player.furnace.coal.lt(tmp.fn.bfReq),
			fn: player.furnace.coal.gte(tmp.fn.bfReq)
		});
		tmp.el.bfReq.setTxt(showNum(tmp.fn.bfReq));
		tmp.el.bfAmt.setTxt(showNum(player.furnace.blueFlame)+(tmp.fn.enh.eff.gt(0)?(" + "+showNum(tmp.fn.enh.eff)):""));
		tmp.el.blueFlameName.setTxt(getScalingName("bf"))
		tmp.el.bfEff.setTxt(showNum(ExpantaNum.sub(1, tmp.fn.bfEff).times(100)));
		tmp.el.furnChalls.setDisplay(player.inf.endorsements.gte(10))
		for (let i=1;i<=6;i++) {
			if (i==6) tmp.el["fnc"+i].setDisplay(player.elementary.bosons.scalar.higgs.upgrades.includes("6;0;0")&&player.furnChalls.includes(i-1))
			else if (i>1) tmp.el["fnc"+i].setDisplay(player.furnChalls.includes(i-1))
			tmp.el["fnc"+i+"goal"].setTxt(showNum(FC_GOAL[i]))
			tmp.el["fns"+i].setTxt((player.activeFC==i)?(FCEnd()?"Complete":"Exit"):(player.furnChalls.includes(i)?"Finished":"Start"))
		}
		tmp.el.fnu1eff.setTxt(showNum(tmp.fn1base))
		tmp.el.fnu4eff.setTxt(showNum(tmp.fn4base))
		tmp.el.fu4dc.setTxt((player.tr.upgrades.includes(35)&&!HCCBA("noTRU"))?"is weaker":"does nothing")
	}
}

function updateEnhanceFurnace(){
	if (fnTab=="efn") {
		tmp.el.eCoal.setTxt(
			showNum(player.furnace.enhancedCoal) + " 强化煤 " + formatGain(player.furnace.enhancedCoal, tmp.fn.enh.gain, "fn")
		);
		tmp.el.eCoalEff.setTxt(showNum(tmp.fn.enh.eff));
		tmp.el.eCoalEff2.setTxt(showNum(tmp.fn.enh.eff2))
		for (let i = 1; i <= 13; i++) {
			tmp.el["efnu" + i].setClasses({
				btn: true,
				locked: player.furnace.enhancedCoal.lt(tmp.fn.enh.upgs[i].cost),
				fn: player.furnace.enhancedCoal.gte(tmp.fn.enh.upgs[i].cost)
			});
			tmp.el["efnu" + i + "cost"].setTxt(showNum(tmp.fn.enh.upgs[i].cost));
			tmp.el["efnu" + i + "name"].setTxt(getScalingName("efn", i));
			tmp.el["efnu" + i + "lvl"].setTxt(showNum(player.furnace.enhancedUpgrades[i - 1])+(tmp.fn.enh.upgs[i].extra.gt(0)?(" + "+showNum(tmp.fn.enh.upgs[i].extra)):""));
		}
		tmp.el.efnu1eff.setTxt(showNum(tmp.fn.enh.upg1eff))
		tmp.el.efnu2eff.setTxt(showNum(tmp.fn.enh.upg2eff.times(100)))
		tmp.el.efnu3eff.setTxt(showNum(tmp.fn.enh.upg3eff))
		tmp.el.efnu13eff.setTxt(showNum(tmp.fn.enh.upg13eff))
		tmp.el.moltBr.setDisplay(tmp.fn.enh.moltBr.gte(1))
		tmp.el.moltBrAmt.setTxt(showNum(tmp.fn.enh.moltBr))
		tmp.el.moltBrEff.setTxt(showNum(tmp.fn.enh.moltBrEff))
		tmp.el.moltBrEff2.setTxt(showNum(tmp.fn.enh.moltBrEff2))
	}
}

function updateMagma() {
	if (fnTab == "magma") {
		let req = getMagmaReq();
		tmp.el.magmaSearch.setClasses({
			btn: true,
			locked: player.furnace.enhancedCoal.lt(req),
			magma: player.furnace.enhancedCoal.gte(req),
		})
		tmp.el.magmaReq.setTxt(showNum(req))
		tmp.el.magmaAmt.setTxt(showNum(player.magma.amount))
		tmp.el.magmaEff.setTxt(showNum(tmp.fn.magma.eff.sub(1).times(100)))
		let req2 = getMagmaReformReq();
		let req2b = getMagmaReformReq2();
		tmp.el.reformMagma.setClasses({
			btn: true,
			locked: player.magma.amount.lt(req2)||player.inf.knowledge.lt(req2b),
			magma: player.magma.amount.gte(req2)&&player.inf.knowledge.gte(req2b),
		})
		tmp.el.magmaReformReq.setTxt(showNum(req2));
		tmp.el.magmaReformReq2.setTxt(showNum(req2b));
		tmp.el.rMagmaAmt.setTxt(showNum(player.magma.ref));
		tmp.el.rMagmaEff.setHTML("<span class='magmaTxt'>"+showNum(tmp.fn.magma.eff2)+"</span>"+(player.elementary.theory.tree.unl?(" (受到未花费的学说点数"+(player.elementary.theory.depth.gte(6)?("和一维弦长度加成)"):"加成)")):""));
	}
}

function updatePlasma() {
	if (fnTab == "plasma") {
		tmp.el.plasmaExp.setTxt(showNum(tmp.fn.pl.exp))
		tmp.el.plasmaAmt.setTxt(showNum(player.plasma.amount))
		tmp.el.whiteFlameGen.setTxt(formatGain(player.plasma.whiteFlame, tmp.fn.pl.wfGain, "plasma"))
		tmp.el.whiteFlameAmt.setTxt(showNum(player.plasma.whiteFlame))
		
		let boostReq = getPlasmaBoostReq();
		tmp.el.plasmaBoostBtn.setDisplay(canBuyPlasmaBoost())
		if (canBuyPlasmaBoost()) {
			tmp.el.plasmaBoostBtn.setHTML("解锁一个新的"+getPlasmaBoostType(player.plasma.boosts.plus(1), true)+"加成<br><br>花费："+showNum(boostReq)+"白色火焰。")
			tmp.el.plasmaBoostBtn.setClasses({
				btn: true,
				plasma: player.plasma.whiteFlame.gte(boostReq),
				locked: !player.plasma.whiteFlame.gte(boostReq),
			})
		}
		let data = PLASMA_BOOSTS;
		for (let i=1;i<=data.upgs();i++) {
			tmp.el["plB"+i].setDisplay(player.plasma.boosts.gte(i));
			if (player.plasma.boosts.gte(i)) {
				let cd = data[i];
				tmp.el["plB"+i+"Curr"].setTxt(cd.effD(tmp.fn.pl.boosts[i]));
			}
		}
	}
}

function updateOverallExtremeModeHTML(){
	tmp.el.rankCheapDiv.setDisplay(modeActive('extreme'));
	if (modeActive("extreme")) {
		updateRankCheapenersHTML()
		// The Furnace
		if (player.tab=="furnace") {
			updateNormalFurnace() 
			updateEnhanceFurnace()
			updateMagma()
			updatePlasma()
		}
	}
}

function updateStatisticsHTML(){
	if (player.tab == "statistics") {
		updateStatTabs();
		if (statTab == "mainStats") {
			tmp.el.best.setTxt(formatDistance(player.bestDistance))
			tmp.el.bestV.setTxt(formatDistance(player.bestV)+"/秒")
			tmp.el.bestA.setHTML(formatDistance(player.bestA)+"/秒<sup>2</sup>")
			tmp.el.maxEnd.setTxt(player.bestEnd.eq(0)?"":("最高的认可数值："+showNum(player.bestEnd)))
			tmp.el.maxEP.setTxt(player.bestEP.eq(0)?"":("一次重置中最高的基本粒子获取量："+showNum(player.bestEP)))
		} 
		
		// Always called because it determines whether the tab button is shown
		statScalingsShown = false;
		for (let i=0;i<Object.keys(SCALING_STARTS).length;i++) {
			let name = Object.keys(SCALING_STARTS)[i]
			let tt = ""
			if (name=="hyper") tt = "注意：究级折算的效果不会低于50% :)\n"
			for (let r=0;r<Object.keys(SCALING_RES).length;r++) { // NESTED LOOP, REMOVE TO REDUCE LAG
				let func = Object.values(SCALING_RES)[r]
				let key = Object.keys(SCALING_RES)[r]
				let amt = func(1)
				if (MULTI_SCALINGS.includes(key)) for (let i=1;i<=SCALING_AMTS[key];i++) amt = ExpantaNum.max(amt, func(i))
				if (amt.eq(0)||((key=="rankCheap"||key=="fn")&&!modeActive("extreme"))) continue
				if (amt.gte(getScalingStart(name, key))) tt += capitalFirst(REAL_SCALING_NAMES[key])+" ("+showNum(getScalingPowerDisplay(name, key).times(100))+"%)：从 "+showNum(getScalingStart(name, key))+" 开始\n"
			}
			let blank = ""
			if (name=="hyper") blank = "注意：究级折算的效果不会低于50% :)\n"
			tmp.el[name+"Stat"].changeStyle("visibility", tt==blank?"hidden":"visible")
			if (tt!=blank) statScalingsShown = true
			tmp.el[name+"Stat"].setAttr("widetooltip", tt)
		}
		
		if (statTab == "rankTiers") {
			tmp.el.rankTierStats.setDisplay(player.rank.gt(1)||player.tier.gt(0))
			for (let i=0;i<Object.keys(RANK_DESCS).length;i++) {
				let ranks = Object.keys(RANK_DESCS)[i]
				tmp.el["rankReward"+ranks].setDisplay(player.rank.gt(ranks))
				if (tmp.el["rankEff"+ranks]) tmp.el["rankEff"+ranks].setTxt(showNum(window["rank"+ranks+"Eff"]()));
			}
			for (let i=0;i<Object.keys(TIER_DESCS).length;i++) {
				let tiers = Object.keys(TIER_DESCS)[i]
				tmp.el["tierReward"+tiers].setDisplay(player.tier.gt(tiers))
				if (tmp.el["tierEff"+tiers]) tmp.el["tierEff"+tiers].setTxt(showNum(window["tier"+tiers+"Eff"]()));
			}
		}
	}
}

function updateFermionsHTML(){
	tmp.el.fermionsamt.setTxt(showNum(player.elementary.fermions.amount));
	tmp.el.transfer1Fermions.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(0),
		elm: player.elementary.particles.gt(0)
	});
	tmp.el.transfer10pFermions.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(10),
		elm: player.elementary.particles.gt(9)
	});
	tmp.el.transfer50pFermions.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(2),
		elm: player.elementary.particles.gt(1)
	});
	tmp.el.transfer100pFermions.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(1),
		elm: player.elementary.particles.gt(0)
	});
}

function updateQuarksHTML(){
	tmp.el.quarks.setHTML(
		showNum(player.elementary.fermions.quarks.amount) + " " + tmp.elm.ferm.quarkName() + "夸克"
	);
	tmp.el.quarkGain.setTxt(showNum(adjustGen(tmp.elm.ferm.quarkGain, "quarks")));
	tmp.el.quarkRewards.setTooltip(
		tmp.elm.ferm.quarkName(true) +
			"夸克：" +
			tmp.elm.ferm.quarkDesc(QUARK_NAMES[player.elementary.fermions.quarks.type - 1])
	);
}

function updateLeptonsHTML(){
	tmp.el.leptons.setHTML(
		showNum(player.elementary.fermions.leptons.amount) + " " + tmp.elm.ferm.leptonName() + "轻子"
	);
	tmp.el.leptonGain.setTxt(showNum(adjustGen(tmp.elm.ferm.leptonGain, "leptons")));
	tmp.el.leptonRewards.setTooltip(
		tmp.elm.ferm.leptonName(true) +
			"轻子：" +
			tmp.elm.ferm.leptonDesc(LEPTON_NAMES[player.elementary.fermions.leptons.type - 1])
	);
}

function updateBosonsAmountsHTML(){
	tmp.el.bosonsamt.setTxt(showNum(player.elementary.bosons.amount));
	tmp.el.transfer1Bosons.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(0),
		elm: player.elementary.particles.gt(0)
	});
	tmp.el.transfer10pBosons.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(10),
		elm: player.elementary.particles.gt(9)
	});
	tmp.el.transfer50pBosons.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(2),
		elm: player.elementary.particles.gt(1)
	});
	tmp.el.transfer100pBosons.setClasses({
		btn: true,
		locked: player.elementary.particles.lte(1),
		elm: player.elementary.particles.gt(0)
	});
}

function updateGaugeBosonsAmountHTML(){
	tmp.el.gaugeAmt.setTxt(showNum(player.elementary.bosons.gauge.amount));
	tmp.el.gaugeGain.setTxt(showNum(adjustGen(tmp.elm.bos.gaugeGain, "gauge")));
	tmp.el.gaugeForce.setTxt(showNum(player.elementary.bosons.gauge.force));
	tmp.el.gaugeForceGain.setTxt(formatGain(player.elementary.bosons.gauge.force, tmp.elm.bos.forceGain, "gauge"));
	tmp.el.gaugeForceEff.setTxt(showNum(tmp.elm.bos.forceEff));
}

function updatePhotonsHTML(){
	tmp.el.photons.setTxt(showNum(player.elementary.bosons.gauge.photons.amount));
	tmp.el.photonGain.setTxt(formatGain(player.elementary.bosons.gauge.photons.amount, tmp.elm.bos.photonGain, "gauge"));
	for (let i = 1; i <= PHOTON_UPGS; i++) {
		let chs = "";
		chs = getScalingName("photons", i);
		chs = chs.replace("Scaled","折算");
		chs = chs.replace("Superscaled","超级折算");
		chs = chs.replace("Hyper","究级折算");
		chs = chs.replace("Atomic","原子折算");
		tmp.el["photon" + i].setClasses({
			btn: true,
			locked: player.elementary.bosons.gauge.photons.amount.lt(tmp.elm.bos.photonCost[i]),
			light: player.elementary.bosons.gauge.photons.amount.gte(tmp.elm.bos.photonCost[i])
		});
		tmp.el["photonLvl" + i].setTxt(chs+"等级： "+showNum(player.elementary.bosons.gauge.photons.upgrades[i - 1]));
		tmp.el["photonDesc" + i].setTxt(showNum(tmp.elm.bos.photonEff(i)) + " 倍");
		tmp.el["photonCost" + i].setTxt(showNum(tmp.elm.bos.photonCost[i]));
	}
}

function upadteWZBosonsHTML(){
	tmp.el.w.setTxt(showNum(player.elementary.bosons.gauge.w));
	tmp.el.wg.setTxt(formatGain(player.elementary.bosons.gauge.w, tmp.elm.bos.wg, "gauge"));
	tmp.el.w1.setTxt(showNum(tmp.elm.bos.w1));
	tmp.el.w2.setTxt(showNum(tmp.elm.bos.w2));
	tmp.el.z.setTxt(showNum(player.elementary.bosons.gauge.z));
	tmp.el.zg.setTxt(formatGain(player.elementary.bosons.gauge.z, tmp.elm.bos.zg, "gauge"));
	tmp.el.z1.setTxt(showNum(tmp.elm.bos.z1));
	tmp.el.z2.setTxt(showNum(tmp.elm.bos.z2));
}

function updateGluonsHTML(){
	for (let i = 0; i < GLUON_COLOURS.length; i++) {
		let col = GLUON_COLOURS[i];
		let amt = player.elementary.bosons.gauge.gluons[col].amount;
		tmp.el[col + "g"].setTxt(showNum(amt));
		tmp.el[col + "gg"].setTxt(formatGain(amt, tmp.elm.bos[col+"g"], "gauge"));
		tmp.el["glu"+col+"3"].setDisplay(hasDE(1))
		for (let x = 1; x <= 3; x++) {
			tmp.el[col + "Upg" + x].setClasses({
				btn: true,
				locked: amt.lt(tmp.elm.bos.gluonCost(col, x)),
				elm: amt.gte(tmp.elm.bos.gluonCost(col, x))
			});
			tmp.el[col + "Lvl" + x].setTxt(
				showNum(player.elementary.bosons.gauge.gluons[col].upgrades[x - 1]||new ExpantaNum(0))
			);
			tmp.el[col + "Eff" + x].setTxt(showNum(tmp.elm.bos.gluonEff(col, x)));
			tmp.el[col + "Cost" + x].setTxt(showNum(tmp.elm.bos.gluonCost(col, x)));
		}
	}
}

function updateGravitonsHTML(){
	tmp.el.grav.setTxt(showNum(player.elementary.bosons.gauge.gravitons));
	tmp.el.gravGain.setTxt(formatGain(player.elementary.bosons.gauge.gravitons, tmp.elm.bos.gravGain, "gauge"));
	tmp.el.gravMult.setTxt(showNum(tmp.elm.bos.gravEff));
	tmp.el.gravBoostDiv.setDisplay(hasDE(4))
	let boosts = getGravBoosts();
	tmp.el.gravBoosts.setTxt(showNum(boosts));
	tmp.el.gravBoostNext.setTxt(showNum(getNextGravBoost(boosts)));
	tmp.el.gravBoostEach.setTxt(showNum(getGravBoostBase()));
	tmp.el.gravBoostMult.setTxt(showNum(getGravBoostMult()));
}

function updateScalarBosonsHTML(){
	if (bosTab == "scalar") {
		tmp.el.scalarAmt.setTxt(showNum(player.elementary.bosons.scalar.amount));
		tmp.el.scalarGain.setTxt(showNum(adjustGen(tmp.elm.bos.scalarGain, "scalar")));
		tmp.el.higgs.setTxt(showNum(player.elementary.bosons.scalar.higgs.amount))
		tmp.el.higgsGain.setTxt(formatGain(player.elementary.bosons.scalar.higgs.amount, tmp.elm.bos.higgsGain, "scalar"))
		for (let i=0;i<Object.keys(HIGGS_UPGS).length;i++) {
			let name = Object.keys(HIGGS_UPGS)[i]
			let data = Object.values(HIGGS_UPGS)[i]
			tmp.el["higgs"+name].setDisplay(data.unl())
			tmp.el["higgs"+name].setClasses({btn: true, higgsL: player.elementary.bosons.scalar.higgs.amount.lt(data.cost)&&!player.elementary.bosons.scalar.higgs.upgrades.includes(name), higgs: player.elementary.bosons.scalar.higgs.amount.gte(data.cost)&&!player.elementary.bosons.scalar.higgs.upgrades.includes(name), higgsB: player.elementary.bosons.scalar.higgs.upgrades.includes(name)})
			let extra = HIGGS_UPGS_EXTR_DESCS[name]
			let text = data.desc
			if (extra != undefined) {
				let ac = extra.active()
				if (ac) text = extra.desc[ac]
			}
			tmp.el["higgs"+name].setHTML(text+"<br>花费： "+showNum(data.cost)+" 希格斯玻色子。")
		}
		tmp.el["higgs1;1;0"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_1;1;0"](true))+" 倍")
		tmp.el["higgs0;1;1"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_0;1;1"](true))+" 倍")
		tmp.el["higgs3;0;0"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_3;0;0"](true))+" 倍")
		tmp.el["higgs0;2;1"].setTooltip("目前：+"+showNum(tmp.elm.bos["higgs_0;2;1"](true))+"%")
		tmp.el["higgs0;0;4"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_0;0;4"](true))+" 倍")
		tmp.el["higgs1;3;0"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_1;3;0"](true))+" 倍")
		tmp.el["higgs0;3;1"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_0;3;1"](true))+" 倍")
		tmp.el["higgs0;0;5"].setTooltip("目前： "+showNum(tmp.elm.bos["higgs_0;0;5"](true))+" 次延迟")
	}
}

function updateElementaryMainDisplaysHTML(){
	tmp.el.elmReset.setHTML(
		player.elementary.theory.active?(tmp.elm.can?("退出当前的学说宇宙以获得 "+showNum(tmp.elm.theory.gain)+" 学说点数。"):"Reach the end of this Elementary run to gain Theory Points."):("重置之前所有进度，并获得 <span class='eltxt'>" +
			showNum(tmp.elm.layer.gain) +
			"</span> 基本粒子。"+(tmp.elm.layer.gain.gte(tmp.elm.softcap)?"<span class='sc'>(已达软上限)</span>":""))
	);
	tmp.el.elmReset.setClasses({ btn: true, locked: !tmp.elm.can, elm: (tmp.elm.can&&!player.elementary.theory.active), th: (tmp.elm.can&&player.elementary.theory.active) });
	tmp.el.elmt.setTxt(showNum(player.elementary.times));
	tmp.el.elmp.setTxt(showNum(player.elementary.particles));
}

function updateSuperSymetryHTML(){
	if (thTab=="ss") {
		tmp.el.ssUnl.setDisplay(!player.elementary.theory.supersymmetry.unl)
		tmp.el.ssDiv.setDisplay(player.elementary.theory.supersymmetry.unl)
		for (let i=0;i<4;i++) {
			let type = ["squark","slepton","neutralino","chargino"][i]
			tmp.el[type+"s"].setTxt(showNum(player.elementary.theory.supersymmetry[type+"s"]))
			tmp.el[type+"Gain"].setTxt(formatGain(player.elementary.theory.supersymmetry[type+"s"], tmp.elm.theory.ss[type+"Gain"], "ss"))
			tmp.el[type+"Eff"].setTxt(showNum(tmp.elm.theory.ss[type+"Eff"]))
		}
		tmp.el.wavelength.setTxt(formatDistance(tmp.elm.theory.ss.wavelength))
		tmp.el.waveEff.setTxt(showNum(tmp.elm.theory.ss.waveEff))
	}
}

function updateTheoryTreeHTML(){
	if (thTab=="tree") {
		tmp.el.treeUnl.setDisplay(!player.elementary.theory.tree.unl)
		tmp.el.treeDiv.setDisplay(player.elementary.theory.tree.unl)
		tmp.el.mainTree.setDisplay(!player.options.tht)
		tmp.el.groupTree.setDisplay(player.options.tht)
		for (let i=1;i<=TREE_AMT;i++) {
			let bought = tmp.elm.theory.tree.bought(i)
			let pref = player.options.tht?"gTree":"tree"
			tmp.el[pref+i].changeStyle("visibility", (TREE_UPGS[i].unl?TREE_UPGS[i].unl():true)?"visible":"hidden")
			let cap = getTreeUpgCap(i)
			tmp.el[pref+i].setTxt(showNum(bought)+"/"+showNum(cap))
			tmp.el[pref+i].setClasses({tree: true, capped: bought.gte(cap), unl: (!(bought.gte(cap))&&player.elementary.theory.points.gte(TREE_UPGS[i].cost(bought.div(tmp.elm.theory.tree.costScaling)).div(tmp.elm.theory.tree.costReduc).round())), locked: (!(bought.gte(cap))&&!player.elementary.theory.points.gte(TREE_UPGS[i].cost(bought.div(tmp.elm.theory.tree.costScaling)).div(tmp.elm.theory.tree.costReduc).round()))})
		}
		if (player.options.tht) {
			for (let i=1;i<=Object.keys(G_TREE_SECTS).length;i++) {
				let unl = G_TREE_SECTS[i]()
				tmp.el["gTreeSect"+i].setDisplay(unl)
			}
		}
		tmp.el.treeRespec.setTxt("重置学说树的升级(且强制进行一次基本重置)并返还 "+showNum(player.elementary.theory.tree.spent)+" 学说点数。")
		tmp.el.ach152Eff.setHTML(tmp.ach[152].has?('“无用的学说”效果：升级便宜 '+showNum(ach152Eff())+' 倍。<br><br>'):"")
	}
}

function updateTheoryTreeHTMLPerSec() {
	if (thTab=="tree") {
		for (let i=1;i<=TREE_AMT;i++) {
			let bought = tmp.elm.theory.tree.bought(i)
			let cap = getTreeUpgCap(i)
			let pref = player.options.tht?"gTree":"tree"
			tmp.el[pref+i].setTooltip(((TREE_UPGS[i].altDesc&&player.options.tht)?TREE_UPGS[i].altDesc:TREE_UPGS[i].desc)+"\n"+(bought.gte(cap)?"":("花费: "+showNum(TREE_UPGS[i].cost(bought.div(tmp.elm.theory.tree.costScaling)).div(tmp.elm.theory.tree.costReduc).round())+" 学说点数"))+"\n目前: "+TREE_UPGS[i].effD(TREE_UPGS[i].effect(ExpantaNum.add(bought, i==7?TREE_UPGS[11].effect(player.elementary.theory.tree.upgrades[11]||0):0))))
		}
	}
}

function updateStringsHTML(){
	if (thTab=="strings") {
		tmp.el.stringsUnl.setDisplay(!player.elementary.theory.strings.unl)
		tmp.el.stringsDiv.setDisplay(player.elementary.theory.strings.unl)
		for (let i=1;i<=TOTAL_STR;i++) {
			if (i>1) tmp.el["str"+i].setDisplay(player.elementary.theory.strings.amounts[i-2].gte(STR_REQS[i])&&(UNL_STR()>=i))
			tmp.el["str"+i+"amt"].setTxt(formatDistance(player.elementary.theory.strings.amounts[i-1]))
			tmp.el["str"+i+"eff"].setTxt(showNum(getStringEff(i)))
			tmp.el["str"+i+"gain"].setTxt(formatGain(player.elementary.theory.strings.amounts[i-1], getStringGain(i), "str", true))
		}
		let lastStr = player.elementary.theory.strings.amounts.findIndex(x => new ExpantaNum(x).eq(0))+1
		tmp.el.nextStr.setTxt((lastStr<=1||lastStr>UNL_STR())?"":("下一个弦将在"+STR_NAMES[lastStr-1]+"弦长度达到 "+formatDistance(STR_REQS[lastStr])+" 时解锁"))
		tmp.el.entangleDiv.setDisplay(lastStr>=3||lastStr==0||player.elementary.theory.strings.entangled.gt(0))
		tmp.el.entangle.setClasses({btn: true, locked: lastStr<3&&lastStr!=0, th: lastStr>=3||lastStr==0})
		tmp.el.entangle.setTxt("纠缠您的弦(并重置它们)以获得 "+formatDistance(getEntangleGain())+" 长度的纠缠弦。")
		tmp.el.entangleAmt.setTxt(formatDistance(player.elementary.theory.strings.entangled))
		tmp.el.entangleEff.setTxt(showNum(getEntangleEff()))
	}
}

function updatePreonsHTML(){
	if (thTab=="preons") {
		tmp.el.preonsUnl.setDisplay(!player.elementary.theory.preons.unl)
		tmp.el.preonsDiv.setDisplay(player.elementary.theory.preons.unl)
		tmp.el.preonAmt.setTxt(showNum(player.elementary.theory.preons.amount))
		tmp.el.preonGain.setTxt(formatGain(player.elementary.theory.preons.amount, getPreonGain(), "preons"))
		tmp.el.theoryBoost.setClasses({btn: true, locked: player.elementary.theory.preons.amount.lt(getTBCost()), th: player.elementary.theory.preons.amount.gte(getTBCost())})
		tmp.el.theoryBoost.setHTML("获取1个学说增强器(增加 "+showNum(getTBGain())+" 学说点数)<br>花费： "+showNum(getTBCost())+" 前子")
		tmp.el.theoryBoosters.setTxt(showNum(player.elementary.theory.preons.boosters))
		let t = player.elementary.theory.preons.boosters
		tmp.el.theoryBoostersEff.setTxt(showNum(player.elementary.entropy.upgrades.includes(17)?(ExpantaNum.div(t.pow(2).times(t.plus(1).pow(2)).times(t.pow(2).times(2).plus(t.times(2)).sub(1)), 12).round()):(t.div(2).times(t.plus(1)))))
	}
}

function updateAcceleronsHTML(){
	if (thTab=="accelerons") {
		tmp.el.acceleronsUnl.setDisplay(!player.elementary.theory.accelerons.unl)
		tmp.el.acceleronsDiv.setDisplay(player.elementary.theory.accelerons.unl)
		tmp.el.accel.setTxt(showNum(player.elementary.theory.accelerons.amount))
		let gain = getAccelGain()
		tmp.el.accelGain.setTxt(showNum(adjustGen(gain, "accelerons")))
		tmp.el.accelerSC.setHTML(gain.gte(1e6)?"<span class='sc'>(已达软上限)</span>":"")
		let accEff = getAccelEff()
		tmp.el.accelEff.setHTML((hasDE(7)?"及强子时间间隔减少":"")+"<span class='thp'>"+showNum(accEff)+"</span>倍"+(accEff.gte(2)?" <span class='sc'>(已达软上限)</span>":""))
		let next = player.elementary.theory.accelerons.expanders.toNumber()+1
		let cost = (modeActive("extreme")&&EXTREME_DE_COSTS[next])?EXTREME_DE_COSTS[next]:((modeActive("hikers_dream")&&HD_DE_COSTS[next])?HD_DE_COSTS[next]:DARK_EXPANDER_COSTS[next]);
		tmp.el.darkExp.setClasses({btn: true, locked: (player.elementary.theory.accelerons.amount.lt(cost)||next-1>=getMaxDEs()), th: (!(player.elementary.theory.accelerons.amount.lt(cost)||next-1>=getMaxDEs()))})
		tmp.el.darkExp.setHTML((next-1>=getMaxDEs())?"MAXED":(DARK_EXPANDER_DESCS[next]+"<br>花费："+showNum(cost)+" 加速子"))
		tmp.el.darkExpAmt.setTxt(showNum(player.elementary.theory.accelerons.expanders))
		let past = ""
		if (next>1) Array.from(Array(next-1), (_, i) => i + 1).forEach(n => past += "黑暗拓展器"+n+"："+DARK_EXPANDER_DESCS[n]+"<br>")
		tmp.el.darkExpPast.setHTML(past)
	}
}

function updateInfatonsHTML(){
	if (thTab=="inflatons") {
		tmp.el.inflatonsUnl.setDisplay(!player.elementary.theory.inflatons.unl)
		tmp.el.inflatonsDiv.setDisplay(player.elementary.theory.inflatons.unl)
		tmp.el.inflatonAmt.setTxt(showNum(player.elementary.theory.inflatons.amount))
		let state = tmp.elm.hc.infState
		tmp.el.inflatonPerc.setTxt(state>=0?(showNum(state*100)+"% 已暴胀"):(showNum(state*(-100))+"% 已收缩"))
		tmp.el.inflatonGain.setTxt(showNum(adjustGen(tmp.elm.hc.infGain, "inflatons")))
		tmp.el.inflaton1.setTxt(showNum(getInflatonEff1()))
		let eff2 = getInflatonEff2()
		tmp.el.inflaton2.setTxt(showNum(eff2))
		tmp.el.inflatonSC.setTxt(tmp.elm.hc.infGain.gte(5e4)?" (已达软上限)":"")
		tmp.el.inflaton2sc.setTxt((eff2.gte(5)&&!player.elementary.entropy.upgrades.includes(13))?"(已达极端软上限)":"")
	}
}

function updateFermionsMainHTML(){
	if (elmTab == "fermions") {
		updateFermionsHTML()
		updateQuarksHTML()
		updateLeptonsHTML()
	}
}

function updateBosonsMainHTML(){
	if (elmTab == "bosons") {
		updateBosonsAmountsHTML()
		if (bosTab == "gauge") {
			updateGaugeBosonsAmountHTML()
			updatePhotonsHTML()
			upadteWZBosonsHTML()
			updateGluonsHTML()
			updateGravitonsHTML()
		}
		updateScalarBosonsHTML()
	}
}

function updateTheoryverseMainHTML(){
	if (elmTab=="theory") {
		tmp.el.thp.setTxt(showNum(player.elementary.theory.points))
		if (thTab=="tv") {
			tmp.el.theoriverse.setHTML(HCTVal("tv").gt(-1)?"Trapped in the Theoriverse!":hasMltMilestone(4)?("学说宇宙深度："+showNum(player.elementary.theory.depth)+("<br>总学说点数："+showNum(tmp.elm.theory.gainMult.times(ExpantaNum.sub(1, ExpantaNum.pow(2, player.elementary.theory.depth))).times(-1)))):(player.elementary.theory.active?("Exit The Theoriverse early for no reward."):("进入学说宇宙深度 "+showNum(player.elementary.theory.depth))))
			tmp.el.theoriverse.setTooltip(hasMltMilestone(4)?("弱化：x^"+showNum(tmp.elm.theory.nerf)):("进入学说宇宙时将强制进行一次基本重置，在学说宇宙中所有基本粒子之前的资源获取量变为 (x^"+showNum(tmp.elm.theory.nerf)+")"))
		}
		updateSuperSymetryHTML()
		updateTheoryTreeHTML()
		updateStringsHTML()
		updatePreonsHTML()
		updateAcceleronsHTML()
		updateInfatonsHTML()
	}
}

function updateHadronicChallenges(){
	if (elmTab=="hc") {
		tmp.el.projHadScore.setTxt(showNum(tmp.elm.hc.currScore))
		tmp.el.startHC.setTxt((!(!player.elementary.hc.active))?(canCompleteHC()?"Complete Hadronic Challenge!":"Exit Hadronic Challenge early for no reward"):"Start Hadronic Challenge")
		tmp.el.startHC.setClasses({btn: true, hc: !tmp.elm.hc.mltMode, mlthc: tmp.elm.hc.mltMode})
		tmp.el.bestHadScore.setTxt(showNum(player.elementary.hc.best))
		tmp.el.hadrons.setTxt(showNum(player.elementary.hc.hadrons))
		tmp.el.hadronGain.setTxt(formatGain(player.elementary.hc.hadrons, tmp.elm.hc.hadronGain, "hc"))
		tmp.el.hadronEff.setTxt(showNum(player.elementary.hc.claimed))
		tmp.el.hadronNext.setTxt(showNum(tmp.elm.hc.next))
		tmp.el.hadEffBulk.setTxt(showNum(tmp.elm.hc.hadronBulk))
		tmp.el.hadInterval.setTxt(tmp.elm.hc.hadInterval.lt(1+0.1**(player.options.sf-1))?("每数量级的强子时间间隔："+showNum(tmp.elm.hc.hadInterval.log10().pow(-1))):("强子时间间隔："+showNum(tmp.elm.hc.hadInterval)))
		for (let s=0;s<DYNAMIC_UNLOCK_HC_SELECTORS.length;s++) {
			let name = DYNAMIC_UNLOCK_HC_SELECTORS[s];
			tmp.el["hcSelectorSpan"+name].setDisplay(checkFunc(HC_DATA[name][3]));
		}
		for (let s=0;s<DYNAMIC_RANGE_HC_SELECTORS.length;s++) {
			let name = DYNAMIC_RANGE_HC_SELECTORS[s];
			tmp.el["hcSelector"+name].el.min = checkFunc(HC_DATA[name][1][0])
			tmp.el["hcSelector"+name].el.max = checkFunc(HC_DATA[name][1][1])
		}
		for (let i=0;i<6;i++) {
			let x = ""
			for (let j=0;j<6;j++) x += "难度等级"+(j+1)+"："+STADIUM_DESCS[HC_CHALLS[i]][j]+"。\n\n"
			tmp.el["hcChall"+HC_CHALLS[i]].setTooltip(x)
			tmp.el["hcCurrent"+HC_CHALLS[i]].setTxt("目前: "+showNum(getHCSelector(HC_CHALLS[i])))
			
			x = ""
			for (let j=0;j<6;j++) x += "难度等级"+(j+1)+"："+EXTREME_STADIUM_DATA[HC_EXTREME_CHALLS[i]].descs[j]+"。\n\n"
			tmp.el["hcExtrChall"+HC_EXTREME_CHALLS[i]].setTooltip(x)
			tmp.el["hcCurrent"+HC_EXTREME_CHALLS[i]].setTxt("目前: "+showNum(getHCSelector(HC_EXTREME_CHALLS[i])))
		}
		tmp.el["hcCurrenttv"].setTxt("目前: "+showNum(getHCSelector("tv")))
		tmp.el["hcCurrentstring"].setTxt("目前: "+showNum(getHCSelector("string")))
		tmp.el["hcCurrentde"].setTxt("目前: "+showNum(getHCSelector("de")))
		tmp.el["hcCurrentrfrm"].setTxt("目前: "+showNum(getHCSelector("rfrm")))
		tmp.el.hcPerc.setTxt(player.elementary.hc.active?("已完成 "+showNum(tmp.elm.hc.complPerc.times(100).max(0))+"%"):"")
		let ach198 = tmp.ach[198].has;
		tmp.el.mltHCTabButton.setDisplay(ach198);
		tmp.el.hcSelectorTitlegoal.setTxt("挑战目标 (单位为"+((ach198&&getHCSelector("goalMlt"))?"多宇宙":"宇宙")+")")
	}
}

function updateMainEnergyTabHTML(){
	updateENTabs()
	if (enTab=="mainEN") {
		tmp.el.energyAmt.setTxt(showNum(player.energy))
		tmp.el.energyEff.setTxt(showNum(tmp.hd.enEff))
		tmp.el.energyRefillOnce.setDisplay(!modeActive("hard"))
		tmp.el.energyRefill.setClasses({
			btn: true,
			en: player.canRefill,
			locked: !player.canRefill,
		})
		tmp.el.motive.setTxt(showNum(tmp.hd.motive))
		if(modeActive("reality")){
			document.getElementById("bankedMotive").innerHTML = showNum(player.bankedMotive)
			document.getElementById("bankedMotiveAdd").innerHTML = showNum(tmp.hd.totalMotive.sub(player.bankedMotive))
		}else{
			document.getElementById("bankedMotive").style.display = "none"
		}

		tmp.el.nextMotive.setHTML(tmp.hd.motive.lte(((player.energyUpgs.includes(24)) ? (tmp.hd.enerUpgs ? tmp.hd.enerUpgs[24] : new ExpantaNum(0)) : new ExpantaNum(0)).max(0))?("[剩下 <span class='energy'>"+showNum(player.spentMotive.plus(player.spentMotiveGens).sub(tmp.hd.totalMotive).plus((player.energyUpgs.includes(24)) ? (tmp.hd.enerUpgs ? tmp.hd.enerUpgs[24] : new ExpantaNum(0)) : new ExpantaNum(0)).max(0))+"</span>]"):"")
		for (let i=1;i<=36;i++) {
			let cost = getEnergyUpgCost(i)
			tmp.el["energyUpg"+i].setClasses({
				btn: true,
				bought: player.energyUpgs.includes(i),
				locked: !player.energyUpgs.includes(i)&&tmp.hd.motive.lt(cost),
				en: !player.energyUpgs.includes(i)&&tmp.hd.motive.gte(cost),
				enBox: true,
			})
			tmp.el["energyUpg"+i].setDisplay(isEnergyUpgShown(i))
			tmp.el["energyUpg"+i+"Cost"].setTxt(showNum(cost))
			tmp.el["energyUpg"+i+"Current"].setTxt(showNum(tmp.hd.enerUpgs[i]))
		}
	}
}

function updateGeneratorsHTML(){
	if (enTab=="generator") {
		let plural = player.geners.gt(1)
		tmp.el.geners.setHTML(plural?("共有 <span class='energy'>"+showNum(player.geners)+"</span> 个发生器，"):"发生器")
		tmp.el.genLvl.setTxt(showNum(player.genLvl))
		tmp.el.energyGen.setTxt(showNum(tmp.hd.energyGen))
		tmp.el.energyLim.setTxt(showNum(getEnergyLim()))
		let cost = getGenCost()
		tmp.el.buyGen.setClasses({
			btn: true,
			locked: tmp.hd.motive.lt(cost),
			en: tmp.hd.motive.gte(cost),
			enBox: true,
		})
		tmp.el.genCost.setTxt(showNum(cost))
		tmp.el.superEn.setTxt(showNum(tmp.hd.superEn))
		tmp.el.superEnEff.setTxt(showNum(tmp.hd.superEnEff))
		tmp.el.superEnEff2Div.setDisplay(player.geners.gt(1))
		tmp.el.superEnEff2.setTxt(showNum(tmp.hd.superEnEff2.sub(1).times(100)))
		tmp.el.newGen.setDisplay(player.inf.endorsements.gte(21))
		let cost2 = getNewGenCost()
		tmp.el.newGen.setClasses({
			btn: true,
			locked: tmp.hd.motive.lt(cost2),
			en: tmp.hd.motive.gte(cost2),
			enBox: true,
		})
		tmp.el.newGenCost.setTxt(showNum(cost2))
	}
}

function updateOverallElementaryHTML(){
	if (player.tab == "elementary") {
		updateElementaryMainDisplaysHTML()
		updateFermionsMainHTML()
		updateBosonsMainHTML()
		updateTheoryverseMainHTML()
		updateHadronicChallenges()
		updateQFHTML()
		updateSkyHTML()
	}
}

function updateMiscHTML(){
	tmp.el.ts.setHTML(
		tmp.timeSpeed.eq(1) || nerfActive("noTS") ? "" : "时间速度: " + showNum(tmp.timeSpeed) + " 倍<br>"
	);
	tmp.el.body.changeStyle("background", tmp.bc);
	let root = document.documentElement;
	root.style.setProperty("--plaintxt", player.options.theme == "dark" ? (player.options.fonts!="courier"?"#d9d9d9":"white") : "black");
	root.style.setProperty("--tb", player.options.theme == "dark" ? "#00968f" : "#03fcf0");
	root.style.setProperty("--ach", player.options.theme == "dark" ? "#287d1b" : "#4ceb34");
	root.style.setProperty("--rbt", player.options.theme == "dark" ? "#666666" : "#c9c9c9");
	root.style.setProperty("--threeArrows", player.options.theme == "dark" ? 'url("images/threeArrows2.jpg")' : 'url("images/threeArrows.jpg")');
	root.style.setProperty("--font", '"'+capitalFirst(player.options.fonts)+'"')
	root.style.setProperty("--foamcol", player.options.theme == "dark" ? "#d3e8cc" : "#687364")

	tmp.el.mainContainer.setDisplay(showContainer&&player.tab!="mlt");
	tmp.el.loading.setDisplay(false)
	tmp.el.footer.setDisplay(player.tab == "options");
	tmp.el.newsticker.changeStyle('visibility', player.options.newst?'visible':'hidden');
	tmp.el.hotkeys.setAttr("widetooltip", 
		"R -> 级别重置\n"+
		(modeActive("extreme")?"Shift + C -> 级别降价器重置\n":"")+
		(modeActive("hikers_dream")?"J -> 复原能量\n":"")+
		"T -> 阶层重置\n"+
		(TABBTN_SHOWN.rockets()?"Shift + R -> 火箭重置\n":"")+
		(TABBTN_SHOWN.rockets()?"F -> 火箭燃料重置\n":"")+
		((TABBTN_SHOWN.furnace()&&tmp.fn)?"Shift + F -> 蓝色火焰重置\n":"")+
		(TABBTN_SHOWN.tr()?"U -> 时间反演\n":"")+
		(TABBTN_SHOWN.collapse()?"C -> 坍缩重置\n":"")+
		(TABBTN_SHOWN.pathogens()?"P -> 最大化购买所有病原体升级\n":"")+
		(TABBTN_SHOWN.dc()?"D -> 购买黑暗核心\n":"")+
		((TABBTN_SHOWN.inf() && player.inf.endorsements.gte(10))?"E -> 获得认可\n":"")+
		(INF_TABS.ascension()?"1, 2, 3, 4 -> 切换特权\n":"")+
		(INF_TABS.derivatives()?"Shift + P -> 切换净化\n":"")+
		(INF_TABS.derivatives()?"Shift + D -> 导数变换/提升\n":"")+
		(TABBTN_SHOWN.elementary()?"Shift + E -> 基本重置\n":"")+
		(ELM_TABS.theory()?"Shift + T -> 切换学说宇宙\n":"")+
		(TH_TABS.strings()?"S -> 纠缠弦重置\n":"")+
		(ELM_TABS.sky()?"Shift + S -> 斯格明子重置":"")
	);
}

function updateOverallEnergyHTML(){
	if (player.tab == "energy") {
		updateMainEnergyTabHTML()
		updateGeneratorsHTML()
	}
}

function updateQFHTML() {
	if (elmTab=="foam") {
		if (foamTab=="foamBoosts") {
			for (let b=1;b<=25;b++) {
				tmp.el["qfb"+b].setDisplay(tmp.elm.qf.boostData[b].gt(0))
				tmp.el["qfb"+b+"amt"].setTxt(showNum(tmp.elm.qf.boostData[b])+(((b<5&&tmp.elm.qf.boost5.plus(tmp.elm.qf.boost13).plus(tmp.elm.qf.boost25).gt(0))||(b<13&&tmp.elm.qf.boost13.plus(tmp.elm.qf.boost25).gt(0))||(b<25&&tmp.elm.qf.boost25.gt(0)))?(" + "+showNum(tmp.elm.qf.boost25.plus(b>=13?0:tmp.elm.qf.boost13).plus(b>=5?0:tmp.elm.qf.boost5))):""))
				tmp.el["qfb"+b+"eff"].setTxt(showNum(tmp.elm.qf["boost"+b]))
			}
			tmp.el.ach162span.setDisplay(tmp.ach[162].has)
			tmp.el.ach162eff.setTxt(showNum(getAch162Eff()))
		}
		for (let x=1;x<=5;x++) if (foamTab=="qf1") {
			tmp.el["qf"+x+"Amt"].setTxt(showNum(player.elementary.foam.amounts[x-1]))
			tmp.el["qf"+x+"Gain"].setTxt(formatGain(player.elementary.foam.amounts[x-1], tmp.elm.qf.gain[x], "foam"))
			if (x>1) tmp.el["qf"+x+"Eff"].setTxt(showNum(tmp.elm.qf.eff[x]))
			for (let i=1;i<=3;i++) {
				let cost = getQFBoostCost(x, i)
				tmp.el["qf"+x+"Boost"+i].setClasses({
					btn: true,
					locked: player.elementary.foam.amounts[x-1].lt(cost),
					foam: player.elementary.foam.amounts[x-1].gte(cost),
				})
				tmp.el["qf"+x+"Cost"+i].setTxt(showNum(cost))
				tmp.el["qf"+x+"Bought"+i].setTxt(formatDistance(player.elementary.foam.upgrades[(x-1)*3+(i-1)]))
				tmp.el["qf"+x+"Auto"+i].setDisplay(player.elementary.entropy.bestDepth.gte(x+2)||hasMltMilestone(4))
				tmp.el["qf"+x+"Auto"+i].setTxt("Auto: "+(player.elementary.foam.autoUnl[(x-1)*3+(i-1)]?"ON":"OFF"))
			}
			tmp.el["qf"+x+"NextUnl"].setDisplay(x==5||player.elementary.foam.maxDepth.eq(x))
			let refoamCost = getRefoamCost()
			tmp.el["qf"+x+"NextUnl"].setClasses({
				btn: true,
				locked: player.elementary.foam.amounts[x-1].lt((x==5)?refoamCost:QF_NEXTLAYER_COST[x]),
				foam: player.elementary.foam.amounts[x-1].gte((x==5)?refoamCost:QF_NEXTLAYER_COST[x]),
			})
			tmp.el["qf"+x+"Cost4"].setTxt(showNum((x==5)?refoamCost:QF_NEXTLAYER_COST[x]))

			if (x===1) continue
			const foamRows = document.querySelectorAll(`.qf${x}row`)
			for (const i in foamRows) try { foamRows[i].style.display = player.elementary.foam.maxDepth.gte(x) ? "table-row" : "none" } catch (_) {}
		}
		if (foamTab=="qf1") tmp.el.qf5type.setHTML(player.elementary.foam.maxDepth.gt(5)?("<sup>"+showNum(player.elementary.foam.maxDepth.sub(4))+"</sup>"):"")
		if (foamTab=="entropy") {
			let entGain = tmp.elm.entropy.gain
			tmp.el.entropyReset.setClasses({
				btn: true,
				foam: entGain.gte(1),
				locked: entGain.lt(1),
			})
			tmp.el.entropyGain.setTxt(showNum(entGain))
			tmp.el.entropyNext.setTxt(entGain.lt(1e3)?("到达 "+showNum(getEntropyNext())+" 量子泡沫后可获取下一个熵"):"")
			tmp.el.entropyAmt.setTxt(showNum(player.elementary.entropy.amount))
			tmp.el.entropyBest.setTxt(showNum(player.elementary.entropy.best))
			tmp.el.entropyEff.setTxt(showNum(tmp.elm.entropy.eff))
			tmp.el.omegaParticles.setTxt(showNum(tmp.elm.entropy.omega))
			tmp.el.nextOmega.setTxt(showNum(getNextOmega()))
			tmp.el.omegaEff.setTxt(showNum(tmp.elm.entropy.omegaEff))
			for (let i=1;i<=ENTROPY_UPGS;i++) {
				let cost = getEntropyUpgCost(i)
				tmp.el["entropy"+i].setDisplay(entropyUpgShown(i))
				tmp.el["entropy"+i].setClasses({
					btn: true,
					foamBought: player.elementary.entropy.upgrades.includes(i),
					foam: player.elementary.entropy.amount.gte(cost)&&!player.elementary.entropy.upgrades.includes(i),
					locked: player.elementary.entropy.amount.lt(cost)&&!player.elementary.entropy.upgrades.includes(i),
				})
				tmp.el["entropyCost"+i].setTxt(showNum(cost))
				if (tmp.elm.entropy.upgEff[i]) tmp.el["entropyEff"+i].setTxt(showNum(tmp.elm.entropy.upgEff[i]))
			}
		}
	}
}

function updateSkyHTML() {
	if (elmTab == "sky") {
		let nextFieldReq = SKY_FIELD_UPGS_REQS.reduce(function(a,c) {
			if (player.elementary.sky.amount.lt(a)) return new ExpantaNum(a);
			return ExpantaNum.max(a,c)
		})
		if (skyTab == "skyrmions") {
			let canReset = canSkyReset()
			tmp.el.skyrmionReset.setClasses({
				btn: true,
				locked: !canReset,
				sky: canReset,
			})
			tmp.el.skyrmionGain.setTxt(showNum(canReset?tmp.elm.sky.gain:0))
			tmp.el.skyrmionAmt.setTxt(showNum(player.elementary.sky.amount))
			tmp.el.skyrmionEff.setTxt(showNum(tmp.elm.sky.eff))
			tmp.el.skyrmionEff2.setTxt(showNum(getSkyToPionSpinorGainMult()));
			tmp.el.maxBothFields.setDisplay(tmp.ach[178].has)
		} else if (skyTab == "pions") {
			tmp.el.nextPionUpgs.setTxt(player.elementary.sky.amount.gte(SKY_FIELD_UPGS_REQS[SKY_FIELD_UPGS_REQS.length-1])?"":("到达 "+showNum(nextFieldReq)+" 斯格明子后可解锁更多升级"))
			tmp.el.pionAmt.setTxt(showNum(player.elementary.sky.pions.amount))
			tmp.el.pionGain.setTxt(formatGain(player.elementary.sky.pions.amount, tmp.elm.sky.pionGain, "sky"))
			for (let id=1;id<=SKY_FIELDS.upgs;id++) {
				tmp.el["pionUpg"+id].setClasses({
					hexBtn: true,
					locked: player.elementary.sky.pions.amount.lt(getFieldUpgCost("pions", id)),
				})
				tmp.el["pionUpg"+id].changeStyle("visibility", player.elementary.sky.amount.gte(SKY_FIELDS[id].req)?"visible":"hidden")
			}
			tmp.el.pionData.setHTML(pionSel==0?"":("π介子升级 &"+GREEK_LETTERS[pionSel]+"; ("+showNum(player.elementary.sky.pions.field[pionSel]||0)+")<br>"+SKY_FIELDS[pionSel].pionDesc+"<br>目前： "+SKY_FIELDS[pionSel].desc(tmp.elm.sky.pionEff[pionSel])+"<br>花费： "+showNum(getFieldUpgCost("pions", pionSel))+" π介子"))
			tmp.el.maxPion.setDisplay(player.elementary.entropy.upgrades.includes(20))
		} else if (skyTab == "spinors") {
			tmp.el.nextSpinorUpgs.setTxt(player.elementary.sky.amount.gte(SKY_FIELD_UPGS_REQS[SKY_FIELD_UPGS_REQS.length-1])?"":("到达 "+showNum(nextFieldReq)+" 斯格明子后可解锁更多升级"))
			tmp.el.spinorAmt.setTxt(showNum(player.elementary.sky.spinors.amount))
			tmp.el.spinorGain.setTxt(formatGain(player.elementary.sky.spinors.amount, tmp.elm.sky.spinorGain, "sky"))
			for (let id=1;id<=SKY_FIELDS.upgs;id++) {
				tmp.el["spinorUpg"+id].setClasses({
					hexBtn: true,
					locked: player.elementary.sky.spinors.amount.lt(getFieldUpgCost("spinors", id)),
				})
				tmp.el["spinorUpg"+id].changeStyle("visibility", player.elementary.sky.amount.gte(SKY_FIELDS[id].req)?"visible":"hidden")
			}
			tmp.el.spinorData.setHTML(spinorSel==0?"":("旋量升级 &"+GREEK_LETTERS[spinorSel]+"; ("+showNum(player.elementary.sky.spinors.field[spinorSel]||0)+")<br>"+SKY_FIELDS[spinorSel].spinorDesc+"<br>目前： "+SKY_FIELDS[spinorSel].desc(tmp.elm.sky.spinorEff[spinorSel])+"<br>花费： "+showNum(getFieldUpgCost("spinors", spinorSel))+" 旋量"))
			tmp.el.maxSpinor.setDisplay(player.elementary.entropy.upgrades.includes(20))
		}
	}
}

function updateOverallMultiverseHTML() {
	tmp.el.multiversestabbtn.setDisplay(player.mlt.times.gt(0))
	tmp.el.mltContainer.setDisplay(player.tab=="mlt")
	tmp.el.mltContainer.setClasses({first: player.mlt.times.lte(1)&&player.distance.eq(0)})
	tmp.el.mltReset.setDisplay(tmp.mlt.can&&(!player.options.hideMltBtn||player.mlt.times.eq(0)));
	tmp.el.mltReset.setClasses({ btn: true, locked: !tmp.mlt.can, mlt: tmp.mlt.can });
	if (tmp.mlt.can&&(!player.options.hideMltBtn||player.mlt.times.eq(0))) {
		tmp.el.mltReset.setHTML(
			(player.mlt.times.eq(0)?("您已经穿过了整个多宇宙，您必须继续前进。"):("毁灭多宇宙以产生 <span class='mlttxt'>" +
			showNum(tmp.mlt.layer.gain) +
			"</span> 多元能量。"))
		);
	}
	if (player.tab == "mlt") {
		tmp.el.mltEnergy.setTxt(showNum(player.mlt.energy));
		tmp.el.totalME.setTxt(showNum(player.mlt.totalEnergy));
		tmp.el.mltTimes.setTxt(showNum(player.mlt.times));
		tmp.el.mltReset2.setDisplay(tmp.mlt.can&&player.options.hideMltBtn);
		tmp.el.mltReset2.setClasses({ btn: true, locked: !tmp.mlt.can, mlt: tmp.mlt.can });
		if (tmp.mlt.can&&player.options.hideMltBtn) {
			tmp.el.mltReset2.setHTML(
				(player.mlt.times.eq(0)?("您已经穿过了整个多宇宙，您必须继续前进。"):("毁灭多宇宙以产生 <span class='mlttxt'>" +
				showNum(tmp.mlt.layer.gain) +
				"</span> 多元能量。"))
			);
		}
		
		if (mltTab == "mltMap") {
			for (let m=1;m<=MULTIVERSES;m++) {
				tmp.el["mltmap"+m].setClasses({innerMltOrbit: true, mltComp: player.mlt.highestCompleted>=m})
				tmp.el["mltmap"+m].setDisplay(player.mlt.highestCompleted>=m-1)
			}
			tmp.el.mltData.changeStyle("visibility", mltSelected!="NONE"?"visible":"hidden");
			if (mltSelected!="NONE") {
				tmp.el.mltDataTxt.setHTML(getMltDisplay(mltSelected));
				tmp.el.mltStart.setDisplay(mltUnlocked(mltSelected));
				tmp.el.mltStart.setTxt((player.mlt.active==mltSelected)?"返回此多宇宙":"进入此多宇宙")
				tmp.el.mltUnl.setDisplay(player.mlt.highestUnlocked<mltSelected && mltSelected>0)
				if (player.mlt.highestUnlocked<mltSelected && mltSelected>0) {
					tmp.el.mltUnl.setClasses({btn: true, locked: player.mlt.energy.lt(MLT_DATA[mltSelected].req), mlt: player.mlt.energy.gte(MLT_DATA[mltSelected].req)})
				}
			}
		} else if (mltTab == "mltMilestones") {
			for (let r=1;r<=MLT_MILESTONE_NUM;r++) {
				let has = hasMltMilestone(r);
				for (let i=1;i<=2;i++) tmp.el["mltMil"+r+String(i)].changeStyle("background", has?"rgba(79, 240, 109, 0.4)":"none")
				tmp.el["mltMil"+r+"desc"].setHTML(((modeActive("hikers_dream")&&MLT_MILESTONES[r-1].hdDesc)?MLT_MILESTONES[r-1].hdDesc:((modeActive("extreme")&&MLT_MILESTONES[r-1].extremeDesc)?MLT_MILESTONES[r-1].extremeDesc:MLT_MILESTONES[r-1].desc)));
				if (tmp.el["mltMil"+r+"effDesc"]) tmp.el["mltMil"+r+"effDesc"].setHTML(MLT_MILESTONES[r-1].effectDesc())
			}
		} else if (mltTab == "quilts") {
			for (let i=1;i<=3;i++) {
				tmp.el["quilt"+i+"Strength"].setTxt(showNum(tmp.mlt.quilts[i].strength.times(100)))
				tmp.el["quilt"+i+"Eff"].setTxt(showNum(i==1?tmp.mlt.quilts[i].eff:tmp.mlt.quilts[i].eff.sub(1).times(100)))
				tmp.el["quilt"+i+"Eff2"].setTxt(showNum(tmp.mlt.quilts[i].eff2))
				tmp.el["quiltUpg"+i].setClasses({btn: true, locked: player.mlt.energy.lt(tmp.mlt.quilts[i].upgCost), mlt: player.mlt.energy.gte(tmp.mlt.quilts[i].upgCost)})
				tmp.el["quiltUpg"+i].setHTML("使此项多元织物强化"+showNum(tmp.mlt.quilts[i].upgPow.times(10))+"%<br>Currently: +"+showNum(tmp.mlt.quilts[i].upgEff.times(100))+"%<br>花费："+showNum(tmp.mlt.quilts[i].upgCost)+" 多元能量")
			}
			tmp.el.quilt2Eff2Desc.setTxt(hasMltMilestone(6)?"，π介子，旋量":"")
			tmp.el.quilt3sc.setTxt(tmp.mlt.quilts[3].eff.gte(tmp.mlt.quilts[3].scStart)?"(已达软上限)":"")
		}
	}
}

function updateHTML() {
	updateOptionsHTML()
	updateMainHTML()
	updateRocketsHTML()
	updateAchievementsHTML()
	updateAutomationHTML()
	updateTimeReversalHTML()
	updateCollpaseHTML()
	upadtePathogenHTML()
	updateSoftcapsHTML()
	updateDarkCircleHTML()
	updateAllInfinityHTML()
	updateOverallExtremeModeHTML()
	updateStatisticsHTML()
	updateOverallElementaryHTML()
	updateOverallEnergyHTML()
	updateOverallMultiverseHTML()
	updateMiscHTML()
	
	// Features
	tmp.el.nextFeature.setTxt(tmp.nf === "none" ? "All Features Unlocked!" : tmp.features[tmp.nf].desc);	
}

function updateHTMLPerSec() {
	if (player.tab=="elementary"&&elmTab=="theory") updateTheoryTreeHTMLPerSec()
}