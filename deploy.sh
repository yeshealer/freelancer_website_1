echo "Switching to branch master"
git checkout 

echo "Building app ..."
npm run build 

echo "Deploying files to server..."
scp -r build/* tim@137.184.62.104:/var/www/137.184.62.104/

echo "Done!"