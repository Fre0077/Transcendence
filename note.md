premere "barra spazziatrice" solo per far partire il game, dopo aspettare [3] secondi dopo ogni goal
	[3] secondi sono un placeholder, vedi qual'e' il tempo ottimale

se non ricordo male la pallina deve andare nella direzione di chi ha preso goal (non ne sono sicuro)

perche' le paddle non possono arrivare in cima??

nel game state deve arrivare anche lo score


TOMMI:
1. 3 secondi mi piace come timeout.
2. La pallina adesso va nella direzione di chi perde :D
3. Le paddle arrivano in cima adesso :)
4. Nel gamestate adesso c'e' ancche lo score

new:
5. Nel gamestate adesso ci sono anche le stat delle singole paddle (anche se per ora sono le stesse per entrrambe)
6. Nota per i dati del gamestate:
	- le coordinate dei player sono le Y del CENTRO dei paddle.
	- il paddle.offset e' la distanza dal bordo
	- paddle.width e paddle.heigth sono l'altezza e la larghezza del paddle (meglio essere chiari :)
	- le coordinate della pallina si riferiscono al CENTRO della pallina
7. con game.end() puoi vedere se il game e' ancora ongoint (return 0) o qualcuno ha vinto (return 1 o 2)
8. con game.setFormat() puoi passare lo score richiesto per vincere (di base 3, aka Bo5)

9. Se hai dubbi su qualcosa ho messo vari commentini aggiro per il codice. ho messo il tag @aleborghi dove penso ci fosse cose che ti interessino

EXTRA: io sto' 'aggiornando public/fastify_frontend.html' in modo che abbia senso col mio backend, se non ti torna qualcosa puoi anche guardare li.
ho aggiunto anche un 'RESET' che tiene lo stesso socket ma resetta la partita all'inizio.

IMPORTANTE: ho cambiato anche il modo di comunicare gli imput:
	- P1UP_PRESS
	- P1UP_RELEASE
	- P2DW_PRESS
	- ...
	- START_PRESS
	- RESET_PRESS

NOTA: I game in locale li farei direttamente in frontend, cosi' nn si stressa il server.
In questi giorni sentiamoci cosi' si inizia a setuppare il game in remoto (scrivimi su whatsapp)
