class Feature {
	constructor(data) {
		this.name = data.name;
		this.req = data.req;
		this.res = data.res;
		this.display = data.display;
		this.r = data.reached || (function() { return false });
		this.spec = data.spec ? data.spec : Array.isArray(data.res);
		this.superSpec = data.superSpec || false
		this.resName = data.resName || "???"
		this.disp = data.displayName ? data.displayName : data.name;
		this.progress = data.progress
			? data.progress
			: function () {
					return 0;
			  };
		this.res_amt = data.res_amt || 1;
		this.specRes = data.specRes || [];
	}

	amt(x = 1) {
		if (this.res_amt > 1) {
			if (this.superSpec?this.superSpec[x - 1]:false) return this.res[x - 1]()
			else return this.spec[x - 1] ? player[this.res[x - 1][0]][this.res[x - 1][1]] : player[this.res[x - 1]];
		} else {
			if (this.superSpec) return this.res()
			else return this.spec ? player[this.res[0]][this.res[1]] : player[this.res];
		}
	}

	dispAmt(x = 1) {
		if (this.specRes[x-1]) return this.specRes[x-1]
		if (this.res_amt > 1) {
			if (this.superSpec?this.superSpec[x - 1]:false) return capitalFirst(this.resName[x - 1])
			else return this.spec[x - 1] ? capitalFirst(this.res[x - 1][1]) : capitalFirst(this.res[x - 1]);
		} else {
			if (this.superSpec) return capitalFirst(this.resName)
			else return this.spec ? capitalFirst(this.res[1]) : capitalFirst(this.res);
		}
	}

	get reached() {
		if (this.res_amt > 1) {
			let bool = true;
			for (let i = 1; i <= this.res_amt; i++) bool = (bool && this.amt(i).gte(this.req[i - 1])) || this.r();
			return bool;
		} else return this.amt().gte(this.req()) || this.r();
	}

	get desc() {
		if (this.res_amt > 1) {
			let desc = "到达";
			if (!this.reached) {
				for (let i = 1; i <= this.res_amt; i++) {
					let chs = "";
					chs = this.dispAmt(i);
					chs = chs.replace("Cadavers","残骸");
					chs = chs.replace("Rockets","火箭");
					chs = chs.replace("Endorsements","认可");
					chs = chs.replace("EP in one run","基本粒子于一次基本重置中");
					chs = chs.replace("Quarks","夸克");
					chs = chs.replace("Leptons","轻子");
					desc +=
						this.display[i - 1](this.req[i - 1]) +
						(this.res[i - 1] == "distance" ? "" : chs);
					if (i == this.res_amt - 1) desc += "，及";
					else if (i < this.res_amt - 1) desc += "，";
				}
				desc +=
					"以解锁" + this.disp + "(" + showNum(new ExpantaNum(this.progress() || 0).times(100)) + "%)";
				return desc;
			} else return "";
		} else {
			let chs = "";
			chs = this.dispAmt();
			chs = chs.replace("Cadavers","残骸");
			chs = chs.replace("Endorsements","认可");
			return this.reached
				? ""
				: "到达" +
						this.display(this.req()) +
						"" +
						(this.res == "distance" ? "" : chs) +
						"以解锁" +
						this.disp +
						"(" +
						showNum(new ExpantaNum(this.progress() || 0).times(100)) +
						"%)";
		}
	}
}
