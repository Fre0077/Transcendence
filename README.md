## 🚀 Guida al Setup e Testing


### 1. Comandi di Gestione (Makefile)

Utilizza il **Makefile** incluso per gestire il ciclo di vita dei container: 

* 
**Avvio completo (build e background):** `make up` 


* 
**Spegnimento:** `make down` 


* 
**Reset totale (re-build):** `make re` 


* 
**Pulizia profonda (rimozione volumi e immagini):** `make clean` 



> **Nota:** Se la porta **3001** risulta occupata prima dell'avvio, usa:
> `sudo lsof -ti:3001 | xargs kill -9`

---

### 2. Protocollo di Test (Istruzioni per l'Ingegnere)

1. **Sequenza di Avvio:** Eseguire `make up`. Il file `docker-compose.yml` è configurato per rispettare le dipendenze: **RabbitMQ** (con healthcheck) → **Frontend** → **Servizi Backend** (Auth, Chat, Profile).
2. **Verifica Container:** Controllare che tutto sia attivo con `docker-compose ps`.
3. **Interfacce Disponibili:**
* **UI di Test:** [http://localhost:3000?test=true](https://www.google.com/search?q=http://localhost:3000%3Ftest%3Dtrue)
* **RabbitMQ Dashboard:** [http://localhost:15672](https://www.google.com/search?q=http://localhost:15672) (User/Pass: `guest`)


3. **Verifica Risultati:**
* Eseguire i test dalla pagina UI.
* Controllare il file `log.log`: gli status code devono essere di successo (2xx).
* *Nota: Errori legati ai token scaduti sono normali se fanno parte dei casi di test previsti.*



---

### ⚠️ AZIONE RICHIESTA PRIMA DELLA CONSEGNA

**RIMOZIONE BACKDOOR:** Nel file `./backend/src/function`, all'interno della funzione di login, è presente un bypass critico:
`input.password = 'a'`
**Deve essere rimosso** per ripristinare la corretta validazione delle password.
