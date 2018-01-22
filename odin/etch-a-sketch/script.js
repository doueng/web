var grid = document.querySelector('#grid')

function createGrid(gridSize) {
    for (var i = 0; i < gridSize; i++)
    {
        var row = document.createElement('div')
        row.classList.add('row')
        for (var ii = 0; ii < gridSize; ii++)
        {
            var box = document.createElement('div')
            box.classList.add('box')
            box.addEventListener('mouseover', function(e){
                e.target.style.backgroundColor = 'red'
            })
            row.appendChild(box);
        }
        grid.appendChild(row)
    }
}

createGrid(16)

var reset = document.querySelector('#reset')
reset.addEventListener('click', function(e){
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild)
    }
    createGrid(prompt('Input grid size'))
})