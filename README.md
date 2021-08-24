# S3 Signed Upload

This repository consists of two lambdas, each with their own CloudFormation templates for provisioning roles, and deploying the lambda packages to the AWS surface. The http-api-triggered-lambda/s3-signed-upload-with-http-api.yaml file will also create an AWS API Gateway HTTP API for invoking the NodeJS entry point and returning to you the signed URL for the upload operation.

* http-api-triggered-lambda: receives a request from [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader) via the HTTP API created in the corresponding CloudFormation template and returns a signed URL. The signed URL is for upload within a bucket folder and contains sample metadata, as these two S3 upload problem variants have their own challenges I thought I would provide an example on how to solve them here.

* s3-upload-trigger: An S3 trigger destination lambda which extracts the metadata and converts the contents of the object to a Base64 encoded string. The idea being; you can now store this string in DynamoDB or Aurora and let your [S3 Lifecycle Policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html) handle archiving and removal for you.  

## Installation

Clone or fork this repository, and verify you have the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed first. Once you have a working `sam` CLI and you have properly stored your [AWS credentials](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-set-up-credentials.html) on your local machine, you are ready to run the following:

1. http-api-triggered-lambda/zip-and-upload-cmd-template.sh (modify the s3 bucket where you would like these lambda deployment packages staged)
2. http-api-triggered-lambda/s3-signed-upload-with-http-api.yaml (follow instructions in comments at the top)
3. s3-upload-trigger/zip-and-upload-cmd-template.sh (modify the s3 bucket where you would like these lambda deployment packages staged)
4. s3-upload-trigger/s3-upload-trigger.yaml (follow instructions in comments at the top)

## Usage

Easiest use case is via [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader)
```
  <ReactS3Uploader
    signingUrl="https://<your-api-id>.execute-api.<region>.amazonaws.com/"
    signingUrlMethod="GET"
    accept="image/*"
    signingUrlQueryParams={{ key1: 'Key one', key2: 'Key two' }}
    uploadRequestHeaders={{}}
    onFinish={onUploadFinish}
    onProgress={onUploadProgress}
    style={uploaderStyle}
  />
```
At the time I created this repository, I was using version 5.0.0.

## Contributing

1. Fork this repository
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History


## Credits
Daniel Kemper (Author)

## License

Licensed under the MIT license for open source code

TODO: Write license