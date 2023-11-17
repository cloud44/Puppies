const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2308-ACC-ET-WEB-PT-A';
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

let localPlayers = []; // Local array to store player data

// Function to fetch all players from the API
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        return data.data.players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

// Function to render all players
const renderAllPlayers = (playerList) => {
    try {
        let playerContainerHTML = '';
        playerList.forEach(player => {
            playerContainerHTML += `
                <div class="player-card">
                    <img src="${player.imageUrl}" alt="${player.name}">
                    <h3>${player.name}</h3>
                    <p class="player-details">Breed: ${player.breed}</p>
                    <p class="player-details">Status: ${player.status}</p>
                    <button id="details-${player.id}">See details</button>
                    <button id="remove-${player.id}">Remove from roster</button>
                </div>
            `;
        });
        playerContainer.innerHTML = playerContainerHTML;

        playerList.forEach(player => {
            document.getElementById(`details-${player.id}`).onclick = () => fetchSinglePlayer(player.id);
            document.getElementById(`remove-${player.id}`).onclick = () => removePlayer(player.id);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

// Function to handle "See details" action
const fetchSinglePlayer = (playerId) => {
    try {
        const player = localPlayers.find(p => p.id === playerId);
        if (player) {
            alert(JSON.stringify(player));
        } else {
            console.error(`Player with ID ${playerId} not found`);
        }
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// Function to handle "Remove from roster" action
const removePlayer = (playerId) => {
    try {
        localPlayers = localPlayers.filter(p => p.id !== playerId);
        renderAllPlayers(localPlayers);
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

// Function to handle adding new players
const addNewPlayer = (playerObj) => {
    try {
        const newPlayer = {
            id: localPlayers.length + 1 + Math.max(0, ...localPlayers.map(p => p.id)),
            name: playerObj.name,
            breed: playerObj.breed,
            status: 'bench',
            imageUrl: playerObj.imageUrl,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            teamId: null,
            cohortId: null
        };
        localPlayers.push(newPlayer);
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

// Function to render the form for adding new players
const renderNewPlayerForm = () => {
    try {
        const formHTML = `
            <form id="add-player-form">
                <input type="text" id="player-name" placeholder="Player name" required>
                <input type="text" id="player-breed" placeholder="Player breed" required>
                <input type="url" id="player-image-url" placeholder="Player image URL" required>
                <button type="submit">Add Player</button>
            </form>
        `;
        newPlayerFormContainer.innerHTML = formHTML;
        document.getElementById('add-player-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const playerName = document.getElementById('player-name').value;
            const playerBreed = document.getElementById('player-breed').value;
            const playerImageUrl = document.getElementById('player-image-url').value;
            addNewPlayer({ name: playerName, breed: playerBreed, imageUrl: playerImageUrl });
            renderAllPlayers(localPlayers);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

// Initialize the application
const init = async () => {
    const playersFromAPI = await fetchAllPlayers();
    if (playersFromAPI) {
        localPlayers = playersFromAPI;
    }
    renderAllPlayers(localPlayers);
    renderNewPlayerForm();
};

init();
