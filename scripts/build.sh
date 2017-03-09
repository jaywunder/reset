rm -rf ./build
babel src -d build
cd front
npm run build
cd ..
ln -s ./node_modules ./build/node_modules
mv ./front/build ./build/front-build
