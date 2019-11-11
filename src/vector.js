export default class Vector{

	constructor(color, x, y){
		this.color = color
		this.x = x
		this.y = y

	}

	draw(ctx){
		ctx.beginPath();
		ctx.moveTo(710, 350);
		ctx.lineTo(x,y);
		ctx.lineWidth = 4;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

}