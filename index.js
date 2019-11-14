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

var drawPoints_selected = false
var showLines_selected = false

redrawAll()

function drawPoints() {
	ctx.fillStyle = "Green"
	ctx.strokeStyle = "green"
	for (var point = 0; point < pointsDraw.length; point++){
		ctx.beginPath()
		ctx.arc(c_x + (pointsDraw[point][0] * line_spacing), c_y - (pointsDraw[point][1] * line_spacing), 5, 2 * Math.PI, false)
		ctx.fill()
	}
	if (showLines_selected) {
		console.log("show lines")
		for (var point = 0; point < pointsDraw.length - 1; point++) {
			ctx.beginPath()
			ctx.strokeStyle = "green"
			ctx.lineWidth = 3
			ctx.moveTo(c_x + (pointsDraw[point][0] * line_spacing), c_y - (pointsDraw[point][1] * line_spacing))
			ctx.lineTo(c_x + (pointsDraw[point+1][0] * line_spacing), c_y - (pointsDraw[point+1][1] * line_spacing))
			ctx.stroke()
		}
		ctx.moveTo(c_x + (pointsDraw[0][0] * line_spacing), c_y - (pointsDraw[0][1] * line_spacing))
		ctx.lineTo(c_x + (pointsDraw[pointsDraw.length - 1][0] * line_spacing), c_y - (pointsDraw[pointsDraw.length - 1][1] * line_spacing))
		ctx.stroke()
	}
}

// Draws checkboxes that allow user to toggle drawing points, and showing lines
function drawCheckBoxes() {
	if (showLines_selected) { 
		ctx.fillStyle = "lightblue"
		ctx.rect(1350, 120, 20, 20)
		ctx.fill()
	}
	if (drawPoints_selected) { 
		ctx.fillStyle = "lightblue"
		ctx.rect(1350, 80, 20, 20)
		ctx.fill()
	}
	ctx.font = "25px Arial"
	ctx.fillStyle = "black"
	ctx.fillText("Draw Points", 1200, 100)
	ctx.fillText("Show Lines", 1200, 140)
	ctx.strokeStyle = "black"
	ctx.beginPath()
	ctx.rect(1350, 80, 20, 20)
	ctx.stroke()
	ctx.beginPath()
	ctx.rect(1350, 120, 20, 20)
	ctx.stroke()
	// Draw Clear Button
	ctx.beginPath()
	ctx.fillStyle = "lightblue"
	ctx.rect(1210, 160, 150, 50)
	ctx.fill()
	ctx.fillStyle = "black"
	ctx.font = "35px Arial"
	ctx.fillText("CLEAR", 1225, 195)
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
		ctx.save()
		ctx.strokeStyle = j_color
		var new_x = (c_x + (i_dx * i))
		var new_y = (c_y + (i_dy * i))
		ctx.beginPath()
		ctx.moveTo((new_x + (j_dx * 5)), (new_y + (j_dy * 5)))
		ctx.lineTo((new_x - (j_dx * 5)), (new_y - (j_dy * 5)))
		ctx.lineWidth = 1
		ctx.stroke()
		ctx.restore()

		// I Vector Lines
		var new_x = (c_x + (j_dx * i))
		var new_y = (c_y + (j_dy * i))
		ctx.save()
		ctx.strokeStyle = i_color
		ctx.beginPath()
		ctx.moveTo((new_x + (i_dx * 5)), (new_y + (i_dy * 5)))
		ctx.lineTo((new_x - (i_dx * 5)), (new_y - (i_dy * 5)))
		ctx.lineWidth = 1
		ctx.stroke()
		ctx.restore()
	}
}

function drawMatrix() {
	ctx.fillStyle = "black"
	ctx.strokeStyle = "black"
	ctx.font = "30px Arial Itallic"
	ctx.fillText("x", 70, 305)
	ctx.fillText("y", 70, 345)
	ctx.fillText("X", 150, 325)
	matrixSide(65, 355, 4, "black")
	matrixSide(90, 355, -4, "black")
	ctx.fillText("=", 110, 325)
	ctx.fillStyle = i_color
	ctx.strokeStyle = i_color
	matrixSide(180, 355, 4, i_color)
	matrixSide(250, 355, -4, i_color)
	ctx.fillText(transfMatrix[0][0].toFixed(2), 185, 305)
	ctx.fillText(transfMatrix[1][0].toFixed(2), 185, 345)
	ctx.fillStyle = "black"
	ctx.fillText("+", 255, 325)
	ctx.fillText("Y", 285, 325)
	ctx.fillStyle = j_color
	ctx.strokeStyle = j_color
	matrixSide(320, 355, 4, j_color)
	matrixSide(390, 355, -4, j_color)
	ctx.fillText(transfMatrix[0][1].toFixed(2), 327, 305)
	ctx.fillText(transfMatrix[1][1].toFixed(2), 327, 345)
	ctx.fillStyle = "black"
	ctx.strokeStyle = "black"
	ctx.font = "30px Arial Itallic"
	ctx.fillText("x", 70, 150)
	ctx.fillText("y", 70, 190)
	matrixSide(65, 200, 4, "black")
	matrixSide(90, 200, -4, "black")
	ctx.fillText("=", 110, 170)
	ctx.font = "30px Arial Itallic"
	ctx.fillStyle = i_color
	ctx.fillText(transfMatrix[0][0].toFixed(2), 160, 150)
	ctx.fillText(transfMatrix[1][0].toFixed(2), 160, 190)
	ctx.fillStyle = j_color
	ctx.fillText(transfMatrix[0][1].toFixed(2), 240, 150)
	ctx.fillText(transfMatrix[1][1].toFixed(2), 240, 190)
	ctx.fillStyle = "black"
	ctx.strokeStyle = "black"
	matrixSide(155, 200, 4, "black")
	matrixSide(300, 200, -4, "black")
	ctx.fillText("=", 110, 170)
	matrixSide(310, 200, 4, "black")
	ctx.fillText("X", 320, 150)
	ctx.fillText("Y", 320, 190)
	matrixSide(350, 200, -4, "black")
	

}

function redrawAll() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	i_vector.draw(ctx)
	j_vector.draw(ctx)
	drawAxes()
	drawNewAxes()
	drawMatrix()
	drawCheckBoxes()
	drawPoints()
}

// Mouse events
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x, y]
}

canvas.addEventListener('mousedown', function(e) {
    var e_x = getCursorPosition(canvas, e)[0]
    var e_y = getCursorPosition(canvas, e)[1]
    if (drawPoints_selected) {
    	var i_dx = i_vector.getx() - c_x
		var i_dy = i_vector.gety() - c_y
		var j_dx = j_vector.getx() - c_x
		var j_dy = j_vector.gety() - c_y
    	var poly = [[c_x + 5*i_dx + 5*j_dx, c_y + 5*i_dy + 5*j_dy], 
    				[c_x - 5*i_dx + 5*j_dx, c_y - 5*i_dy + 5*j_dy],
    				[c_x - 5*i_dx - 5*j_dx, c_y - 5*i_dy - 5*j_dy],
    				[c_x + 5*i_dx - 5*j_dx, c_y + 5*i_dy - 5*j_dy]]
    	if (inside([e_x, e_y], poly)) {
    		var inv = inverse(transfMatrix)
    		//console.log(inv)
    		pointsDraw.push([(e_x - c_x)/line_spacing, (c_y - e_y)/line_spacing])
    		pointsOrig.push(transform(inv, [pointsDraw[pointsDraw.length - 1]])[0])
    		console.log(pointsOrig)
    		console.log(pointsDraw)
    	}
    }
    // CLicking I Vector
    else if (distance(e_x, i_vector.getx(), e_y, i_vector.gety()) < 12) {
    	i_selected = true
    }
    // Clicking J Vector
    else if (distance(e_x, j_vector.getx(), e_y, j_vector.gety()) < 12) {
    	j_selected = true
    }
    // Clicking Draw Points
    if ((1350 < e_x && e_x < 1370) && (80 < e_y && e_y < 100)){
    	drawPoints_selected = !(drawPoints_selected)
    } 
    // Clicking Show Lines 
    if ((1350 < e_x && e_x < 1370) && (120 < e_y && e_y < 140)){
    	showLines_selected = !(showLines_selected)
    } 
    // Clicking Clear
    if ((1210 < e_x && e_x < 1360) && (160 < e_y && e_y < 210)){
    	pointsOrig = []
    	pointsDraw = []
    	transfMatrix = [[1,0],[0,1]]
    	i_vector.setx(c_x + line_spacing)
    	i_vector.sety(c_y)
    	j_vector.setx(c_x)
    	j_vector.sety(c_y - line_spacing)
    }
})

canvas.addEventListener('mouseup', function(e) {
	i_selected = false
	j_selected = false
	redrawAll()
})

canvas.addEventListener('mousemove', function(e) {
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
	//console.log("i_x: " + i_x)
	var j_x = m1[0][1]
	//console.log("j_x: " + j_x)
	var i_y = m1[1][0]
	//console.log("i_y: " + i_y)
	var j_y = m1[1][1]
	//console.log("j_y: " + j_y)
	var retArray = []
	for (var point = 0; point < m2.length; point++){
		//console.log("point: " + point + "x: " + m2[point][0])
		var newpoint = [(i_x * m2[point][0] + j_x * m2[point][1]), ((i_y * m2[point][0] + j_y * m2[point][1]))]
		retArray.push(newpoint)
	}
	return retArray
}

function inverse(m1){
	var i_x = m1[0][0]
	//console.log("i_x: " + i_x)
	var j_x = m1[0][1]
	//console.log("j_x: " + j_x)
	var i_y = m1[1][0]
	//console.log("i_y: " + i_y)
	var j_y = m1[1][1]
	//console.log("j_y: " + j_y)
	var determinant = i_x * j_y - j_x * i_y
	var retMatrix = [[(1/determinant) * j_y,(1/determinant) *  (0-j_x)],
					 [(1/determinant) * (0-i_y),(1/determinant) * i_x]]
	return retMatrix
}

// From https://github.com/substack/point-in-polygon
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

// Draws one side of matrix/vector
function matrixSide(x, y, diff, color) {
	ctx.fillStyle = color
	ctx.strokeStyle = color
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x, y-75)
	ctx.lineTo(x+diff, y-75)
	ctx.moveTo(x,y)
	ctx.lineTo(x+diff, y)
	ctx.stroke()
	ctx.closePath()
}





//https://www.w3resource.com/html5-canvas/html5-canvas-lines.php