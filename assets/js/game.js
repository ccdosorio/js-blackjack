/**
 * 2C = Two of Clubs
 * 2D = Two of Diamonds
 * 2H = Two of Hearts
 * 2S = Two of Spades
 */

// Baraja
let deck = [];
const cardTypes = ['C', 'D', 'H', 'S'];
const specialCards = ['A', 'J', 'Q', 'K'];

let playerPoints = 0;
let machinePoints = 0;


// Referencias HTML
const btnRequest = document.querySelector('#btnRequest');
const btnNewGame = document.querySelector('#btnNewGame');
const btnStop = document.querySelector('#btnStop');
const htmlPoints = document.querySelectorAll('small');
const playerHand = document.getElementById('player-hand');
const machineHand = document.getElementById('machine-hand');

// Crear una nueva baraja
const createDeck = () => {
    // 2 numero menor de cartas y 10 el mayor
    for (let i = 2; i <= 10; i++) {
        for (const type of cardTypes) {
            deck.push(i + type);
        }
    }

    for (const type of cardTypes) {
        for (const special of specialCards) {
            deck.push(special + type);
        }
    }

    // Orden aleatorio del deck
    deck = _.shuffle(deck);
    console.log(deck);

    return deck;
}

createDeck();

// Funcion para tomar una carta

const requestCard = () => {

    if (deck.length === 0) {
        throw 'No hay cartas en el deck';
    }

    return deck.pop();
}

const cardValue = (card) => {
    const value = card.substring(0, card.length - 1);
    // Is not a number

    return (isNaN(value)) ?
        (value === 'A') ? 11 : 10
        : Number(value);
}

const generateImg = (classImg, elementHtml, card) => {
    const imgCard = document.createElement('img');
    imgCard.classList.add(classImg);
    imgCard.src = `assets/cards/${card}.png`;
    elementHtml.append(imgCard);
}

/**
 * DOM:
 * querySelector -> retorna el primer elemento que cumple la condicion
 * querySelectorAll -> retorna un arreglo con los elementoss
 */

// Turno computadora

const machineTurn = (minimumPoints) => {

    do {
        const card = requestCard();
        machinePoints = machinePoints + cardValue(card);
        htmlPoints[1].innerHTML = machinePoints;

        generateImg('card', machineHand, card);

        if (minimumPoints > 21) {
            break;
        }

    } while ((machinePoints < minimumPoints) && (minimumPoints <= 21));

    setTimeout(() => {
        if (machinePoints === minimumPoints) {
            Swal.fire('Nadie gana :(');
        } else if (minimumPoints > 21) {
            Swal.fire('Computadora gana!');
        } else if (machinePoints > 21) {
            Swal.fire('Jugador gana!');
        } else {
            Swal.fire('Computadora gana!');
        }
    }, 100);
}


// Eventos

btnRequest.addEventListener('click', () => {
    const card = requestCard();
    playerPoints = playerPoints + cardValue(card);
    htmlPoints[0].innerHTML = playerPoints;

    generateImg('card', playerHand, card);

    if (playerPoints > 21) {
        console.warn('Lo siento mucho, perdiste!');
        btnRequest.disabled = true;
        btnStop.disabled = true;
        machineTurn(playerPoints);
    } else if (playerPoints === 21) {
        console.log('21, Genial!');
        btnRequest.disabled = true;
        btnStop.disabled = true;
        machineTurn(playerPoints);
    }
});

btnStop.addEventListener('click', () => {
    btnRequest.disabled = true;
    btnStop.disabled = true;

    machineTurn(playerPoints);
});

btnNewGame.addEventListener('click', () => {

    console.clear();
    deck = [];
    deck = createDeck();

    playerPoints = 0;
    machinePoints = 0;

    htmlPoints[0].innerText = 0;
    htmlPoints[1].innerText = 0;

    playerHand.innerHTML = '';
    machineHand.innerHTML = '';

    btnRequest.disabled = false;
    btnStop.disabled = false;

});