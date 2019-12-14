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
    pollInterval: ms`5 seconds`,
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
        pollInterval: ms`2 seconds`,
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

it("should invalidate initial entries", async () => {
  const entrySource = {
    entriesToFetch: [
      {
        id: "rem",
        hairColor: "blue",
      },
    ],
    fetch() {
      const returnValue = [...this.entriesToFetch]
      this.entriesToFetch.push({
        id: "ram",
        hairColor: "pink",
      })
      return returnValue
    },
  }
  let newEntryFired = false
  let initialEntryFired = false
  const emitter = new PollingEmitter({
    pollInterval: ms`1 second`,
    invalidateInitialEntries: true,
    fetchEntries: () => entrySource.fetch(),
    autostart: true,
  })
  emitter.on("initialEntry", entry => {
    expect(entry.hairColor).toBe("blue")
    initialEntryFired = true
  })
  emitter.on("newEntry", entry => {
    expect(entry.hairColor).toBe("pink")
    newEntryFired = true
  })
  expect(emitter.processedEntryIds.size).toBe(0)
  await delay(ms`3 seconds`)
  expect([...emitter.processedEntryIds]).toStrictEqual(["rem", "ram"])
  emitter.stop()
  expect(newEntryFired).toBeTruthy()
  expect(initialEntryFired).toBeTruthy()
}, ms`10 seconds`)