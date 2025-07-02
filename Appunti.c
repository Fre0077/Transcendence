// npx prisma init --datasource-provider mysql --output ../generated/prisma

//web socket: npm install @fastify/websocket

//# Elasticsearch
//wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-8.13.4-amd64.deb
//sudo dpkg -i elasticsearch-8.13.4-amd64.deb

//# Logstash
//wget https://artifacts.elastic.co/downloads/logstash/logstash-8.13.4-amd64.deb
//sudo dpkg -i logstash-8.13.4-amd64.deb

//# Kibana
//wget https://artifacts.elastic.co/downloads/kibana/kibana-8.13.4-amd64.deb
//sudo dpkg -i kibana-8.13.4-amd64.deb

/*
sudo systemctl start elasticsearch
sudo systemctl start kibana
sudo systemctl start logstash
*/

//logstash -f ./Transcendence/backend/database/logstash.conf

//enrollment token
sudo /usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana

//verification code
sudo /usr/share/kibana/bin/kibana-verification-code

//credenziali
sudo /usr/share/elasticsearch/bin/elasticsearch-reset-password -u elastic

elastic
WFzUBPYoO3BLNEFldGKG

//pachetti per elastc

