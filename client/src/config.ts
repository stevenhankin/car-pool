// apiId can be found after running the service deployments using sls
const apiId = "ujy3txnqm6";
const region = "eu-west-2";
const stage = "dev";
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`;

// Auth0 Configuration
export const authConfig = {
  domain: "dev-h22b0uti.eu.auth0.com", // Auth0 domain
  clientId: "a00gmtdtP4BHJHn9jL9VmeToCDWE58YZ", // Auth0 client id
  callbackUrl: "/callback"
};
