Instalar pm2 na maquina
sudo npm install pm2 -g

Start app com pm2
pm2 start index.js --name=chat_bot

Parar aplicação
pm2 stop chat_bot

Atualizar projeto
git pull

Reload no projeto em produçao
pm2 restart chat_bot 

Listar todos os projetos rodando no pm2
pm2 list