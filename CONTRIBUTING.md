# Contributing to Riverflow

Thank you for considering contributing to Riverflow! This document outlines the process for contributing to the project and how to report issues.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](./CODE_OF_CONDUCT.md). Please make sure to read and understand it.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Riverflow. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the [issues](https://github.com/aryankumarofficial/stackoverflow-appwrite-clone/issues) to see if the problem has already been reported.
- Perform a cursory search to see if the problem has been reported already.

**How Do I Submit A Good Bug Report?**
Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps to reproduce the problem** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem.
- **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Riverflow, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check if there's already a package which provides that enhancement.
- Determine which repository the enhancement should be suggested in.
- Perform a cursory search to see if the enhancement has already been suggested.

**How Do I Submit A Good Enhancement Suggestion?**
Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Provide specific examples to demonstrate the steps**.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which help you demonstrate the steps or point out the part of Riverflow which the suggestion is related to.
- **Explain why this enhancement would be useful** to most Riverflow users.
- **List some other applications where this enhancement exists.**
- **Specify which version of Riverflow you're using.**
- **Specify the name and version of the OS you're using.**

### Pull Requests

The process described here has several goals:
- Maintain Riverflow's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Riverflow
- Enable a sustainable system for Riverflow's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in [the template](PULL_REQUEST_TEMPLATE.md)
2. Follow the [styleguides](#styleguides)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing

**What if the status checks are failing?**
If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem with our status check suite.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * ⚡️ `:zap:` when improving performance
    * 🔥 `:fire:` when removing code or files
    * 🐛 `:bug:` when fixing a bug
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### JavaScript/TypeScript Styleguide

All JavaScript/TypeScript code should adhere to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

### React/JSX Styleguide

* Use functional components with hooks instead of class components
* Use TypeScript for type checking
* Use inline styles only when necessary, prefer CSS modules or styled components
* Use destructuring for props
* Keep components small and focused

### Documentation Styleguide

* Use [Markdown](https://guides.github.com/features/mastering-markdown/) for documentation.
* Reference methods and classes in markdown with backticks: \`Class.method()\`
* Use clarity and be concise in documentation.

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

**Type of Issue and Issue State:**
* `enhancement`: Feature requests.
* `bug`: Confirmed bugs or reports that are very likely to be bugs.
* `question`: Questions more than bug reports or feature requests (e.g. how do I do X).
* `feedback`: General feedback more than bug reports or feature requests.
* `help-wanted`: The Riverflow team would appreciate help from the community in resolving these issues.
* `beginner`: Less complex issues which would be good first issues to work on for users who want to contribute to Riverflow.
* `more-information-needed`: More information needs to be collected about these problems or feature requests.
* `needs-reproduction`: Likely bugs, but haven't been reliably reproduced.
* `blocked`: Issues blocked on other issues.
* `duplicate`: Issues which are duplicates of other issues, i.e. they have been reported before.
* `wontfix`: The Riverflow team has decided not to fix these issues for now for some reason.
* `invalid`: Issues which aren't valid (e.g. user errors).

Thank you for contributing to Riverflow!