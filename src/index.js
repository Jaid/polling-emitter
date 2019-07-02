/** @module polling-emitter */

import EventEmitter from "eventemitter3"
import {isEmpty, isFunction} from "lodash"

/**
 * @typedef Options
 * @type {Object}
 * @prop {number} [pollIntervalSeconds=10]
 * @prop {boolean} [invalidateInitialEntries=false]
 * @prop {boolean} [autostart=true]
 */

/**
 * Returns the number of seconds passed since Unix epoch (01 January 1970)
 * @example
 * import PollingEmitter from "polling-emitter"
 * const emitter = PollingEmitter()
 * @class
 * @extends {EventEmitter}
 */
export default class PollingEmitter extends EventEmitter {

  /**
   * @constructor
   * @param {Options} options
   */
  constructor(options) {
    super()
    this.options = {
      pollIntervalSeconds: 10,
      invalidateInitialEntries: false,
      autostart: true,
      ...options,
    }
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
      clearInterval(this.interval)
      delete this.interval
    }
    this.interval = setInterval(async () => {
      try {
        const fetchedEntries = await this.fetchEntries()
        if (!fetchedEntries) {
          return
        }
        const unprocessedEntries = fetchedEntries.filter(entry => !this.hasAlreadyProcessedEntry(entry))
        if (unprocessedEntries |> isEmpty) {
          return
        }
        for (const entry of unprocessedEntries) {
          const id = this.getIdFromEntry(entry)
          this.processedEntryIds.add(id)
          if (this.processEntry |> isFunction) {
            const shouldEmitEntry = await this.processEntry(entry, id)
            if (shouldEmitEntry === false) {
              return
            }
          }

          /**
           * @event PollingEmitter#newEntry
           */
          this.emit("newEntry", entry, id)
        }
      } catch (error) {
        this.handleError?.(error)
      }
    }, this.options.pollIntervalSeconds * 1000)
  }

  /**
   * @async
   * @function
   */
  async invalidateEntries() {
    try {
      const fetchedEntries = await this.fetchEntries()
      if (!fetchedEntries) {
        return
      }
      for (const entry of fetchedEntries) {
        const id = this.getIdFromEntry(entry)
        this.processedEntryIds.add(id)
        this.emit("invalidatedEntry", entry, id)
      }
    } catch (error) {
      this.handleError?.(error)
    }
  }

  /**
   * @function
   * @param {Object} entry
   * @returns {boolean}
   */
  hasAlreadyProcessedEntry(entry) {
    return this.processedEntryIds.has(this.getIdFromEntry(entry))
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
   * @param {Object} entry
   * @returns {string}
   */
  getIdFromEntry(entry) {
    return entry.id
  }

  /**
   * @async
   * @function
   * @throws {Error}
   */
  stop() {
    clearInterval(this.interval)
    delete this.interval
  }

}