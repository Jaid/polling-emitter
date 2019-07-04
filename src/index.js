/** @module polling-emitter */

import EventEmitter from "eventemitter3"
import {isEmpty, isFunction} from "lodash"

const debug = require("debug")(_PKG_NAME)

/**
 * @typedef Options
 * @type {Object}
 * @prop {number} [pollIntervalSeconds=10]
 * @prop {boolean} [invalidateInitialEntries=false]
 * @prop {boolean} [autostart=true]
 * @prop {(entry: Object) => string} [getIdFromEntry=entry => entry.id]
 * @prop {Function} [getIdFromEntry=entry => entry.id]
 * @prop {(entry: Object, id: string) => (boolean|void|Promise<boolean|void>)} [processEntry]
 * @prop {Function} [processEntry]
 * @prop {() => Promise<Object[]>} fetchEntries
 * @prop {Function} fetchEntries
 */

/**
 * @example
 * import PollingEmitter from "polling-emitter"
 * const emitter = PollingEmitter()
 * @class
 * @extends {EventEmitter}
 */
export default class extends EventEmitter {

  /**
   * @constructor
   * @param {Options} options
   */
  constructor(options) {
    super()

    /**
     * @member {Options}
     * @readonly
     */
    this.options = {
      pollIntervalSeconds: 10,
      invalidateInitialEntries: false,
      autostart: true,
      getIdFromEntry: entry => entry.id,
      ...options,
    }

    /**
     * @member {Set<string>}
     */
    this.processedEntryIds = new Set
    if (this.options.invalidateInitialEntries) {
      this.invalidateEntries()
    }
    if (this.options.autostart) {
      this.start()
    }
  }

  /**
   * @function
   * @fires PollingEmitter#newEntry
   */
  start() {
    if (this.interval) {
      this.stop()
    }
    debug("Starting PollingEmitter with an interval of %s seconds", this.options.pollIntervalSeconds)
    this.interval = setInterval(async () => {
      try {
        const fetchedEntries = await (this.options.fetchEntries || this.fetchEntries)()
        if (!fetchedEntries) {
          return
        }
        const unprocessedEntries = fetchedEntries.filter(entry => !this.hasAlreadyProcessedEntry(entry))
        if (unprocessedEntries |> isEmpty) {
          return
        }
        for (const entry of unprocessedEntries) {
          const id = this.options.getIdFromEntry(entry)
          this.processedEntryIds.add(id)
          debug("Invalidated %s", id)
          if ((this.options.processEntry || this.processEntry) |> isFunction) {
            const shouldEmitEntry = await (this.options.processEntry || this.processEntry)(entry)
            if (shouldEmitEntry === false) {
              return
            }
          }

          /**
           * @event PollingEmitter#newEntry
           */
          this.emit("newEntry", entry)
        }
      } catch (error) {
      (this.options.handleError || this.handleError)?.(error)
      }
    }, this.options.pollIntervalSeconds * 1000)
  }

  /**
   * @async
   * @function
   */
  async invalidateEntries() {
    try {
      const fetchedEntries = await (this.options.fetchEntries || this.fetchEntries)()
      if (!fetchedEntries) {
        return
      }
      for (const entry of fetchedEntries) {
        const id = this.options.getIdFromEntry(entry)
        this.processedEntryIds.add(id)
        debug("Invalidated %s", id)
        this.emit("invalidatedEntry", entry)
      }
    } catch (error) {
      (this.options.handleError || this.handleError)?.(error)
    }
  }

  /**
   * @function
   * @param {Object} entry
   * @returns {boolean}
   */
  hasAlreadyProcessedEntry(entry) {
    return this.processedEntryIds.has(this.options.getIdFromEntry(entry))
  }

  /**
   * @function
   * @param {string} entryId
   * @returns {boolean}
   */
  hasAlreadyProcessedEntryId(entryId) {
    return this.processedEntryIds.has(entryId)
  }

  /**
   * @function
   */
  stop() {
    debug("Stopping PollingEmitter")
    clearInterval(this.interval)
    delete this.interval
  }

}