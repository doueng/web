var BEATEN_BY = {
    'paper' : 'scissors',
    'rock' : 'paper',
    'scissors' : 'rock'
}

function computerPlay() {
    const a = ["rock", "paper", "scissors"]
    return a[Math.floor((Math.random() * 3))]
}

var playerScore = 0
var cpScore = 0
function playRound (ps, cp) {
    ps = ps.toLowerCase()
    cp = cp.toLowerCase()
    if (ps === cp)
        return `It is a draw!`
    else if (ps == BEATEN_BY[cp])
    {
        cpScore++
        return `You Lose! ${cp} beats ${ps}`
    }
    else if (cp == BEATEN_BY[ps])
    {
        playerScore++
        return `You Win! ${ps} beats ${cp}`
    }
    else
        return `Invalid input ${ps}, can only input rock, paper or scissors`
}

function declareWinner(div) {
    if (cpScore == 5)
        div.textContent = "CP WON!!!!!"
    else
        div.textContent = "YOU WON!!!!"
    playerScore = 0
    cpScore = 0
}

var btns = document.querySelectorAll('.btn')
btns.forEach(function (btn) {
    btn.addEventListener('click', function(e) {
        var div = document.querySelector('#result')
        div.textContent = playRound(e.toElement.innerText, computerPlay())
        var p = document.querySelector('#score')
        p.textContent = `Player ${playerScore} : ${cpScore} CP`
        if (playerScore == 5 || cpScore == 5)
            declareWinner(div)
    })
})