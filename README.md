## 🚀 Guida Finale al Setup e Testing

### 1. Architettura e Sicurezza (Punti Chiave)

* **Google Login lato Backend (Spiegazione):**
Quando si dice che il login "deve essere gestito dal backend", si intende che il frontend non deve limitarsi a confermare l'identità dell'utente. Il processo corretto è:
1. Il **Frontend** ottiene un token da Google.
2. Il **Backend** riceve quel token e lo valida contattando direttamente i server di Google.
3. Il **Backend** estrae l'email verificata e genera il JWT interno del tuo sistema.
*Questo evita che un utente malintenzionato possa inviare al server un'email falsa fingendo di aver fatto il login con Google.*


* **JWT & Identità:**
* **Payload:** Si utilizza la **mail** anziché lo username perché è un dato immutabile.
* **Access Token:** Validità 5 minuti.
* **Refresh Token:** Validità 24 ore.


* **Variabili d'ambiente:** Gestione tramite file `.env` e libreria `dotenv`.

---

### 2. Verifica Configurazione RabbitMQ

Prima di avviare il sistema, è fondamentale verificare la connessione tra i microservizi.

* **Azione:** Controlla tutti i file `rabbit.ts` (o i file di configurazione RabbitMQ nel backend).
* **URL Corretto:** Assicurati che l'URL utilizzato sia esattamente:
`amqp://guest:guest@rabbitmq:5672`

---

### 3. Comandi di Gestione (Makefile)

Usa il **Makefile** per gestire l'intero ciclo di vita dell'applicazione:

* **Avvio completo:** `make up` (esegue `docker compose up --build -d`). 

* **Spegnimento:** `make down` (esegue `docker compose down`). 


* **Reset totale:** `make re` (riesegue il build da zero). 

* **Pulizia profonda:** `make clean` (rimuove volumi, immagini e container). 

> **Nota Tecnica:** Se ricevi un errore sulla porta 3001, liberala con:
> `sudo lsof -ti:3001 | xargs kill -9`

---

### 4. Protocollo di Test (Istruzioni per l'Ingegnere)

1. **Sequenza di Avvio automatizzata:** Il file `docker-compose.yml` gestisce già le dipendenze: **RabbitMQ** (con healthcheck) → **Frontend** → **Microservizi** (`auth`, `chat`, `profile`). 

2. **Verifica Stato:** Esegui `docker-compose ps` per confermare che tutti i container siano "Up" o "Healthy". 

3. **Interfacce e Debug:**
* **Piattaforma di Test:** [http://localhost:3000?test=true](https://www.google.com/search?q=http://localhost:3000%3Ftest%3Dtrue)
* **Gestione Code:** [http://localhost:15672](https://www.google.com/search?q=http://localhost:15672) (User: `guest`, Pass: `guest`). 

4. **Analisi Log:**
* Controlla il file `log.log`.
* Verifica che non ci siano errori **4xx** o **5xx**, eccetto quelli previsti dai test sui token scaduti.

---

### ⚠️ AZIONE CRITICA PRIMA DELLA CONSEGNA

**RIMOZIONE BACKDOOR:** Verifica il file `./backend/src/function`.
**ELIMINA** la riga `input.password = 'a'` nella funzione di login. Questa modifica è necessaria per ripristinare la sicurezza del sistema e permettere la validazione reale delle password.

---
