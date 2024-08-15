const core = require('@actions/core');
const github = require('@actions/github');

async function fetchUsers(slackToken) {
  return fetch("https://slack.com/api/users.list", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${slackToken}`
    }
  })
}

async function main() {
  try {
    const slackToken = core.getInput('slack-token');
    const email = core.getInput('email');
    const defaultValue = core.getInput('default');
    const result = await fetchUsers(slackToken)
    if (result.ok) {
      const resultJson = await result.json()
      const user = resultJson.members.find((member) => member.profile.email === email)?.id;
      core.setOutput("slack-mention-tag", user ? `<@${user}>` : defaultValue);
      core.setOutput("slack-user-id", user || null)
    } else {
      core.setFailed(`Failed to fetch user list - [${result.status}: ${result.statusText}]`)
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main()
