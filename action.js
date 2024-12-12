const core = require('@actions/core');

async function fetchUsers(slackToken, email) {

  return fetch(`https://slack.com/api/users.lookupByEmail?email=${email}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${slackToken}`
    }
  })
}

async function execute() {
  try {
    const slackToken = core.getInput('slack-token');
    const email = core.getInput('email');
    const defaultValue = core.getInput('default');
    const result = await fetchUsers(slackToken, email);
    if (result.ok) {
      const resultJson = await result.json()
      const user = resultJson?.user?.id;
      core.setOutput("slack-mention-tag", user ? `<@${user}>` : defaultValue);
      core.setOutput("slack-user-id", user || null)
    } else {
      core.setFailed(`Failed to fetch user list - [${result.status}: ${result.statusText}]`)
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}


module.exports = {
  execute
}
