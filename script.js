
//NIJE OBELEZENO ALI ISPOD IMAM OBJASNJENJA.
//*********************requestAnimationFrame OK OBJASNJENO IMA I U WORDU *********************
//https://medium.com/@sureshkumar.anbu88/creating-animations-with-the-requestanimationframe-function-in-html5-decf5ff4daec 

//1.
const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p")   //Ovo nisam znao da moze. Selector kao u CSS-u targetuje child.
const ctx = canvas.getContext("2d");        //canvas i getoContext() ima na googlu.
canvas.width = innerWidth;                          //Ovde innerWidth valjda predstavlja unutrasnju sirinu browser prozora. Tako da nam je valjda sirina canvas-a jednaka sirini ekrana. Step 6. - The innerWidth property is a number that represents the interior width of the browser window.
canvas.height = innerHeight;                        //Step 7. - The innerHeight property is a number that represents the interior height of the browser window.
const gravity = 0.5;                                //Step 8. - In your platformer game, the main player will need to jump between the different platforms. When the player jumps, you will need to apply gravity to bring them back down. Create a new const variable called gravity and assign it the number 0.5. 
let isCheckpointCollisionDetectionActive = true;    //Step 9. - In the game, the player will have the opportunity to cross different checkpoints. You will need to keep track of the status for the checkpoint collision detection. Use let to create a new variable called isCheckpointCollisionDetectionActive and assign it the value of true.
const proportionalSize = (size) => {                //Step 10. - As you are designing the game, you will need to make sure that the size of the elements in the game are responsive and adapt to different screen sizes. Start by creating an arrow function called proportionalSize that takes in a size parameter.       
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size     //Step 11. - The width and the height of the main player, platforms and checkpoints will be proportional sized relative to the innerHeight of the the browser screen. The goal is to make the game responsive and visually consistent across different screen sizes.
};
//2.
class Player {
    constructor() {
        this.position = {               //**********************PROVERITI sta radi !!! Ovde namestam da pozicija igraca bude uvek na x,y poziciji u odnosu na velicinu ekrana.
            x: proportionalSize(10),    //Ovde su samo zadate pocetne vrednosti. U funkciji update() su zadate vrednosti pozicije rectangla kad aktiviramo igru.
            y: proportionalSize(400),
        };
        this.velocity = {               //Step 16. - The velocity property will be used to store the player's speed in the x and y directions.
            x: 0,
            y: 0,
        };
        this.width = proportionalSize(40);      //Step 17. - You are using the proportionalSize() function here to set the width and height properties of your class to be proportional to the height of the screen.
        this.height = proportionalSize(40);
    }

    draw() {
        ctx.fillStyle = "#99c9ff";          //The fillStyle property sets or returns the color, gradient, or pattern used to fill the drawing. https://www.w3schools.com/tags/canvas_fillstyle.asp 
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);    //Crta rectangle https://www.w3schools.com/jsref/canvas_fillrect.asp 

    }

    update() {              //Step 21. - The next step is to create an update() method which will be responsible for updating the player's position and velocity as it moves throughout the game.
        this.draw();        //Step 22. - Inside the update() method, call the draw() method to ensure that the player is continually drawn on the screen as the game updates.
        this.position.x += this.velocity.x;//X2
        // console.log("Gornja pozicija x: " + this.position.x)
        this.position.y += this.velocity.y;     //y se menja kada player skoci.
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {         //********** PROVERITI jel radi i sa innerHeight umesto canvas.height.  Step 25. - Right now, when the player jumps up, it is possible for it to move past the height of the canvas. To fix that, you will need to add a condition to stop the player from falling past the height of the canvas. Create an empty if statement that checks if the sum of the player's y position, height, and y velocity is less than or equal to the height of the canvas.
            if (this.position.y < 0) {
               this.position.y = 0;
               this.velocity.y = gravity;
            }
            this.velocity.y += gravity;  //XX  ovo mi je referenca za "XXX" objasnjenje.
        } else {
            this.velocity.y = 0;        //X  ovo mi je referenca za "XXX" objasnjenje.
        }

        if (this.position.x < this.width) {     //Ovde ako player pokusa da se priblizi levoj ivici blize nego koliko je player rectangle sirok onda nece moci jer onda razmak x postaje jednak sirini rectangla.
            this.position.x = this.width;
        }

        if (this.position.x >= canvas.width - 2 * this.width) {         //Ovo valjda ne dozvoljava da se player rectaangle priblizi desno strani blize od dve sirine rectangla.
            this.position.x = canvas.width - 2 * this.width;
        }
    }
}
//3.
const player = new Player();        //KREIRAM PLAYER OBJEKAT.


const animate = () => {
    requestAnimationFrame(animate);         //Ima i u wordu ali jos nisam siguran sta radi.
    ctx.clearRect(0, 0, canvas.width, canvas.height);       //ima na googlu.
    platforms.forEach((platform) => platform.draw());    //** ispod. Ovo je ovde dodato posle koraka 10. koji je nize u kodu kad skrolujem.
    checkpoints.forEach((checkpoint) => checkpoint.draw());     //Dodato posle koraka 20.
    player.update();
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {       // ********* OVO ***********Step 46. - You need to use the proportionalSize function here to make sure the player's x position is always proportional to the screen size.
        player.velocity.x = 5;//X3
        // console.log("velocity: " + player.velocity.x)
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {     // ***OVO  You need to use the proportionalSize function here to make sure the player's x position is always proportional to the screen size.
        player.velocity.x = -5; 
    } else {
        player.velocity.x = 0;
        // console.log(player.velocity.x)
        // console.log(player.velocity.y)
        // console.log("VISINA SKOKA: " + (innerHeight - player.position.y))  //XXXX  
        
        //Step 78. - If you try to start the game, you will notice that the platforms are rendered on the screen. But as the player moves to the right, the platform does not move with it. To fix this issue, you will need to update the platform's x position as the player moves across the screen. Inside the animate function, add a condition to check if the right key was pressed and if the isCheckpointCollisionDetectionActive is true.
        if (keys.rightKey.pressed && isCheckpointCollisionDetectionActive) {        //proverava da li je i jednu u drugo true.
            platforms.forEach((platform) => {platform.position.x -= 5});            //Ovde smanjujem x jer kad rectangle ide u desno treba mi da platforme idu u levo.  Na freeCodeCamp mi je trazilo da stavim {} okolo platform.position.x -= 5 ali mislim da nema razloga za to.
            checkpoints.forEach((checkpoint) => {checkpoint.position.x -= 5});
        } else if (keys.leftKey.pressed && isCheckpointCollisionDetectionActive) {
            platforms.forEach((platform) => {
              platform.position.x += 5;         //Ovo sam ovako ostavio da bi skontao da je normalno da posle 5 ide ";"
            });
            checkpoints.forEach((checkpoint) => {checkpoint.position.x += 5});
        }
    }
    //Step 81. - When you start the game, you will notice that the position of the platforms is animating alongside the player. But if you try to jump below one of the platforms, then you will jump right through it. To fix this issue, you will need to add collision detection logic to the game. Start by calling the forEach method on the platforms array. For the callback function pass in platform as the parameter.
    platforms.forEach((platform) => {
        const collisionDetectionRules = [               //*** Ispod. Ovo je array. Do sad mislim da nisam imao ovakve vrednosti unutar array-a ali to ce biti true ili false vrednosti.  
            player.position.y + player.height <= platform.position.y,   //Ako je istinito dace true, a ako nije dace false. To vazi i za ove uslove ispod.
            player.position.y + player.height + player.velocity.y >= platform.position.y,    
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <= platform.position.x + platform.width - player.width / 3
        ];
        if (collisionDetectionRules.every((rule) => rule)) {    //Proverava da li je svaki clan array-a true.
            player.velocity.y = 0;
            return;
          }

        const platformDetectionRules = [
            player.position.x >= platform.position.x - player.width / 2,
            player.position.x <=platform.position.x + platform.width - player.width / 3,
            player.position.y + player.height >= platform.position.y,
            player.position.y <= platform.position.y + platform.height
        ];  
        if (platformDetectionRules.every((rule) => rule)) {
            player.position.y = platform.position.y + player.height;
            player.velocity.y = gravity;
        }
    })
    //Step 109. - The last few steps involve updating the animate function to display the checkpoint screen when the player reaches a checkpoint. Start by adding a forEach to the checkpoints array. For the callback function, use checkpoint, index and checkpoints for the parameters.
    checkpoints.forEach((checkpoint, index, checkpoints) => {   //Ima na googlu sta je sta kad ima vise od jednog parametra.
        const checkpointDetectionRules = [
            player.position.x >= checkpoint.position.x,
            player.position.y >= checkpoint.position.y,
            player.position.y + player.height <= checkpoint.position.y + checkpoint.height,
            isCheckpointCollisionDetectionActive,
            player.position.x - player.width <= checkpoint.position.x - checkpoint.width + player.width * 0.9, //PROVERICU. Ovo mislim da se odnosi na to kad hocu da pokupim checkpoint sa desne strane. Da je dovoljno da zagazim samo player.width * 0.1 unutar checkpointa. 
            index === 0 || checkpoints[index - 1].claimed === true,  //**** Ispod. Proverava da li je index checkpointa 0 pokupljen (znaci da li je prvi checkpoint pokupljen) ILI da li je prethodni check point pokupljen. Znaci 
        ];
        if (checkpointDetectionRules.every((rule) => rule)) {   //Proverava da li je svaki uslov za dovoljen. Ako je svaki uslov true onda vraca true, a ako je je barem jedan uslov false onda vraca false.
            checkpoint.claim();      //Znaci tek kad pokujpim prvi checkpoint u koraku "****" onda drugi uslov postaje tacan, ali samo za sledeci index. Onda kad pokupim taj sedeci postaje tacan.
            if (index === checkpoints.length - 1) {     //Proverava da li je player pokupio krajnji checkpoint (checkpoint.length - 1).
                isCheckpointCollisionDetectionActive = false;
                showCheckpointScreen("You reached the final checkpoint!");
                movePlayer("ArrowRight", 0 , false);
            } else if (player.position.x >= checkpoint.position.x && player.position.x <=checkpoint.position.x + 40) {
                showCheckpointScreen("You reached a checkpoint!")
              }
        }
    })

};

const keys = {              //Step 44. - To manage the player's movement in the game, you will need to monitor when the left and right arrow keys are pressed. Create a new const variable called keys and assign it an empty object.
    rightKey: {
        pressed: false
    },
    leftKey: {
        pressed: false
    }
};

const movePlayer = (key, xVelocity, isPressed) => {         //Step 50. - The next step is to add the functionality that will be responsible for moving the player across the screen.
    if (!isCheckpointCollisionDetectionActive) {            //Proveravam jel ovo u zagradi false. Zato sam stavio "!" ispred, jer je gore zadato da je isCheckpointCollisionDetectionActive = true. Isto bi bilo i da sam ovo stavio u zagradu (isCheckpointCollisionDetectionActive === false).
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }
    switch (key) {
        case "ArrowLeft":
            keys.leftKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x = -xVelocity;
        break;

        case "ArrowUp":                 //Mogu vise case da grupisem ovako ako rade isto.
        case " ":
        case "Spacebar":
            player.velocity.y -= 8;     //XXX OBJASNJENJE ISPOD KAKO SKOK RADI.
            // console.log("Pocetno y: " + (innerHeight - player.position.y))  //XXXXX
        break;

        case "ArrowRight":
            keys.rightKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x = xVelocity;//X1
            // console.log(key)
            // console.log(player.velocity.x)
            // console.log("Donja pozicija x: " + player.position.x)
            
    }
}


const startGame = () => {       //Step 36. - Now it is time to see your new player drawn on the screen. Start by creating an empty arrow function called startGame.
    canvas.style.display = "block";               //Pokazuje canvas.
    startScreen.style.display = "none";           //Sklanja start screen.
    animate();

    // console.log(player.position.x)
    // console.log(player.width)
}

startBtn.addEventListener("click", startGame);
window.addEventListener("keydown", ({ key }) => {       //Ne znam zasto ali ovako kako sam zadao key je u stvari event.key. Step 59. - For the arguments, pass in the keydown event and an arrow function that uses the destructuring assignment to get the key property from the event object in the event listener parameter.
    movePlayer(key, 8, true);
});
window.addEventListener("keyup", ({ key }) => {
    movePlayer(key, 0 , false);
});


//SAD PRAVIM PLATFORME PO KOJIMA CE RECTANGLE DA SKACE.
class Platform {
    constructor(x,y) {          //Ovo mislim da nisam do sad radio. Da u constructor zadajem parametre.
        this.position = {       //Ima u wordu objasnjeno sta ovo u stvari znaci (ctrl+f Object(skraceno), shorthand, short, property name). Nije komplikovano samo je skraceno napisano.
            x,
            y,
          } 
        this.width = 200;       //Valjda sirina platforme.
        this.height = proportionalSize(40);         //OVDE IMA LIGIKE STO PREKO proportionalSize zadajemo. Sto je visina prozora manja, proporcionalno ce biti i visina platforme manja.
    }

    draw() {
        ctx.fillStyle = "#acd157";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const platformPositions = [             //Step 71. - The next step will be to create a list of positions for the platforms. Start by creating a new const variable called platformPositions and assign it an empty array.
    { x: 500, y: proportionalSize(450) },   //Ovo su objekti samo nisam pisao jedno ispod drugog da bi bilo preglednije.
    { x: 700, y: proportionalSize(400) },
    { x: 850, y: proportionalSize(350) },
    { x: 900, y: proportionalSize(350) },
    { x: 1050, y: proportionalSize(150) },
    { x: 2500, y: proportionalSize(450) },
    { x: 2900, y: proportionalSize(400) },
    { x: 3150, y: proportionalSize(350) },
    { x: 3900, y: proportionalSize(450) },
    { x: 4200, y: proportionalSize(400) },
    { x: 4400, y: proportionalSize(200) },
    { x: 4700, y: proportionalSize(150) },
];       

//10. Nisam redovno obelezavao pa sam stavio 10 cisto da bi gore u kodu mogao referencu da stavim.
const platforms = platformPositions.map((platform) => new Platform(platform.x, platform.y));     //* ispod. Step 75. - The next step is to create a list of new platform instances using the Platform class. You will later reference this list to draw the platforms on the canvas. Start by creating a new const variable called platforms and assign it platformPositions.map().


//OVDE RADIM NA CHECKPOINTIMA.  Step 93. - The last portion of the project is to add the logic for the checkpoints. When a player collides with a checkpoint, the checkpoint screen should appear. Start by creating a new class called CheckPoint.
class CheckPoint {
    constructor(x,y,z) {
        this.position = {
            x,
            y,
          };
        this.width = proportionalSize(40);
        this.height = proportionalSize(70);
        this.claimed = false;       //Step 97. - This property will be used to check if the player has reached the checkpoint.
    }
    draw() {
        ctx.fillStyle = "#f1be32";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    claim() {
        this.width = 0;
        this.height = 0;
        this.position.y = Infinity;     //Ima na googlu.   https://www.w3schools.com/jsref/jsref_infinity.asp
        this.claimed = true;
      }
}

const checkpointPositions = [
    { x: 1170, y: proportionalSize(80), z: 1 },
    { x: 2900, y: proportionalSize(330), z: 2 },
    { x: 4800, y: proportionalSize(80), z: 3 },
  ];

//20.
const checkpoints = checkpointPositions.map((checkpoint) => new CheckPoint(checkpoint.x, checkpoint.y, checkpoint.z));  //Ovde je slicno objasnjenje kao i kod "*".

//30.
const showCheckpointScreen = (msg) => {
    checkpointScreen.style.display = "block";       //Ovde prikazuje checkpointScreen kao block (misli se na ono block, inline, inline-block). A style koristim da meanjam css koliko se secam.
    checkpointMessage.textContent = msg;            //checkpointMessage zadato ne pocetku.
    if (isCheckpointCollisionDetectionActive) {         //Ovde ako je isCheckpointCollisionDetectionActive truthy(true), onda posle 2000(2 sekunde) sklanja checkpointScreen.
        setTimeout(() => {
            checkpointScreen.style.display = "none";
        }, 2000)
      }
};


// ____________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________
// Kada stisnem "rightArrow" aktiviram eventListener i pokrenem movePlayer(key, 8, true) funkciju.
// U kodu na mestu X1: se dodeljuje player.velocity.x = xVelocity sto je u stvari 8. 
// Na mestu X2:  this.position.x += this.velocity.x znaci rectangle se pomeri 8px u desno i onda imam repeat delay
// tastature u MOM SLUCAJU pola sekunde (ima u wordu objasnjeno) zbog cega se za to vreme dodeljuje da je
// X3: player.velocity.x = 5 sto znaci da se za vreme tih pola sekunde na mestu X2 dodeljuje 5. Kad prodje tih
// pola sekunde onda ce velocity da se menja izmedju 5 i 8 sto savisi od refresh rate monitora(60Hz) i repeat rate
// tastature(30Hz). Kada se rectangle pomeri desto toliko da player.position.x < proportionalSize(400) vise nije
// zadovoljeno onda se dodeljuje da je player.velocity.x = 8.
// Da naglasim da cim stisnem startGame onda se animate funkcija poziva sama od sebe 60 puta u sekundi (jer je
// to refresh rate mog monitora). A posiva se zbog requestAnimationFrame.
// ____________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________




// PRE NEGO STO UZMEM DA CITAM STA SE DESAVA TREBA DA SKLONIM "//" JER JE LAKSE ZA CITANJE.
// *********************requestAnimationFrame OK OBJASNJENO IMA I U WORDU *********************

// update() {              
//     this.draw();        //Crta rectangle
//     this.position.x += this.velocity.x;     //Ovo cu videti posle hoce mi biti jasnije.
//     this.position.y += this.velocity.y; 
    
//     // Ovde ispod imam uslov da ova tri kad saberem ako je manje od velicine ekrana onda je this.velocity.y += gravity
//     // ali imam i dodatini uslov this.position.y < 0 sto sprecava rectangle da predje visinu ekrana. Znaci
//     // kad rectangle dodirne gornju ivicu u tom momentu mu se dodeljuje this.position.y = 0 i 
//     // this.velocity.y = gravity.
//     // Ako pri uslov this.position.y + this.height + this.velocity.y <= canvas.height nije zadovoljen
//     // onda je this.velocity.y = 0 sto znaci da je rectangle na dnu stranice. Ovde koliko vidim usliv
//     // nije morao da bude "<=" posto radi i sa "<" i to mi ima vise logike.
//     if (this.position.y + this.height + this.velocity.y <= canvas.height) {         
//         if (this.position.y < 0) {
//            this.position.y = 0;
//            this.velocity.y = gravity;
//         }
//         this.velocity.y += gravity;    //Ovde += znaci da imam ubrzanje.   Probavao sam da testiram sta bude kad ovaj red obrisem,a iznad gde imam =gravity napisem +=graviti. U tom slucaju kad rectangle dodirne vrh prozora samo u tom momentu mu se dodeli gravity i cim padne palo ovaj uslov (this.position.y < 0) vise ne vazi tako da ubrzanje (+=) ni ne moze da ima dejstva.
//     } else {
//         this.velocity.y = 0;
//     }

//     // Ovaj statement ne dozvoljava rectanglu da price levoj ivici ekrana blize od sirine rectangla.
//     // Znaci minimalni razmak izmedju leve ivice ekrana i leve ivice rectangla ce biti jednak 
//     // sirini rectangla. 
//     if (this.position.x < this.width) {     //Ovde ako player pokusa da se priblizi levoj ivici blize nego koliko je player rectangle sirok onda nece moci jer onda razmak x postaje jednak sirini rectangla.
//         this.position.x = this.width;
//     }

//     // Ovaj statement ne dozvoljava rectanglu da price desnoj ivici ekrana blize od sirine rectangla.
//     // Znaci minimalni razmak izmedju desne ivice ekrana i desne ivice rectangla ce biti jednak 
//     // sirini rectangla. Tj minimalni razmak izmedju desne ivice ekrana i LEVE ivice rectangla ce biti jednak 
//     // 2 SIRINE RECRTANGLA. Zato u formuli ispod imamo *2 jer se uzimaju kordinate leve ivice rectangla.
//     if (this.position.x >= canvas.width - 2 * this.width) {         //Ovo valjda ne dozvoljava da se player rectaangle priblizi desno strani blize od dve sirine rectangla.
//         this.position.x = canvas.width - 2 * this.width;
//     }
// }

// //POJASNJENJA
// 1. U startGame funkciji je pozvana funkcjia animate(), a u njoj imamo requestAnimationFrame(animate)
// zbog cega se animate() funkcija poziva stalno (mislim da je 60 puta u secundi zato sto je refresh rate
// za moj monitor 60Hz). Imam neka objasnjenja u *****WORDU*****. Ima i repeat rate tastature.

// U funkciji animate() ne znam sto sam ovaj uslov stavljao player.position.x < proportionalSize(400).
// I ovaj player.position.x > proportionalSize(100). 
// Cak sta vise mislim da sve ovo ispod mogao nekako da zaobidjem samo bi trebao dosta koda da prepravim: 
// if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {       // ********* OVO ***********Step 46. - You need to use the proportionalSize function here to make sure the player's x position is always proportional to the screen size.
//     player.velocity.x = 5;
//     // console.log("Gornji velocity: " + player.velocity.x)
// } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {     // ***OVO  You need to use the proportionalSize function here to make sure the player's x position is always proportional to the screen size.
//     player.velocity.x = -5; 
// } else {
//     player.velocity.x = 0;
//     // console.log(player.velocity.x)
    
// }



// *
// const platforms = platformPositions.map((platform) => new Platform(platform.x, platform.y));
// Ovde radim map() na platformPositions. Znaci u prvoj iteraciji platform postaje prvi clan 
// arraya platformPositions sto je { x: 500, y: proportionalSize(450) }. Onda pozivam
// constructor function Platform (pozivam sa new Platform) i prosledjujem platform.x sto je 500 i 
// platform.y sto je proportionalSize(450). Ovde zadajem parametre na New Platform zato sto
// gore imam unutar constructor dva parametra (x,y).
// Posle toga u drugoj iteraciji platform postaje drugi clan arraya platformPositions i tako redom 
// dok se ne odradi map() sa svakom clanu platformPositions arraya.
// Znaci rezultat ce biti array u kome su clanovi objekti kreirani pozivanjem constructor funkcije, a 
// constructor funkcija i sluzi da pravi objekte.


// **
// platforms.forEach((platform) => platform.draw())
// U prvoj iteraciji je platform prvi clan arraya platforms sto je u stvari objekat i onda pozivamo metod draw()
// na tom objektu. Isto radimo za svaki clan platforms arraya.


// XXX (Ako mi nije jasno sto je "y" minus to je zato sto se "y" meri od vrha ekrana na dole pa da bi rectangle pomerao na gore moram da koristim minus)
// Posto je tako programirano skok se registruje i kad stisnem i kad pustim dugme jer imam i 
// keydown i keyup eventListener zadat.
// Objasnicu za primer da samo taknem ArrowUp ili Spacebar. To znaci da se u istom momentu desi i
// keydown i keyup. Posto imam zadato player.velocity.y -= 8; to znaci da ce ako u isto momentu 
// stiznem i pustim dugme sledece se desava. Gore imam referencu "X" gde je zadato player.velocity.y=0. 
// Znaci kad stisnem ArrowUp zbog ovoga -=8 cu imati player.velocity.y = 0 - 8 i kad pustim ArrowUP dobijam
// player.velocity.y = -8 - 8 sto je -16. Znaci ovako sam zadao da je velocity -16 i to se desava u prvom
// frejmu. Posto imam zadato u referenci "XX" ovo this.velocity.y += gravity, a na pocetku imam da je zadato
// da je graviti 0.5 znaci da ce u drugom frejmu this.velocity.y biti jednako = -16 + 0.5, u trecem 
// frejmu -15.5 + 0.5 i tako redom dok this.velocity.y ne postane 0. U tom momentu se rectangle zaustavlja i 
// krece da ide na dole jer onda imam da je this.velocity.y jednako 0 + 0.5 pa u sledecem frejmu 0.5+0.5
// i raste sve dok se ne aktivira referenca "X".
// Maksimalna visina koju dostigne rectangle u ovom slucaju je znaci 16 + 15.5 + 15 + 14.5 + ... + 1 + 0.5 = 264.
// Imam console.log zadato u referenci "XXXX" i tu mogu da vidim da se dobije 303.5, a razlog za to je 
// u referenci. Iz neko razloga innerHeight minus pocetna vrednost "y" nije jednako "0" nego 39.5.
// Tako da je ovih 303.5 jednako 264 + 39.5.


// ***
// collisionDetectionRules sluzi da detektuje kad se zaustavlja rectangle kad je iznad platforme.
// platformDetectionRules sluzi da detektuje kad rectangle udara u donji deo platforme da ne bi prosao kroz nju.


// ****
// index === 0 || checkpoints[index - 1].claimed === true, 

// index === 0   Znaci da u momentu kad krenem igru samo prvi checkpoint(index === 0) ima vrednost true.
// Za drugi checkpoint (index === 1), kao i za sve ostale ovaj uslov ne vazi.
// Znaci samo prvi check point moze da se pokupi.

// checkpoints[index - 1].claimed   Za prvi checkpoint ovo je undefined (ne postoji clan -1 u array-u) sto
// je falsy value, znaci nije true.
// Za drugi check point bi imao checkpoint[0].claimed sto na pocetku igre je false. Znaci tek kad pokupim
// prvi checkpoint (index === 0) onda ce ovaj uslov vaziti za sledeci index.
// claimed() se odradi u nekom od sledecih koraka.