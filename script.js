// Globais
let board = document.querySelector('#board')
let message = document.querySelector('#message')
var isPvP = true
var isXRound = true
var currentPlayer = true
var pieces = []
var piecesCont = 0

function clearPieces()
{
    for (var i = 0; i < 3; i++)
    {
        pieces[i] = []
        for (var j = 0; j < 3; j++)
        {
            pieces[i][j] = []
            for (var k = 0; k < 3; k++)
            {
                pieces[i][j][k] = 0
            }
        }
    }

    piecesCont = 0
}

function newXPiece(zIndex)
{
    let piece = document.createElement('div')
    piece.className = 'xPiece'
    piece.style.zIndex = zIndex

    let xBraceDepth = document.createElement('div')
    xBraceDepth.className = 'xBraceDepth'
    xBraceDepth.style.zIndex = ++zIndex
    piece.appendChild(xBraceDepth)

    xBraceDepth = document.createElement('div')
    xBraceDepth.className = 'xBraceDepth'
    xBraceDepth.style.zIndex = ++zIndex
    piece.appendChild(xBraceDepth)

    let xBrace = document.createElement('div')
    xBrace.className = 'xBrace'
    xBrace.style.zIndex = ++zIndex
    piece.appendChild(xBrace)

    xBrace = document.createElement('div')
    xBrace.className = 'xBrace'
    xBrace.style.zIndex = ++zIndex
    piece.appendChild(xBrace)

    return piece
}

function newOPiece(zIndex)
{
    let piece = document.createElement('div')
    piece.className = 'oPiece'
    piece.style.zIndex = zIndex

    let oPieceDepth = document.createElement('div')
    oPieceDepth.className = 'oPieceDepth'

    piece.appendChild(oPieceDepth)

    let oPieceActive = document.createElement('div')
    oPieceActive.className = 'oPieceActive'
    piece.appendChild(oPieceActive)

    return piece
}

function clearBoard()
{
    board.innerHTML = ''
    
    for (var i = 1; i <= 3; i++)
    {
        let plane = document.createElement('div')
        plane.className = 'plane'
        let cont = 100*i
        
        for (var j = 1; j <= 9; j++)
        {
            let cell = document.createElement('div')
            cell.className = 'cell'
            cell.style.zIndex = cont++
            
            let floor = document.createElement('div')
            floor.className = 'floor'
            floor.style.zIndex = cont++
            cell.appendChild(floor)

            plane.appendChild(cell)
            cont -= 10
        }

        board.appendChild(plane)
    }

    clearPieces()
}

function makeAComputerMove(handleClick)
{
    let emptyCells = []
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        for (let k = 0; k < 3; k++)
            if (pieces[i][j][k] == 0)
                emptyCells.push([i, j, k])
  
    let randomIndex = Math.floor(Math.random() * emptyCells.length)
    let pos = emptyCells[randomIndex]

    piecesCont++
    pieces[pos[0]][pos[1]][pos[2]] = isXRound ? 1 : 2

    // Entrada da nova peça
    let cell = board.querySelectorAll('.cell')[9*pos[2] + 3*pos[1] + pos[0]]
    const zIndex = getComputedStyle(cell).getPropertyValue('z-index')
    let piece = isXRound ? newXPiece(zIndex) : newOPiece(zIndex)
    cell.appendChild(piece)
    piece = cell.lastChild
    let currentTransform = getComputedStyle(piece).getPropertyValue('transform')
    piece.style.transform = isXRound ? `${currentTransform} translateX(-700px)` : `${currentTransform} translateY(700px)`

    cell.removeEventListener('click', handleClick)
    isXRound = !isXRound
    currentPlayer = !currentPlayer
    updateRoundText()

    let hasEnded = checkEnd()
}  

function updateOptions()
{
    isPvP = document.querySelectorAll('input[name="game-type"]')[0].checked
    isXRound = document.querySelectorAll('input[name="player-type"]')[1].checked
}

function showStartPanel()
{
    message.innerHTML = 'Jogo da Velha 3D'
    document.querySelector('#restart').style.display = 'none'
    updateOptions()
}

function updateRoundText()
{
    message.innerHTML = 'Rodada da vez: ' + (isXRound ? 'X' : 'O')
}

function addButtonsListeners()
{
    let startButton = document.querySelector('#start')

    startButton.addEventListener('click', () => {
        document.querySelector('#stopper').style.display = 'none'
        updateRoundText()
        document.querySelector('#options').style.display = 'none'
        startButton.style.display = 'none'
        restartButton.style.display = 'flex'
        addCellsListeners()
        hasEnded = false
        currentPlayer = true
    })

    let restartButton = document.querySelector('#restart')

    restartButton.addEventListener('click', () => {
        message.innerHTML = 'Jogo da Velha 3D'
        document.querySelector('#stopper').style.display = 'flex'
        document.querySelector('#options').style.display = 'flex'
        document.querySelector('#gameOver').style.display = 'none'
        startButton.style.display = 'flex'
        restartButton.style.display = 'none'
        clearBoard()
    })
}

function addOptionsListeners()
{
    var options = document.querySelectorAll('input[type="radio"]')

    options.forEach(option => {
        option.addEventListener('click', () => { updateOptions() })
    })
}

function addCellsListeners()
{
    var cells = document.querySelectorAll('.cell')

    for (var i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let xPos = i%3
        let zPos = Math.floor(i/9)
        let yPos = Math.floor((i - 9*zPos)/3)

        cell.addEventListener('click', function handleClick() {
            piecesCont++
            pieces[xPos][yPos][zPos] = isXRound ? 1 : 2

            // Entrada da nova peça
            const zIndex = getComputedStyle(cell).getPropertyValue('z-index')
            let piece = isXRound ? newXPiece(zIndex) : newOPiece(zIndex)
            cell.appendChild(piece)
            piece = cell.lastChild
            let currentTransform = getComputedStyle(piece).getPropertyValue('transform')
            piece.style.transform = isXRound ? `${currentTransform} translateX(-700px)` : `${currentTransform} translateY(700px)`

            cell.removeEventListener('click', handleClick)
            isXRound = !isXRound
            currentPlayer = !currentPlayer
            updateRoundText()

            let hasEnded = checkEnd()
            if (!hasEnded && !isPvP && !currentPlayer) makeAComputerMove(handleClick)
        })
    }
}

function areEqual(a, b, c)
{
    if (a !== 0 && a === b && b === c) return a
    return null
}

function getWinner()
{
    let p = pieces

    // Variando X
    for (let y = 0; y < 3; y++)
    {
        // Linhas
        for (let z = 0; z < 3; z++)
        {
            const lineResult = areEqual(p[0][y][z], p[1][y][z], p[2][y][z])
            if (lineResult !== null) return lineResult
        }

        // Diagonais
        var diagResult = areEqual(p[y][0][0], p[y][1][1], p[y][2][2])
        if (diagResult !== null) return diagResult
        diagResult = areEqual(p[y][2][0], p[y][1][1], p[y][0][2])
        if (diagResult !== null) return diagResult
    }

    // Variando Y
    for (let x = 0; x < 3; x++)
    {
        // Linhas
        for (let z = 0; z < 3; z++)
        {
            const lineResult = areEqual(p[x][0][z], p[x][1][z], p[x][2][z])
            if (lineResult !== null) return lineResult
        }

        // Diagonais
        var diagResult = areEqual(p[0][x][0], p[1][x][1], p[2][x][2])
        if (diagResult !== null) return diagResult
        diagResult = areEqual(p[2][x][0], p[1][x][1], p[0][x][2])
        if (diagResult !== null) return diagResult
    }

    // Variando Z
    for (let x = 0; x < 3; x++)
    {
        // Linhas
        for (let y = 0; y < 3; y++)
        {
            const lineResult = areEqual(p[x][y][0], p[x][y][1], p[x][y][2])
            if (lineResult !== null) return lineResult
        }

        // Diagonais
        var diagResult = areEqual(p[0][0][x], p[1][1][x], p[2][2][x])
        if (diagResult !== null) return diagResult
        diagResult = areEqual(p[2][0][x], p[1][1][x], p[0][2][x])
        if (diagResult !== null) return diagResult
    }

    // Check diagonals
    var diagResult = areEqual(p[0][0][0], p[1][1][1], p[2][2][2])
    if (diagResult !== null) return diagResult
    diagResult = areEqual(p[0][2][0], p[1][1][1], p[2][0][2])
    if (diagResult !== null) return diagResult
    diagResult = areEqual(p[0][0][2], p[1][1][1], p[2][2][0])
    if (diagResult !== null) return diagResult
    diagResult = areEqual(p[0][2][2], p[1][1][1], p[2][0][0])
    if (diagResult !== null) return diagResult

    // Sem vitória
    return null
}

function checkEnd()
{
    let winnerNum = getWinner()

    if (winnerNum)
        message.innerHTML = (!currentPlayer) ? 'O JOGADOR 1 VENCEU!' : (isPvP ? 'O JOGADOR 2 VENCEU!' : 'O COMPUTADOR VENCEU!')
    else if (piecesCont == 27)
        message.innerHTML = 'DEU VELHA!'
    else
        return false
    
    document.querySelector('#stopper').style.display = 'flex'
    document.querySelector('#gameOver').style.display = 'flex'
    return true
}

function main()
{
    clearBoard()
    showStartPanel()
    addOptionsListeners()
    addButtonsListeners()
}

main()