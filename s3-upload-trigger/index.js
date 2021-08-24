const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const { Body, Metadata } = await s3.getObject(params).promise();
        const encodedBody = Body.toString('base64');
        const metadata = Metadata; // Needed to update an existing DynamoDB table item or Aurora table row.

        // Now the uploaded contents can be saved in DynamoDB or an Aurora instance as a base-64 encoded
        // string and subsequently removed from S3, should an S3 lifecycle policy not exist. 
        return encodedBody;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};