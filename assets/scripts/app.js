const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 17 ; 

const MODE_ATTACK = 'ATTACK' // 0
const STRONG_MODE_ATTACK = 'STRONG_ATTACK' // 1

const LOG_EVENT_PLAYER_ATTACK = 'Il_giocatore_attacca';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'Il_giocatore_attacca_forte';
const LOG_EVENT_MONSTER_ATTACK = 'Il_mostro_attacca';
const LOG_EVENT_PLAYER_HEALT = 'Il_giocatore_si_sta_curando'
const LOG_EVENT_GAME_OVER = 'Fine partita!'

const enteredNumber = prompt('Inserisci la vita massima del tuo personaggio','100');
let chosenMaxLife = parseInt(enteredNumber);

let battleLog = [];

// //! Come generare degli errori personalizzati 

// function getUserInput(){
    //     const enteredNumber = prompt('Inserisci la vita massima del tuo personaggio','100');
//     let parseInput = parseInt(enteredNumber);
    
//     if(isNaN(parseInput) || parseInput <= 0){
//     throw{ message: "the user input isn't a number"}
//     }
//      return parseInput ;
// }

// let chosenMaxLife = getUserInput();


// Prima verifica user input
if(isNaN(chosenMaxLife) || chosenMaxLife <= 0 || chosenMaxLife >= 500){
    chosenMaxLife = 100;
}

let currentHealtMonster = chosenMaxLife;
let currentHealtPlayer = chosenMaxLife;
let bonusLife = true ;
// regolatore vita massima 
adjustHealthBars(chosenMaxLife);

// rendiamo questa funzione una funzione più pura che funziona solo con i dati forniti invece di prendere un valore globale
function writeToLog(event,valAtt,healtMonst,healtPlay){

    let logEntry = {
        event:event,
        statoSaluteDelMostro:parseInt(healtMonst),
        statoSaluteDelPlayer:parseInt(healtPlay),
    };

    switch(event){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.valueAttackPlayer = parseInt(valAtt),
            logEntry.target = 'Attacca il Monster';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.valueAttackPlayerStrong = parseInt(valAtt),
            logEntry.target = 'Monster';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.valueAttackMonster = parseInt(valAtt),
            logEntry.target = 'Attaco al Player';
            break;
        case LOG_EVENT_PLAYER_HEALT:
            logEntry.valoreCura = parseInt(valAtt);
            logEntry.target = 'Heal Player';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry.resultMatch = valAtt;
            break;
    }
    battleLog.push(logEntry);



    // if(event === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.valueAttackPlayer = parseInt(valAtt),
    //     logEntry.target = 'Attacca il Monster';

    // } else if ( event === LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry.valueAttackPlayerStrong = parseInt(valAtt),
    //     logEntry.target = 'Monster';

    // } else if ( event === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry.valueAttackMonster = parseInt(valAtt),
    //     logEntry.target = 'Attaco al Player';
            
    // } else if ( event === LOG_EVENT_PLAYER_HEALT){
    //     logEntry.valoreCura = valAtt;
    //     logEntry.target = 'Heal Player';

    // } else if ( event === LOG_EVENT_GAME_OVER){
    //     logEntry.resultMatch = valAtt;
    // }
    // battleLog.push(logEntry);
}
console.log('Ciao')
function writeInLog(){
    let i = 0 ; 
    for(let logEntry of battleLog){
        console.log('-----------')
        console.log(`posizione nell'array: ${i}`);
        for(const key in logEntry){
            console.log(`${key} : ${logEntry[key]}`);
        };
        i++ ; 
    }
    console.log(battleLog);
}

function reset(){
    currentHealtMonster = chosenMaxLife;
    currentHealtPlayer = chosenMaxLife;
    resetGame(chosenMaxLife);
}

// attack on the player, condition of match;
function endRound(){
    let initialHealtPlayer = currentHealtPlayer;
    
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentHealtPlayer -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK, 
        playerDamage, 
        currentHealtMonster, 
        currentHealtPlayer
        );
    
    if(currentHealtPlayer <= 0 && bonusLife) {
        bonusLife = false;
        removeBonusLife();
        // initialHealtPlayer = 50 ; 
        // increasePlayerHealth(initialHealtPlayer);
        currentHealtPlayer = initialHealtPlayer;
        // console.log(initialHealtPlayer)
        setPlayerHealth(initialHealtPlayer);
        alert('YOU WOULD BE DEAD BUT THE BONUS LIFE SAVED YOU')
    }

    if (currentHealtMonster <= 0 && currentHealtPlayer > 0){
        
        alert('HAI VINTO!!');

        writeToLog(
        LOG_EVENT_GAME_OVER,
        'YOU WON',
        currentHealtMonster,
        currentHealtPlayer,
        );

        reset();
    } else if (currentHealtPlayer <= 0 && currentHealtMonster > 0){

        alert('HAI PERSO');

        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentHealtMonster,
            currentHealtPlayer,
            );

        reset();

    } else if (currentHealtPlayer <= 0 && currentHealtMonster <= 0){

        alert('HAI PAREGGIATO');

        writeToLog(
            LOG_EVENT_GAME_OVER,
            'YOU DRAW',
            currentHealtMonster,
            currentHealtPlayer,
            );

        reset();
        
    }
    if(currentHealtMonster <= 0 || currentHealtPlayer <= 0){
        reset();
    }
}
// Logica per la modalità d'attacco (attack or strongAttack) la quale differisce nelle due funzioni di attacco nomarle e strong 
function attackMode(modeAttack){
    const maxDamge = modeAttack === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logAttackEvent = modeAttack === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK; 
    // if(modeAttack === MODE_ATTACK){

    //     maxDamge = ATTACK_VALUE;
    //     logAttackEvent = LOG_EVENT_PLAYER_ATTACK;

    // } else if (modeAttack === STRONG_MODE_ATTACK){
    //     maxDamge = STRONG_ATTACK_VALUE;
    //     logAttackEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const monsterDamage = dealMonsterDamage(maxDamge);
    currentHealtMonster -= monsterDamage;

    writeToLog(
        logAttackEvent,
        monsterDamage,
        currentHealtMonster,
        currentHealtPlayer,
         )

    endRound();
}

// attack normal
function attackHandler(){
   
    attackMode(MODE_ATTACK);

}

// Attack strong on the monster
function strongAttackHandler(){
   
    attackMode(STRONG_MODE_ATTACK);
    
}

// heal healt player
function healPlayerHandler(){
    let healValue;
    if(currentHealtPlayer >= chosenMaxLife - HEAL_VALUE){
        healValue = chosenMaxLife - currentHealtPlayer ;
        alert('NON PUOI CURARTI PIU DELLA TUA VITA, VALORE DI CURA' // + parseInt(healValue)
        )
    } else {
        healValue = HEAL_VALUE;
        
    }
    increasePlayerHealth(healValue);
    currentHealtPlayer += healValue;

    writeToLog(
        LOG_EVENT_PLAYER_HEALT,
        healValue,
        currentHealtMonster,
        currentHealtPlayer,
        );
    endRound();
}



attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', writeInLog);