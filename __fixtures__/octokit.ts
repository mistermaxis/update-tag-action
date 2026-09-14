import { jest } from '@jest/globals'

class Context {
  _eventName: string = 'push'
  _payload: {
    commits?: [
      {
        id: string
        message: string
      }
    ]
  } = {}
  get eventName(): string {
    return this._eventName
  }
  set eventName(event_name: string) {
    this._eventName = event_name
  }
  get payload(): {
    commits?: [
      {
        id: string
        message: string
      }
    ]
  } {
    return this._payload
  }
  set payload(input: {
    commits?: [
      {
        id: string
        message: string
      }
    ]
  }) {
    this._payload = input
  }

  get repo(): { owner: string; repo: string } {
    return { owner: 'owner', repo: 'repo' }
  }
}

export const context = new Context()

export const getOctokit = jest.fn()
