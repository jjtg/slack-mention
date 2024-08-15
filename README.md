# Slack Mention GitHub Action
___
Fetch a user ID in order to mention them in conjunction with [Slack Send GitHub Action](https://github.com/slackapi/slack-github-action).

## Setup
- Create a Slack App for your workspace (alternatively use an existing app you have already created and installed).
- Add the `user:read` and `users:read.email` bot scope under OAuth & Permissions.
- Install the app to your workspace.
- To use in conjuction with `Slack Send GitHub Action` follow [their setup as well](https://github.com/slackapi/slack-github-action?tab=readme-ov-file#setup).

## Usage
To use this simply add the following to your workflow:

```yaml
uses: jjtg/slack-mention@v1.0.0
with:
  slack-token: ${{ secrets.SLACK_BOT_TOKEN }}
  email: ${{ github.author.email }}
  default: "@here"
```

### Inputs
The action supports the following inputs:
- `slack-token` - (required) The slack application token. *Must have `users:read` & `users:read.email` permissions.
- `email` - (required) The email of the slack user you want to get a mention.
- `default` - (optional) The value to default should the email not exist in the slack workspace. OBS! Defaults to `@here`.

### Outputs
The action configures two outputs: 
- `slack-mention-tag` - The formatted slack mention tag, i.e. `<@USER_ID>`, or default value.
- `slack-user-id` - The raw slack user ID value (defaults to null if not user is found).

## Sample code
Check out the [example](https://github.com/jjtg/slack-mention/blob/main/.github/workflows/example.yaml) to get an idea of how to use the code in your GitHub workflows.

## License
[MIT](https://opensource.org/license/mit)

## Want to contribute?
All contributors are welcome, feel free to add issues and we can take it from there! 🚀
