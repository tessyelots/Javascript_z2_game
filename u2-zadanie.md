# ODOVZDAVTE DOCKER-COMPOSE.YML, PACKAGE.JSON, .JS a INDEX.HTML
# pripadne odovzdavate DOCKERFILE, .DOCKERIGNORE
# NEODOVZDAVATE OBRAZKY, NODE_MODULES
# KAZDY SUBOR MUSI MAT HLAVICKU
# "docker-compose build" a "docker-compose up" musi vsetko spustit

Cielom ulohy bude prepisat povodnu (u1-game.js) zavodnu hru z client-side verzie na server-side verziu s moznostou manazmentu viacerych hracov.

1	prepisanie originalnej zavodnej hry na server-side riesenie	1*
2	posielanie stlaceni klaves na server a ich spracovanie na serveri (http)	1*
3	vratenie aktualnej plochy hry zo serveru pomocou websocketov a vykreslenie aktualnej plochy cez canvas	1*
4   moznost vyberu obrazku auta, pamatanie vyberu pre prihlaseneho pouzivatela 1*
5	serverside ukladanie max skore a rychlosti pre prihlaseneho pouzivatela a neprihlaseneho pouzivatela	1*
6	vypisovanie aktualneho a najlepsieho skore a rychlosti zo serveru (per user/session)   1*
7	umoznenie viacerych nezavislych hier paralelne (aspon 1000)	1*
8	na stranke umoznit registraciu a prihlasenie pouzivatelov - e-mail, login, heslo (2x pri registracii)	1*
9	zdielanie session medzi backendom (server) a frontedom (browser)	1
10	admin rozhranie zobrazujuce tabulku registrovanych pouzivatelov s moznostou zmazania pouzivatela (len pre admina)	1
11	zobrazit zoznam aktualne hranych hier (meno/null) s moznostou sledovania pre vsetkych pouzivatelov	1
12	import a export CSV udajov pouzivatelov (meno, email, heslo, max score, max rychlost) len pre pouzivatela "admin"	1
13	vyuzitie objektovej reprezentacie struktury stranky	1*
14	server vracia staticky obsah (index.html, js subory), vsetka ostatna komunikacia (plocha, interakcia) pouziva JSON	1*
15	kontrola vstupov (email, login, heslo)	1*
 	SUM	15
 
13. Inspiracia:
[
    {​​​​​​​​
        "tag": "div",
        "id":  "id1",
        "innerTags": [
            {​​​​​​​​
                "tag": "p",
                "innerText": "Lorem ipsum"
            }​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​,
            {​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
                "tag": "button",
                "innerText": "Click me"
            }
        ]
    }​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​
]
 
15.
e-mail - unikatny*, s overenim tvaru
heslo - hashed*
login - unikatne*, iba [a-zA-Z]; nepihlaseny "[N/A]"

vzor index.html:
<!-- Roman Bronis -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <script src="client.js"></script>
    </head>
    <body>
    </body>
</html>

iny vzor index.html:
<!-- Roman Bronis -->
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
    </head>
    <body>
    </body>
    <script src="client.js"></script>
</html>

Odovzdavate zazipovany priecinok s:
1x JS so server kodom
1x JS so server-side kodom hry
1x JS s client-side kodom hry
max. 1 HTML - index.html (cez server, nie cez file://) kde LEN nacitate svoju client-side kniznicu
optional: iny pocet JS suborov
1x package.json
1x docker-compose a (pripadne) dockerfile
 
HTTP server komunikuje na 8080
WS server komunikuje na 8082
 
Po otvoreni priecinku a spusteni "docker-compose build" a "docker-compose up" sa musi vsetko spustit.
 
Kazdy subor musi mat hlavicku s menom autora.
Priklad hlavicky a komentaru:
html:
<!-- Roman Bronis -->
 
js:
// Roman Bronis
...

Odporucane frameworky/kniznice:
Express
 
Vyzadovane frameworky/kniznice:
ws, jQuery/fetch
 
Zakazane frameworky/kniznice:
React, Angular, Vue, socket.io, html2json... (ak si nie ste isty, ci ho mozete pouzit, spytajte sa)