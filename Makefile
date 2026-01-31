all: consegners

consegners:
	docker compose up
	
up: credentials
	docker compose up --build -d

down:
	docker compose down

game:
	docker compose up --build ft_bunny pong lobby tournament bots frontend
	
build: credentials
	docker compose build

re: down up

clean:
	docker compose down --rmi all -v

credentials:
	mkdir -p nginx/ssl
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/nginx.key -out nginx/ssl/nginx.crt
