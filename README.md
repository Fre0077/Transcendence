il google login deve essere gestito dal backend ( 'CONSIGLIO' di l****eli ) - NON HO CAPITO IN CHE SENSO

il JWT va diviso in refresh token (5 min) e access token (24h)
	i tempi sono indicativi - FATTO

per il JWT nel sign usare la mail invece dello username ( perche' la mail non puo' essere cambiata mentre lo username si ) - FATTO

per l'env e' meglio usare dotenv

per testare le API: http://localhost:3000?test=true

use make up who do docker compose up --build -d
or use docker-compose up -d
check if everything work with docker-compose ps
Access the UI from here: http://localhost:15672
The credentials are guest and guest

TEST DA FARE PER L'INGEGNERE:
1) in ordine va fatto partire RabbitMQ, poi i tre server e poi frontend in, in caso auth dia problemi eseguire il comando 
2) poi fare tutti i test indicati sulla pagina: http://localhost:3000?test=true
3) nei test devi andare nel file log.log e verificare che tutti gli status code ritornati non siano 400 o 500
4) errori come quelli dei token non rappresentano problema, però segnalare nel caso

ISSUE
What i don't understand is this:
if i run in this order:
 - 1 make to run RabbitMQ and frontend
 - 2 npm install; npm run generate; npm run push; npm start
everything perfect and working
if instead i do the same with the dockerfiles
when i run: docker compose ps i saw the conteiner
when i run: docker compose logs service_name it show to me the log
but when i try to do the same operations i do with the first case
it doesn't work.

COMANDO PER LIBERARE LA PORTA 3001:
sudo lsof -ti:3001 | xargs kill -9

IMPORTANTE!!!
in ./backend/src/function, nella funzione di login c'è un controllo input.password = 'a' da togleire prima della consegna

