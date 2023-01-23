// Marek Smutny
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const ws = require('ws');
const bcrypt = require('bcrypt');
const Game = require('./game');

const port = {
    app: 8080,
    socket: 8082,
};

//zahashovanie hesla
async function hashPassword(passwd){
    const salt = await bcrypt.genSalt(10);
    passwd = await bcrypt.hash(passwd, salt);
    return passwd;
}

//vytvorenie noveho usera
async function newUser(user){
    user.password = await hashPassword(user.password);
    
    activeUsers[user.id] = {
        "username": user.username,
        "password": user.password,
        "email": user.email,
        "score": "0",
        "car": "1",
        "id": user.id,
    }

    usersList.push(activeUsers[user.id]);
}

//ulozenie vsetkych userov
function saveUsers(usersList){
    fs.truncate('users.csv', 0, () => {});
    for (let i = 0; i < usersList.length; i++){
        let user = usersList[i].username + "~" + usersList[i].password + "~" + usersList[i].email + "~" + usersList[i].score + "~" + usersList[i].car + "~\n";
        fs.appendFile("users.csv", user, () => {
        })
    }
}

//skontrolovanie mena a hesla pri prihlasovani
async function authenticate(username, password){
    for (let i = 0; i < usersList.length; i++){
        if (username == usersList[i].username){
            const valid = await bcrypt.compare(password, usersList[i].password);
            if (valid){
                return usersList[i];
            }else{
                return "zly";
            }
        }
    }
    return "nikto";
}

//kontrola, ci email a meno este neexistuju pri registracii
function checkDupe(username, email){
    for (let i = 0; i < usersList.length; i++){
        if (username == usersList[i].username){
            return true;
        }
    }
    for (let i = 0; i < usersList.length; i++){
        if (email == usersList[i].email){
            return true;
        }
    }
    return false;
}


var activeUsers =[]
//pridanie neprihlaseneho usera (je zavolana pri otvoreni stranky)
function addGuestUser(){
    var index = activeUsers.push({
        "username": "guest",
        "password": "",
        "email": "",
        "score": 0,
        "car": 0,
        "id": 0,
    }) - 1
    activeUsers[index].id = index;
}

//otvorenie a nacitanie suboru userov do pola usersList
var Users = fs.readFileSync('users.csv', 'utf8');
Users = Users.split('\n');
var usersList = [];
for (let i = 0; i < Users.length; i++){
    let temp = Users[i].split("~");
    if (temp[0] !== ''){
        usersList.push({
            "username": temp[0],
            "password": temp[1],
            "email": temp[2],
            "score": temp[3],
            "car": temp[4],
            "id": 0
        })
    }  
}

const socketServer = new ws.Server({ port: port.socket });

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/register', async (req, res) => {
    if (checkDupe(req.body.username, req.body.email)){
        res.send(JSON.stringify({"username": "dupe"}))
    }else{
        await newUser(req.body);
        res.send(JSON.stringify(activeUsers[req.body.id]));
    }
})

app.post('/login', async (req, res) => {
    let temp = await authenticate(req.body.username, req.body.password);
    if (temp == 'nikto'){
        console.log("user neexistuje");
    }else if(temp == 'zly'){
        console.log("zle heslo");
    }else{
        activeUsers[req.body.id] = temp;
        res.send(JSON.stringify(activeUsers[req.body.id]));
    }
})

var activeGames = []

socketServer.on('connection', (ws) => {
	console.log('New connection');
    addGuestUser();
    var index = activeGames.push(new Game()) - 1;
    ws.send(JSON.stringify({
        type: 'open',
        id: index,
        speed: activeGames[index].speed,
    }))
    ws.on('message', function (message) {
        var message = JSON.parse(message);
        var id = message.id;
        switch(message.type){
            case 'update':
                if (activeGames[id].colision){
                    if (activeGames[id].score > activeUsers[id].score){
                        activeUsers[id].score = activeGames[id].score;
                    }
                    ws.send(JSON.stringify({
                        type: 'colision',
                        score: activeUsers[id].score,
                    }))
                }else{
                    var data = activeGames[id].getGameLines();
                    ws.send(JSON.stringify(data));
                    activeGames[id].update();
                }
                break;
            case 'move':
                if (message.value == 'up'){
                    activeGames[id].movePlayer(-1);
                }else if(message.value == 'down'){
                    activeGames[id].movePlayer(1);
                }
                break;
            case 'end':
                activeGames[id].update(0);
                ws.send(JSON.stringify({
                    type: 'end'
                }))
                break;
            case 'reset':
                iter = 0;
                activeGames[id] = new Game();
                var data = activeGames[id].getGameLines();
                data.type = 'reset';
                ws.send(JSON.stringify(data));
                activeGames[id].update(iter);
                iter++;
                break;
            case 'car':
                activeUsers[id].car = message.value;
                break;
        }
        
    });
    ws.on('close', () => {
        console.log("konec");
        saveUsers(usersList);
    });
})


app.listen(port.app, () => {
    console.log(`App listening at http://localhost:${port.app}`);
})
