import path from "path"

import delay from "delay"
import ms from "ms.macro"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: PollingEmitter} = indexModule

it("should run", async () => {
  const emitter = new PollingEmitter({
    pollIntervalSeconds: 5,
    fetchEntries: () => [{key: "a"}],
    getIdFromEntry: ({key}) => key,
  })
  expect(emitter.processedEntryIds.size).toBe(0)
  await delay(ms`6 seconds`)
  expect(emitter.processedEntryIds.size).toBe(1)
  emitter.stop()
  expect(emitter.interval).toBe(undefined)
}, ms`10 seconds`)