function distance(x1, x2, y1, y2) {
	x_dist = x1-x2
	y_dist = y1-y2
	return Math.sqrt((x_dist * x_dist) + (y_dist * y_dist))
}

let canvas = document.getElementById("screen");

let ctx = canvas.getContext("2d")

ctx.fillStyle= "#f00"

ctx.fillRect(20, 30, 30, 40)

const line_spacing = 50 // Space between the axis lines
const c_x = canvas.width/2 
const c_y = canvas.height/2 // Where (c_x, c_y) is the origin

//Setting I and J vector colors
const i_color = "#f00"
const j_color = "#0000FF"

//Coordinates of i and j vector
var i_x = c_x + line_spacing
var i_y = c_y
var j_x = c_x
var j_y = c_y - line_spacing

var i_selected = false
var j_selected = true

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
    if (distance(e_x, i_x, e_y, i_y) < 5) {
    	i_selected = true
    }
    else if (distance(e_x, j_x, e_y, j_y) < 5) {
    	j_selected = true
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle= j_color
    ctx.fillRect(20, 30, 30, 40)
})

canvas.addEventListener('mouseup', function(e) {
	i_selected = false
	j_selected = false
})

canvas.addEventListener('mousemove', function(e) {
    //console.log("x: " + e_x + " y: " + e_y)
	if (i_selected) {
		var e_x = getCursorPosition(canvas, e)[0]
    	var e_y = getCursorPosition(canvas, e)[1]
		i_x = e_x
		i_y = e_y
	}
	else if (j_selected) {
		var e_x = getCursorPosition(canvas, e)[0]
   	 	var e_y = getCursorPosition(canvas, e)[1]
		j_x = e_x
		j_y = e_y
	}
})



//https://www.w3resource.com/html5-canvas/html5-canvas-lines.php