let canvas = document.getElementById("screen");

let ctx = canvas.getContext("2d")

class Vector{
	constructor(color, x, y, c_x, c_y){
		this.color = color
		this.x = x
		this.y = y
		this.c_x = c_x
		this.c_y = c_y
	}
	draw(ctx){
		ctx.beginPath();
		ctx.moveTo(this.c_x, this.c_y);
		ctx.lineTo(this.x,this.y);
		ctx.lineWidth = 4;
		ctx.strokeStyle = this.color;
		ctx.stroke();
	}
	setx(new_x) {
		this.x = new_x
	}
	sety(new_y) {
		this.y = new_y
	}
	getx() {
		return this.x
	}
	gety() { 
		return this.y
	}
}

function distance(x1, x2, y1, y2) {
	x_dist = x1-x2
	y_dist = y1-y2
	return Math.sqrt((x_dist * x_dist) + (y_dist * y_dist))
}

ctx.fillStyle= "#f00"

ctx.fillRect(20, 30, 30, 40)

const line_spacing = 50 // Space between the axis lines
const c_x = canvas.width/2
const c_y = canvas.height/2 // Where (c_x, c_y) is the origin

//Setting I and J vector colors
const i_color = "#f00"
const j_color = "#0000FF"

var i_selected = false
var j_selected = false

let i_vector = new Vector(i_color, (c_x + line_spacing), c_y, c_x, c_y)
let j_vector = new Vector(j_color, c_x, (c_y - line_spacing), c_x, c_y)

redrawAll()

function drawAxes() {
	for (var i = -4; i < 5; i++){
		// Vertical Lines
		ctx.beginPath()
		ctx.moveTo((c_x + (line_spacing * i)), (c_y) - (line_spacing * 5))
		ctx.lineWidth = 1
		ctx.strokeStyle = "gray"
		ctx.lineTo((c_x + (line_spacing * i)), (c_y) + (line_spacing * 5))
		ctx.stroke()
		// Horizontal Lines
		ctx.beginPath()
		ctx.moveTo((c_x + (line_spacing * 5)), (c_y) + (line_spacing * i))
		ctx.lineWidth = 1
		ctx.strokeStyle = "gray"
		ctx.lineTo((c_x - (line_spacing * 5)), (c_y) + (line_spacing * i))
		ctx.stroke()
	}
}


function redrawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	i_vector.draw(ctx)
	j_vector.draw(ctx)
	drawAxes()
}

// Mouse events
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    //console.log("x: " + x + " y: " + y)
    return [x, y]
}

canvas.addEventListener('mousedown', function(e) {
    var e_x = getCursorPosition(canvas, e)[0]
    var e_y = getCursorPosition(canvas, e)[1]
    if (distance(e_x, i_vector.getx(), e_y, i_vector.gety()) < 6) {
    	i_selected = true
    	console.log("i_selected")
    }
    else if (distance(e_x, j_vector.getx(), e_y, j_vector.gety()) < 6) {
    	j_selected = true
    	console.log("j_selected")
    }
})

canvas.addEventListener('mouseup', function(e) {
	i_selected = false
	j_selected = false
	redrawAll()
})

canvas.addEventListener('mousemove', function(e) {
    //console.log("x: " + e_x + " y: " + e_y)
	if (i_selected) {
		var e_x = getCursorPosition(canvas, e)[0]
    	var e_y = getCursorPosition(canvas, e)[1]
		i_vector.setx(e_x)
		i_vector.sety(e_y)
	}
	else if (j_selected) {
		var e_x = getCursorPosition(canvas, e)[0]
   	 	var e_y = getCursorPosition(canvas, e)[1]
		j_vector.setx(e_x)
		j_vector.sety(e_y)
	}
	redrawAll()

})





//https://www.w3resource.com/html5-canvas/html5-canvas-lines.php