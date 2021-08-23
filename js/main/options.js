function saveOptions() {
	localStorage.setItem("dist-inc-options" + betaID, btoa(JSON.stringify(player.options)));
}

function loadOptions() {
	let optData = localStorage.getItem("dist-inc-options" + betaID)
	if (!optData) return;
	let name = player.options.name;
	player.options = JSON.parse(atob(optData));
	player.options.name = name;
}

function getAllSaves() {
	let local = localStorage.getItem("dist-inc-saves" + betaID)
	let all = JSON.parse(atob(local ? local : btoa(JSON.stringify([]))));
	return all
}

function save(sav=player, force=false) {
	if (!showContainer && !force) return;
	localStorage.setItem("dist-inc" + betaID, btoa(JSON.stringify(ENString(sav))));
	let all = getAllSaves();
	if ((all.includes(null) || all[sav.savePos - 1] === undefined || all[sav.savePos - 1].savePos == sav.savePos) && all.length >= sav.savePos) {
		all[sav.savePos - 1] = ENString(sav);
	} else all.push(ENString(sav));
	localStorage.setItem("dist-inc-saves" + betaID, btoa(JSON.stringify(all)));
	if (document.hasFocus()) notifier.success("游戏已保存！");
}

function setSave(ns, cod=false) {
	saveTimer = 0 // safety thing ;)
	save(cod ? transformToEN(JSON.parse(atob(ns))) : transformToEN(ns));
	reload();
}

function deleteSave(loc) {
	if (!confirm("您确定要删除此存档吗？您将无法恢复此存档！")) return;
	let all = getAllSaves();
	let isCurrent = all[loc].saveID == player.saveID;
	all[loc] = null;
	localStorage.setItem("dist-inc-saves" + betaID, btoa(JSON.stringify(all)));
	if (isCurrent) startModes([]);
	else {
		loads();
		save();
	}
}

function hardReset(force=false) {
	if (!force)
		if (!confirm("您确定要硬重置吗？您将失去目前的所有进度！！！"))
			return;
	let s = transformToEN(DEFAULT_START, DEFAULT_START)
	let all = getAllSaves();
	if (player.options.saveImp=="overwrite" || s.saveID==player.saveID) s.savePos = deepCopy(player.savePos)
	else {
		if (all.indexOf(null) > -1) s.savePos = all.indexOf(null) + 1;
		else s.savePos = all.length + 1;
		if (s.savePos > MAX_SAVES) s.savePos = MAX_SAVES;
	}
	setSave(s);
}

function importSave() {
	let prmpt = prompt("在此处粘贴存档。");
	let sav;
	if (prmpt) {
		try {
			sav = JSON.parse(atob(prmpt));
			notifier.info("存档已导入");
			let s = transformToEN(sav);
			let all = getAllSaves();
			if (player.options.saveImp=="overwrite" || s.saveID==player.saveID) s.savePos = deepCopy(player.savePos)
			else {
				if (all.indexOf(null) > -1) s.savePos = all.indexOf(null) + 1;
				else s.savePos = all.length + 1;
				if (s.savePos > MAX_SAVES) s.savePos = MAX_SAVES;
			}
			setSave(s);
		} catch (e) {
			notifier.error("存档无法识别");
		}
	}
}

function exportSave() {
	let toExport = btoa(JSON.stringify(ENString(player)));
	notifier.info("存档已导出");
	copyToClipboard(toExport);
}

function startModes(modes) {
	let s = transformToEN(DEFAULT_START);
	s.modes = modes;
	if (s.modes.includes("aau")) s.achievements = getAllAchievements();
	let all = getAllSaves();
	if (all.indexOf(null) > -1 && all[all.indexOf(null)] === null) s.savePos = all.indexOf(null) + 1;
	else s.savePos = all.length + 1;
	if (s.savePos > MAX_SAVES) {
		alert("您的存档太多了！您需要先删除任何一个存档才行！");
		return;
	}
	save(s);
	reload();
}

function setDropdown(dropdown, els, load=false, type=0) {
	let html = "";
	for (let i = 0; i < Object.keys(els).length; i++) {
		let el = els[Object.keys(els)[i]];
		if (el.display!==undefined) if (!el.display) continue;
		html += "<br>";
		if (load) {
			html += "<b>" + el.name + "</b><br>";
			html += el.info + "<br>";
			for (let x = 1; x <= el.buttons; x++)
				html +=
					"<button "+((el.display!==undefined)?(" style='display: "+(el.display?"":"none")+"'"):"")+"class='"+(el.classOnLoad?el.classOnLoad:"btn tb opt")+"' onclick='" +
					el["onclick" + x] +
					"' "+">" +
					el["txt" + x] +
					"</button> ";
		} else html += "<button "+((el.display!==undefined)?(" style='display: "+(el.display?"":"none")+"'"):"")+"class='"+(el.classOnLoad?(el.classOnLoad+" tt"):"btn tb opt tt")+"' onclick='" + el.onclick + "'>" + el.txt + "</button>";
		if (load || el.bottomLineBreak) html += "<br><br>";
	}
	dropdown.setHTML(html + "<br><button class='btn tb opt' style='visibility: hidden;'></button>");
}

function changeOpt(name, type) {
	let dropdown = new Element("dropDown");
	if (type != 3 && type != 0)
		dropdown.changeStyle(
			"display",
			dropdown.style.display != "none" && name == ddState ? "none" : "inline-block"
		);
	else dropdown.changeStyle("display", "none");
	let els = {};
	if (type == 0) {
		player.options[name] = !player.options[name]
		saveOptions()
	} else if (type == 1) {
		let max = OPT_CHNG_MAX[name];
		let min = OPT_CHNG_MIN[name];
		for (x = min; x <= max; x++)
			els[x] = {
				txt: x.toString(),
				onclick:
					"player.options[&quot;" +
					name +
					"&quot;] = " +
					x +
					"; this.parentElement.style.display=&quot;none&quot;; saveOptions();"
			};
	} else if (type == 2) {
		let types = OPT_NAMES[name];
		for (x = 0; x < types.length; x++)
			els[types[x]] = {
				txt: capitalFirst(types[x]),
				onclick:
					"player.options[&quot;" +
					name +
					"&quot;] = &quot;" +
					types[x] +
					"&quot;; this.parentElement.style.display=&quot;none&quot;; saveOptions();"
			};
	} else if (type == 3) {
		let old = deepCopy(player.options[name])
		player.options[name] = window.prompt("在此处修改名称(" + name + ")。", player.options[name]);
		if (player.options[name]===null || player.options[name]===undefined) player.options[name] = old
		let d2 = new Element("dropDown2")
		d2.changeStyle("display", "none");
		save();
		saveOptions();
		return;
	} else if (type == 4) {
		let data = TABBTN_SHOWN;
		let types = Object.keys(data);
		els.exit = {
			txt: "EXIT",
			classOnLoad: "btn tb opt redTint",
			bottomLineBreak: true,
			onclick: "this.parentElement.style.display=&quot;none&quot;;",
		}
		for (x = 0; x < types.length; x++) {
			if (HIDE_WHITELIST.includes(types[x])) continue;
			els[types[x]] = {
				txt: FULL_TAB_NAMES[types[x]],
				display: data[types[x]](),
				classOnLoad: "btn tb opt"+(player.options[name].includes(types[x])?" optActive":""),
				onclick: 
					"toggleTabDisplay(&quot;"+types[x]+"&quot;, this); saveOptions();"
			};
		}
	}
	if (type>0) {
		setDropdown(dropdown, els);
		ddState = name;
	}
}

function toggleTabDisplay(x, el) {
	let extensions = el.className.split(" ").filter(x => x != "btn" && x != "tb" && x != "opt" && x != "optActive").join(" ")
	if (extensions.length>0) extensions = " "+extensions
	if (!player.options.tabsHidden.includes(x)) {
		player.options.tabsHidden.push(x)
		el.className = "btn tb opt optActive"+extensions
	} else {
		player.options.tabsHidden.splice(player.options.tabsHidden.indexOf(x), 1);
		el.className = "btn tb opt"+extensions
	}
}

function getInfo(sav) {
	let mds = "";
	if (sav.modes.length > 1) mds = sav.modes.reduce((x, y) => capitalFirst(x) + "，" + capitalFirst(y));
	else if (sav.modes.length > 0) mds = capitalFirst(sav.modes[0].replace("_"," "));
	else mds = "无";
	mds = mds.replace("Hard","困难");
	mds = mds.replace("Aau","全成就");
	mds = mds.replace("Na","无成就");
	mds = mds.replace("Absurd","荒诞");
	mds = mds.replace("Easy","容易");
	mds = mds.replace("Extreme","极限");
	mds = mds.replace("Hikers Dream","旅人之梦");
	mds = mds.replace("Hikers_dream","旅人之梦");
	let info = "模式: " + mds + "<br>";
	if (sav.mlt?(sav.mlt.times?ExpantaNum.gt(sav.mlt.times, 0):false):false) {
		info += "多元能量："+showNum(new ExpantaNum(sav.mlt.totalEnergy))+" ，独特多宇宙通过次数： "+(sav.mlt.highestCompleted+1)+" ，多元织物升级： "+showNum(new ExpantaNum(sav.mlt.quiltUpgs.reduce((a,c) => ExpantaNum.add(a,c))))+" ， "
	} else if (sav.elementary?(sav.elementary.sky?sav.elementary.sky.unl:false):false) {
		info += "斯格明子: "+showNum(new ExpantaNum(sav.elementary.sky.amount))+" ，π介子： "+showNum(new ExpantaNum(sav.elementary.sky.pions.amount))+" ，旋量： "+showNum(new ExpantaNum(sav.elementary.sky.spinors.amount))+" ， "
	} else if (sav.elementary?(sav.elementary.foam?sav.elementary.foam.unl:false):false) {
		info += "量子泡沫： "+showNum(new ExpantaNum(sav.elementary.foam.amounts[0]))+" ， "
		if (sav.elementary.entropy?sav.elementary.entropy.unl:false) {
			info += "熵： "+showNum(new ExpantaNum(sav.elementary.entropy.amount))+" ， "
		}
	} else if (sav.elementary?(sav.elementary.hc?sav.elementary.hc.unl:false):false) {
		info += "最高强子分数： "+showNum(new ExpantaNum(sav.elementary.hc.best))+" ，强子： "+showNum(new ExpantaNum(sav.elementary.hc.hadrons))+" ， "
	} else if (sav.elementary?(sav.elementary.theory?sav.elementary.theory.unl:false):false) {
		info += "学说点数： "+showNum(new ExpantaNum(sav.elementary.theory.points))+" ，学说宇宙深度： "+showNum(new ExpantaNum(sav.elementary.theory.depth))+" ， "
	} else if (sav.elementary?new ExpantaNum(sav.elementary.times).gt(0):false)
		info += "基本重置次数： "+showNum(new ExpantaNum(sav.elementary.times))+" ，费米子： "+showNum(new ExpantaNum(sav.elementary.fermions.amount))+" ，玻色子： "+showNum(new ExpantaNum(sav.elementary.bosons.amount))+" ， "
	else if (sav.inf.derivatives.unl)
		info += "导数变换/提升： " + showNum(new ExpantaNum(sav.inf.derivatives.unlocks)) + " ， ";
	else if (new ExpantaNum(sav.inf.endorsements).gte(21))
		info +=
			"幽冥宝石总量： " +
			showNum(
				new ExpantaNum(sav.inf.pantheon.gems).plus(sav.inf.pantheon.angels).plus(sav.inf.pantheon.demons)
			) +
			" ， ";
	else if (new ExpantaNum(sav.inf.endorsements).gte(15))
		info += "竞技场挑战完成数量： " + sav.inf.stadium.completions.length + " ， ";
	else if (new ExpantaNum(sav.inf.endorsements).gte(10)) {
		let enl = new ExpantaNum(0);
		for (let i = 0; i < sav.inf.ascension.enlightenments.length; i++)
			enl = enl.plus(sav.inf.ascension.enlightenments[i]);
		info +=
			"飞升能量： " +
			showNum(new ExpantaNum(sav.inf.ascension.power)) +
			" ，启迪总量： " +
			showNum(enl) +
			" ， ";
	} else if (sav.inf.unl)
		info +=
			"知识： " +
			showNum(new ExpantaNum(sav.inf.knowledge)) +
			" ，认可： " +
			showNum(new ExpantaNum(sav.inf.endorsements)) +
			" ， ";
	else if (sav.dc.unl) info += "黑暗核心： " + showNum(new ExpantaNum(sav.dc.cores)) + " ， ";
	else if (sav.pathogens.unl) info += "病原体： " + showNum(new ExpantaNum(sav.pathogens.amount)) + " ， ";
	else if (sav.collapse.unl)
		info +=
			"残骸： " +
			showNum(new ExpantaNum(sav.collapse.cadavers)) +
			" ，生命精华： " +
			showNum(new ExpantaNum(sav.collapse.lifeEssence)) +
			" ， ";
	else if (sav.tr.unl) info += "时间方盒： " + showNum(new ExpantaNum(sav.tr.cubes)) + " ， ";
	else if (sav.automation.unl)
		info +=
			"碎屑： " +
			showNum(new ExpantaNum(sav.automation.scraps)) +
			" ，智慧： " +
			showNum(new ExpantaNum(sav.automation.intelligence)) +
			" ， ";
	else if (new ExpantaNum(sav.rf).gt(0)) {
		if (sav.modes.includes("extreme"))
			info +=
				"煤： " +
				showNum(new ExpantaNum(sav.furnace.coal)) +
				" ，蓝色火焰： " +
				showNum(new ExpantaNum(sav.furnace.blueFlame)) +
				" ， ";
		else info += "火箭燃料： " + showNum(new ExpantaNum(sav.rf)) + " ， ";
	} else if (new ExpantaNum(sav.rockets).gt(0)) info += "火箭： " + showNum(new ExpantaNum(sav.rockets)) + " ， ";
	else {
		info += "阶层 " + showNum(new ExpantaNum(sav.tier)) + " ， ";
		if (sav.modes.includes("extreme"))
			info += "级别降价器 " + showNum(new ExpantaNum(sav.rankCheap || 0)) + " ， ";
		info += "级别 " + showNum(new ExpantaNum(sav.rank)) + " ， ";
	}
	info += "距离： " + formatDistance(new ExpantaNum(sav.distance), sav.mlt?(sav.mlt.times?ExpantaNum.lt(sav.mlt.times, 1):true):true);
	return info;
}

function loads() {
	let all = getAllSaves();
	let dropdown = new Element("dropDown2");
	dropdown.changeStyle("display", dropdown.style.display == "block" ? "none" : "block");
	let els = {};
	for (let x = 0; x < all.length; x++) {
		if (all[x] === undefined || all[x] === null) continue;
		let active = player.saveID == all[x].saveID && player.savePos == all[x].savePos;
		let name =
			all[x].options.name == "Save #"
				? "存档 #" + (all[x].savePos ? all[x].savePos : "???")
				: all[x].options.name;
		els[x] = {
			name: name + (active ? " (使用中)" : ""),
			info: getInfo(all[x]),
			onclick1: "setSave(&quot;" + btoa(JSON.stringify(all[x])) + "&quot;, true)",
			txt1: "Load",
			onclick2: "deleteSave(" + x + ")",
			txt2: "Delete",
			buttons: 2
		};
	}
	setDropdown(dropdown, els, true);
}

function exportAll() {
	save()
	let all = getAllSaves();
	copyToClipboard(btoa(JSON.stringify(all)));
	notifier.info("所有存档已导出");
}

function importAll() {
	let input = prompt("在此处粘贴存档。");
	if (input) {
		if (!confirm("您确定要导入全部存档吗？目前游戏中的所有存档都将被覆盖！")) return
		try {
			saves = JSON.parse(atob(input));
			notifier.info("存档已导入");
			localStorage.setItem("dist-inc-saves"+betaID, input)
			let s = transformToEN(saves[saves.findIndex(x => x!=null)]);
			setSave(s);
		} catch (e) {
			notifier.error("存档无法识别");
		}
	}
}

function selectMode(name) {
	if (modesSelected.includes(name)) {
		modesSelected = modesSelected.filter(x => x != name);
		if (MODES[name].dis)
			MODES[name].dis.map(x =>
				(function () {
					if (modesSelected.includes(x)) modesSelected = modesSelected.filter(n => n != x);
				})()
			);
	} else {
		modesSelected.push(name);
		if (MODES[name].ext)
			MODES[name].ext.map(x =>
				(function () {
					if (!modesSelected.includes(x)) modesSelected.push(x);
				})()
			);
	}
}

function confirmModes() {
	if (modesSelected.length == 0) startModes([]);
	else if (modesSelected.length == 1) {
		let modeData = MODEBALANCES[modesSelected[0]];
		if (modeData) {
			if (modeData.balanceCheck)
				if (!confirm("This mode is " + modeData.balancing + ". Are you sure you want to enter this run?"))
					return;
		} else if (!confirm("您选择了一个平衡情况未知的模式。您确定要选择此模式开始游戏吗？")) return;
		startModes(modesSelected);
	} else if (modesSelected.length == 2) startModes(modesSelected);
	else {
		let modeData = MODEBALANCES[calcModeAndBalanceName(modesSelected).balanceName]
		if (modeData) {
			if (modeData.balanceCheck) {
				if (!confirm("This mode combination is " + modeData.balancing + ". Are you sure you want to enter this run?"))
					return;
			}
		} else if (
			!confirm(
				"您选择了一个平衡情况未知的模式组合。您确定要选择此模式组合开始游戏吗？"
			)
		)
			return;
		startModes(modesSelected);
	}
}

function modeActive(name) {
	if (name[0] == "!") return !modeActive(name.slice(1))
	if (name.includes("-")) {
		let m = name.split("-")
		for (let i = 0; i < m.length; i++) {
			let active = modeActive(m[i])
			if (i==0) {
				if (!active) return false;
			} else if (active) return false;
		}
		return true;
	} else if (name.includes("+")) {
		let l = name.split("+")
		for (let i = 0; i < l.length; i++) {
			if (!modeActive(l[i])) return false
		}
		return true;
	} else return player.modes.includes(name);
}

function setupModeComboTable() {
	let data = MODE_TABLE_DATA;
	let el = new Element("modeComboTable");
	let html = "<div class='flexRow'>"
	for (let i=-1;i<data.top.length;i++) {
		if (i==-1) html += "<div class='rtRewardMini'></div>";
		else html += "<div class='rtRewardMini'>"+data.top[i][1]+"</div>";
	}
	html += "</div>"
	for (let r=0;r<data.left.length;r++) {
		html += "<div class='flexRow'>";
		for (let c=-1;c<data.top.length;c++) {
			let rc = c;
			c = Math.max(c, 0);
			let o = data.left[r][0].concat(data.top[c][0]);
			let nameData = calcModeAndBalanceName(o);
			let id = nameData.balanceName;
			let name = nameData.modeName;
			
			html += "<div class='rtRewardMini'>";
			if (rc==-1) html += name;
			else html += "<button id='"+id+"modeCombo' class='btn tb' style='height: 40px; width: 80px;' onclick='modesSelected = "+JSON.stringify(o)+"'>Activate</button>"
			html += "</div>"
			c = rc;
		}
		html += "</div>"
	}
	
	el.addHTML(html);
}

function getCompletedModeCombos() {
	let data = MODEBALANCES;
	let toRet = [];
	let all = getAllSaves();
	for (let x=0;x<all.length;x++) {
		let p = all[x];
		if (p==null) continue;
		let m = p.modes;
		let id = calcModeAndBalanceName(m).balanceName;
		
		if (MODEBALANCES[id].balancing=="balanced up to first multiverse" && ExpantaNum.gte(p.bestDistance, DISTANCES.多宇宙) && p.achievements.length>=136) toRet.push(m);
		else if (ExpantaNum.gte(p.bestDistance, ExpantaNum.pow(DISTANCES.多宇宙, 1e3)) && p.achievements.length>=152) toRet.push(m);
	}
	return toRet;
}