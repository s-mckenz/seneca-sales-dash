export const environment = {
  production: false,
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_0WHyPNNRN',
        userPoolClientId: 'k197r02g8dn54b8mhtfjlru1f',
      },
      loginWith: {
        oauth: {
          redirectSignIn: [
            "http://localhost:4200/",
            "https://senecaPayroll.s4hospitality.net/",
          ],
          redirectSignOut: [
            "http://localhost:4200/",
            "https://senecaPayroll.s4hospitality.net/",
          ],
          domain: 'us-east-10whypnnrn.auth.us-east-1.amazoncognito.com',
          
          scope: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'], 
          clientId: 'k197r02g8dn54b8mhtfjlru1f',
          responseType: 'code', 
        },
      },
    },
  },
  graphqlWsUri: 'wss://rds-cloud-staging.hasura.app/v1/graphql',
  graphqlUri: 'https://rds-cloud-staging.hasura.app/v1/graphql',
  authorizationToken: 'tAOkaxydbwpbuaqYnmApQl6d6WDxHxFKehW1RNx3ZTcUCMfsFxb7HeJ46G1lKY2b',
  googleClientId:'61605134382-5h228ll6cotfj1tojnitvn86op7qjo9r.apps.googleusercontent.com',
  cognitoUrl: 'https://0whypnnrn.auth.us-east-1.amazoncognito.com', // Fixed
  cognitoAuthority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_0WHyPNNRN', // Fixed
};
