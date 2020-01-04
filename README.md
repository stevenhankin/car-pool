# Car Pool App

This application is my capstone project for the [Udacity Cloud Developer Nanodegree](https://www.udacity.com/course/cloud-developer-nanodegree--nd9990)

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

## Files
- __car\-pool__
   - [README.md](README.md)
   - __client__
     - [README.md](client/README.md)
     - [node\_modules](client/node_modules)
     - [package.json](client/package.json)
     - __public__
       - [favicon.ico](client/public/favicon.ico)
       - [index.html](client/public/index.html)
       - [logo192.png](client/public/logo192.png)
       - [logo512.png](client/public/logo512.png)
       - [manifest.json](client/public/manifest.json)
       - [robots.txt](client/public/robots.txt)
     - __src__
       - [App.css](client/src/App.css)
       - [App.js](client/src/App.js)
       - [App.test.js](client/src/App.test.js)
       - [index.css](client/src/index.css)
       - [index.js](client/src/index.js)
       - [logo.svg](client/src/logo.svg)
       - [serviceWorker.js](client/src/serviceWorker.js)
       - [setupTests.js](client/src/setupTests.js)
     - [yarn.lock](client/yarn.lock)
   - __serverless__
