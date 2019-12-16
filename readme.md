# polling-emitter



## Installation
<a href='https://npmjs.com/package/polling-emitter'><img alt='npm logo' src='https://github.com/Jaid/action-readme/raw/master/images/base-assets/npm.png'/></a>
```bash
npm install --save polling-emitter@^4.1.0
```
<a href='https://yarnpkg.com/package/polling-emitter'><img alt='Yarn logo' src='https://github.com/Jaid/action-readme/raw/master/images/base-assets/yarn.png'/></a>
```bash
yarn add polling-emitter@^4.1.0
```


## Try it out
<img alt='Chromium logo' src='https://github.com/Jaid/action-readme/raw/master/images/base-assets/browser.png'/>
Open a browser's JavaScript console and execute:

```javascript
const scriptElement = document.createElement("script");
scriptElement.setAttribute("type","text/javascript");
scriptElement.setAttribute("src","https://unpkg.com/polling-emitter@4.1.0");
document.querySelector("head").appendChild(scriptElement);
```

This module is now loaded in a variable that can be accessed in any scope.

```javascript
typeof PollingEmitter.default
```

## Documentation

* [polling-emitter](#module_polling-emitter)
    * [module.exports](#exp_module_polling-emitter--module.exports) ⇐ <code>EventEmitter</code> ⏏
        * [new module.exports(options)](#new_module_polling-emitter--module.exports_new)
        * _instance_
            * [.options](#module_polling-emitter--module.exports+options) : <code>Options</code>
            * [.processedEntryIds](#module_polling-emitter--module.exports+processedEntryIds) : <code>Set.&lt;string&gt;</code>
            * [.successfulRunsCount](#module_polling-emitter--module.exports+successfulRunsCount) : <code>number</code>
            * [.isRunning](#module_polling-emitter--module.exports+isRunning) : <code>boolean</code>
            * [.hasProcessEntryFunction](#module_polling-emitter--module.exports+hasProcessEntryFunction) : <code>boolean</code>
            * [.hasHandleErrorFunction](#module_polling-emitter--module.exports+hasHandleErrorFunction) : <code>boolean</code>
            * [.start()](#module_polling-emitter--module.exports+start)
            * [.hasAlreadyProcessedEntry(entry)](#module_polling-emitter--module.exports+hasAlreadyProcessedEntry) ⇒ <code>boolean</code>
            * [.hasAlreadyProcessedEntryId(entryId)](#module_polling-emitter--module.exports+hasAlreadyProcessedEntryId) ⇒ <code>boolean</code>
            * [.stop()](#module_polling-emitter--module.exports+stop)
        * _inner_
            * [~Options](#module_polling-emitter--module.exports..Options) : <code>Object</code>

Polls data from any source at given interval and fires events on changes.

**Kind**: Exported class  
**Extends**: <code>EventEmitter</code>  

| Param | Type |
| --- | --- |
| options | <code>Options</code> | 

**Example**  
```javascript
import PollingEmitter from "polling-emitter"
const emitter = PollingEmitter()
```
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Read only**: true  
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: instance property of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: instance method of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Emits**: <code>PollingEmitter#event:newEntry</code>  
**Kind**: instance method of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  

| Param | Type |
| --- | --- |
| entry | <code>Object</code> | 

**Kind**: instance method of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  

| Param | Type |
| --- | --- |
| entryId | <code>string</code> | 

**Kind**: instance method of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Kind**: inner typedef of [<code>module.exports</code>](#exp_module_polling-emitter--module.exports)  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| [pollInterval] | <code>number</code> | <code>60000</code> | 
| [invalidateInitialEntries] | <code>boolean</code> | <code>false</code> | 
| [autostart] | <code>boolean</code> | <code>true</code> | 
| [getIdFromEntry] | <code>function</code> | <code>(entry) &#x3D;&gt; entry.id</code> | 
| [processEntry] | <code>function</code> |  | 
| fetchEntries | <code>function</code> |  | 



## License
```text
MIT License

Copyright © 2019, Jaid <jaid.jsx@gmail.com> (github.com/jaid)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
