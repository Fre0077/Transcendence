const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const deleteBtn = document.getElementById('deleteBtn');
const output = document.getElementById('output');

async function sendMessage() {
    const msg = msgInput.value.trim();
    if (!msg) return;
    const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    output.textContent += `\n👤 Tu: ${msg}\n`;
    output.textContent += `🤖 Bot: ${data.reply || data.error}\n`;
    output.scrollTop = output.scrollHeight;
    msgInput.value = '';
    msgInput.focus();
}

async function deleteChat() {
    const chatId = prompt("Inserisci l'ID della chat da eliminare:");
    if (!chatId) return;
    const res = await fetch('/chat-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId })
    });
    const data = await res.json();
    output.textContent += `\n🗑️ ${data.reply || data.error}\n`;
    output.scrollTop = output.scrollHeight;
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
deleteBtn.onclick = deleteChat;