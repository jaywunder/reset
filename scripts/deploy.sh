pm2 stop server

sudo git pull

# update dependencies for backend
npm prune
npm install
npm install --only=dev

# update dependencies for backend
cd front 
npm prune
npm install
npm install --only=dev
cd ..

# build codebase
npm run build

pm2 start server
