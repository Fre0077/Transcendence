FROM debian:bullseye

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV ZSH=/root/.oh-my-zsh

# 1. Pacchetti di base + dev lib
RUN apt-get update && apt-get install -y \
    build-essential clang cmake gdb valgrind vim git curl wget lldb \
    iputils-ping net-tools man unzip python3 python3-pip python-is-python3 \
    libreadline-dev libncurses-dev libx11-dev libgl1-mesa-dev ca-certificates \
    zsh fonts-powerline sqlite3 libsqlite3-dev postgresql-client libpq-dev \
    libssl-dev libffi-dev libbz2-dev libgmp-dev autoconf automake pkg-config \
    nodejs yarn jq \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Rimuovi vecchie versioni di Node.js/NPM
RUN apt-get remove -y nodejs npm || true

# 3. Installa Node.js 20.x + yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. Aggiorna npm
RUN npm install -g npm@latest

# 5. Frontend essentials
RUN npm install -g \
    vite eslint prettier typescript \
    create-react-app serve next react react-dom \
    tailwindcss postcss autoprefixer

# 6. Backend essentials
RUN npm install -g \
    fastify express nodemon dotenv \
    prisma pg sqlite3 sequelize \
    socket.io jsonwebtoken bcryptjs zod

# 7. Python minimal AI/ML stack
RUN python3 -m pip install --upgrade pip setuptools wheel && \
    python3 -m pip install \
    numpy scipy scikit-learn flask flask-cors

# 8. Oh My Zsh config
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended && \
    sed -i 's/^ZSH_THEME=.*/ZSH_THEME="robbyrussell"/' /root/.zshrc && \
    echo "DISABLE_UPDATE_PROMPT=true" >> /root/.zshrc && \
    LC_ALL=C sed -i 's/[^[:print:]\t]//g' /root/.zshrc

# 9. (Facoltativo) ModSecurity rimosso per velocità
# Se vuoi tenerlo, te lo metto come blocco opzionale a parte

# 10. Working directory
WORKDIR /app

# 11. Shell di default
CMD ["zsh"]

# per runnare nella finestra giusta premere F1 e poi compia-incollare "Remote-Containers: Reopen in Container".
# cosi' ti apre la finestra in remoto con tutte le installazioni
