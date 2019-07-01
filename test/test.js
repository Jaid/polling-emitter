import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
   * @type { import("../src") }
   */
const {default: PollingEmitter} = indexModule

it("should run", () => {
  const emitter = new PollingEmitter()
})