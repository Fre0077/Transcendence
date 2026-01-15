all: re

up:
	docker compose up --build -d

down:
	docker compose down

game:
	docker compose up --build ft_bunny pong lobby tournament bots frontend

re: down up

clean:
	docker compose down --rmi all -v