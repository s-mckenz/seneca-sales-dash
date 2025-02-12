# Apollo Angular Template with AWS Cognito

## Overview
This repository serves as a base template for an Angular application using the [Apollo Angular Template](https://www.primefaces.org/apollo-ng) integrated with AWS Cognito for authentication.

## Prerequisites
Before setting up the project, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- Angular CLI
- AWS CLI (For managing Cognito resources)

## Project Setup
1. Clone the repository and navigate to the project directory:
   
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   
   ```sh
   npm install
   ```

3. Start the development server:
   
   ```sh
   ng serve
   ```

## AWS Cognito Setup
To use AWS Cognito for authentication, follow these steps:

### 1. Create a User Pool
1. Go to the [AWS Cognito Console](https://console.aws.amazon.com/cognito/).
2. Click **Create user pool**.
3. Configure the **Sign-in method** (e.g., email, username).
4. Set up **Password policies** and MFA (optional).
5. Create an **App client** without a secret.
6. Save the **User Pool ID** and **App Client ID** for later use.

### 2. Add a Custom Attribute
AWS Cognito does not allow custom attributes to be added from the web console after pool creation. Use the AWS CLI:

```sh
aws cognito-idp add-custom-attributes --user-pool-id <your-user-pool-id> --custom-attributes Name=license_key,AttributeDataType=String,Mutable=true
```

### 3. Update Authentication Flow
1. Configure the authentication settings in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  cognito: {
    userPoolId: '<your-user-pool-id>',
    userPoolWebClientId: '<your-app-client-id>',
    region: 'us-east-1'
  }
};
```

2. Update your `main.ts` file to initialize AWS Amplify:

```typescript
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';

Amplify.configure({
  Auth: {
    region: environment.cognito.region,
    userPoolId: environment.cognito.userPoolId,
    userPoolWebClientId: environment.cognito.userPoolWebClientId,
  }
});
```

## Importing Users via CSV
AWS Cognito allows importing users into a User Pool via a CSV file. Follow these steps:

1. **Download the CSV Template:**
   - Go to your Cognito User Pool in the AWS Console.
   - Navigate to **Users** > **Import users** > **Create an import job**.
   - Download the [user-import-template.csv](https://github.com/mwarnermatt-git/apollo-ng-cognito/blob/main/user-import-template.csv) file.

2. **Prepare the CSV File:**
   - Ensure the header remains unchanged.
   - Populate only the required fields: `cognito:username`, `email`, and `email_verified`.
   - Example:
     
     ```csv
     profile,address,birthdate,gender,preferred_username,updated_at,website,picture,phone_number,phone_number_verified,zoneinfo,custom:license_key,locale,email,email_verified,given_name,family_name,middle_name,name,nickname,cognito:mfa_enabled,cognito:username
     ,,,,,,,,,,,,user1@example.com,TRUE,,,,,,FALSE,user1
     ,,,,,,,,,,,,user2@example.com,TRUE,,,,,,FALSE,user2
     ```
   - Replace `<your-user-pool-id>` with the correct ID.

3. **Upload the CSV File:**
   - Go to **Users** > **Import users** > **Create an import job**.
   - Select your CSV file and submit the job.
   - Monitor the process in Amazon CloudWatch Logs.

[Download CSV Template](user-import-template.csv)

## Running the Application
After configuring Cognito, start the application:

```sh
ng serve
```

You can now sign up, sign in, and retrieve user attributes, including `license_key`.

## Repomix: Generating a Shareable Code Overview
We use [Repomix](https://github.com/yamadashy/repomix) to generate a summary of our codebase into a single `repomix-output.txt` file. This makes it easier to share and analyze with LLMs. Note that repomix is git aware and will ignore files in your .gitignore file. Consider temporarily excluding large and irrelevant files that may confuse your LLM of choice. 

### How to Run Repomix
1. Install Repomix globally:
   ```sh
   npm install -g repomix
   ```
2. Run Repomix in the project root:
   ```sh
   repomix
   ```
   This will generate `repomix-output.txt` in the repository.

### Excluding Repomix from VS Code Search
Since `repomix-output.txt` contains duplicated content from the repo, it can clutter search results in VS Code. To hide it from searches:
1. Open **VS Code**.
2. Go to **Settings** (`Ctrl + ,`).
3. Search for `"files.exclude"` and click **Edit in settings.json**.
4. Add:
   ```json
   "search.exclude": {
       "**/repomix-output.txt": true
   }
   ```
5. Save the file, and `repomix-output.txt` will no longer appear in searches.

---

## Additional Features
- User registration and login using Cognito
- Fetching user attributes dynamically, including custom attributes
- Integration with Apollo Angular theme for UI consistency

## Future Enhancements
- Properly implement password recovery flow
- Implement a user service to grab user, user-role, and related site data from Hasura
- Properly implement site hierarchies in forthcoming user service
- Enable multi-factor authentication (MFA)
- Add role-based access control (Hasura sites data + Angular RoleGuard library)
- Mirror cognito users in Hasura? 

## Troubleshooting
If you encounter issues with authentication, verify:
- Your Cognito configuration in `environment.ts`
- That your App Client **does not have a secret**
- The AWS CLI command syntax for adding attributes

For further details, refer to the [AWS Amplify Authentication Docs](https://docs.amplify.aws/gen1/angular/build-a-backend/auth/).

