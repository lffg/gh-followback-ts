import * as chalk from 'chalk';
import { humanizeBool } from './utils/human';
import { puts, gets, cls, getsBoolean, registerStep } from './utils/io';

export function main(args: string[]): void {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Whoops! Something went wrong:');
      console.error(error);
    });
}

async function run() {
  let lastStep = registerStep({});

  //
  // Step 1:
  // Get GitHub username.
  //
  puts([
    chalk`{bold gh-followback} - GitHub Followback Checker`,
    'Checks which of the users you are following follow you back.',
    ''
  ]);
  const username = await gets('Enter your GitHub username: ');
  lastStep = registerStep({
    ...lastStep,
    'Username:': username
  });

  //
  // Step 2:
  // Get (or not) the GitHub API personal token.
  //
  puts([
    chalk`GitHub API has a rate limit policy, which makes this CLI unsuitable to fetch a long list of followers and following users. To unauthenticated users, GitHub imposes a maximum of {bold 60 requests per hour}, associated with the originating IP address.`,
    '',
    'To learn more, check the GitHub documentation at:',
    chalk`{cyan https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting}`,
    '',
    'To increase that limit, you can use a personal access token. This application does not require any special scope. You can generate a new personal access token here:',
    chalk`{cyan https://github.com/settings/tokens/new}`,
    ''
  ]);
  let usePersonalToken = await getsBoolean(
    'Do you want to use a personal access token?',
    { defaultResponse: 'yes' }
  );
  let personalToken: null | string = null;
  if (usePersonalToken) {
    lastStep = registerStep({
      ...lastStep,
      'Use personal token:': humanizeBool(usePersonalToken)
    });
    puts([
      'You can create a new personal token at:',
      chalk`{cyan https://github.com/settings/tokens/new}`,
      '',
      'If you do not want to use a personal access token, press enter (leave the field blank).',
      ''
    ]);
    personalToken = await gets('Enter your GitHub personal token: ');
    if (!personalToken) {
      personalToken = null;
      usePersonalToken = false;
    }
  }

  //
  // Step 3:
  // Fetch selected user info.
  //
  registerStep({
    ...lastStep,
    'Use personal token:': humanizeBool(usePersonalToken)
  });
  console.log({ username, personalToken });
}
