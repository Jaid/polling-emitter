/** @module polling-emitter */

import EventEmitter from "eventemitter3"
import {isFunction} from "lodash"
import {isEmpty} from "has-content"
import intervalPromise from "interval-promise"
import ms from "ms.macro"

const debug = require("debug")(_PKG_NAME)

/**
 * @typedef Options
 * @type {Object}
 * @prop {number} [pollInterval=60000]
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
 * Polls data from any source at given interval and fires events on changes.
 * @class
 * @extends {EventEmitter}
 * @example
 * import PollingEmitter from "polling-emitter"
 * const emitter = PollingEmitter()
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
      pollInterval: ms`1 minute`,
      invalidateInitialEntries: false,
      autostart: false,
      getIdFromEntry: entry => entry.id,
      ...options,
    }

    /**
     * @member {Set<string>}
     */
    this.processedEntryIds = new Set

    /**
     * @member {number}
     */
    this.successfulRunsCount = 0

    /**
     * @member {boolean}
     */
    this.isRunning = false
    if (this.options.fetchEntries) {
      this.fetchEntries = this.options.fetchEntries
    }
    if (this.options.processEntry) {
      this.processEntry = this.options.processEntry
    }
    if (this.options.handleError) {
      this.handleError = this.options.handleError
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
    if (this.isRunning) {
      debug("Skipped start(), because PollingEmitter is already running")
      return
    }
    debug("Starting PollingEmitter with an interval of %s ms", this.options.pollInterval)
    this.isRunning = true
    const job = async (iteration, stop) => {
      if (!this.isRunning) {
        stop()
        return
      }
      try {
        const fetchedEntries = await this.fetchEntries()
        this.successfulRunsCount++
        if (this.options.invalidateInitialEntries && this.successfulRunsCount === 1) {
          for (const entry of fetchedEntries) {
            const id = this.options.getIdFromEntry(entry)
            this.processedEntryIds.add(id)
            debug("Initially invalidated %s", id)
          }
          return
        }
        if (fetchedEntries |> isEmpty) {
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
          if (this.processEntry |> isFunction) {
            const shouldEmitEntry = await this.processEntry(entry)
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
        if (this.handleError) {
          debug("Handling error: %s", error)
          this.handleError(error)
        } else {
          debug("Throwing error: %s", error)
          throw error
        }
      }
    }
    intervalPromise(job, this.options.pollInterval)
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
    this.isRunning = false
  }

}