export const environment = {
  production: false,
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_9DO881wuX',
        userPoolClientId: '34ibbsvkc014g5q7r5nc3pm8p5',
      },
      loginWith: {
        oauth: {
          redirectSignIn: [
            "http://localhost:4200/",
            "https://senecapayroll.s4hospitality.net/",
          ],
          redirectSignOut: [
            "http://localhost:4200/",
            "https://senecapayroll.s4hospitality.net/",
          ],
          domain: 'https://us-east-19do881wux.auth.us-east-1.amazoncognito.com',
          
          scope: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'], 
          clientId: '34ibbsvkc014g5q7r5nc3pm8p5',
          responseType: 'code', 
        },
      },
    },
  },
  graphqlWsUri: 'wss://rds-cloud-staging.hasura.app/v1/graphql',
  graphqlUri: 'https://rds-cloud-staging.hasura.app/v1/graphql',
  authorizationToken: 'tAOkaxydbwpbuaqYnmApQl6d6WDxHxFKehW1RNx3ZTcUCMfsFxb7HeJ46G1lKY2b',
  googleClientId:'268557945384-1mletd95tvd3t2a5n35nn5kin3jiqma7.apps.googleusercontent.com ',
  cognitoUrl: 'https://9do881wux.auth.us-east-1.amazoncognito.com', // Fixed
  cognitoAuthority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_9DO881wuX', // Fixed
};
