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
}, {
  name: 'isPrivate',
  type: 'confirm',
  message: 'Is the endpoint private (requires API key)?',
  default: true,
}];

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
  const params = xregexp.match(route, /\{\w+\}/g, 'all');

  methods.forEach((method) => {
    let name = camelcase(`${method}-${route}`.replace(/\//g, '-'));
    params.forEach((param) => {
      name = name.replace(`-${param}`, '');
    });

    console.log(`  ${name}:
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

(async () => {
  logIntroduction();

  const {
    isPrivate,
    methods,
    route,
  } = await inquirer.prompt(questions);

  logEndpoints({ isPrivate, methods, route });
})();
