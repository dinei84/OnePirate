class GameState {
    constructor() {
        this.players = [];
        this.selectedFruits = [[], []];
        this.currentScreen = 'player-setup';
        this.gameMode = '1v1';
    }

    initializePlayers() {
        const p1Name = document.getElementById('player1-name').value || 'Jogador 1';
        this.players[0] = new Player(p1Name, this.selectedFruits[0]);
        
        if(this.gameMode === '1v1') {
            const p2Name = 'Jogador 2'; // Implementar entrada para jogador 2
            this.players[1] = new Player(p2Name, this.selectedFruits[1]);
        } else {
            this.players[1] = new ComputerPlayer(this.selectedFruits[1]);
        }
    }

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        this.currentScreen = screenId;
    }
}

const gameState = new GameState();

// Inicialização do Jogo
document.addEventListener('DOMContentLoaded', () => {
    // Configuração de Modo de Jogo
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.gameMode = btn.dataset.mode;
        });
    });

    // Iniciar Batalha
    document.getElementById('start-battle').addEventListener('click', () => {
        gameState.switchScreen('fruit-select');
        loadFruitSelection();
    });

    // Sistema de Batalha
    const battleSystem = new BattleSystem();
    
    document.querySelectorAll('.battle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            battleSystem.executeAction(action);
        });
    });
});

function loadFruitSelection() {
    const grid = document.getElementById('fruit-selection');
    
    // Carregar frutas disponíveis
    Object.values(frutas).forEach(fruta => {
        const card = document.createElement('div');
        card.className = 'fruit-card';
        card.innerHTML = `
            <img src="assets/fruits/thumbnails/${fruta.nome.toLowerCase()}.png" width="40">
            <h4>${fruta.nome}</h4>
            <p>⚔️${fruta.ataque} 🛡️${fruta.defesa}</p>
        `;
        
        card.addEventListener('click', () => selectFruit(fruta, card));
        grid.appendChild(card);
    });
}

function selectFruit(fruta, element) {
    const currentPlayer = gameState.currentPlayer;
    const selected = gameState.selectedFruits[currentPlayer];
    
    if(selected.length < 3 && !selected.includes(fruta)) {
        selected.push(fruta);
        element.classList.add('selected');
        updateSelectionDisplay();
    }
}

function updateSelectionDisplay() {
    const count = gameState.selectedFruits[gameState.currentPlayer].length;
    document.getElementById('selected-count').textContent = `${count}/3`;
    document.getElementById('confirm-selection').disabled = count !== 3;
}