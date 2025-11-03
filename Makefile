all: re

up:
	docker compose up --build -d

down:
	docker compose down

re: down up

clean:
	docker compose down --rmi all -v