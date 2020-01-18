# Car Pool App

This application is my capstone project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

As a user, you can login and register your car for loaning purposes to the eMarket-Place.

It demonstrates
* AWS 
  * Lambdas (serverless functions)
  * DynamoDB (database)
  * S3 Bucket (storage of images)
  * Cognito (authentication of users)
* [Serverless Framework](https://serverless.com/)
* [AWS Amplify Client Framework](https://aws-amplify.github.io/docs/js/react)
* WebApp Client (React) integration

Additionally, this application uses ReactJS, which I learnt a few years ago on [Udacity React Nanodegree](https://www.udacity.com/course/react-nanodegree--nd019) 

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
Here I'm assuming that you have an AWS Profile of _serverless_ and are deploying to region _eu-west-2_. The NODE_OPTIONS setting is to help avoid memory problems in Node when packaging the lambdas as separate deployables.
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

## Screenshots
**Screenshot showing the Amplify Console**
![Image of Client Amplify Deployment](https://github.com/stevenhankin/car-pool/blob/master/screenshots/client-amplify-CD.png)
The client React App has been deployed to the cloud (static build inside an S3 bucket)

**Screenshot showing the result of a Serverless deployment (sls deploy -v)**
![Image of Serverless Deployment](https://github.com/stevenhankin/car-pool/blob/master/screenshots/serverless-deployment.png)

**Screenshot of the CloudFormation Stack for Serverless deployment**
![Image of CloudFormation Summary](https://github.com/stevenhankin/car-pool/blob/master/screenshots/CloudFormationStack-serverless.png)


## Files
- __car\-pool__
   - [README.md](README.md)
   - __client__
     - __public__ (standard React App files)
     - __src__
       - __api__ (REST API to Service)
       - __auth__ (Auth0 3rd party authentication)
       - __components__ (React Components)
       - __types__ (Typescript Interfaces)
       - __utils__
   - __service__
     - [serverless.yml](service/serverless.yml) (Serverless framework config file)
     - __src__
       - __auth__ (JWT handling)
       - __lambda__ (Serverless lambdas)
         - __http__ (separate HTTP handlers)
       - __models__ (Typescript interfaces)
       - __utils__ (Logging module)
