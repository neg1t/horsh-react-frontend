type SyncHandler = (payload: unknown) => Promise<void>

const handlers = new Map<string, SyncHandler>()

export function registerSyncHandler(type: string, handler: SyncHandler) {
  handlers.set(type, handler)
}

export function getSyncHandler(type: string): SyncHandler | undefined {
  return handlers.get(type)
}
