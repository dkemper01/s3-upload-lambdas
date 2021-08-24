mkdir -p deploy
zip -r ./deploy/s3-signed-upload-lambda.zip ./index.js ./package-lock.json ./package.json ./node_modules
aws s3 cp ./deploy/s3-signed-upload-lambda.zip s3://signed-upload-packages-us-west-1