mkdir -p deploy
zip ./deploy/s3-upload-lambda-trigger.zip ./index.js
aws s3 cp ./deploy/s3-upload-lambda-trigger.zip s3://signed-upload-packages-us-west-1