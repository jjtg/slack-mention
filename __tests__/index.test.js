const {execute} = require("../action");

process.env.EMAIL = "test@test.com"
process.env.DEFAULT = "@default"

jest.mock("@actions/core", function () {
  return {
    getInput: jest.fn(function (name) {
      switch (name) {
        case "slack-token":
          return "token"
        case "email":
          return process.env.EMAIL
        case "default":
          return process.env.DEFAULT
        default:
          throw Error(`Illegal argument: ${name} is not a valid input.`)
      }
    }),
    setOutput: jest.fn(),
    setFailed: jest.fn()
  }
})

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      members: [{
        id: 1,
        profile: {
          email: "test@test.com"
        }
      }]
    }),
  })
);

const core = require('@actions/core');


describe("Test main function", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it("Should return outputs when ID is found", async () => {
    await execute()
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.getInput).toBeCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledWith("slack-mention-tag", "<@1>")
    expect(core.setOutput).toHaveBeenCalledWith("slack-user-id", 1)
  })
  it("Should return default when ID is not found", async () => {
    process.env.EMAIL = "non-existing-email@email.com"
    await execute()
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.getInput).toBeCalledTimes(3)
    expect(core.setOutput).toHaveBeenCalledWith("slack-mention-tag", "@default")
    expect(core.setOutput).toHaveBeenCalledWith("slack-user-id", null)

  })
  it("Should return error when fetching fails", async () => {
    global.fetch.mockImplementation(() => {
      throw Error("Test error")
    })
    await execute()
    expect(core.setFailed).toHaveBeenCalledWith("Test error")
  })
  it("Should return error when an unexpected error happens", async () => {
    global.fetch.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 418,
      statusText: "Test - Invalid request",
    }))
    await execute()
    expect(core.setFailed).toHaveBeenCalledWith("Failed to fetch user list - [418: Test - Invalid request]")
  })
})
