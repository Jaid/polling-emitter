import path from "path"

import delay from "delay"
import ms from "ms.macro"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: PollingEmitter} = indexModule

it("should run", async () => {
  let newEntryFired = false
  const emitter = new PollingEmitter({
    pollIntervalSeconds: 5,
    invalidateInitialEntries: false,
    fetchEntries: () => [{key: "a"}],
    getIdFromEntry: ({key}) => key,
    autostart: true,
  })
  emitter.on("newEntry", () => {
    newEntryFired = true
  })
  expect(emitter.processedEntryIds.size).toBe(0)
  await delay(ms`6 seconds`)
  expect(emitter.processedEntryIds.size).toBe(1)
  emitter.stop()
  expect(emitter.interval).toBe(undefined)
  expect(newEntryFired).toBeTruthy()
}, ms`10 seconds`)

it("Extending class should work", async () => {
  const MyPollingEmitter = class extends PollingEmitter {

    constructor() {
      super({
        getIdFromEntry: entry => entry.myId,
        pollIntervalSeconds: 2,
        invalidateInitialEntries: false,
      })
      this.start()
    }

    async fetchEntries() {
      await delay(1)
      return [
        {
          myId: "car",
          color: "red",
        },
      ]
    }

  }
  let newEntryFired = false
  const emitter = new MyPollingEmitter({
  })
  emitter.on("newEntry", () => {
    newEntryFired = true
  })
  expect(emitter.processedEntryIds.size).toBe(0)
  await delay(ms`3 seconds`)
  expect(emitter.processedEntryIds.size).toBe(1)
  expect(emitter.hasAlreadyProcessedEntryId("car")).toBe(true)
  emitter.stop()
  expect(emitter.interval).toBe(undefined)
  expect(newEntryFired).toBeTruthy()
}, ms`10 seconds`)