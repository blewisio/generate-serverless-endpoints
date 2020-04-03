# Generate Serverless Endpoints

## Installation

```
npm install --global generate-serverless-endpoints
```

## Usage

At the command line:
```
$ generate-endpoints
```

Example prompts1:
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
  getUsersSettings:
    events:
      - http:
          method: GET
          path: /users/{id}/settings
          private: true
          request:
            parameters:
              paths:
                id: true
  putUsersSettings:
    events:
      - http:
          method: PUT
          path: /users/{id}/settings
          private: true
          request:
            parameters:
              paths:
                id: true
```