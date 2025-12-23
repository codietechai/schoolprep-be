#!/bin/bash
root="/var/www/galileofx-tradingsignals-backend"
cd $root
echo -e '\e[1m\e[34mPulling code from remote..\e[0m\n'
git pull origin main
echo -e '\e[1m\e[34mCode is ready..\e[0m\n'
pm2 stop galileofx-tradingsignals-backend || true
pm2 delete galileofx-tradingsignals-backend || true
pm2 save
echo -e '\e[1m\e[34m\nInstalling required packages..\e[0m\n'
npm install
pm2 start 'npm run start' --name 'galileofx-tradingsignals-backend'
pm2 save
echo -e '\e[1m\e[34m\nAPI deployed\e[0m\n'