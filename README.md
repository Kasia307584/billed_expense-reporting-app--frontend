# Billed - expense reporting app

Billed is an application to manage employee expense reports. The main focus of this project is on writing JavaScript tests for the front-end.
The project is build on the top of [this OpenClassrooms project](https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front).

## Installation

### Prerequisites

- Recommended: Node.js 18.16.1
- NPM
- To run the project locally, install the backend provided [here](https://github.com/Kasia307584/billed_expense-reports-app--backend)

### Getting started

Clone the project:

```bash
  $ git clone https://github.com/Kasia307584/billed_expense-reporting-app--frontend
```

Install project dependencies:

```bash
  $ npm install
```

Install live-server globally for a local server:

```bash
  $ npm install -g live-server
```

### Development

Start the development server using live-server:

```bash
  $ live-server
```

Open the app in your browser: `http://127.0.0.1:8080/`

### How to run tests locally?

Run all the tests:

```bash
  $ npm run test
```

Install Jest CLI globally and run a specific test file using Jest:

```bash
   $ npm install -g jest-cli
   $ jest src/**tests**/your_test_file.js
```

View the test coverage report:
`http://127.0.0.1:8080/coverage/lcov-report/`
or

```bash
$ ./coverage/lcov-report/index.html
```

### Login credentials

- Admin:
  - Email: admin@test.tld
  - Password: admin
- Employee:
  - Email: employee@test.tld
  - Password: employee

## My process

### Build with

- The project base is build with vanilla JavaScript.

Tests are build with:

- Jest
- Testing library

### What I learned

- use `Chrome Debugger` and `VS Code Debugger` to debug the code
- implement debugging methodology
- use `Jest` syntax and `Testing library` to write tests
- mock some parts of the code
- implement end-to-end test writing methodology

### Continued development

- cover the rest of the application with tests
