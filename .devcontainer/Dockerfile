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
WORKDIR /Trash/frontend
RUN npm init -y
RUN npm install \
    vite eslint prettier typescript \
    tailwindcss postcss autoprefixer

# 6. Backend essentials
WORKDIR /Trash/backend
RUN npm init -y
RUN npm install \
    fastify express nodemon dotenv \
    prisma pg sqlite3 sqlite sequelize \
    socket.io jsonwebtoken bcryptjs zod \
    @sequelize/cli sequelize-typescript ts-node
RUN npm install -g prisma


# 7. Python minimal AI/ML stack
WORKDIR /Trash
RUN python3 -m pip install --upgrade pip setuptools wheel && \
    python3 -m pip install \
    numpy scipy scikit-learn flask flask-cors

# 8. Oh My Zsh config
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended && \
    sed -i 's/^ZSH_THEME=.*/ZSH_THEME="robbyrussell"/' /root/.zshrc && \
    echo "DISABLE_UPDATE_PROMPT=true" >> /root/.zshrc && \
    LC_ALL=C sed -i 's/[^[:print:]\t]//g' /root/.zshrc

# 9. Installa GitHub Copilot CLI + alias zsh
RUN npm install -g @githubnext/github-copilot-cli && \
    echo '\n# GitHub Copilot CLI alias' >> /root/.zshrc && \
    echo 'eval "$(github-copilot-cli alias -- "$0")"' >> /root/.zshrc

# 10. Alias Zsh personalizzati
RUN echo '\n# Alias personalizzati' >> /root/.zshrc && \
    echo "alias ..='cd ..'" >> /root/.zshrc && \
    echo "alias push='git add . && git commit -m "fastpush" && git push'" >> /root/.zshrc && \
    echo "alias CLEAR='clear'" >> /root/.zshrc && \
    echo "alias clera='clear'" >> /root/.zshrc

# 11. Working directory
WORKDIR /Trash

# 12. Shell di default
CMD ["zsh"]

# per runnare nella finestra giusta premere F1 e poi compia-incollare:
# "Remote-Containers: Reopen in Container".
# cosi' ti apre la finestra in remoto con tutte le installazioni
# se si modifica il docker lanciare:
# "Remote-Containers: Rebuild Container"

# docker system prune -a --volumes -f

# aggiunte da fare
