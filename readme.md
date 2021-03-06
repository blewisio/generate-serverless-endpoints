# Generate Serverless Endpoints

Generate boilerplate definitions for serverless API endpoints by answering questions.

## Usage

At the command line:
```sh
$ npx generate-serverless-endpoints
```

Example prompts:
```
jeff@amazon:~/my-lambda$ generate-endpoints 

Use {named} variables in the path to declare path parameters.

? What is the new endpoint's path? /users/{id}/settings
? Which methods are supported? GET, PUT
? Is the endpoint private (requires API key)? Yes
```

Example output:
```
Copy and paste this into your serverless.yml file:

functions:
  getUsersNotifications:
    handler: handler.getUsersNotifications
    events:
      - http:
          method: GET
          path: /users/{userId}/notifications
          private: true
          request:
            parameters:
              paths:
                userId: true
  postUsersNotifications:
    handler: handler.postUsersNotifications
    events:
      - http:
          method: POST
          path: /users/{userId}/notifications
          private: true
          request:
            parameters:
              paths:
                userId: true


Copy and paste these into your handler.js file:

module.exports.getUsersNotifications = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

module.exports.postUsersNotifications = async () => {
  return {
    statusCode: 201,
  };
};
```