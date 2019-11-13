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
		var headlen = 9
  		var angle = Math.atan2((this.y-this.c_y), (this.x-this.c_x));
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 3
		ctx.moveTo(this.c_x, this.c_y);
		ctx.lineTo(this.x,this.y);
		ctx.stroke()
		ctx.beginPath()
		ctx.fillStyle = this.color;
		ctx.lineWidth = 1
		ctx.moveTo(this.x, this.y)
		ctx.lineTo(this.x - headlen * Math.cos(angle - Math.PI / 6), this.y - headlen * Math.sin(angle - Math.PI / 6))
		ctx.lineTo(this.x - headlen * Math.cos(angle + Math.PI / 6), this.y - headlen * Math.sin(angle + Math.PI / 6))
		ctx.lineTo(this.x,this.y);
		ctx.fill()
		
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

var pointsOrig = [[1,1]]
var pointsDraw = [[1,1]]
var transfMatrix = [[1.00,0.00],[0.00,1.00]]

redrawAll()

function drawPoints() {
	for (var point = 0; point < pointsDraw.length; point++){
		ctx.beginPath()
		ctx.arc(c_x + (pointsDraw[point][0] * line_spacing), c_y - (pointsDraw[point][1] * line_spacing), 5, 2 * Math.PI, false)
		ctx.fillStyle = 'green'
		ctx.fill()
	}
}

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

function drawNewAxes() {
	var i_dx = i_vector.getx() - c_x
	var i_dy = i_vector.gety() - c_y
	var j_dx = j_vector.getx() - c_x
	var j_dy = j_vector.gety() - c_y

	for (var i = -4; i < 5; i++) {
		// J Vector Lines
		var new_x = (c_x + (i_dx * i))
		var new_y = (c_y + (i_dy * i))
		ctx.beginPath()
		ctx.moveTo((new_x + (j_dx * 5)), (new_y + (j_dy * 5)))
		ctx.lineTo((new_x - (j_dx * 5)), (new_y - (j_dy * 5)))
		ctx.strokeStyle = j_color
		ctx.lineWidth = 1
		ctx.stroke()

		// I Vector Lines
		var new_x = (c_x + (j_dx * i))
		var new_y = (c_y + (j_dy * i))
		ctx.beginPath()
		ctx.moveTo((new_x + (i_dx * 5)), (new_y + (i_dy * 5)))
		ctx.lineTo((new_x - (i_dx * 5)), (new_y - (i_dy * 5)))
		ctx.strokeStyle = i_color
		ctx.lineWidth = 1
		ctx.stroke()
	}
}

function drawMatrix() {
	ctx.font = "35px Arial"
	ctx.fillStyle = i_color
	ctx.fillText(transfMatrix[0][0].toFixed(2), 160, 140)
	ctx.fillText(transfMatrix[1][0].toFixed(2), 160, 190)
	ctx.fillStyle = j_color
	ctx.fillText(transfMatrix[0][1].toFixed(2), 250, 140)
	ctx.fillText(transfMatrix[1][1].toFixed(2), 250, 190)
}

function redrawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	i_vector.draw(ctx)
	j_vector.draw(ctx)
	drawAxes()
	drawNewAxes()
	drawMatrix()
	drawPoints()
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
    if (distance(e_x, i_vector.getx(), e_y, i_vector.gety()) < 12) {
    	i_selected = true
    	console.log("i_selected")
    }
    else if (distance(e_x, j_vector.getx(), e_y, j_vector.gety()) < 12) {
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
		transfMatrix[0][0] = (e_x - c_x)/line_spacing
		transfMatrix[1][0] = (c_y - e_y)/line_spacing
		pointsDraw = transform(transfMatrix, pointsOrig)

	}
	else if (j_selected) {
		var e_x = getCursorPosition(canvas, e)[0]
   	 	var e_y = getCursorPosition(canvas, e)[1]
		j_vector.setx(e_x)
		j_vector.sety(e_y)
		transfMatrix[0][1] = (e_x - c_x)/line_spacing
		transfMatrix[1][1] = (c_y - e_y)/line_spacing
		pointsDraw = transform(transfMatrix, pointsOrig)
	}
	redrawAll()

})

function transform(m1, m2) {
	// Transformation matrix in format ([[i_x, j_x],[i_y, j_y]])
	// Points matrix in format [[x1, y1], [x2, y2]]
	var i_x = m1[0][0]
	console.log("i_x: " + i_x)
	var j_x = m1[0][1]
	console.log("j_x: " + j_x)
	var i_y = m1[1][0]
	console.log("i_y: " + i_y)
	var j_y = m1[1][1]
	console.log("j_y: " + j_y)
	var retArray = []
	for (var point = 0; point < m2.length; point++){
		console.log("point: " + point + "x: " + m2[point][0])
		var newpoint = [(i_x * m2[point][0] + j_x * m2[point][1]), ((i_y * m2[point][0] + j_y * m2[point][1]))]
		retArray.push(newpoint)
	}
	return retArray
}







//https://www.w3resource.com/html5-canvas/html5-canvas-lines.php