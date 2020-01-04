# Car Pool App

This application is my capstone project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

It demonstrates
* AWS 
  * Lambdas (serverless functions)
  * DynamoDB (database)
  * S3 Bucket (storage of images)
  * Cognito (authentication of users)
* [Serverless Framework](https://serverless.com/)

## Requirements

* [Node 12](https://nodejs.org/en/)
* [AWS Account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html)
* [AWS CLI](https://aws.amazon.com/cli/)
* [Serverless](https://serverless.com/framework/docs/getting-started/)

## Installation

Use the node package manager to install car-pool

```bash
npm install
```

## Usage
Firstly, the serverless application should be deployed to AWS
Here I'm assuming that you have an AWS Profile of _serverless_ and are deploying to region _eu-west-2_
```bash
export NODE_OPTIONS=--max_old_space_size=4096

sls deploy -v --aws-profile serverless --aws-region eu-west-2
```

The client can then be installed and run locally 
```bash
cd client

npm start
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change

Please make sure to update tests as appropriate

## License
[MIT](https://choosealicense.com/licenses/mit/)
