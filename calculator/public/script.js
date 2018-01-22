$(() => {

    var display = $('#display')
    var currExp = ''

    function lastIsOp() {
        return isOp(currExp[currExp.length - 1])
    }

    function isOp(c) {
        return ['+', '-', '*', '/'].includes(c)
    }

    $('.op').on('click', (e) => {
        if (currExp && !lastIsOp())
            currExp += e.toElement.innerText
        display.text(currExp)
    })

    $('.num').on('click', (e) => {
        currExp += e.toElement.innerText
        display.text(currExp)
    })

    $('#equals').on('click', (e) => {
        if (currExp)
        {
            currExp = lastIsOp() ? currExp.slice(0, -1) : currExp
            currExp = eval(currExp).toString()
            display.text(currExp)
        }
    })

    $('#clear').on('click', () => {
        currExp = ''
        display.text('0')
    })

    $('#delete').on('click', () => {
        if (currExp)
            currExp = currExp.slice(0, -1)
        display.text((currExp) ? currExp : '0')
    })

    function currNumHasPoint() {
        for (var i = currExp.length - 1; i >= 0; i--) {
            if (currExp[i] === '.')
                return 1
            else if (isOp(currExp[i]))
                return 0
        }
        return (0)
    }

    $('#point').on('click', () => {
        if (!currNumHasPoint()) {
            currExp += '.'
            display.text(currExp)
        }
    })
})