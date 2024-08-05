function main() {
    console.log('main called');

    const form = document.querySelector('.start form');
    const startValuesInput = document.querySelector('#startValues');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        
        console.log(startValuesInput.value);

        console.log('clicked');
        this.classList.add('hidden'); // Hide the form

        const startValues = startValuesInput.value ? startValuesInput.value.split(',').map(card => card.trim()) : [];
        const deck = createDeck(startValues);

        game(deck);

    });
}

function game(deck)
{
    const hands = dealCards(deck); // Deal cards to the player and computer

    console.log('Player hand:', hands.player);
    console.log('Computer hand:', hands.computer);

    console.log(calculateHandTotal(hands.player));
    console.log(calculateHandTotal(hands.computer));

    displayHand(hands.player, 'playerHand', false);
    displayHand(hands.computer, 'computerHand', true);

    displayTotals(calculateHandTotal(hands.player));
    createGameButtons(deck, hands.player, hands.computer);

}

function createDeck(startValues) {
    // Create a standard 52-card deck and shuffle it
    let deck = [...generateDeck()];

    // Add startValues to the top of the deck
    startValues.reverse().forEach(card => {
        deck.unshift({ face: card, suit: 'Diamonds' }); // Default suit is Diamonds
    });

    return deck;
}

function generateDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    let deck = [];

    suits.forEach(suit => {
        faces.forEach(face => {
            deck.push({ face, suit });
        });
    });

    return shuffle(deck);
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
    return deck;
}

function dealCards(deck) {
    // Deal cards alternately between the computer and player
    const computerHand = [];
    const playerHand = [];

    for (let i = 0; i < 4; i++) {
        if (i % 2 === 0) {
            computerHand.push(deck.shift());
        } else {
            playerHand.push(deck.shift());
        }
    }
    return {
        computer: computerHand,
        player: playerHand
    };
}

function ensureContainerExists(containerId) {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'hand';  // Assuming you want to use this class for styling
        document.body.appendChild(container);  // Append to body or another specific element
    }
    return container;
}

function displayHand(hand, containerId, isComputerHand) {
    const container = ensureContainerExists(containerId);
    container.innerHTML = '';  // Clear previous contents

    hand.forEach((card, index) => {
        // For the computer's first card, don't reveal it if isComputerHand is true
        const cardText = isComputerHand && index === 0 ? '??' : `${card.face} of ${card.suit}`;
        const cardElement = createCardElement(cardText);
        container.appendChild(cardElement);
    });
}

function createCardElement(cardText) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.textContent = cardText;
    return cardDiv;
}


function calculateHandTotal(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.face === 'A') {
            aces++;
            total += 11;
        } else if (['J', 'Q', 'K'].includes(card.face)) {
            total += 10;
        } else {
            total += parseInt(card.face, 10);
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function createTotalElement(id) {
    const totalElement = document.createElement('div');
    totalElement.id = id;
    document.body.appendChild(totalElement); // Append to a more specific element if needed
    return totalElement;
}

function displayTotals(playerTotal, computerTotal) {
    const playerTotalElement = document.getElementById('playerTotal') || createTotalElement('playerTotal');
    playerTotalElement.textContent = `Player Total: ${playerTotal}`;

    const computerTotalElement = document.getElementById('computerTotal') || createTotalElement('computerTotal');
    computerTotalElement.textContent = `Computer Total: ?`;
}


function ensureElementExists(elementId, text) {
    let element = document.getElementById(elementId);
    if (!element) {
        element = document.createElement('div');
        element.id = elementId;
        element.textContent = text;
    }
    return element;
}

function createGameButtons(deck, playerHand, computerHand) {
    const hitButton = createButton('hitButton', 'Hit');
    hitButton.addEventListener('click', function() {
        hit(deck, playerHand);
    });

    const standButton = createButton('standButton', 'Stand');
    standButton.addEventListener('click', function() {
        stand(deck, playerHand, computerHand); // Ensure playerHand and computerHand are passed
    });

    const gameArea = document.querySelector('.game');
    gameArea.appendChild(hitButton);
    gameArea.appendChild(standButton);
}


function createButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    return button;
}

function hit(deck, playerHand) {
    playerHand.push(deck.shift()); // Add the next card from the deck to the player's hand
    displayHand(playerHand, 'playerHand', false); // Update the user's hand display
    const playerTotal = calculateHandTotal(playerHand);
    console.log(playerTotal)
    displayTotals(playerTotal, '?'); // Update the player's total display

    if (playerTotal > 21) {
        // Player busts
        alert('Busted! You lose.');
        // Logic to end the hand
    }
}

function stand(deck, playerHand, computerHand) {
    let computerTotal = calculateHandTotal(computerHand);
    console.log(computerTotal);
    while (computerTotal < 17) { // Example threshold
        computerHand.push(deck.shift()); // Computer hits
        computerTotal = calculateHandTotal(computerHand);
    }
    displayHand(computerHand, 'computerHand', true); // Update the computer's hand display
    displayTotals(calculateHandTotal(playerHand), computerTotal); // Update the computer's total display

    // Determine the winner
    determineWinner(playerHand, computerHand);
}


function determineWinner(playerHand, computerHand) {
    const playerTotal = calculateHandTotal(playerHand);
    const computerTotal = calculateHandTotal(computerHand);

    if (playerTotal > 21) {
        alert('You busted. Computer wins!');
    } else if (computerTotal > 21 || playerTotal > computerTotal) {
        alert('You win!');
    } else if (playerTotal < computerTotal) {
        alert('Computer wins!');
    } else {
        alert('It\'s a tie!');
    }
}





document.addEventListener('DOMContentLoaded', main);
