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
     - [package\-lock.json](client/package-lock.json)
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
       - [App.test.tsx](client/src/App.test.tsx)
       - [App.tsx](client/src/App.tsx)
       - __api__
         - [car\-pool\-api.ts](client/src/api/car-pool-api.ts)
       - __assets__
         - [Screenshot 2020\-01\-04 at 22.39.48.png](client/src/assets/Screenshot%202020-01-04%20at%2022.39.48.png)
         - [jonathan\-borba\-zSTUJTO4Xe8\-unsplash.jpg](client/src/assets/jonathan-borba-zSTUJTO4Xe8-unsplash.jpg)
         - [logo.png](client/src/assets/logo.png)
         - [reinhart\-julian\-VsXHzSdwuik\-unsplash.jpg](client/src/assets/reinhart-julian-VsXHzSdwuik-unsplash.jpg)
       - __auth__
         - [Auth.js](client/src/auth/Auth.js)
       - [auth\_config.json](client/src/auth_config.json)
       - [aws\-exports.js](client/src/aws-exports.js)
       - __components__
         - [EditCarDetails.tsx](client/src/components/EditCarDetails.tsx)
         - [Hire.tsx](client/src/components/Hire.tsx)
         - [ListLoanedCars.tsx](client/src/components/ListLoanedCars.tsx)
         - [Loan.tsx](client/src/components/Loan.tsx)
         - [LoanCar.tsx](client/src/components/LoanCar.tsx)
         - [LoanOrHire.tsx](client/src/components/LoanOrHire.tsx)
         - [LogIn.tsx](client/src/components/LogIn.tsx)
         - [NavBar.tsx](client/src/components/NavBar.tsx)
         - [UploadCarImage.tsx](client/src/components/UploadCarImage.tsx)
       - [config.ts](client/src/config.ts)
       - [index.css](client/src/index.css)
       - [index.tsx](client/src/index.tsx)
       - [logo.svg](client/src/logo.svg)
       - [react\-app\-env.d.ts](client/src/react-app-env.d.ts)
       - [react\-auth0\-spa.js](client/src/react-auth0-spa.js)
       - [serviceWorker.ts](client/src/serviceWorker.ts)
       - [setupTests.ts](client/src/setupTests.ts)
       - __types__
         - [Car.ts](client/src/types/Car.ts)
         - [CarWithUploadUrl.ts](client/src/types/CarWithUploadUrl.ts)
         - [CreateCarRequest.ts](client/src/types/CreateCarRequest.ts)
         - [UploadUrl.ts](client/src/types/UploadUrl.ts)
       - __utils__
         - [Log.ts](client/src/utils/Log.ts)
         - [history.ts](client/src/utils/history.ts)
     - [tsconfig.json](client/tsconfig.json)
   - __service__
     - [node\_modules](service/node_modules)
     - [package\-lock.json](service/package-lock.json)
     - [package.json](service/package.json)
     - [serverless.yml](service/serverless.yml)
     - __src__
       - __auth__
         - [JwtPayload.ts](service/src/auth/JwtPayload.ts)
         - [utils.ts](service/src/auth/utils.ts)
       - __lambda__
         - __http__
           - [createCar.ts](service/src/lambda/http/createCar.ts)
           - [deleteCar.ts](service/src/lambda/http/deleteCar.ts)
           - [getPhotoUploadUrl.ts](service/src/lambda/http/getPhotoUploadUrl.ts)
           - [getUserCars.ts](service/src/lambda/http/getUserCars.ts)
           - [updateCar.ts](service/src/lambda/http/updateCar.ts)
       - __models__
         - [Car.ts](service/src/models/Car.ts)
       - __utils__
         - [logger.ts](service/src/utils/logger.ts)
     - [tsconfig.json](service/tsconfig.json)
     - __vscode__
       - [launch.json](service/vscode/launch.json)
     - [webpack.config.js](service/webpack.config.js)
