
const { S3Client, CreateBucketCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fetch = require("node-fetch");

exports.handler = async (event) => {
    // Set the AWS region
    const region = process.env.region;
    const s3Client = new S3Client({ region });

    console.log(event);
    
    // Set the parameters
    let fileName = Date.now() + '.jpeg';
    let contentType = 'image/jpeg';
    let metadata = { key1: '', key2: '' };
    const uploadsBucket = process.env.bucket; //BUCKET_NAME
    const signedUrlExpirySeconds = 60*5; //EXPIRATION  

    if (event.body && event.body.fileName) {
        fileName = event.body.fileName
    } else if (event.queryStringParameters && event.queryStringParameters["objectName"]) {
        fileName = event.queryStringParameters["objectName"];
        contentType = event.queryStringParameters["contentType"];
    } 

    // Working metadata saved along with the upload
    if (event.queryStringParameters && event.queryStringParameters["key1"]) {
        metadata.key1 = event.queryStringParameters["key1"];
        metadata.key2 = event.queryStringParameters["key2"];
    }

    // This example assumes a folder called "covers" has been created in your bucket, change it to whatever 
    // you wish, it is also not required if you just want all signed uploads going to the bucket proper.
    // As shown the folder name is referenced in the Key not in the Bucket.
    const bucketParams = {
        Bucket: uploadsBucket,
        ContentType: contentType,
        Key: `covers/${fileName}`,
        Metadata: metadata
    };
    
    try {
        // Create the command.
        const command = new PutObjectCommand(bucketParams);
    
        // Create the presigned URL.
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: signedUrlExpirySeconds });   
        console.log(`\nPutting "${bucketParams.Key}" using signedUrl with content type "${bucketParams.ContentType}" in S3.`);
        console.log(signedUrl);
        
        // Nothing has been created yet, so you will see the SignatureDoesNotMatch error code in your CloudWatch logs
        const response = await fetch(signedUrl);  
        console.log(`\nResponse returned by signed URL: ${await response.text()}\n`);
        
        return { "statusCode": 200, "body": JSON.stringify({ signedUrl }) };
        
      } catch (err) {
        console.log('Error creating presigned URL:', err);
      }
};
