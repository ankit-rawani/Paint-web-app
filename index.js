const canvas = document.querySelector('#canvas1')
const ctx = canvas.getContext('2d')
const toolColors = ['#fff', '#ccc']
const toolbar = document.querySelector('#toolbar')

const strokeColorPicker = document.createElement('div')
const fillColorPicker = document.createElement('div')

var tools = []
var shouldDraw = false
var shouldErase = false
var path
var pointer
var EraserSize = 10
var brushSize = 10
var strokeColor  = '#000'
var fillColor = '#000'
var Color = '#000'

pointer = document.createElement('div')
pointer.style.height = '30px'
pointer.style.width = '30px'
pointer.style.borderRadius = '15px'
pointer.style.position = 'absolute'
document.querySelector('body').appendChild(pointer)

var mouse = {x: 0, y: 0}

window.addEventListener('mousemove', (evt) => {
    mouse.x = evt.clientX - canvas.getBoundingClientRect().left
    mouse.y = evt.clientY - canvas.getBoundingClientRect().top
})

canvas.height = window.innerHeight - 56
canvas.width = window.innerWidth - 56

window.addEventListener('resize', () => {
    canvas.height = window.innerHeight - 60
    canvas.width = window.innerWidth
})

function Tool(icon, name) {
    this.icon = icon
    this.name = name
    this.isSelected = false

    this.tool = document.createElement('div')
    let img = document.createElement('img')

    this.tool.className = 'tool'
    this.tool.style.height = '30px'
    this.tool.style.width = '30px'

    img.src = icon
    img.alt = name
    img.style.padding = '5px'
    img.style.height = '20px'
    img.style.width = '20px'
    this.tool.appendChild(img)
    this.tool.style.backgroundColor = toolColors[0]
    this.tool.style.borderRadius = '4px'
    this.tool.style.border = '1px solid #111'
    this.tool.style.padding = '4px'
}

function ColorPicker(isStroke){
    var dialogOverlay = document.querySelector('#colorpicker')
    dialogOverlay.style.display = 'block'


    var title = document.querySelector('#title')
    title.textContent = isStroke ? 'Choose Stroke Color' : 'Choose Fill Color'

    var dialogBox = document.querySelector('#dialogbox')
    dialogBox.style.backgroundColor = '#ffffff'
    dialogBox.style.width = window.innerWidth / 2
    dialogBox.style.left = window.innerWidth / 4
    dialogBox.style.top = window.innerHeight / 5
    dialogBox.style.position = 'absolute'
    dialogBox.style.height = window.innerHeight / 2

    var canvas2 = document.querySelector('#canvas2')
    canvas2.width = 400
    canvas2.height = 100
    var ctx2 = canvas2.getContext('2d')

    var showColor = document.querySelector('#showcolor')
    showColor.style.height = '30px'
    showColor.style.width = '30px'
    showColor.style.padding = '4px'
    showColor.style.marginLeft = '4px'
    showColor.style.border = '2px solid white'
    showColor.style.backgroundColor = Color

    var choose_btn = document.querySelector('#btn_done')
    choose_btn.style.borderRadius = '4px'
    choose_btn.style.color = '#fff'
    choose_btn.textContent = 'Done'

    var gradient = ctx2.createLinearGradient(0, 0, 400, 0)
    gradient.addColorStop(0, '#fff')
    gradient.addColorStop(0.1, '#f00')
    gradient.addColorStop(0.2, '#0f0')
    gradient.addColorStop(0.3, '#00f')
    gradient.addColorStop(0.5, '#ff0')
    gradient.addColorStop(0.6, '#0ff')
    gradient.addColorStop(0.8, '#f0f')
    gradient.addColorStop(1, '#000')

    ctx2.fillStyle = gradient
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height)

    canvas2.onclick = (evt) => {
        var p = ctx2.getImageData(evt.clientX, evt.clientY, 1, 1).data;
        Color = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        showColor.style.backgroundColor = Color
        
        if(isStroke){
            strokeColor = Color
            strokeColorPicker.style.backgroundColor = strokeColor
        }
        else {
            fillColor = Color
            fillColorPicker.style.backgroundColor = fillColor
        }

    }

    choose_btn.onclick = () => {
        dialogOverlay.style.display = 'none'
    }

}


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function Path() {
    this.start = mouse

    this.draw = () => {
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = brushSize
        ctx.lineCap = 'round'
        ctx.lineTo(this.start.x, this.start.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(this.start.x, this.start.y)
        ctx.lineTo(this.start.x + Math.random(), this.start.y+Math.random())
        ctx.closePath()
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(this.start.x, this.start.y)
        // console.log(this.start, mouse)
    }

    this.update = () => {
        this.start = mouse
        this.draw()
    }

    this.disconnect = () => {
        ctx.closePath()
        ctx.beginPath()
    }
}

function init(){
    const cursor = new Tool('./icons/cursor.svg', 'Pointer')
    const ellipse = new Tool('./icons/oval.svg', 'Ellipse')
    const rectangle = new Tool('./icons/rectangle.svg', 'Rectangle')
    const pencil = new Tool('./icons/edit.svg', 'Pencil')
    const eraser = new Tool('./icons/clean.svg', 'Eraser')

    strokeColorPicker.style.height = '30px'
    strokeColorPicker.style.width = '30px'
    strokeColorPicker.style.padding = '4px'
    strokeColorPicker.style.marginLeft = '4px'
    strokeColorPicker.style.border = '2px solid white'
    strokeColorPicker.style.backgroundColor = strokeColor

    fillColorPicker.style.height = '30px'
    fillColorPicker.style.width = '30px'
    fillColorPicker.style.padding = '4px'
    fillColorPicker.style.marginLeft = '4px'
    fillColorPicker.style.border = '2px solid white'
    fillColorPicker.style.backgroundColor = fillColor

    tools.push(cursor, ellipse, rectangle, pencil, eraser)

    toolbar.appendChild(cursor.tool)
    toolbar.appendChild(pencil.tool)
    toolbar.appendChild(rectangle.tool)
    toolbar.appendChild(ellipse.tool)
    toolbar.appendChild(eraser.tool)
    toolbar.appendChild(strokeColorPicker)
    toolbar.appendChild(fillColorPicker)

    tools.forEach(t => {
        t.tool.addEventListener('click', () => {
          t.isSelected = true
          tools.forEach(x=> {
              if(t !== x) x.isSelected = false
          })
          tools.forEach(x => {
              if (x.isSelected) x.tool.style.backgroundColor = toolColors[1]
              else x.tool.style.backgroundColor = toolColors[0]
              console.log(x.name, x.isSelected)
          })

          if(t == tools[3]){
            path = new Path()
            brushSize = prompt('Enter brush size')
          }

        if (t == tools[4]) {
            EraserSize = prompt('Enter eraser size')
        }
        })
    })

    animate()
}

fillColorPicker.addEventListener('click',() => {
    ColorPicker(false)
})

strokeColorPicker.addEventListener('click', () => {
    ColorPicker(true)
 
})

canvas.addEventListener('mousedown', () => {
    shouldDraw = true

    if(tools[4].isSelected) {
        shouldErase = true
    }
})

canvas.addEventListener('mouseup', () => {
    shouldDraw = false
    if(tools[3].isSelected)
        path.disconnect()
})

function draw(){
    if (shouldDraw && tools[0].isSelected) {
        shouldErase = false
        pointer.style.backgroundColor = '#f00'
        pointer.style.left = (mouse.x + canvas.getBoundingClientRect().left)+'px'
        pointer.style.top = (mouse.y + canvas.getBoundingClientRect().top) + 'px'
    }

    if(shouldDraw && tools[3].isSelected){
        shouldErase = false
        pointer.style.backgroundColor = '#fff0'
            path.update()
            // console.log(path.start)

    }

    if (shouldDraw && tools[2].isSelected) {
        shouldErase = false
        pointer.style.backgroundColor = '#fff0'
        alert('Yet to implement')
        shouldDraw = false
    }

    if (shouldDraw && tools[1].isSelected) {
        shouldErase = false
        pointer.style.backgroundColor = '#fff0'
        alert('Yet to implement')
        shouldDraw = false
    }

    if(shouldErase){
        ctx.clearRect(mouse.x - EraserSize * 5, mouse.y - EraserSize * 5, EraserSize * 5, EraserSize * 5)
    }

}

function animate() {
    draw()
    window.requestAnimationFrame(animate)
}

init()