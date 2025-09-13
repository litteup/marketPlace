# Contributing to Distress MarketPlace BE

Thank you for considering contributing to Distress MarketPlace BE! We welcome all kinds of contributions, including bug reports, feature requests, and code improvements.

## Table of Contents

- [Contributing to Distress MarketPlace BE](#contributing-to-distress-marketplace-be)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [How to Contribute](#how-to-contribute)
    - [Reporting Bugs](#reporting-bugs)
    - [Suggesting Features](#suggesting-features)
    - [Code Contributions](#code-contributions)
      - [Development Workflow](#development-workflow)
        - [Branch Naming Rules](#branch-naming-rules)
        - [Commit Message Rules](#commit-message-rules)
      - [Submitting Pull Requests](#submitting-pull-requests)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Getting Started

1. Fork the repository.
2. Clone your forked repository:
   ```sh
   git clone https://github.com/kodecampteam/distress-marketplace-be.git
   ```
3. Navigate to the project directory:
   ```sh
   cd distress-marketplace-be
   ```
4. Install dependencies:
   ```sh
   npm ci
   ```
5. Start the local server to preview and interact with the app:
   ```sh
   npm run start:dev
   ```

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue on [GitHub Issues](https://github.com/kodecampteam/distress-marketplace-be/issues) and include as much detail as possible. Provide steps to reproduce, expected and actual behavior, and any relevant logs.

### Suggesting Features

If you have an idea for a new feature, please open an issue on [GitHub Issues](https://github.com/kodecampteam/distress-marketplace-be/issues) and describe your proposal. Explain why the feature would be useful and how it should work.

### Code Contributions

> Please make sure to have created a fork of the original repository. This is where you will work in when contributing.

#### Development Workflow

1. Create a new branch for your work:
   ```sh
   git checkout -b feat/DMB-2145-your-feature-name
   ```
   ##### Branch Naming Rules
   - You will likely work on features, bug fixes, refactors (restructuring code without changing functionality), chores on the repo (routine tasks such as updating dependencies or changing configurations), or documentation. Each of the type of update should be used as a prefix your branch name as `feat/`, `refactor/`, `fix/`, `chore/`, or `docs/`
   - For any of these updates, you will likely use a ticket or an issue. The ticket number, e.g. DMB-2145 or issue number should also be included in your branch name
   - Finally, a short description for your update should follow suit. This is often taken from the ticket title
   - All of this (except the ticket number acronym, `DMB`) should be written in lowercase
     > Thus, a typical branch should look like `feat/DMB-1234-create-login-page` or like `chore/remove-unused-variables` if your update has no corresponding ticket or issue (unlikely)
2. Make your changes, and commit them with descriptive messages:

   ```sh
   git commit -m "feat: your commit message"
   ```

   ##### Commit Message Rules

   Commit messages also follow a similar pattern. However, there is no need to add ticket number since they can be easily tracked given the branch name. Instead, use a colon, `:`, after the type of change (`feat`, `fix`, etc.), a whitespace, then your commit message. In cases where you are required to add the ticket number, you may use a the parenthesis after the type of change, like `feat(DMB-1234): your commit message`

   > Another example: `refactor: use a single state for formData` or `refactor(DMB-1234): use a single state for formData`

> Please notice how both branch names an commit messages use the imperative tense. The imperative tense is a command or request, which makes it clear what the commit does. i.e., "fix login issue", NOT "I fixed login issue", and NOT "fixed login issue"

3. Make sure your code passes the following checks:
   - **Lint** – check for code quality issues

     ```sh
     npm run lint
     ```

   - **Format** – auto-fix style issues (indentation, quotes, etc.)
     ```sh
     npm run format
     ```
   - **Build** – ensure the code compiles without errors:

     ```sh
     npm run build
     ```

   > Pull requests that fail linting, formatting, build, or tests will not be merged.

4. Push your branch to your forked repository:
   ```sh
   git push origin <your-branch>
   ```

#### Submitting Pull Requests

1. Ensure your branch is up to date with your remote repository:
   ```sh
   git checkout dev
   git pull origin dev
   git checkout <your-branch>
   git rebase dev
   ```
   > You should regularly update your remote repository with changes from the [default branch of the] upstream repository
2. Submit a pull request from your branch to the upstream repository.
3. In your pull request description, explain what changes you made and why.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/). By participating, you are expected to uphold this code. Please report unacceptable behavior to [email@example.com].

## License

By contributing, you agree that your contributions will be licensed under the [Apache License](LICENSE).
