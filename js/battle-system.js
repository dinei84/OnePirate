class BattleSystem {
    constructor() {
        this.turn = 0;
        this.actions = [];
        this.effects = [];
    }

    executeAction(action) {
        const currentPlayer = this.getCurrentPlayer();
        const targetPlayer = this.getTargetPlayer();
        
        switch(action) {
            case 'attack':
                this.executeAttack(currentPlayer, targetPlayer);
                break;
                
            case 'skill':
                if(currentPlayer.fruta.energy >= currentPlayer.fruta.custo) {
                    this.executeSkill(currentPlayer, targetPlayer);
                }
                break;
                
            case 'defend':
                currentPlayer.defendendo = true;
                this.log(`${currentPlayer.nome} está defendendo!`);
                break;
                
            case 'switch':
                this.switchFruit(currentPlayer);
                break;
        }
        
        this.nextTurn();
    }

    executeAttack(attacker, defender) {
        const dano = this.calculateDamage(attacker, defender);
        defender.fruta.hp -= dano;
        
        this.log(`${attacker.nome} atacou causando ${dano} dano!`);
        this.playAnimation('attack', attacker);
    }

    calculateDamage(attacker, defender) {
        let damage = attacker.fruta.ataque - (defender.fruta.defesa / 2);
        
        // Elementos
        if(attacker.fruta.forteContra.includes(defender.fruta.tipo)) {
            damage *= 1.5;
            gameState.players[this.turn%2].pontos += 3;
        }
        
        if(attacker.fruta.fracoContra.includes(defender.fruta.tipo)) {
            damage *= 0.7;
        }
        
        return Math.max(1, Math.round(damage));
    }

    nextTurn() {
        this.turn++;
        this.updateUI();
        this.checkWinCondition();
    }

    updateUI() {
        // Atualizar barras de HP e energia
        gameState.players.forEach((player, index) => {
            const fruta = player.frutaAtiva;
            
            // Atualizar HP
            const hpBar = document.querySelector(`.player${index+1}-info .hp-bar`);
            hpBar.style.width = `${(fruta.hp / fruta.maxHp) * 100}%`;
            
            // Atualizar Energia
            const energyBar = document.querySelector(`.player${index+1}-info .energy-bar`);
            energyBar.style.width = `${fruta.energia}%`;
        });
    }

    playAnimation(type, source) {
        const animationElement = document.createElement('div');
        animationElement.className = `animation ${type}`;
        
        if(type === 'attack') {
            animationElement.style.left = source === 0 ? '30%' : '70%';
        }
        
        document.querySelector('.battle-effects').appendChild(animationElement);
        
        setTimeout(() => {
            animationElement.remove();
        }, 1000);
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        document.getElementById('battle-log').appendChild(entry);
    }
}