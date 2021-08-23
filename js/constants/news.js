var eheheTimes = 0;
var eheheResetAmt = 0;
var eheheResetReq = 1000;
var ehehe = function() { 
	eheheTimes+=eheheResetAmt+1;
	if (eheheTimes>=eheheResetReq) return '啊哈哈 '+eheheTimes+'：将冒号后的所有内容复制到控制台并回车可以进行啊哈哈转生：console.log(ehehePrestige())'
	else return '啊哈哈 '+eheheTimes+'：将冒号后的所有内容复制到控制台并回车：console.log(ehehe())' 
}
var ehehePrestige = function() {
	if (eheheTimes<eheheResetReq) return "啊哈哈不足，您还需要 "+eheheResetReq+" 啊哈哈";
	else {
		eheheTimes = 0
		eheheResetReq = Math.round(eheheResetReq*1.2);
		eheheResetAmt++;
		return "啊哈哈转生点数："+eheheResetAmt+"，可使啊哈哈获取量变为 "+(eheheResetAmt+1)+" 倍(将冒号后的所有内容复制到控制台并回车：console.log(ehehe()))"
	}
}
const NEWS_DATA = {
	// No Conditions
	m1: ["欢迎来到最真实的旅行。"],
	m2: ["滚动新闻委员会向您问好。"],
	m3: ["从此处加速冲向宇宙终点。"],
	m4: ["最大速度真的是多宇宙的祸害。"],
	m5: ["毒瘤(Cancer)记数法目前被拒之门外……"],
	m6: ["试试看能不能不靠成就玩到最后"],
	m7: ["您至少在旅途中碾过了1只蜗牛"],
	m8: ["如果您想要被诅咒的话，试试工程记数法"],
	m9: ["这里没有真正的无限"],
	m10: ["试试二进制记数法吧！"],
	m11: ["超-5运算啥的完全是给弱者们玩的"],
	m12: ["如果您看到了这条新闻，说明您已经正式成为了加拿大人"],
	m13: ["5光时后升级就到"],
	m14: ["您应该试试荒诞模式，很好玩的"],
	m15: ["永不弃尔，永不负尔 —— 艾克·瑞斯里"],
	m16: ["据报道，有一位男子以超高速火影跑冲向了51区，但是他迟到了5个月"],
	m17: ["本游戏灵感来自Hevipelle的反物质维度(以及它的各种MOD，特别是NG+++)"],
	m18: ["离线进度的效果很不理想，但这是故意的，因为我们不想你走 :("],
	m19: ["有人说这游戏一点也不平衡，或许只是其他游戏太平衡了。"],
	m20: ["神秘的病毒——旧亚病毒引起的疫情已经平息了(至少目前如此)"],
	m21: ["既要重来，何故前行？"],
	m22: ["至高神正在俯视着你(也可能是仰视，您可能走得比我想象中要远)"],
	m23: ["如果我没弄错的话，目前的日期是"+new Date().toISOString().substring(0, 10)+"。"],
	m24: ["下个机制是蛋"],
	m25: ["游戏卡了？不不，是你的眼睛瞪太大了。"],
	m26: ["请不要关闭滚动新闻，不然谁也听不到我的声音了……"],
	m27: ["现在开始用OmegaNum了，这说明我们成序数了。"],
	m28: ["前方就有一个时间墙，我感觉到了。"],
	m29: ["糟糕的测试"],
	m30: ["点击<a href='https://www.youtube.com/watch?v=lXMskKTw3Bc' style='color: grey;'>此处</a>可以解锁一些特别的东西……"],
	m31: ['“您能给这些也整一个滚动新闻吗？” —— 树类游戏的创始者'],
	m32: ['“你喜欢爵士乐吗” —— 蜂蜂蜂'],
	m33: ["记得经常导出存档！"],
	m34: ["真的挺好奇，您到底是用什么东西来走这么远的"],
	m35: ["突发新闻：佛罗里达一男子出门慢跑，竟成了全能宇宙的至高神"],
	m36: ["滚动新闻当然不是从什么其他地方扒过来的……"],
	m37: ["这并不是第69条滚动新闻"],
	m38: ["如果您看到了载入界面，您应该也能发现，太有创意了，对吧。"],
	m39: ["如果您正在看这条新闻，快回去玩你的吧"],
	m40: ["有一条滚动新闻很显然只是想玩瑞克摇摆的梗。到目前为止只有1人上当。"],
	m41: ["您想要上天堂，但神却说<span class='sc'>(已达软上限)</span>"],
	m42: ["软上限：游戏具现"],
	m43: ['“五周目游戏真的是太有趣了” —— 准备跑路的Ink'],
	m44: ['“玩吧。” —— 丹尼·德维托'],
	m45: ['“我要求加工资” —— Ink在某游戏中浪费人生后如是说'],
	m46: ["获胜者是，莱昂纳多·迪卡普里奥"],
	m47: ['“有内鬼，取消交易！” —— 刘德华'],
	m48: ['“有内鬼，取消交谊！” —— 刘德华'],
	m49: ['“友内诡，取消交谊！” —— 华德刘'],
	m50: ['“说笑，说笑” —— 经过5小时以后，Jacorb如是说'],
	m51: ["距离增量最新的机制可不是纯搬运过来的，或者说，你有证据吗"],
	m52: ["我应该在Hevipelle之前先做一个反物质维度的MOD，然后把现实重置弄出来……"],
	m53: ["或许您还没意识到，自己其实是奥特曼(划掉)"],
	m54: ["卡比都比你快"],
	m55: ["快捷键是最新的时尚潮流"],
	m56: ["老妈，快过来看！我上新闻了！"],
	m57: ["做这个能有工资拿吗？"],
	m58: ['“你凝视着滚动新闻时，滚动新闻也在凝视着你” —— 某个在玩反物质维度的家伙'],
	m59: ["阿祖，投降吧，外面全是警察。"],
	m60: ["点击<a href='https://www.youtube.com/watch?v=xfr64zoBTAQ' style='color: grey;'>此处</a>后可以额外前进1毫米，就这样……"],
	m61: ['“等等……所有一切都已达软上限了？”“一直都是。”*枪声响了，枪手是(已达软上限)*'],
	m62: ["点击<a href='#' onclick='return false;'>此处</a>不会发生任何事"],
	m63: ["由于最近的新闻过多，我们决定将滚动新闻设为<span class='sc'>(已达软上限)</span>"],
	m64: ['“不知道我的学识能不能跟得上版本的变化” —— CRG'],
	m65: ["此消息(已达软上限)所以您无法回"],
	m66: ["是不是也该在现实生活中多出去走走？当然只是建议而已……"],
	m67: ['“工程师们入侵了距离增量的世界，并研发了他们专属的记数法！趁现在还来得及，快跑啊！” —— 一名科学家'],
	m68: ['“我听说荒诞模式挺有趣的，之后会试试的” —— 某个刚打通了普通模式的萌新'],
	m69: ['“非常好，完美。” —— 某个写下第69条滚动新闻的家伙'],
	m70: ["软上限您是！"],
	m71: ['“荒诞模式蠢到家了。” —— 某个Reddit玩家'],
	m72: ['我还在寻找一些数值膨胀，结果突然听到了一个平静得可怕的声音：“已达软上限”'],
	m73: ["1星差评：蛋不是下个机制"],
	m74: ["5分钟以内蛋升级就裂开了"],
	m75: ["泡沫真的存在吗？"],
	m76: ["滚动新闻中至少有两条瑞克摇摆相关的……您能把它们全找出来吗？？？"],
	m77: ["&quot;是Siivagunner，不是Silvagunner&quot; —— 某人曾表示他已经放弃了"],
	m78: ["突发新闻：佛罗里达一男子在看到一条滚动新闻表示他正式成为加拿大人以后，竟然开始说起了法语"],
	m79: ["我得继续添加滚动新闻的内容，给一些点子吧"],
	m80: ["Jacorb式的平衡现在是挺受欢迎，但10年后，增量游戏都是只需要3分钟就能通关了。"],
	m81: ["或许这是个元笑话。或许这只是一个厌倦的游戏开发者没有更好的点子了。谁知道是哪个呢！"],
	m82: ["本游戏作者为Jacorb，一个增量游戏开发者，他从来都不知道自己到底在干啥"],
	m83: ["在另一个宇宙中，所有的(已达软上限)都被替换成了(已模糊)，折算没有具体名字，而且距离增量的时间墙是按周来算的。"],
	m84: ["我挺怀疑您能不能逃离多宇宙……"],
	m85: ['“该死，我的学识得完全推翻重来了，因为我们根本不懂多宇宙之后的那玩意是啥意思！” —— CRG'],
	m86: ['“加拿大并不存在……” —— 祂'],
	m87: ["Jacorb搞出旅人之梦模式的原因是他从不锻炼。"],
	m88: ["您可能注意到了，游戏中有一个捐赠按钮。如果您之前没有，现在也应该注意到了！"],
	m89: ["就所有表示您是加拿大的滚动新闻而言：是也好，不是也好，只希望您享受游戏的乐趣。"],
	m90: ["到了2073年，我们的版本号将变成v193.6，拥有超过200层重置，并且游戏将以20.00美元的售价出售"],
	m91: ["是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上是的，但事实上 -无限循环-"],
	m92: ["点击<a href='#' onclick=&quot;console.log(ehehe())&quot;>此处</a>后打开控制台看看……"],
	m93: ["你好啊，凡人。我穿越时间到此，是为了告诉你这游戏两天后就凉了……等等，我好像来早了？"],
	m94: ['“如果我给一只猫设置了它的微信头像，再拍了拍它，这到底能不能算拍了拍它？” —— 某位萌新'],
	m95: ['“海胆，麦芽？接下来还有啥？奶油派吗？” - 某个吃货'],
	m96: ["Jacorb发现这游戏居然是2020年5月1日发布的。记好这个时间，Kahoot上可能也会看到这个游戏的！"],
	m97: ["提醒：提醒：提醒：提醒：提醒：提醒：提醒：提————行了，去小黑屋待着吧你 :)"],
	m98: ["悖论 101：这句话是假话。"],
	m99: ["悖论 201：后半句话是假话，前半句话是真话。"],
	m100: ["悖论 301：下一句话是假话。下一句话是假话。第一句话是假话。"],
	m101: ["Jacorb的精神越来越不安定了。如果他的不安定值达到了100%，那么多宇宙就炸了。"],
	m102: ["这个游戏的作者会弃坑吗？"+((Math.random()>0.5)?"当然会的。":"绝对不会。")],
	m103: ['“彩蛋升级得等到啥时候？” —— The Almighty Orb对于他自己的游戏如是说'],
	m104: ["我们很庆幸我们的宇宙未受感染，我很肯定在某些平行多宇宙中情况可不太妙……"],
	m105: ["有人表示多宇宙中是没有至高神的。他们大概活不过三集。"],
	m106: ["有人表示至高神只有那么几位而已。他们大概活不过三集。"],

	//现实
	cr1: [
		"这是真的吗",
		function () {
			return player.modes.includes("reality")
		}
	],
	cr2: [
		"光速是299792458m/s...你应该发现了速度在光速的时候有个软上限.真实mod独有.",
		function () {
			return player.modes.includes("reality") && player.distance.gte(299792458)
		}
	],
	cr3: [
		"超越光速。-faster than light--------------------(reality-softcapped)",
		function () {
			return player.modes.includes("reality") && player.distance.gte(299792458)
		}
	],
	cr4: [
		"又一个毫无创意的软上限。也不知道现实mod的作者怎么想的。",
		function () {
			return player.modes.includes("reality") && player.collapse.unl
		}
	],
	cr5: [
		"不真实的是，你为何能在宇宙塌缩里活下来？",
		function () {
			return player.modes.includes("reality") && player.collapse.unl
		}
	],
	cr6: [
		"看，我们就快飞到那了！(已达软上限)",
		function () {
			return player.modes.includes("reality") && player.rockets.unl
		}
	],
	cr7: [
		"现实mod的作者是QwQe308(QwQ,qq317495334...我又习惯性输成某大佬的qq1010903229了)",
		function () {
			return player.modes.includes("reality")
		}
	],
	r1: ["您想要(已达软上限)，但神却说<span class='sc'>(已达极端软上限)</span>"],
	r2: ["您想要(已达极端软上限)，但神却说<span class='sc'>(已达硬上限)</span>"],
	r3: ["您想要(已达硬上限)，但神却说<span class='sc'>(undefined)</span>"],
	r4: ["您想要...能不写这个了不..."],
	r5: ["悖论 404：NOT FOUND"],
	r6: ["软上限是什么？通俗一点讲，1+1=1.1"],

	// Distance-based Conditions
	d1: [
		"您比我今天走得更远",
		function () {
			return player.distance.gte(500);
		}
	],
	d2: [
		"世界磅礴走泥丸",
		function () {
			return player.distance.gte(DISTANCES.光年);
		}
	],
	d3: [
		"我看宇宙是有很多个了",
		function () {
			return player.distance.gte(DISTANCES.宇宙);
		}
	],
	d4: [
		"飞向宇宙，浩瀚无限！",
		function () {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, Number.MAX_VALUE));
		}
	],
	d5: [
		"您真的是个一心一意的着迷者",
		function () {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, "1e100000"));
		}
	],
	d6: [
		"别再刷了，不然不出5个小时您就要抓狂了！",
		function () {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, "1e2000000"));
		}
	],
	d7: [
		"宇宙听起来有点像某种转生货币",
		function () {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, 5));
		}
	],
	d8: [
		"欢迎来到泡沫俱乐部……",
		function() {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, "1e42000000"));
		}
	],
	d9: [
		"嘿呀。您最近很忙啊，嗯？所以，我有一个问题要问你。你是否觉得即使是最糟糕的人也能够改变？所有人都可以成为好人，只要他们肯去尝试？嘿嘿嘿嘿……好吧。那么，我有个更好的问题。你想经历一段糟糕的时光吗？不要再向前迈进半步了……否则接下来会发生的事，你可绝对不会喜欢。好吧，抱歉了，老女士。这就是我从不作承诺的原因。",
		function() {
			return player.distance.gte(ExpantaNum.mul(DISTANCES.宇宙, "1e108000000"));
		}
	],
	d10: [
		"多宇宙都满足不了你了，对吗？",
		function() { return player.distance.gte(DISTANCES.多宇宙) },
	],

	// Mode-based Conditions
	mod1: [
		"您怎么会这么对自己的？？",
		function () {
			return player.modes.includes("hard");
		}
	],
	mod2: [
		"老兄，不用再刷成就了",
		function () {
			return player.modes.includes("aau");
		}
	],
	mod3: [
		"这模式无聊到爆了……",
		function () {
			return player.modes.includes("na");
		}
	],
	mod4: [
		"这不合法！您怎敢这样对游戏！",
		function () {
			return player.modes.includes("easy");
		}
	],
	mod5: [
		"任你翱翔任你翱翔任你翱翔任你翱翔任你翱翔",
		function () {
			return player.modes.includes("extreme");
		}
	],
	mod6: [
		"您怎么可能读到这段话的？",
		function () {
			return player.modes.includes("absurd");
		}
	],
	mod7: [
		"如果您真的是旅人，那么就开始旅行吧。",
		function () {
			return player.modes.includes("hikers_dream")
		}
	],
	mod8: [
		"旅人之梦制作者为~reda~(如果这模式中任何东西让您抓狂了，请找他算帐)",
		function () {
			return player.modes.includes("hikers_dream")
		}
	],

	// Chance-based Conditions
	c1: [
		"这条滚动新闻很稀有！您的运气不错哦！",
		function () {
			return Math.random() < 0.25;
		}
	],
	c2: [
		"这条滚动新闻非常稀有！您的运气真的很好……",
		function () {
			return Math.random() < 0.1;
		}
	],
	c3: [
		"这条滚动新闻极其稀有！您的运气真的好到爆啦！",
		function () {
			return Math.random() < 0.0025;
		}
	],
	c4: [
		"任你千算万算,不及我豪运一半",
		function () {
			return Math.random() < 1e-9;
		}
	],
	c5: [
		"您的运气已经可以毁灭宇宙了",
		function () {
			return Math.random() < 1e-15;
		}
	],
	c6: [
		"您的运气已经毁灭了多宇宙以及其中的所有一切",
		function() {
			return Math.random() < 1e-30;
		}
	],
	c7: [
		"即使您每个普朗克时间看1条滚动新闻，经过宇宙年龄的时间，都看不到这条新闻",
		function() {
			return Math.random() < 1e-80;
		}
	],

	// Achievement-based Conditions
	a1: [
		"您是这个假光世界的超级明星",
		function () {
			return player.achievements.length >= 5;
		}
	],
	a2: [
		"哇哦，您有点投入啊",
		function () {
			return player.achievements.length >= 10;
		}
	],
	a3: [
		"前往火箭以外的世界",
		function () {
			return player.achievements.length >= 20;
		}
	],
	a4: [
		"补充燃料，弹指间就是一辈子",
		function () {
			return player.achievements.length >= 30;
		}
	],
	a5: [
		"从2116年开始时间反演",
		function () {
			return player.achievements.length >= 40;
		}
	],
	a6: [
		"死亡即是新生",
		function () {
			return player.achievements.length >= 50;
		}
	],
	a7: [
		"很好",
		function () {
			return player.achievements.length == 69;
		}
	],
	a8: [
		"选项中没有Discord频道。请别找了……",
		function () {
			return player.achievements.length >= 80;
		}
	],
	a9: [
		"有能耐你就在荒诞模式玩到这啊",
		function () {
			return player.achievements.length >= 96 && !player.modes.includes("absurd");
		}
	],
	a10: [
		"对不起您真的有能耐",
		function () {
			return player.achievements.length >= 96 && player.modes.includes("absurd");
		}
	],

	// Special Conditions
	s1: [
		"Patcail认为是Jacorb拿走了他的坍缩点子。但如果真这么做了，那Patcail恐怕就得把他的游戏名字改成序数维度了。 —— NiceManKSP",
		function () {
			return player.collapse.unl;
		}
	],
	s2: [
		"病原体更像是旧亚病毒",
		function () {
			return player.pathogens.unl;
		}
	],
	s3: [
		"宇宙很安静，但不久病原体国就打过来了。",
		function () {
			return player.elementary.times.gt(0);
		}
	],
	s4: [
		"轻子听着像是什么软饮料的名字 —— Mark's Rival's Rival",
		function () {
			return player.elementary.times.gt(0);
		}
	],
	s5: [
		"玻色子会让你的眼珠子都惊掉",
		function () {
			return player.elementary.times.gt(0);
		}
	],
	s6: [
		"滚动新闻委员会注意到您开始行动了。他们目前完全不虚。",
		function () {
			return player.inf.endorsements.gt(0);
		}
	],
	s7: [
		"我们比Aarex先弄出了希格斯升级！耶！",
		function () {
			return player.elementary.times.gt(0);
		}
	],
	s8: [
		"我们不是早就在用这些了吗？",
		function () {
			return player.rockets.gt(0);
		}
	],
	s9: [
		"该刷点基本重置次数了！",
		function () {
			return player.elementary.times.gte(3);
		}
	],
	s10: [
		"NASA已经负担不起您的花费了。",
		function () {
			return player.tr.cubes.gt(0);
		}
	],
	s11: [
		'“游戏评分1/5 没有机器人机器人” —— 某个解锁了自动机器人的家伙',
		function () {
			return player.automators["robots"]
		}
	],
	s12: [
		'“前往基本，永不停息！” —— 到达e600k宇宙的Buzz',
		function () {
			return player.distance.gte("1e600027")
		}
	],
	s13: [
		'“我想要万神殿提升” —— 某个打通了游戏却还没看到万神殿提升的人',
		function () {
			return player.inf.pantheon.unl
		}
	],
	s14: [
		"加加加加速度哪去了？",
		function () {
			return player.inf.derivatives.unl
		},
	],
	s15: [
		"加速子是你最大的致命伤",
		function () {
			return player.elementary.theory.accelerons.unl
		},
	],
	s16: [
		"本来这个游戏的评级是pg-3的，但由于有了残骸的存在，只好变成18+了",
		function () {
			return player.collapse.cadavers.gt(0)
		},
	],
	s17: [
		"您真的达到了光速！",
		function () {
			return player.bestV.gte(299792458)
		},
	],
	s18: [
		"物理学已经阻止不了您了！",
		function () {
			return player.bestV.gte(299792458*1.1)
		},
	],
	s19: [
		'“复制品哪去了？” —— 解锁了前子的NG+++爱好者',
		function () {
			return player.elementary.theory.preons.unl
		}
	],
	s20: [
		"对抗现实是重罪。",
		function () {
			return player.inf.pantheon.purge.active && !player.inf.stadium.current=="reality"
		}
	],
	s21: [
		'“救命啊” —— 明白残骸实际上是指什么东西的人们',
		function () {
			return player.collapse.cadavers.gt(0)
		}
	],
	s22: [
		"等等，已经有叫序数维度的游戏了？",
		function () {
			return player.collapse.unl;
		}
	],
	s23: [
		"泡沫是存在的！",
		function() { return player.elementary.foam.unl },
	],
	s24: [
		"是时候重构太初泡沫了。",
		function() { return player.elementary.foam.maxDepth.gte(5) },
	],
	s25: [
		"熵是时间之矢，引领您前往未来(希望它不会将您带到太未来的地方)",
		function() { return player.elementary.entropy.unl },
	],
	s26: [
		"我看，是时候将费米子转换为斯格明子了！",
		function() { return player.elementary.sky.unl },
	],
	s27: [
		"这游戏跟Aarex无关，没有基本粒子的滚动新闻……",
		function() { return player.elementary.particles.gt(0) },
	],
	s28: [
		"信不信随您，本游戏唯一随机的地方就是滚动新闻。",
		function() { return player.distance.gte(1e86)&&player.distance.lte("1e10000") },
	],
	s29: [
		"当您刚好达到多宇宙的终点时这条消息就出现了！",
		function() { return !player.ended&&player.distance.gte(DISTANCES.多宇宙) },
	],
	s30: [
		"哇哦您到达了学说宇宙深度20，到这个时候已经没有任何意义了。您感觉如何？",
		function() { return player.elementary.theory.depth.gt(20) },
	],
	s31: [
		"是时候将自己转换为斯格明子了！",
		function() { return player.elementary.sky.unl },
	],
	s32: [
		"佛罗里达一男子尝试到达多宇宙的终点，却被分解成了3个量子场。",
		function() { return player.elementary.foam.unl },
	],
	s33: [
		'“基本粒子很棒，它强子挑战了我编造学说，并给光子光追加了一个新梗：泡沫，我得走了，斯格明子需要我。” —— 一个真的一语双关的家伙',
		function() { return player.elementary.sky.unl },
	],
	s34: [
		"等等，别，别毁灭多宇宙，没了它我就死定了！",
		function() { return player.distance.gte(DISTANCES.多宇宙)&&player.mlt.times.eq(0) },
	],
	s35: [
		"如果说这个世界遍地黄金，那么多宇宙则是金之海。是的，您现在拥有它了。",
		function() { return player.mlt.times.gt(0) },
	],
	s36: [
		'“就这？” —— 某个解锁了多宇宙的人',
		function () {
			return player.mlt.times.gt(0)
		}
	],
	s37: [
		"裂了，我裂开了！？！？！？！！",
		function() { return player.inf.derivatives.amts.crackle!==undefined },
	],
	s38: [
		'“下一个导数什么时候才解锁？” —— 某个导数狂魔',
		function() { return player.mlt.highestCompleted>=2 },
	],
	s39: [
		"即使至高神也有不完美之处。虽然他们很想时时巡视多宇宙，但有一些威胁实在……太大了。",
		function() { return player.elementary.times.gte(555) && player.elementary.times.lt(777777) },
	],
	s40: [
		"那里还有更多的多宇宙……我也不知道那里会有什么样的混乱了。",
		function() { return player.mlt.highestCompleted>=5 },
	],
};