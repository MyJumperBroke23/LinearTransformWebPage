# Basic Animation Framework

from tkinter import *
import numpy as np
import pickle
import os
import sys
import math


USE_CV2 = False

if USE_CV2:
    import cv2


def distance(x0,x1,y0,y1):
    return ((x0-x1)**2 + (y0-y1)**2) ** 0.5

####################################
# Helper Image Functions
####################################

def findEdges(image):
    # Detect edges using Canny
    canny_output = cv2.Canny(image, 100, 200)
    # Find contours
    contours, hierarchy = cv2.findContours(canny_output, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    # Draw contours
    drawing = np.zeros((canny_output.shape[0], canny_output.shape[1], 3), dtype=np.uint8)
    for i in range(len(contours)):
        cv2.drawContours(drawing, contours, i, (255, 255, 255), 1, cv2.LINE_8, hierarchy, 0)
    # Show in a window
    return drawing


def pic2array(image):
    pointsList = []
    for row in range(len(image)):
        for col in range(len(image[0])):
            if image[row][col] != 0:
                pointsList.append([col, len(image)-row])
    return pointsList



####################################
# customize these functions
####################################

def init(data):
    data.width = 800
    data.height = 800
    data.line_spacing = 80

    data.i_x = data.width/2 + data.line_spacing
    data.i_y = data.height/2
    data.j_x = data.width / 2
    data.j_y = data.height / 2 - data.line_spacing

    data.i = None
    data.i_circle = None
    data.j = None
    data.j_circle = None

    data.i_selected = False
    data.j_selected = False


    if USE_CV2:
        data.img = cv2.imread("images/penguindab2.jpeg")
        data.img = findEdges(data.img)
        data.img = cv2.cvtColor(data.img, cv2.COLOR_BGR2GRAY)

        data.coordsList = np.array(pic2array(data.img))
        data.coordsList = np.transpose(data.coordsList)
    else:
        with open(os.path.dirname(os.path.abspath(sys.argv[0])) + '/examplePoints.txt', 'rb') as fp:
            data.coordsList = pickle.load(fp)

    max_val = np.max(data.coordsList)
    data.scale = 1.3333/max_val
    data.coordsList = data.coordsList * data.scale  # CoordsList stores # of notches away from the origin

    data.coordsList[0] = data.coordsList[0] - min(data.coordsList[0])
    data.coordsList[1] = data.coordsList[1] - min(data.coordsList[1])

    data.mult_matrix = np.array([[1, 0],
                                [0, 1]])

    data.drawCoords = data.coordsList

    data.zoom = 0.5  # Max Val of 1


def leftPressed(event, canvas, data):
    orig = (data.width / 2, data.height / 2)
    new_i_x = orig[0] + (data.mult_matrix[0][0] * data.line_spacing) * data.zoom
    new_i_y = orig[1] - (data.mult_matrix[1][0] * data.line_spacing) * data.zoom
    new_j_x = orig[0] + (data.mult_matrix[0][1] * data.line_spacing) * data.zoom
    new_j_y = orig[1] - (data.mult_matrix[1][1] * data.line_spacing) * data.zoom
    if (distance(new_i_x, event.x, new_i_y, event.y) < 6):
        data.i_selected = True
    elif (distance(new_j_x, event.x, new_j_y, event.y) < 6):
        data.j_selected = True
    elif (event.x < 75 and event.y > 725):
        if (data.zoom > 0.1):
            data.zoom -= 0.1
            print(data.zoom)
            canvas.delete(ALL)
            canvas.create_rectangle(0, 0, data.width, data.height,
                                    fill='white', width=0)
            redrawAll(canvas, data)
            canvas.update()

    elif (event.x > 725 and event.y > 725):
        if (data.zoom < 3):
            data.zoom += 0.1
            print(data.zoom)
            canvas.delete(ALL)
            canvas.create_rectangle(0, 0, data.width, data.height,
                                    fill='white', width=0)
            redrawAll(canvas, data)
            canvas.update()


def leftMoved(event, canvas, data):
    if (data.i_selected):
        data.i_x = event.x
        data.i_y = event.y
        canvas.coords(data.i, data.width/2, data.height/2, event.x, event.y)
        canvas.coords(data.i_circle, event.x-4, event.y-4, event.x+4, event.y+4)
    elif (data.j_selected):
        data.j_x = event.x
        data.j_y = event.y
        canvas.coords(data.j, data.width / 2, data.height / 2, event.x, event.y)
        canvas.coords(data.j_circle, event.x - 4, event.y - 4, event.x + 4, event.y + 4)

def leftReleased(event, canvas, data):
    if (data.i_selected):
        data.i_selected = False
        print(event.x)
        i_x = (event.x - data.width/2)/(data.line_spacing * data.zoom)
        print(i_x)
        i_y = -(event.y - data.height/2)/(data.line_spacing * data.zoom)
        data.mult_matrix = np.array([[i_x, data.mult_matrix[0,1]],
                                     [i_y, data.mult_matrix[1,1]]])
        print(data.mult_matrix)
        data.drawCoords = np.dot(data.mult_matrix, data.coordsList)  # Linear Transformation

        canvas.delete(ALL)
        canvas.create_rectangle(0, 0, data.width, data.height,
                                fill='white', width=0)
        redrawAll(canvas, data)
        canvas.update()
    elif (data.j_selected):
        data.j_selected = False
        j_x = (event.x - data.width/2)/(data.line_spacing * data.zoom)
        j_y = -(event.y - data.height/2)/(data.line_spacing * data.zoom)
        data.mult_matrix = np.array([[data.mult_matrix[0,0], j_x],
                                     [data.mult_matrix[1,0], j_y]])
        data.drawCoords = np.dot(data.mult_matrix, data.coordsList)  # Linear Transformation

        canvas.delete(ALL)
        canvas.create_rectangle(0, 0, data.width, data.height,
                                fill='white', width=0)
        redrawAll(canvas, data)
        canvas.update()

def keyPressed(event, data):
    # use event.char and event.keysym
    pass

def timerFired(data):
    pass

def redrawAll(canvas, data):
    drawGrid(canvas, data)
    drawUnitVectors(canvas, data)
    drawImage(canvas, data)
    drawUnitMatrix(canvas, data)
    #drawNewGrid(canvas, data)
    drawNewGridBetter(canvas, data)
    drawZoom(canvas, data)

def drawGrid(canvas, data):
    w = data.width
    h = data.height
    l = round(data.line_spacing * data.zoom)
    p1 = round((1-data.zoom) * (data.width)/2)
    p2 = round((1+data.zoom) * (data.width)/2)
    # Creates all vertical lines at intervals of line_spacing
    for i in range(p1 + l, p2, l):
        canvas.create_line([(i, p1), (i, p2)], tag='grid_line', fill="grey")

    # Creates all horizontal lines at intervals of line_spacing
    for i in range(p1 + l, p2, l):
        canvas.create_line([(p1, i), (p2, i)], tag='grid_line', fill="grey")

    # canvas.create_line([(w/2, 0), (w/2, h)], fill="blue", width=2)  # Y Axis
    # canvas.create_line([(0, h/2), (w, h/2)], fill="red", width=2)  # X Axis

def drawUnitVectors(canvas, data):
    orig = (data.width/2, data.height/2)
    new_i_x = orig[0] + (data.mult_matrix[0][0] * data.line_spacing) * data.zoom
    new_i_y = orig[1] - (data.mult_matrix[1][0] * data.line_spacing) * data.zoom
    new_j_x = orig[0] + (data.mult_matrix[0][1] * data.line_spacing) * data.zoom
    new_j_y = orig[1] - (data.mult_matrix[1][1] * data.line_spacing) * data.zoom
    data.i = canvas.create_line([(data.width/2, data.height/2), (new_i_x, new_i_y)], fill="red", width=3,
                       arrow=LAST)  # I Vector
    data.i_circle = canvas.create_oval(new_i_x-4, new_i_y-4, new_i_x+4, new_i_y+4, fill="red", outline="")
    data.j = canvas.create_line([(data.width / 2, data.height / 2), (new_j_x, new_j_y)],fill="blue", width=3,
                       arrow=LAST)  # J Vector
    data.j_circle = canvas.create_oval(new_j_x-4, new_j_y-4, new_j_x+4, new_j_y+4, fill="blue", outline="")

def drawImage(canvas, data):
    for point in range(len(data.drawCoords[0])):
        x = (data.drawCoords[0, point] * data.line_spacing * data.zoom) + data.width/2
        y = -(data.drawCoords[1, point] * data.line_spacing * data.zoom) + data.height/2
        canvas.create_oval(x-1, y-1, x+1, y+1, fill="purple", outline="")
    for point in range(len(data.coordsList[0])):
        x = (data.coordsList[0, point] * data.line_spacing * data.zoom) + data.width/2
        y = -(data.coordsList[1, point] * data.line_spacing * data.zoom) + data.height/2
        canvas.create_oval(x-1, y-1, x+1, y+1, fill="green", outline="")

def drawUnitMatrix(canvas, data):
    # Left Bracket
    canvas.create_line([(100,100), (100,200)], width=4)
    canvas.create_line([(99, 200), (110, 200)], width=4)
    canvas.create_line([(190, 200), (201, 200)], width=4)
    # Right Bracket
    canvas.create_line([(200, 100), (200, 200)], width=4)
    canvas.create_line([(99, 100), (110, 100)], width=4)
    canvas.create_line([(190, 100), (201, 100)], width=4)

    canvas.create_text(125,125, fill="red", font="Times 20 bold", text="%.2f" % data.mult_matrix[0][0])
    canvas.create_text(175, 125, fill="blue", font="Times 20 bold", text="%.2f" % data.mult_matrix[0][1])
    canvas.create_text(125, 175, fill="red", font="Times 20 bold", text="%.2f" % data.mult_matrix[1][0])
    canvas.create_text(175, 175, fill="blue", font="Times 20 bold", text="%.2f" % data.mult_matrix[1][1])

def drawNewGrid(canvas, data):
    i_x = data.i_x
    i_y = data.i_y
    j_x = data.j_x
    j_y = data.j_y

    if (i_x != 400):
        slope = (i_y - 400) / (i_x - 400)  # Where y = mx + b

        for axis_row in range(-6, 6):
            b = (i_y + axis_row * (j_y - 400)) - (slope * (i_x + axis_row * (j_x-400)))  # b = y-mx
            canvas.create_line([(0, b), (800, (slope * 800) + b)], fill="red")
    else:
        for i in range(0, data.height, int(j_x - 400)):
            canvas.create_line([(i, 0), (i, data.width)], fill='red')

    if (j_x != 400):
        slope = (j_y - 400) / (j_x - 400)  # Where y = mx + b

        for axis_row in range(-6, 6):
            b = (j_y + axis_row * (i_y - 400)) - (slope * (j_x + axis_row * (i_x - 400)))  # b = y-mx
            canvas.create_line([(0, b), (800, (slope * 800) + b)], fill="blue")

    else:
        for i in range(0, data.width, int(i_x-400)):
            canvas.create_line([(i, 0), (i, data.height)], fill="blue")


def drawNewGridBetter(canvas, data):
    orig = (data.width / 2, data.height / 2)
    i_x = orig[0] + (data.mult_matrix[0][0] * data.line_spacing) * data.zoom
    i_y = orig[1] - (data.mult_matrix[1][0] * data.line_spacing) * data.zoom
    j_x = orig[0] + (data.mult_matrix[0][1] * data.line_spacing) * data.zoom
    j_y = orig[1] - (data.mult_matrix[1][1] * data.line_spacing) * data.zoom

    # DRAW J_VECTOR LINES
    for line in range(-4, 5):
        x, y = 400, 400
        x += (i_x - 400) * line
        y += (i_y - 400) * line
        x_change = ((j_x-400) * 5)
        y_change = ((j_y-400) * 5)
        canvas.create_line([(x-x_change, y-y_change), (x+x_change, y+y_change)], fill="blue")
    # DRAW I_VECTOR LINES
    for line in range(-4, 5):
        x, y = 400, 400
        x += (j_x - 400) * line
        y += (j_y - 400) * line
        x_change = ((i_x-400) * 5)
        y_change = ((i_y-400) * 5)
        canvas.create_line([(x-x_change, y-y_change), (x+x_change, y+y_change)], fill="red")


def drawZoom(canvas, data):
    # Zoom in
    canvas.create_line([(725, 725), (725, 800)], width=4)
    canvas.create_line([(723, 725), (800, 725)], width=4)

    canvas.create_line([(762, 750), (762, 775)], width=4)
    canvas.create_line([(750, 762), (775, 762)], width=4)

    # Zoom Out
    canvas.create_line([(75, 725), (75, 800)], width=4)
    canvas.create_line([(77, 725), (0, 725)], width=4)

    canvas.create_line([(25, 762), (50, 762)], width=4)


####################################
# use the run function as-is
####################################

def run(width=300, height=300):
    def redrawAllWrapper(canvas, data):
        canvas.delete(ALL)
        canvas.create_rectangle(0, 0, data.width, data.height,
                                fill='white', width=0)
        redrawAll(canvas, data)
        canvas.update()

    def mouseWrapper(mouseFn, event, canvas, data):
        mouseFn(event, canvas, data)
        #redrawAllWrapper(canvas, data)

    def keyPressedWrapper(event, canvas, data):
        keyPressed(event, data)
        #redrawAllWrapper(canvas, data)

    def timerFiredWrapper(canvas, data):
        timerFired(data)
        redrawAllWrapper(canvas, data)
        # pause, then call timerFired again
        #canvas.after(data.timerDelay, timerFiredWrapper, canvas, data)
    # Set up data and call init
    class Struct(object): pass
    data = Struct()
    data.width = width
    data.height = height
    data.timerDelay = 100 # milliseconds
    root = Tk()
    init(data)
    # create the root and the canvas
    canvas = Canvas(root, width=data.width, height=data.height)
    canvas.configure(bd=0, highlightthickness=0)
    canvas.pack()
    # set up events
    root.bind("<Button-1>", lambda event:
                            mouseWrapper(leftPressed, event, canvas, data))
    canvas.bind("<B1-Motion>", lambda event:
                            mouseWrapper(leftMoved, event, canvas, data))
    root.bind("<B1-ButtonRelease>", lambda event:
                            mouseWrapper(leftReleased, event, canvas, data))
    root.bind("<Key>", lambda event:
                            keyPressedWrapper(event, canvas, data))
    timerFiredWrapper(canvas, data)
    # and launch the app
    root.mainloop()  # blocks until window is closed
    print("bye!")

run(400, 200)