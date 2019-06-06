# The code used to generate the tree-logic SVG icon

def gradient():
    center = 12

    x = 4
    yLengths = {
        0:8,
        1:8,
        2:9,
        3:13,
        4:14,
        5:14,
        6:14,
        7:15,
        8:15,
        9:15,
        10:16,
        11:16.5,
        12:16.5,
        13:16.5,
        14:16.5,
        15:16.5,
        16:16.5,
        17:16.5,
        18:16.5,
        19:16,
        20:15,
        21:15,
        22:15,
        23:15,
        24:15,
        25:14,
        26:14,
        27:14,
        28:10,
        29:9,
        30:8,
        31:8}

    colors = {
        0:9,
        1:9,
        2:10,
        3:10,
        4:10,
        5:10,
        6:10+(4.2*1),
        7:10+(4.2*2),
        8:10+(4.2*3),
        9:10+(4.2*4),
        10:10+(4.2*5),
        11:10+(4.2*6),
        12:10+(4.2*7),
        13:10+(4.2*8), # 43.6
        14:47,
        15:47,
        16:47,
        17:47,
        18:47+(4.7*1),
        19:47+(4.7*2),
        20:47+(4.7*3),
        21:47+(4.7*4),
        22:47+(4.7*5),
        23:47+(4.7*6),
        24:47+(4.7*7),
        25:47+(4.7*8),
        26:90,
        27:90,
        28:90,
        29:90,
        30:90,
        31:90,
        32:90}

    red = 10
    orange = 47
    green = 90

    yMin = 8
    yMax = 16

    color = 10

    for i in range(32):
        print(f'<line x1="{x}" y1="{yMin}" x2="{x}" y2={yMax} stroke="hsl({color}, 81%, 53%)" stroke-width="1"/>')
        x += .5
        yLength = yLengths[i]
        yMin = 12 - (yLength/2)
        yMax = 12 + (yLength/2)

        color = colors[i]

def gear():
    print('<circle cx="12" cy="12" r="10.3" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="2,2.3"/>')
    print('<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.25"/>')

def icon():
    print('<svg>')
    gradient()
    gear()
    print('</svg>')

icon()
