// Marek Smutny
var end = false;

var loggedPlayerUsername = "guest";
var loggedPlayerId = 0
var maxScore = 0;
var carModel = 2;

const grassImage = new Image();
grassImage.src = 'https://img.freepik.com/free-vector/seamless-green-grass-pattern_1284-52275.jpg?w=360';
const roadImage = new Image();
roadImage.src = 'https://thumbs.dreamstime.com/b/asphalt-texture-road-background-top-view-127582950.jpg';
const redImage = new Image();
redImage.src = 'https://toppng.com/uploads/preview/red-textured-background-11554006860irzdvhyv4r.jpg';
const whiteImage = new Image();
whiteImage.src = 'https://media.istockphoto.com/photos/white-wood-board-texture-background-picture-id948578140?b=1&k=20&m=948578140&s=170667a&w=0&h=1QH4hC4jZjf69xGrv6qDimaWX5DOjhIdSGl3CEQNxyE=';
const carImage = [new Image(), new Image(), new Image()];
carImage[0].src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmSriInFOJwvv6PzNmjkkhpzHFmkj_HEIiOGdUtBTEQjZgs3RhnMIP7uJZSEvjLyCIbCI&usqp=CAU';
carImage[1].src = 'https://png.pngitem.com/pimgs/s/511-5112241_dundjinni-mapping-software-jeep-png-top-view-transparent.png';
carImage[2].src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-TAQUPJn1HPG3DSSDQj44eb0XDkPaF5nPvw&usqp=CAU';

//objektova reprezentacia struktury stranky
var structure = 
[
  {
    "element": "h1",
    "id": "player-name",
    "innerHTML": loggedPlayerUsername,
  },
  {
    "element": "div",
    "id": "game-container",
    "width": "1600",
    "height": "900",
    "style": "display: flex",
    "children": 
    [
      {
        "element": "div",
        "id": "buttons-container",
        "style": "display: flex; flex-direction: column",
        "children": 
        [
          {
            "element": "button",
            "id": "register-button",
            "innerHTML": "REGISTER",
          },
          {
            "element": "button",
            "id": "login-button",
            "innerHTML": "LOGIN",
          },
          {
            "element": "button",
            "id": "reset-button",
            "innerHTML": "RESET",
          },
          {
            "element": "button",
            "id": "car-button",
            "innerHTML": "CHANGE CAR",
          },
        ]
      },
      {
        "element": "canvas",
        "id": "game-canvas",
        "width": "1600",
        "height": "800"
      }
    ]
  },
]

const loggedUserStructure =
[
  {
    "element": "h1",
    "id": "player-name",
    "innerHTML": loggedPlayerUsername,
  },
  {
    "element": "div",
    "id": "game-container",
    "width": "1600",
    "height": "900",
    "style": "display: flex",
    "children": 
    [
      {
        "element": "div",
        "id": "buttons-container",
        "style": "display: flex; flex-direction: column",
        "children": 
        [
          {
            "element": "button",
            "id": "reset-button",
            "innerHTML": "RESET",
          },
          {
            "element": "button",
            "id": "car-button",
            "innerHTML": "CHANGE CAR",
          },
        ]
      },
      {
        "element": "canvas",
        "id": "game-canvas",
        "width": "1600",
        "height": "800"
      }
    ]
  },
]

const regStructure = 
[
  {
    "element": "div",
    "id": "inputs-container",
    "children":
    [
      {
        "element": "h1",
        "innerHTML": "Registration",
      },
      {
        "element": "input",
        "id": "usernameInput",
        "placeholder": "username",
      },
      {
        "element": "input",
        "id": "emailInput",
        "placeholder": "email",
      },
      {
        "element": "input",
        "id": "passwordInput",
        "type": "password",
        "placeholder": "password",
      },
      {
        "element": "input",
        "id": "againInput",
        "type": "password",
        "placeholder": "password",
      },
    ]
  },
  {
    "element": "div",
    "id": "buttons-container",
    "children":
    [
      {
        "element": "button",
        "id": "cancel-button",
        "innerHTML": "CANCEL"
      },
      {
        "element": "button",
        "id": "confirm-button",
        "innerHTML": "CONFIRM"
      }
    ]
  }
]
const logStructure = 
[
  {
    "element": "div",
    "id": "inputs-container",
    "children":
    [
      {
        "element": "h1",
        "innerHTML": "Login",
      },
      {
        "element": "input",
        "id": "usernameInput",
        "placeholder": "username",
      },
      {
        "element": "input",
        "id": "passwordInput",
        "type": "password",
        "placeholder": "password",
      }
    ]
  },
  {
    "element": "div",
    "id": "buttons-container",
    "children":
    [
      {
        "element": "button",
        "id": "cancel-button",
        "innerHTML": "CANCEL"
      },
      {
        "element": "button",
        "id": "confirm-button",
        "innerHTML": "CONFIRM"
      }
    ]
  }
]

//vytvaranie HTML objektov
function grid(json, container, remove){
  if (remove){
    container.innerHTML = '';
  }
  for (var i = 0; i < json.length; i++){
    var el = json[i];

    var object = document.createElement(el.element);

    for (var tag in el){
      if (tag == "innerHTML"){
        object.innerHTML = el[tag];
      }
      else if (tag != "children" && tag != "element"){
        object.setAttribute(tag, el[tag]);
      }
    }

    container.appendChild(object);
    if (typeof (el.children) == "object"){
      grid(el.children, object, false);
    }
  }
}

//kreslenie policok cesty okraju a auta
function drawWithStyle(points, style, canvas){
    var ctx = canvas.getContext('2d');
    var size = 10;
    switch(style){
      case 'road':
        for(var i=0;i<points.length;i++) {
          if(typeof points[i] !== 'undefined') {
            ctx.drawImage(roadImage, points[i][0] * size, points[i][1] * size, size, size); 
          }
          else console.log('points['+i+'] is undefined');
        }
        break;
      
      case 'red':
        for(var i=0;i<points.length;i++) {
          if(typeof points[i] !== 'undefined') {
            ctx.drawImage(redImage, points[i][0] * size, points[i][1] * size, size, size); 
          }
          else console.log('points['+i+'] is undefined');
        }
        break;
      
      case 'white':
        for(var i=0;i<points.length;i++) {
          if(typeof points[i] !== 'undefined') {
            ctx.drawImage(whiteImage, points[i][0] * size, points[i][1] * size, size, size); 
          }
          else console.log('points['+i+'] is undefined');
        }
        break;

      case 'car':
        tx = points[0][0];
        ty = points[0][1];
        ctx.drawImage(carImage[carModel], tx * size, ty * size, size*5, size*3);
        break;
    }
}

//kreslenie pozadia
function drawBG(canvas){
  var ctx = canvas.getContext('2d');
  ctx.drawImage(grassImage, 0, 0, (canvas.width) / 2, canvas.height);
  ctx.drawImage(grassImage, (canvas.width) / 2, 0, (canvas.width) / 2, canvas.height);
}

//kreslenie textu
function drawScore(canvas, score, speed){
  var ctx = canvas.getContext('2d');
  ctx.font = "30px Arial";
  ctx.fillText("Score: "+score+" Speed: "+speed+" Best: "+maxScore, 10, 50);
}

//vykreslenie celeho canvas
function drawCanvas(canvas, data){
  drawBG(canvas);
  drawWithStyle(data.road, 'road', canvas);
  drawWithStyle(data.red, 'red', canvas);
  drawWithStyle(data.white, 'white', canvas);
  drawWithStyle(data.car, 'car', canvas);
  drawScore(canvas, data.score, data.speed);
}

//kontrola vstupov
function checkInputs(username, email, password, password2){
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var usernameRegex = /^[a-zA-Z]+$/;
  if (! (email.match(emailRegex))){
    return "e";
  };
  if (! (username.match(usernameRegex))){
    return "u";
  };
  if (password != password2){
    return "p";
  }
  return true;
}

//pridanie listenerov na buttony
function setListeners(){
  reset.addEventListener('click', function(event){
    ws.send(JSON.stringify({
      type: 'reset',
      id: loggedPlayerId,
    }));
  })

  carButton.addEventListener('click', function(event){
    carModel += 1;
    if (carModel > 2){
      carModel = 0;
    }
    ws.send(JSON.stringify({
      type: 'car',
      value: carModel,
      id: loggedPlayerId,
    }));
    ws.send(JSON.stringify({
      type: 'reset',
      id: loggedPlayerId,
    }));
  })

  register.addEventListener('click', function(event){
    end = true;
    grid(regStructure, document.body, true);
    
    var cancel = document.getElementById("cancel-button");
    var confirm = document.getElementById("confirm-button");
    
    cancel.addEventListener('click', function(event){
      grid(structure, document.body, true);
      canvas = document.getElementById("game-canvas");
      register = document.getElementById("register-button");
      login = document.getElementById("login-button");
      reset = document.getElementById("reset-button");
      setListeners();
      ws.send(JSON.stringify({
        type: 'reset',
        id: loggedPlayerId,
      }));
    })

    confirm.addEventListener('click', async function(event){
      var usernameText = document.getElementById('usernameInput').value;
      var emailText = document.getElementById('emailInput').value;
      var passwordText = document.getElementById('passwordInput').value;
      var againText = document.getElementById('againInput').value;
      var check = await checkInputs(usernameText, emailText, passwordText, againText);
      if (typeof check === 'string'){
        if (check == "u"){
          alert("Do username zadaj len male alebo velke pismena!")
        }else if(check == "e"){
          alert("Nespravne zadana emailova adresa")
        }else if(check == "p"){
          alert("Hesla sa nezhoduju")
        }
      }else{
        var returnData;
        await fetch('http://localhost:8080/register',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    username: usernameText,
                    email: emailText,
                    password: passwordText,
                    id: loggedPlayerId,
                })
            }).then(data => data.json()).then(data => {
              returnData = data;
            });
        if (returnData.username == "dupe"){
        alert("toto meno alebo email nemozes pouzit");
        return
        }else{
        loggedPlayerUsername = returnData.username;
        loggedUserStructure[0].innerHTML = loggedPlayerUsername;
        maxScore = returnData.score;
        carModel = returnData.car;
        }
        grid(loggedUserStructure, document.body, true);
        canvas = document.getElementById("game-canvas");
        reset = document.getElementById("reset-button");
        carButton = document.getElementById("car-button");
        setListeners();
        ws.send(JSON.stringify({
          type: 'reset',
          id: loggedPlayerId,
        }));
      }
    })
  });

  login.addEventListener('click', function(event){
    end = true;
    grid(logStructure, document.body, true);
    
    var cancel = document.getElementById("cancel-button");
    var confirm = document.getElementById("confirm-button");
    
    cancel.addEventListener('click', function(event){
      grid(structure, document.body, true);
      canvas = document.getElementById("game-canvas");
      register = document.getElementById("register-button");
      login = document.getElementById("login-button");
      reset = document.getElementById("reset-button");
      setListeners();
      ws.send(JSON.stringify({
        type: 'reset',
        id: loggedPlayerId,
      }));
    })

    confirm.addEventListener('click', async function(event){
      var usernameText = document.getElementById('usernameInput').value;
      var passwordText = document.getElementById('passwordInput').value;
      await fetch('http://localhost:8080/login',{
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    username: usernameText,
                    password: passwordText,
                    id: loggedPlayerId,
                })
            }).then(data => data.json()).then(data => {
              loggedPlayerUsername = data.username;
              loggedUserStructure[0].innerHTML = loggedPlayerUsername;
              maxScore = data.score;
              carModel = data.car;
            });
      grid(loggedUserStructure, document.body, true);
      canvas = document.getElementById("game-canvas");
      reset = document.getElementById("reset-button");
      carButton = document.getElementById("car-button");
      setListeners();
      ws.send(JSON.stringify({
        type: 'reset',
        id: loggedPlayerId,
      }));
    })
  })
}

//vytvorenie uvodnej stranky
grid(structure, document.body, true);
var canvas = document.getElementById("game-canvas");
var register = document.getElementById("register-button");
var login = document.getElementById("login-button");
var reset = document.getElementById("reset-button");
var carButton = document.getElementById("car-button");
setListeners();

//otvorenie websocket komunikacie
const ws = new WebSocket('ws://localhost:8082');

ws.onmessage = (event) => {
  var data = JSON.parse(event.data);
  switch(data.type){
    case 'update':
      drawCanvas(canvas, data);
      break;
    case 'colision':
      end = true;
      maxScore = data.score;
      break;
    case 'end':
      end = true;
      break;
    case 'reset':
      if (end){
        end = false;
        gameLoop()
      }
      drawCanvas(canvas, data);
      break;
    case 'open':
      loggedPlayerId = data.id;
      speed = data.speed;
      gameLoop();
  }
	
}

document.addEventListener('keydown',function(ev){
  if(ev.keyCode === 38) ws.send(JSON.stringify({
    type: 'move',
    value: 'up',
    id: loggedPlayerId,
  }));
  else if(ev.keyCode === 40) ws.send(JSON.stringify({
    type: 'move',
    value: 'down',
    id: loggedPlayerId,
  }));
});

var speed;
//funkcia, ktora posiela ziadosti na update na server
function gameLoop(){
  var loop = setInterval(function () {
    if (end){
      clearInterval(loop);
    }
    ws.send(JSON.stringify({
      type: 'update',
      id: loggedPlayerId,
    }));

  }, speed);
}