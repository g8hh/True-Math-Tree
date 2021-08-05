function powsoftcap(num,start,power){
	if(num.gt(start)){
		num = num.root(power).mul(start.pow(one.sub(one.div(power))))
	}
    return num
}
function e(num){
    return new ExpantaNum(num)
}
var zero = new ExpantaNum(0)
var one = new ExpantaNum(1)
var two = new ExpantaNum(2)
var three = new ExpantaNum(3)
var four = new ExpantaNum(4)
var five = new ExpantaNum(5)
var ten = new ExpantaNum(10)
function logsoftcap(num,start,power){
    if(num.gt(start)){
        num =ten.tetr(num.slog(10).sub(power)).pow(start.logBase(ten.tetr(start.slog(10).sub(power))))
    }
    return num
}