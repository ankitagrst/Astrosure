export class UserError extends Error {
  userMessage: string
  status?: number

  constructor(message: string, userMessage?: string, status?: number) {
    super(message)
    this.name = 'UserError'
    this.userMessage = userMessage || message
    this.status = status
  }
}
