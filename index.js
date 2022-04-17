#!/usr/bin/env node
const camelcase = require('camelcase');
const chalk = require('chalk');
const inquirer = require('inquirer');
const xregexp = require('xregexp');
require('loud-rejection/register');

const questions = [{
  name: 'route',
  type: 'input',
  message: 'What is the new endpoint\'s path?',
  validate: (x) => !!x,
}, {
  name: 'methods',
  type: 'checkbox',
  message: 'Which methods are supported?',
  choices: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
  ],
  validate: (x) => x.length !== 0,
}, {
  name: 'isPrivate',
  type: 'confirm',
  message: 'Is the endpoint private (requires API key)?',
  default: true,
}];

const getParams = (route) => xregexp.match(route, /\{\w+\}/g, 'all');

const getName = ({ method, route, params }) => {
  let name = camelcase(`${method}-${route}`.replace(/\//g, '-'));
  params.forEach((param) => {
    name = name.replace(`-${param}`, '');
  });

  return name;
};

const logIntroduction = () => {
  console.log();
  console.log('Use {named} variables in the path to declare path parameters.');
  console.log();
};

const logEndpoints = ({ isPrivate, methods, route }) => {
  console.log();
  console.log(chalk.yellow('Copy and paste this into your serverless.yml file:'));
  console.log();
  console.log('functions:');

  // ex. /users/{id}/settings/{setting}
  const params = getParams(route);

  methods.forEach((method) => {
    const name = getName({ method, route, params });

    console.log(`  ${name}:
    handler: handler.${name}
    events:
      - http:
          method: ${method}
          path: ${route}
          private: ${isPrivate}${params.length === 0 ? '' : `
          request:
            parameters:
              paths:`}`);

    params.forEach((param) => {
      console.log(`                ${param.replace('{', '').replace('}', '')}: true`);
    });
  });

  console.log();
};

const logHandlers = ({ methods, route }) => {
  console.log();
  console.log(chalk.yellow('Copy and paste this into your handler.js file:'));
  console.log();

  const params = getParams(route);

  methods.forEach((method) => {
    const name = getName({ method, route, params });
    console.log(`module.exports.${name} = async () => {
  return {
    statusCode: ${method === 'POST' ? 201 : 200},${method === 'GET' ? `
    body: JSON.stringify({}),` : ''}
  };
};`);
    console.log();
  });
};

(async () => {
  logIntroduction();

  const {
    isPrivate,
    methods,
    route,
  } = await inquirer.prompt(questions);

  logEndpoints({ isPrivate, methods, route });
  logHandlers({ methods, route });
})();
