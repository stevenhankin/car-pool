// apiId can be found after running the service deployments using sls
const apiId = 'a1hc2c4wbj';
const region = 'eu-west-2';
const stage = 'dev';
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;

export const authConfig = {
  domain: 'dev-h22b0uti.eu.auth0.com', // Auth0 domain
  clientId: 'kVhkaTOYIZYhFryediLEZPMVeQ6zpRVe', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
};
