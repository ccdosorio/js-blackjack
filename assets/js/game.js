const myModule = (() => {
    'use strict';

    // Baraja
    let deck = [];
    const cardTypes = ['C', 'D', 'H', 'S'],
        specialCards = ['A', 'J', 'Q', 'K'];

    let playerPoints = [];

    // Referencias HTML
    const btnRequest = document.querySelector('#btnRequest'),
        btnNewGame = document.querySelector('#btnNewGame'),
        btnStop = document.querySelector('#btnStop');

    const htmlPoints = document.querySelectorAll('small'),
        divPlayersHand = document.querySelectorAll('.player-hand');

    const initGame = (numPlayers = 2) => {
        deck = createDeck();
        playerPoints = [];
        for (let i = 0; i < numPlayers; i++) {
            playerPoints.push(0);
        }

        htmlPoints.forEach(element => element.innerText = 0);
        divPlayersHand.forEach(element => element.innerHTML = '');

        btnRequest.classList.remove('disabled-button');
        btnStop.classList.remove('disabled-button');
    }

    // Crear una nueva baraja
    const createDeck = () => {

        deck = [];

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
        return _.shuffle(deck);
    }

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

    // Turno: 0 = primer jugador y el ultimo sera la computadora
    const accumulatePoints = (card, turn) => {
        playerPoints[turn] = playerPoints[turn] + cardValue(card);
        htmlPoints[turn].innerHTML = playerPoints[turn];
        return playerPoints[turn];
    }

    const createCard = (card, turn) => {
        const imgCard = document.createElement('img');
        imgCard.classList.add('card');
        imgCard.src = `assets/cards/${card}.png`;
        divPlayersHand[turn].append(imgCard);
    }

    const determinateWinner = () => {

        const [minimumPoints, machinePoints] = playerPoints;

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


    // Turno computadora
    const machineTurn = (minimumPoints) => {
        let machinePoints = 0;
        do {
            const card = requestCard();

            machinePoints = accumulatePoints(card, playerPoints.length - 1);
            createCard(card, playerPoints.length - 1);

        } while ((machinePoints < minimumPoints) && (minimumPoints <= 21));

        determinateWinner();
    }


    // Eventos

    btnRequest.addEventListener('click', () => {

        const card = requestCard();
        const points = accumulatePoints(card, 0);

        createCard(card, 0);

        if (points > 21) {
            console.warn('Lo siento mucho, perdiste!');
            btnRequest.classList.add('disabled-button');
            btnStop.classList.add('disabled-button');
            machineTurn(points);
        } else if (points === 21) {
            console.warn('21, Genial!');
            btnRequest.classList.add('disabled-button');
            btnStop.classList.add('disabled-button');
            machineTurn(points);
        }
    });

    btnStop.addEventListener('click', () => {
        btnRequest.classList.add('disabled-button');
        btnStop.classList.add('disabled-button');

        machineTurn(playerPoints[0]);
    });

    btnNewGame.addEventListener('click', () => {
        initGame();
    });

    // Todo lo que se retorne, sera publico
    return {
        newGame: initGame
    };
})();