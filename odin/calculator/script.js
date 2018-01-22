var currVal = ''
var display = document.getElementById('display')

var exp = {
    x: 0,
    y: 0,
    op: '',
}

var operators = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => x / y,
}

function operate(op, num, num1) {
    return operators[op](num, num1)
}

var opButtons = document.querySelectorAll('.op')
opButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        currVal = (currVal) ? currVal : '0'
        if (exp.op)
            exp.x = operate(exp.op, exp.x, parseFloat(currVal))
        else
            exp.x = parseFloat(currVal)
        exp.op = e.toElement.innerText
        display.textContent = exp.x.toString()
        currVal = ''
    })
})

var numButtons = document.querySelectorAll('.num')
numButtons.forEach((num) => {
    num.addEventListener('click', (e) => {
        currVal += e.toElement.innerText
        display.textContent = currVal
    })
})

document.querySelector('.equals').addEventListener('click', (e) => {
    if (currVal && exp.op) {
        exp.x = operate(exp.op, exp.x, parseFloat(currVal))
        display.textContent = exp.x.toString()
        currVal = exp.x.toString()
        exp.y = 0
        exp.op = ''
    }
})

document.querySelector('#clear').addEventListener('click', (e) => {
    exp.x = 0
    exp.y = 0
    exp.op = ''
    currVal = ''
    display.textContent = exp.x.toString()
})

document.querySelector('#delete').addEventListener('click', (e) => {
    if (currVal)
        currVal = currVal.slice(0, -1)
    display.textContent = (currVal) ? currVal : '0'
})

document.querySelector('#point').addEventListener('click', (e) => {
    if (currVal.indexOf('.') === -1) {
        currVal += '.'
        display.textContent = currVal
    }
})