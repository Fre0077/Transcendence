import { Sequelize, DataTypes, Model } from 'sequelize';

// Istanza di sequelize con SQLite in un file
const sequelize = new Sequelize({ 
  dialect: 'sqlite', 
  storage: './DB/db.sqlite',
  logging: console.log // mostra le query SQL eseguite
});

// Definizione interfaccia per TypeScript
interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
}

// Definizione modello User estendendo Model
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
}

// Inizializzazione del modello
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
});

// Funzione per creare/sincronizzare la tabella
async function createTable() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connessione al database riuscita');
    
    // Sincronizza solo se la tabella non esiste (alter: true per modifiche)
    await sequelize.sync({ alter: true });
    console.log('✅ Tabella User creata/aggiornata con successo');
    
  } catch (error) {
    console.error('❌ Errore nella creazione della tabella:', error);
  }
}

// Funzione per inserire dati
async function insertUser(firstName: string, lastName: string) {
  try {
    const user = await User.create({ firstName, lastName });
    console.log('✅ Utente creato:', user.toJSON());
    return user;
  } catch (error) {
    console.error('❌ Errore nell\'inserimento:', error);
  }
}

// Funzione per recuperare tutti gli utenti
async function getAllUsers() {
  try {
    const users = await User.findAll();
    console.log('📋 Tutti gli utenti:', users.map(u => u.toJSON()));
    return users;
  } catch (error) {
    console.error('❌ Errore nel recupero utenti:', error);
  }
}

// Funzione per trovare un utente per ID
async function getUserById(id: number) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log('👤 Utente trovato:', user.toJSON());
    } else {
      console.log('❌ Utente non trovato');
    }
    return user;
  } catch (error) {
    console.error('❌ Errore nella ricerca:', error);
  }
}

// Funzione principale di esempio
async function main() {
  // 1. Crea la tabella
  await createTable();
  
  // 2. Inserisci alcuni utenti
  await insertUser('Mario', 'Rossi');
  await insertUser('Giulia', 'Verdi');
  await insertUser('Luca', 'Bianchi');
  
  // 3. Recupera tutti gli utenti
  await getAllUsers();
  
  // 4. Cerca un utente specifico
  await getUserById(1);
  
  // 5. Chiudi la connessione
  await sequelize.close();
  console.log('🔒 Connessione al database chiusa');
}

// Esporta per uso in altri file
export { sequelize, User, createTable, insertUser, getAllUsers, getUserById };

// Esegui solo se il file viene chiamato direttamente
if (require.main === module) {
  main();
}