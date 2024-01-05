
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(moduleArg = {}) {

// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise((resolve, reject) => {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});
["_genQrCode","___indirect_function_table","_fflush","onRuntimeInitialized"].forEach((prop) => {
  if (!Object.getOwnPropertyDescriptor(Module['ready'], prop)) {
    Object.defineProperty(Module['ready'], prop, {
      get: () => abort('You are getting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
      set: () => abort('You are setting ' + prop + ' on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js'),
    });
  }
});

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = true;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

if (Module['ENVIRONMENT']) {
  throw new Error('Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary;

if (ENVIRONMENT_IS_SHELL) {

  if ((typeof process == 'object' && typeof require === 'function') || typeof window == 'object' || typeof importScripts == 'function') throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  if (typeof read != 'undefined') {
    read_ = read;
  }

  readBinary = (f) => {
    if (typeof readbuffer == 'function') {
      return new Uint8Array(readbuffer(f));
    }
    let data = read(f, 'binary');
    assert(typeof data == 'object');
    return data;
  };

  readAsync = (f, onload, onerror) => {
    setTimeout(() => onload(readBinary(f)));
  };

  if (typeof clearTimeout == 'undefined') {
    globalThis.clearTimeout = (id) => {};
  }

  if (typeof setTimeout == 'undefined') {
    // spidermonkey lacks setTimeout but we use it above in readAsync.
    globalThis.setTimeout = (f) => (typeof f == 'function') ? f() : abort();
  }

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit == 'function') {
    quit_ = (status, toThrow) => {
      // Unlike node which has process.exitCode, d8 has no such mechanism. So we
      // have no way to set the exit code and then let the program exit with
      // that code when it naturally stops running (say, when all setTimeouts
      // have completed). For that reason, we must call `quit` - the only way to
      // set the exit code - but quit also halts immediately.  To increase
      // consistency with node (and the web) we schedule the actual quit call
      // using a setTimeout to give the current stack and any exception handlers
      // a chance to run.  This enables features such as addOnPostRun (which
      // expected to be able to run code after main returns).
      setTimeout(() => {
        if (!(toThrow instanceof ExitStatus)) {
          let toLog = toThrow;
          if (toThrow && typeof toThrow == 'object' && toThrow.stack) {
            toLog = [toThrow, toThrow.stack];
          }
          err(`exiting due to exception: ${toLog}`);
        }
        quit(status);
      });
      throw toThrow;
    };
  }

  if (typeof print != 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console == 'undefined') console = /** @type{!Console} */({});
    console.log = /** @type{!function(this:Console, ...*): undefined} */ (print);
    console.warn = console.error = /** @type{!function(this:Console, ...*): undefined} */ (typeof printErr != 'undefined' ? printErr : print);
  }

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  if (!(typeof window == 'object' || typeof importScripts == 'function')) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js
read_ = (url) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.error.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;
checkIncomingModuleAPI();

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];legacyModuleProp('arguments', 'arguments_');

if (Module['thisProgram']) thisProgram = Module['thisProgram'];legacyModuleProp('thisProgram', 'thisProgram');

if (Module['quit']) quit_ = Module['quit'];legacyModuleProp('quit', 'quit_');

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message
// Assertions on removed incoming Module JS APIs.
assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
assert(typeof Module['read'] == 'undefined', 'Module.read option was removed (modify read_ in JS)');
assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
legacyModuleProp('asm', 'wasmExports');
legacyModuleProp('read', 'read_');
legacyModuleProp('readAsync', 'readAsync');
legacyModuleProp('readBinary', 'readBinary');
legacyModuleProp('setWindowTitle', 'setWindowTitle');
var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

assert(!ENVIRONMENT_IS_WORKER, "worker environment detected but not enabled at build time.  Add 'worker' to `-sENVIRONMENT` to enable.");

assert(!ENVIRONMENT_IS_NODE, "node environment detected but not enabled at build time.  Add 'node' to `-sENVIRONMENT` to enable.");

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add 'shell' to `-sENVIRONMENT` to enable.");


// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary; 
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];legacyModuleProp('wasmBinary', 'wasmBinary');

// include: wasm2js.js
// wasm2js.js - enough of a polyfill for the WebAssembly object so that we can load
// wasm2js code that way.

// Emit "var WebAssembly" if definitely using wasm2js. Otherwise, in MAYBE_WASM2JS
// mode, we can't use a "var" since it would prevent normal wasm from working.
/** @suppress{duplicate, const} */
var
WebAssembly = {
  // Note that we do not use closure quoting (this['buffer'], etc.) on these
  // functions, as they are just meant for internal use. In other words, this is
  // not a fully general polyfill.
  /** @constructor */
  Memory: function(opts) {
    this.buffer = new ArrayBuffer(opts['initial'] * 65536);
  },

  Module: function(binary) {
    // TODO: use the binary and info somehow - right now the wasm2js output is embedded in
    // the main JS
  },

  /** @constructor */
  Instance: function(module, info) {
    // TODO: use the module somehow - right now the wasm2js output is embedded in
    // the main JS
    // This will be replaced by the actual wasm2js code.
    this.exports = (
function instantiate(info) {
function Table(ret) {
  // grow method not included; table is not growable
  ret.set = function(i, func) {
    this[i] = func;
  };
  ret.get = function(i) {
    return this[i];
  };
  return ret;
}

  var bufferView;
  var base64ReverseLookup = new Uint8Array(123/*'z'+1*/);
  for (var i = 25; i >= 0; --i) {
    base64ReverseLookup[48+i] = 52+i; // '0-9'
    base64ReverseLookup[65+i] = i; // 'A-Z'
    base64ReverseLookup[97+i] = 26+i; // 'a-z'
  }
  base64ReverseLookup[43] = 62; // '+'
  base64ReverseLookup[47] = 63; // '/'
  /** @noinline Inlining this function would mean expanding the base64 string 4x times in the source code, which Closure seems to be happy to do. */
  function base64DecodeToExistingUint8Array(uint8Array, offset, b64) {
    var b1, b2, i = 0, j = offset, bLength = b64.length, end = offset + (bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '=');
    for (; i < bLength; i += 4) {
      b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
      uint8Array[j++] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      if (j < end) uint8Array[j++] = b1 << 4 | b2 >> 2;
      if (j < end) uint8Array[j++] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
    }
  }
function initActiveSegments(imports) {
  base64DecodeToExistingUint8Array(bufferView, 65536, "aDF2MWgtMXoALSsgICAwWDB4AC0wWCswWCAwWC0weCsweCAweABiaXRMZW4gPD0gZGF0YUNhcGFjaXR5Qml0cwBudW1DaGFyQ291bnRCaXRzAGRyYXdGb3JtYXRCaXRzAGdldFRvdGFsQml0cwBiaXRMZW4gPT0gZGF0YVVzZWRCaXRzAGZpbmRlclBlbmFsdHlDb3VudFBhdHRlcm5zAGRyYXdMaWdodEZ1bmN0aW9uTW9kdWxlcwBnZXROdW1SYXdEYXRhTW9kdWxlcwBkcmF3Q29kZXdvcmRzAGdldE51bURhdGFDb2Rld29yZHMAcmVlZFNvbG9tb25Db21wdXRlRGl2aXNvcgBhcHBlbmRCaXRzVG9CdWZmZXIAcmVlZFNvbG9tb25Db21wdXRlUmVtYWluZGVyAHJlc3VsdC5iaXRMZW5ndGggPT0gYml0TGVuAG5hbgBhcHBseU1hc2sAY2FsY1NlZ21lbnRCaXRMZW5ndGgAaW5mADIxIDw9IHFyc2l6ZSAmJiBxcnNpemUgPD0gMTc3ICYmIDAgPD0geCAmJiB4IDwgcXJzaXplICYmIDAgPD0geSAmJiB5IDwgcXJzaXplAHFyY29kZWdlbl9nZXRTaXplAHFyY29kZWdlbl9jYWxjU2VnbWVudEJ1ZmZlclNpemUAYWRkRWNjQW5kSW50ZXJsZWF2ZQBmYWxzZQBnZXRQZW5hbHR5U2NvcmUAcXJjb2RlZ2VuX2dldE1vZHVsZQBzZXRNb2R1bGVCb3VuZGVkAGdldE1vZHVsZUJvdW5kZWQAcXJjb2RlZ2VuX2VuY29kZVNlZ21lbnRzQWR2YW5jZWQAJWQAcXJjb2RlZ2VuX2lzQWxwaGFudW1lcmljAHFyY29kZWdlbl9tYWtlQWxwaGFudW1lcmljAHFyY29kZWdlbl9pc051bWVyaWMAcXJjb2RlZ2VuX21ha2VOdW1lcmljAC5ccXJjb2RlZ2VuLmMAcXJjb2RlZ2VuX1ZFUlNJT05fTUlOIDw9IHZlciAmJiB2ZXIgPD0gcXJjb2RlZ2VuX1ZFUlNJT05fTUFYADAgPD0gKGludCllY2wgJiYgKGludCllY2wgPCA0ICYmIHFyY29kZWdlbl9WRVJTSU9OX01JTiA8PSB2ZXJzaW9uICYmIHZlcnNpb24gPD0gcXJjb2RlZ2VuX1ZFUlNJT05fTUFYAHFyY29kZWdlbl9WRVJTSU9OX01JTiA8PSBtaW5WZXJzaW9uICYmIG1pblZlcnNpb24gPD0gbWF4VmVyc2lvbiAmJiBtYXhWZXJzaW9uIDw9IHFyY29kZWdlbl9WRVJTSU9OX01BWAAxIDw9IGRlZ3JlZSAmJiBkZWdyZWUgPD0gcXJjb2RlZ2VuX1JFRURfU09MT01PTl9ERUdSRUVfTUFYADAgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSBJTlQxNl9NQVgAMCA8PSBudW1DaGFycyAmJiBudW1DaGFycyA8PSBJTlQxNl9NQVgAMCA8PSB0ZW1wICYmIHRlbXAgPD0gSU5UMTZfTUFYADAgPD0gYml0TGVuZ3RoICYmIGJpdExlbmd0aCA8PSBJTlQxNl9NQVgAZGF0YVVzZWRCaXRzICE9IExFTkdUSF9PVkVSRkxPVwBiaXRMZW4gIT0gTEVOR1RIX09WRVJGTE9XAE5BTgBNAHRleHQgIT0gTlVMTABkaWdpdHMgIT0gTlVMTAB0ZW1wICE9IE5VTEwAcXJjb2RlICE9IE5VTEwAMCA8PSByZXN1bHQgJiYgcmVzdWx0IDw9IDI1Njg4ODhMAElORgAwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVogJCUqKy0uLzoAMCA8PSBrICYmIGsgPD0gOQAyMDggPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSAyOTY0OABpID09IGRhdGFMZW4gKiA4ADAgPD0gKGludCllY2wgJiYgKGludCllY2wgPD0gMyAmJiAtMSA8PSAoaW50KW1hc2sgJiYgKGludCltYXNrIDw9IDcAMCA8PSAoaW50KW1hc2sgJiYgKGludCltYXNrIDw9IDcAMCA8PSBjY2JpdHMgJiYgY2NiaXRzIDw9IDE2ADAgPD0gZSAmJiBlIDwgNABuIDw9IHFyc2l6ZSAqIDMAcmVzdWx0ID49IDAAMCA8PSBudW1CaXRzICYmIG51bUJpdHMgPD0gMTYgJiYgKHVuc2lnbmVkIGxvbmcpdmFsID4+IG51bUJpdHMgPT0gMABzZWdzICE9IE5VTEwgfHwgbGVuID09IDAAYml0cyA+PiAxOCA9PSAwAGJpdExlbiAlIDggPT0gMABiaXRzID4+IDE1ID09IDAALgAsAChudWxsKQAocXJjb2RlZ2VuX1ZFUlNJT05fTUlOICogNCArIDE3KSA8PSByZXN1bHQgJiYgcmVzdWx0IDw9IChxcmNvZGVnZW5fVkVSU0lPTl9NQVggKiA0ICsgMTcpACcwJyA8PSBjICYmIGMgPD0gJzknAAk8cGF0aCBkPSIAPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIAA8L3N2Zz4KADw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04Ij8+CgAJPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0ZGRkZGRiIvPgoAIiBmaWxsPSIjMDAwMDAwIi8+CgAiIHN0cm9rZT0ibm9uZSI+CgA8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgoAc29tZUZ1bmN0aW9uKCkgdG9vayAlZiBtaWxsaXNlY29uZHMgdG8gZXhlY3V0ZSAKAAAAAAAAAAAAAAAAAAAA/wEBAQEBAgICAgQEBAQEBgYGBgcICAkJCgwMDA0ODxAREhMTFBUWGBn/AQEBAgIEBAQFBQUICQkKCgsNDhARERIUFRcZGhwdHyEjJSYoKy0vMf8BAQICBAQGBggICAoMEAwREBIVFBcXGRsdIiIjJigrLTAzNTg7PkFE/wEBAgQEBAUGCAgLCxAQEhATFRkZGSIeICMlKCotMDM2OTw/QkZKTVEAAAAAAAAAAAAAAAD/BwoPFBoSFBgeEhQYGh4WGBweHBwcHB4eGhweHh4eHh4eHh4eHh4eHv8KEBoSGBASFhYaHhYWGBgcHBoaGhocHBwcHBwcHBwcHBwcHBwcHBwc/w0WEhoSGBIWFBgcGhgUHhgcHBoeHB4eHh4cHh4eHh4eHh4eHh4eHh7/ERwWEBYcGhoYHBgcFhgYHhwcGhweGB4eHh4eHh4eHh4eHh4eHh4eHgAAAAAAAAAAAAAAAAEAAAAAAAAAAwAAAAIAAAAKAAAADAAAAA4AAAAJAAAACwAAAA0AAAAIAAAAEAAAABAAAAAIAAAACgAAAAwAAAAZAAoAGRkZAAAAAAUAAAAAAAAJAAAAAAsAAAAAAAAAABkAEQoZGRkDCgcAAQAJCxgAAAkGCwAACwAGGQAAABkZGQAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAZAAoNGRkZAA0AAAIACQ4AAAAJAA4AAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAEwAAAAATAAAAAAkMAAAAAAAMAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAA8AAAAEDwAAAAAJEAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAARAAAAABEAAAAACRIAAAAAABIAABIAABoAAAAaGhoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGgAAABoaGgAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQAAAAAAAAAAAAAABcAAAAAFwAAAAAJFAAAAAAAFAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAAAAAAAAAAAAAAVAAAAABUAAAAACRYAAAAAABYAABYAADAxMjM0NTY3ODlBQkNERUY=");
  base64DecodeToExistingUint8Array(bufferView, 68736, "YAUBAAAAAAAFAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAACgNAQAABAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAA/////woAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIDAEA");
  base64DecodeToExistingUint8Array(bufferView, 68896, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
}

  var scratchBuffer = new ArrayBuffer(16);
  var i32ScratchView = new Int32Array(scratchBuffer);
  var f32ScratchView = new Float32Array(scratchBuffer);
  var f64ScratchView = new Float64Array(scratchBuffer);
  
  function wasm2js_scratch_load_i32(index) {
    return i32ScratchView[index];
  }
      
  function wasm2js_scratch_store_i32(index, value) {
    i32ScratchView[index] = value;
  }
      
  function wasm2js_scratch_load_f64() {
    return f64ScratchView[0];
  }
      
  function wasm2js_scratch_store_f64(value) {
    f64ScratchView[0] = value;
  }
      function wasm2js_trap() { throw new Error('abort'); }

function asmFunc(imports) {
 var env = imports.env;
 var memory = env.memory;
 var buffer = memory.buffer;
 var HEAP8 = new Int8Array(buffer);
 var HEAP16 = new Int16Array(buffer);
 var HEAP32 = new Int32Array(buffer);
 var HEAPU8 = new Uint8Array(buffer);
 var HEAPU16 = new Uint16Array(buffer);
 var HEAPU32 = new Uint32Array(buffer);
 var HEAPF32 = new Float32Array(buffer);
 var HEAPF64 = new Float64Array(buffer);
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 var fimport$0 = env.emscripten_get_now;
 var fimport$1 = env.__assert_fail;
 var fimport$2 = env.emscripten_memcpy_js;
 var wasi_snapshot_preview1 = imports.wasi_snapshot_preview1;
 var fimport$3 = wasi_snapshot_preview1.fd_write;
 var global$0 = 65536;
 var global$1 = 0;
 var global$2 = 0;
 var global$3 = 0;
 var __wasm_intrinsics_temp_i64 = 0;
 var __wasm_intrinsics_temp_i64$hi = 0;
 var i64toi32_i32$HIGH_BITS = 0;
 // EMSCRIPTEN_START_FUNCS
;
 function $0() {
  $95();
  $87();
 }
 
 function $1() {
  HEAP32[((global$0 - 16 | 0) + 12 | 0) >> 2] = 0;
  return 0 | 0;
 }
 
 function $2($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $32_1 = 0;
  $3_1 = global$0 - 7904 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 7896 | 0) >> 2] = $0_1;
  HEAPF64[($3_1 + 7888 | 0) >> 3] = +fimport$0();
  HEAP32[($3_1 + 7884 | 0) >> 2] = 0;
  HEAP8[($3_1 + 31 | 0) >> 0] = ($6(HEAP32[($3_1 + 7896 | 0) >> 2] | 0 | 0, $3_1 + 32 | 0 | 0, $3_1 + 3952 | 0 | 0, HEAP32[($3_1 + 7884 | 0) >> 2] | 0 | 0, 1 | 0, 40 | 0, -1 | 0, 1 & 1 | 0 | 0) | 0) & 1 | 0;
  label$1 : {
   label$2 : {
    if (!((HEAPU8[($3_1 + 31 | 0) >> 0] | 0) & 1 | 0)) {
     break label$2
    }
    HEAP32[($3_1 + 24 | 0) >> 2] = $3($3_1 + 3952 | 0 | 0) | 0;
    HEAPF64[($3_1 + 16 | 0) >> 3] = +fimport$0();
    HEAPF64[($3_1 + 8 | 0) >> 3] = +HEAPF64[($3_1 + 16 | 0) >> 3] - +HEAPF64[($3_1 + 7888 | 0) >> 3];
    HEAPF64[$3_1 >> 3] = +HEAPF64[($3_1 + 8 | 0) >> 3];
    $43(67777 | 0, $3_1 | 0) | 0;
    HEAP32[($3_1 + 7900 | 0) >> 2] = HEAP32[($3_1 + 24 | 0) >> 2] | 0;
    break label$1;
   }
   HEAP32[($3_1 + 7900 | 0) >> 2] = 67825;
  }
  $32_1 = HEAP32[($3_1 + 7900 | 0) >> 2] | 0;
  global$0 = $3_1 + 7904 | 0;
  return $32_1 | 0;
 }
 
 function $3($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 10192 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 10188 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 10184 | 0) >> 2] = $30(HEAP32[($3_1 + 10188 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($3_1 + 10180 | 0) >> 2] = 4;
  $42($3_1 + 176 | 0 | 0, 0 | 0, 1e4 | 0) | 0;
  $4($3_1 + 176 | 0 | 0, 67547 | 0);
  $4($3_1 + 176 | 0 | 0, 67677 | 0);
  $4($3_1 + 176 | 0 | 0, 67471 | 0);
  HEAP32[($3_1 + 32 | 0) >> 2] = (HEAP32[($3_1 + 10184 | 0) >> 2] | 0) + ((HEAP32[($3_1 + 10180 | 0) >> 2] | 0) << 1 | 0) | 0;
  $44($3_1 + 64 | 0 | 0, 66172 | 0, $3_1 + 32 | 0 | 0) | 0;
  $4($3_1 + 176 | 0 | 0, $3_1 + 64 | 0 | 0);
  $4($3_1 + 176 | 0 | 0, 67537 | 0);
  HEAP32[($3_1 + 48 | 0) >> 2] = (HEAP32[($3_1 + 10184 | 0) >> 2] | 0) + ((HEAP32[($3_1 + 10180 | 0) >> 2] | 0) << 1 | 0) | 0;
  $44($3_1 + 64 | 0 | 0, 66172 | 0, $3_1 + 48 | 0 | 0) | 0;
  $4($3_1 + 176 | 0 | 0, $3_1 + 64 | 0 | 0);
  $4($3_1 + 176 | 0 | 0, 67659 | 0);
  $4($3_1 + 176 | 0 | 0, 67587 | 0);
  $4($3_1 + 176 | 0 | 0, 67460 | 0);
  HEAP32[($3_1 + 60 | 0) >> 2] = 0 - (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($3_1 + 60 | 0) >> 2] | 0 | 0) < ((HEAP32[($3_1 + 10184 | 0) >> 2] | 0) + (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP32[($3_1 + 56 | 0) >> 2] = 0 - (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0;
    label$3 : {
     label$4 : while (1) {
      if (!((HEAP32[($3_1 + 56 | 0) >> 2] | 0 | 0) < ((HEAP32[($3_1 + 10184 | 0) >> 2] | 0) + (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
       break label$3
      }
      label$5 : {
       if (!(($38(HEAP32[($3_1 + 10188 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 56 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 60 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
        break label$5
       }
       label$6 : {
        label$7 : {
         if (HEAP32[($3_1 + 56 | 0) >> 2] | 0) {
          break label$7
         }
         if (!(HEAP32[($3_1 + 60 | 0) >> 2] | 0)) {
          break label$6
         }
        }
        $4($3_1 + 176 | 0 | 0, 67537 | 0);
       }
       $4($3_1 + 176 | 0 | 0, 66816 | 0);
       HEAP32[$3_1 >> 2] = (HEAP32[($3_1 + 56 | 0) >> 2] | 0) + (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0;
       $44($3_1 + 64 | 0 | 0, 66172 | 0, $3_1 | 0) | 0;
       $4($3_1 + 176 | 0 | 0, $3_1 + 64 | 0 | 0);
       $4($3_1 + 176 | 0 | 0, 67341 | 0);
       HEAP32[($3_1 + 16 | 0) >> 2] = (HEAP32[($3_1 + 60 | 0) >> 2] | 0) + (HEAP32[($3_1 + 10180 | 0) >> 2] | 0) | 0;
       $44($3_1 + 64 | 0 | 0, 66172 | 0, $3_1 + 16 | 0 | 0) | 0;
       $4($3_1 + 176 | 0 | 0, $3_1 + 64 | 0 | 0);
       $4($3_1 + 176 | 0 | 0, 65536 | 0);
      }
      HEAP32[($3_1 + 56 | 0) >> 2] = (HEAP32[($3_1 + 56 | 0) >> 2] | 0) + 1 | 0;
      continue label$4;
     };
    }
    HEAP32[($3_1 + 60 | 0) >> 2] = (HEAP32[($3_1 + 60 | 0) >> 2] | 0) + 1 | 0;
    continue label$2;
   };
  }
  $4($3_1 + 176 | 0 | 0, 67639 | 0);
  $4($3_1 + 176 | 0 | 0, 67539 | 0);
  global$0 = $3_1 + 10192 | 0;
  return $3_1 + 176 | 0 | 0;
 }
 
 function $4($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  $48(HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) | 0;
  global$0 = $4_1 + 16 | 0;
  return;
 }
 
 function $5($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  return $1() | 0 | 0;
 }
 
 function $6($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1, $7_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  $7_1 = $7_1 | 0;
  var $10_1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $22_1 = 0, $63_1 = 0, $88_1 = 0, $308 = 0, $312 = 0, $365 = 0, $369 = 0, $156 = 0;
  $10_1 = global$0 - 112 | 0;
  global$0 = $10_1;
  HEAP32[($10_1 + 104 | 0) >> 2] = $0_1;
  HEAP32[($10_1 + 100 | 0) >> 2] = $1_1;
  HEAP32[($10_1 + 96 | 0) >> 2] = $2_1;
  HEAP32[($10_1 + 92 | 0) >> 2] = $3_1;
  HEAP32[($10_1 + 88 | 0) >> 2] = $4_1;
  HEAP32[($10_1 + 84 | 0) >> 2] = $5_1;
  HEAP32[($10_1 + 80 | 0) >> 2] = $6_1;
  HEAP8[($10_1 + 79 | 0) >> 0] = $7_1;
  HEAP32[($10_1 + 72 | 0) >> 2] = $53(HEAP32[($10_1 + 104 | 0) >> 2] | 0 | 0) | 0;
  label$1 : {
   label$2 : {
    if (HEAP32[($10_1 + 72 | 0) >> 2] | 0) {
     break label$2
    }
    $22_1 = 0;
    HEAP8[($10_1 + 111 | 0) >> 0] = ($7($22_1 | 0, $22_1 | 0, HEAP32[($10_1 + 92 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 88 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 84 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 80 | 0) >> 2] | 0 | 0, (HEAPU8[($10_1 + 79 | 0) >> 0] | 0) & 1 | 0 | 0, HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 96 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
    break label$1;
   }
   HEAP32[($10_1 + 68 | 0) >> 2] = ((Math_imul(((HEAP32[($10_1 + 84 | 0) >> 2] | 0) << 2 | 0) + 17 | 0, ((HEAP32[($10_1 + 84 | 0) >> 2] | 0) << 2 | 0) + 17 | 0) + 7 | 0 | 0) / (8 | 0) | 0) + 1 | 0;
   label$3 : {
    label$4 : {
     label$5 : {
      if (!(($8(HEAP32[($10_1 + 104 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
       break label$5
      }
      label$6 : {
       if (!(($9(1 | 0, HEAP32[($10_1 + 72 | 0) >> 2] | 0 | 0) | 0) >>> 0 > (HEAP32[($10_1 + 68 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
        break label$6
       }
       break label$3;
      }
      $10($10_1 + 32 | 0 | 0, HEAP32[($10_1 + 104 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0);
      $63_1 = 8;
      i64toi32_i32$2 = ($10_1 + 32 | 0) + $63_1 | 0;
      i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
      i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
      $308 = i64toi32_i32$0;
      i64toi32_i32$0 = ($10_1 + 48 | 0) + $63_1 | 0;
      HEAP32[i64toi32_i32$0 >> 2] = $308;
      HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
      i64toi32_i32$2 = $10_1;
      i64toi32_i32$1 = HEAP32[($10_1 + 32 | 0) >> 2] | 0;
      i64toi32_i32$0 = HEAP32[($10_1 + 36 | 0) >> 2] | 0;
      $312 = i64toi32_i32$1;
      i64toi32_i32$1 = $10_1;
      HEAP32[($10_1 + 48 | 0) >> 2] = $312;
      HEAP32[($10_1 + 52 | 0) >> 2] = i64toi32_i32$0;
      break label$4;
     }
     label$7 : {
      label$8 : {
       if (!(($11(HEAP32[($10_1 + 104 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
        break label$8
       }
       label$9 : {
        if (!(($9(2 | 0, HEAP32[($10_1 + 72 | 0) >> 2] | 0 | 0) | 0) >>> 0 > (HEAP32[($10_1 + 68 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
         break label$9
        }
        break label$3;
       }
       $12($10_1 + 16 | 0 | 0, HEAP32[($10_1 + 104 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0);
       $88_1 = 8;
       i64toi32_i32$2 = ($10_1 + 16 | 0) + $88_1 | 0;
       i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
       i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
       $365 = i64toi32_i32$0;
       i64toi32_i32$0 = ($10_1 + 48 | 0) + $88_1 | 0;
       HEAP32[i64toi32_i32$0 >> 2] = $365;
       HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
       i64toi32_i32$2 = $10_1;
       i64toi32_i32$1 = HEAP32[($10_1 + 16 | 0) >> 2] | 0;
       i64toi32_i32$0 = HEAP32[($10_1 + 20 | 0) >> 2] | 0;
       $369 = i64toi32_i32$1;
       i64toi32_i32$1 = $10_1;
       HEAP32[($10_1 + 48 | 0) >> 2] = $369;
       HEAP32[($10_1 + 52 | 0) >> 2] = i64toi32_i32$0;
       break label$7;
      }
      label$10 : {
       if (!((HEAP32[($10_1 + 72 | 0) >> 2] | 0) >>> 0 > (HEAP32[($10_1 + 68 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
        break label$10
       }
       break label$3;
      }
      HEAP32[($10_1 + 12 | 0) >> 2] = 0;
      label$11 : {
       label$12 : while (1) {
        if (!((HEAP32[($10_1 + 12 | 0) >> 2] | 0) >>> 0 < (HEAP32[($10_1 + 72 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
         break label$11
        }
        HEAP8[((HEAP32[($10_1 + 100 | 0) >> 2] | 0) + (HEAP32[($10_1 + 12 | 0) >> 2] | 0) | 0) >> 0] = HEAPU8[((HEAP32[($10_1 + 104 | 0) >> 2] | 0) + (HEAP32[($10_1 + 12 | 0) >> 2] | 0) | 0) >> 0] | 0;
        HEAP32[($10_1 + 12 | 0) >> 2] = (HEAP32[($10_1 + 12 | 0) >> 2] | 0) + 1 | 0;
        continue label$12;
       };
      }
      HEAP32[($10_1 + 48 | 0) >> 2] = 4;
      HEAP32[($10_1 + 60 | 0) >> 2] = $13(HEAP32[($10_1 + 48 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 72 | 0) >> 2] | 0 | 0) | 0;
      label$13 : {
       if (!((HEAP32[($10_1 + 60 | 0) >> 2] | 0 | 0) == (-1 | 0) & 1 | 0)) {
        break label$13
       }
       break label$3;
      }
      HEAP32[($10_1 + 52 | 0) >> 2] = HEAP32[($10_1 + 72 | 0) >> 2] | 0;
      HEAP32[($10_1 + 56 | 0) >> 2] = HEAP32[($10_1 + 100 | 0) >> 2] | 0;
     }
    }
    HEAP8[($10_1 + 111 | 0) >> 0] = ($7($10_1 + 48 | 0 | 0, 1 | 0, HEAP32[($10_1 + 92 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 88 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 84 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 80 | 0) >> 2] | 0 | 0, (HEAPU8[($10_1 + 79 | 0) >> 0] | 0) & 1 | 0 | 0, HEAP32[($10_1 + 100 | 0) >> 2] | 0 | 0, HEAP32[($10_1 + 96 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
    break label$1;
   }
   HEAP8[(HEAP32[($10_1 + 96 | 0) >> 2] | 0) >> 0] = 0;
   HEAP8[($10_1 + 111 | 0) >> 0] = 0 & 1 | 0;
  }
  $156 = (HEAPU8[($10_1 + 111 | 0) >> 0] | 0) & 1 | 0;
  global$0 = $10_1 + 112 | 0;
  return $156 | 0;
 }
 
 function $7($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1, $7_1, $8_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  $7_1 = $7_1 | 0;
  $8_1 = $8_1 | 0;
  var $11_1 = 0, $417 = 0;
  $11_1 = global$0 - 112 | 0;
  global$0 = $11_1;
  HEAP32[($11_1 + 104 | 0) >> 2] = $0_1;
  HEAP32[($11_1 + 100 | 0) >> 2] = $1_1;
  HEAP32[($11_1 + 96 | 0) >> 2] = $2_1;
  HEAP32[($11_1 + 92 | 0) >> 2] = $3_1;
  HEAP32[($11_1 + 88 | 0) >> 2] = $4_1;
  HEAP32[($11_1 + 84 | 0) >> 2] = $5_1;
  HEAP8[($11_1 + 83 | 0) >> 0] = $6_1;
  HEAP32[($11_1 + 76 | 0) >> 2] = $7_1;
  HEAP32[($11_1 + 72 | 0) >> 2] = $8_1;
  label$1 : {
   if ((HEAP32[($11_1 + 104 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   if (!(HEAP32[($11_1 + 100 | 0) >> 2] | 0)) {
    break label$1
   }
   fimport$1(67266 | 0, 66269 | 0, 209 | 0, 66139 | 0);
   wasm2js_trap();
  }
  label$2 : {
   label$3 : {
    if (!((1 | 0) <= (HEAP32[($11_1 + 92 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    if (!((HEAP32[($11_1 + 92 | 0) >> 2] | 0 | 0) <= (HEAP32[($11_1 + 88 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    if ((HEAP32[($11_1 + 88 | 0) >> 2] | 0 | 0) <= (40 | 0) & 1 | 0) {
     break label$2
    }
   }
   fimport$1(66446 | 0, 66269 | 0, 210 | 0, 66139 | 0);
   wasm2js_trap();
  }
  label$4 : {
   label$5 : {
    if (!((0 | 0) <= (HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$5
    }
    if (!((HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0) <= (3 | 0) & 1 | 0)) {
     break label$5
    }
    if (!((-1 | 0) <= (HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$5
    }
    if ((HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0) <= (7 | 0) & 1 | 0) {
     break label$4
    }
   }
   fimport$1(67025 | 0, 66269 | 0, 211 | 0, 66139 | 0);
   wasm2js_trap();
  }
  HEAP32[($11_1 + 68 | 0) >> 2] = HEAP32[($11_1 + 92 | 0) >> 2] | 0;
  label$6 : {
   label$7 : {
    label$8 : while (1) {
     HEAP32[($11_1 + 60 | 0) >> 2] = ($14(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0) | 0) << 3 | 0;
     HEAP32[($11_1 + 64 | 0) >> 2] = $15(HEAP32[($11_1 + 104 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 100 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0) | 0;
     label$9 : {
      if (!((HEAP32[($11_1 + 64 | 0) >> 2] | 0 | 0) != (-1 | 0) & 1 | 0)) {
       break label$9
      }
      if (!((HEAP32[($11_1 + 64 | 0) >> 2] | 0 | 0) <= (HEAP32[($11_1 + 60 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$9
      }
      break label$7;
     }
     label$10 : {
      if (!((HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0) >= (HEAP32[($11_1 + 88 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$10
      }
      HEAP8[(HEAP32[($11_1 + 72 | 0) >> 2] | 0) >> 0] = 0;
      HEAP8[($11_1 + 111 | 0) >> 0] = 0 & 1 | 0;
      break label$6;
     }
     HEAP32[($11_1 + 68 | 0) >> 2] = (HEAP32[($11_1 + 68 | 0) >> 2] | 0) + 1 | 0;
     continue label$8;
    };
   }
   label$11 : {
    if ((HEAP32[($11_1 + 64 | 0) >> 2] | 0 | 0) != (-1 | 0) & 1 | 0) {
     break label$11
    }
    fimport$1(66754 | 0, 66269 | 0, 225 | 0, 66139 | 0);
    wasm2js_trap();
   }
   HEAP32[($11_1 + 56 | 0) >> 2] = 1;
   label$12 : {
    label$13 : while (1) {
     if (!((HEAP32[($11_1 + 56 | 0) >> 2] | 0 | 0) <= (3 | 0) & 1 | 0)) {
      break label$12
     }
     label$14 : {
      if (!((HEAPU8[($11_1 + 83 | 0) >> 0] | 0) & 1 | 0)) {
       break label$14
      }
      if (!((HEAP32[($11_1 + 64 | 0) >> 2] | 0 | 0) <= (($14(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 56 | 0) >> 2] | 0 | 0) | 0) << 3 | 0 | 0) & 1 | 0)) {
       break label$14
      }
      HEAP32[($11_1 + 96 | 0) >> 2] = HEAP32[($11_1 + 56 | 0) >> 2] | 0;
     }
     HEAP32[($11_1 + 56 | 0) >> 2] = (HEAP32[($11_1 + 56 | 0) >> 2] | 0) + 1 | 0;
     continue label$13;
    };
   }
   $42(HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, 0 | 0, (((Math_imul(((HEAP32[($11_1 + 68 | 0) >> 2] | 0) << 2 | 0) + 17 | 0, ((HEAP32[($11_1 + 68 | 0) >> 2] | 0) << 2 | 0) + 17 | 0) + 7 | 0 | 0) / (8 | 0) | 0) + 1 | 0) << 0 | 0 | 0) | 0;
   HEAP32[($11_1 + 52 | 0) >> 2] = 0;
   HEAP32[($11_1 + 48 | 0) >> 2] = 0;
   label$15 : {
    label$16 : while (1) {
     if (!((HEAP32[($11_1 + 48 | 0) >> 2] | 0) >>> 0 < (HEAP32[($11_1 + 100 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
      break label$15
     }
     HEAP32[($11_1 + 44 | 0) >> 2] = (HEAP32[($11_1 + 104 | 0) >> 2] | 0) + ((HEAP32[($11_1 + 48 | 0) >> 2] | 0) << 4 | 0) | 0;
     $16(HEAP32[(HEAP32[($11_1 + 44 | 0) >> 2] | 0) >> 2] | 0 | 0, 4 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
     $16(HEAP32[((HEAP32[($11_1 + 44 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0 | 0, $17(HEAP32[(HEAP32[($11_1 + 44 | 0) >> 2] | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0) | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
     HEAP32[($11_1 + 40 | 0) >> 2] = 0;
     label$17 : {
      label$18 : while (1) {
       if (!((HEAP32[($11_1 + 40 | 0) >> 2] | 0 | 0) < (HEAP32[((HEAP32[($11_1 + 44 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$17
       }
       HEAP32[($11_1 + 36 | 0) >> 2] = (((HEAPU8[((HEAP32[((HEAP32[($11_1 + 44 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0) + ((HEAP32[($11_1 + 40 | 0) >> 2] | 0) >> 3 | 0) | 0) >> 0] | 0) & 255 | 0) >> (7 - ((HEAP32[($11_1 + 40 | 0) >> 2] | 0) & 7 | 0) | 0) | 0) & 1 | 0;
       $16(HEAP32[($11_1 + 36 | 0) >> 2] | 0 | 0, 1 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
       HEAP32[($11_1 + 40 | 0) >> 2] = (HEAP32[($11_1 + 40 | 0) >> 2] | 0) + 1 | 0;
       continue label$18;
      };
     }
     HEAP32[($11_1 + 48 | 0) >> 2] = (HEAP32[($11_1 + 48 | 0) >> 2] | 0) + 1 | 0;
     continue label$16;
    };
   }
   label$19 : {
    if ((HEAP32[($11_1 + 52 | 0) >> 2] | 0 | 0) == (HEAP32[($11_1 + 64 | 0) >> 2] | 0 | 0) & 1 | 0) {
     break label$19
    }
    fimport$1(65646 | 0, 66269 | 0, 245 | 0, 66139 | 0);
    wasm2js_trap();
   }
   HEAP32[($11_1 + 32 | 0) >> 2] = ($14(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0) | 0) << 3 | 0;
   label$20 : {
    if ((HEAP32[($11_1 + 52 | 0) >> 2] | 0 | 0) <= (HEAP32[($11_1 + 32 | 0) >> 2] | 0 | 0) & 1 | 0) {
     break label$20
    }
    fimport$1(65574 | 0, 66269 | 0, 249 | 0, 66139 | 0);
    wasm2js_trap();
   }
   HEAP32[($11_1 + 28 | 0) >> 2] = (HEAP32[($11_1 + 32 | 0) >> 2] | 0) - (HEAP32[($11_1 + 52 | 0) >> 2] | 0) | 0;
   label$21 : {
    if (!((HEAP32[($11_1 + 28 | 0) >> 2] | 0 | 0) > (4 | 0) & 1 | 0)) {
     break label$21
    }
    HEAP32[($11_1 + 28 | 0) >> 2] = 4;
   }
   $16(0 | 0, HEAP32[($11_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
   $16(0 | 0, (8 - ((HEAP32[($11_1 + 52 | 0) >> 2] | 0 | 0) % (8 | 0) | 0) | 0 | 0) % (8 | 0) | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
   label$22 : {
    if (!((HEAP32[($11_1 + 52 | 0) >> 2] | 0 | 0) % (8 | 0) | 0)) {
     break label$22
    }
    fimport$1(67307 | 0, 66269 | 0, 255 | 0, 66139 | 0);
    wasm2js_trap();
   }
   HEAP8[($11_1 + 27 | 0) >> 0] = 236;
   label$23 : {
    label$24 : while (1) {
     if (!((HEAP32[($11_1 + 52 | 0) >> 2] | 0 | 0) < (HEAP32[($11_1 + 32 | 0) >> 2] | 0 | 0) & 1 | 0)) {
      break label$23
     }
     $16((HEAPU8[($11_1 + 27 | 0) >> 0] | 0) & 255 | 0 | 0, 8 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, $11_1 + 52 | 0 | 0);
     HEAP8[($11_1 + 27 | 0) >> 0] = ((HEAPU8[($11_1 + 27 | 0) >> 0] | 0) & 255 | 0) ^ 253 | 0;
     continue label$24;
    };
   }
   $18(HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0);
   $19(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0);
   $21(HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0, ($20(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0) | 0 | 0) / (8 | 0) | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0);
   $22(HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0);
   $19(HEAP32[($11_1 + 68 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0);
   label$25 : {
    if (!((HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0) == (-1 | 0) & 1 | 0)) {
     break label$25
    }
    HEAP32[($11_1 + 20 | 0) >> 2] = 2147483647;
    HEAP32[($11_1 + 16 | 0) >> 2] = 0;
    label$26 : {
     label$27 : while (1) {
      if (!((HEAP32[($11_1 + 16 | 0) >> 2] | 0 | 0) < (8 | 0) & 1 | 0)) {
       break label$26
      }
      HEAP32[($11_1 + 12 | 0) >> 2] = HEAP32[($11_1 + 16 | 0) >> 2] | 0;
      $23(HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 12 | 0) >> 2] | 0 | 0);
      $24(HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0);
      HEAP32[($11_1 + 8 | 0) >> 2] = $25(HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0) | 0;
      label$28 : {
       if (!((HEAP32[($11_1 + 8 | 0) >> 2] | 0 | 0) < (HEAP32[($11_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$28
       }
       HEAP32[($11_1 + 84 | 0) >> 2] = HEAP32[($11_1 + 12 | 0) >> 2] | 0;
       HEAP32[($11_1 + 20 | 0) >> 2] = HEAP32[($11_1 + 8 | 0) >> 2] | 0;
      }
      $23(HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 12 | 0) >> 2] | 0 | 0);
      HEAP32[($11_1 + 16 | 0) >> 2] = (HEAP32[($11_1 + 16 | 0) >> 2] | 0) + 1 | 0;
      continue label$27;
     };
    }
   }
   label$29 : {
    label$30 : {
     if (!((0 | 0) <= (HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0) & 1 | 0)) {
      break label$30
     }
     if ((HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0) <= (7 | 0) & 1 | 0) {
      break label$29
     }
    }
    fimport$1(67093 | 0, 66269 | 0, 283 | 0, 66139 | 0);
    wasm2js_trap();
   }
   $23(HEAP32[($11_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0);
   $24(HEAP32[($11_1 + 96 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 84 | 0) >> 2] | 0 | 0, HEAP32[($11_1 + 72 | 0) >> 2] | 0 | 0);
   HEAP8[($11_1 + 111 | 0) >> 0] = 1 & 1 | 0;
  }
  $417 = (HEAPU8[($11_1 + 111 | 0) >> 0] | 0) & 1 | 0;
  global$0 = $11_1 + 112 | 0;
  return $417 | 0;
 }
 
 function $8($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $17_1 = 0, $22_1 = 0, $33_1 = 0, $53_1 = 0;
  $3_1 = global$0 - 16 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  label$1 : {
   if ((HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66818 | 0, 66269 | 0, 814 | 0, 66227 | 0);
   wasm2js_trap();
  }
  label$2 : {
   label$3 : {
    label$4 : while (1) {
     $17_1 = 24;
     if (!(((HEAPU8[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $17_1 | 0) >> $17_1 | 0)) {
      break label$3
     }
     $22_1 = 24;
     label$5 : {
      label$6 : {
       if ((((HEAPU8[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $22_1 | 0) >> $22_1 | 0 | 0) < (48 | 0) & 1 | 0) {
        break label$6
       }
       $33_1 = 24;
       if (!((((HEAPU8[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $33_1 | 0) >> $33_1 | 0 | 0) > (57 | 0) & 1 | 0)) {
        break label$5
       }
      }
      HEAP8[($3_1 + 15 | 0) >> 0] = 0 & 1 | 0;
      break label$2;
     }
     HEAP32[($3_1 + 8 | 0) >> 2] = (HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 1 | 0;
     continue label$4;
    };
   }
   HEAP8[($3_1 + 15 | 0) >> 0] = 1 & 1 | 0;
  }
  $53_1 = (HEAPU8[($3_1 + 15 | 0) >> 0] | 0) & 1 | 0;
  global$0 = $3_1 + 16 | 0;
  return $53_1 | 0;
 }
 
 function $9($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $39_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $1_1;
  HEAP32[$4_1 >> 2] = $13(HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  label$1 : {
   label$2 : {
    if (!((HEAP32[$4_1 >> 2] | 0 | 0) == (-1 | 0) & 1 | 0)) {
     break label$2
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = -1;
    break label$1;
   }
   label$3 : {
    label$4 : {
     if (!((0 | 0) <= (HEAP32[$4_1 >> 2] | 0 | 0) & 1 | 0)) {
      break label$4
     }
     if ((HEAP32[$4_1 >> 2] | 0 | 0) <= (32767 | 0) & 1 | 0) {
      break label$3
     }
    }
    fimport$1(66682 | 0, 66269 | 0, 839 | 0, 66011 | 0);
    wasm2js_trap();
   }
   HEAP32[($4_1 + 12 | 0) >> 2] = ((HEAP32[$4_1 >> 2] | 0) + 7 | 0) >>> 3 | 0;
  }
  $39_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  global$0 = $4_1 + 16 | 0;
  return $39_1 | 0;
 }
 
 function $10($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $56_1 = 0, $62_1 = 0, $72_1 = 0, $89_1 = 0;
  $5_1 = global$0 - 32 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $2_1;
  label$1 : {
   if ((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66831 | 0, 66269 | 0, 895 | 0, 66247 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $53(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$0_1 >> 2] = 1;
  HEAP32[($5_1 + 16 | 0) >> 2] = $13(HEAP32[$0_1 >> 2] | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0;
  label$2 : {
   if ((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) != (-1 | 0) & 1 | 0) {
    break label$2
   }
   fimport$1(66786 | 0, 66269 | 0, 900 | 0, 66247 | 0);
   wasm2js_trap();
  }
  HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
    break label$3
   }
   $42(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, 0 | 0, (((HEAP32[($5_1 + 16 | 0) >> 2] | 0) + 7 | 0) >>> 3 | 0) << 0 | 0 | 0) | 0;
  }
  HEAP32[($0_1 + 12 | 0) >> 2] = 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = 0;
  label$4 : {
   label$5 : while (1) {
    $56_1 = 24;
    if (!(((HEAPU8[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 0] | 0) << $56_1 | 0) >> $56_1 | 0)) {
     break label$4
    }
    HEAP8[($5_1 + 7 | 0) >> 0] = HEAPU8[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 0] | 0;
    $62_1 = 24;
    label$6 : {
     label$7 : {
      if (!((48 | 0) <= (((HEAPU8[($5_1 + 7 | 0) >> 0] | 0) << $62_1 | 0) >> $62_1 | 0 | 0) & 1 | 0)) {
       break label$7
      }
      $72_1 = 24;
      if ((((HEAPU8[($5_1 + 7 | 0) >> 0] | 0) << $72_1 | 0) >> $72_1 | 0 | 0) <= (57 | 0) & 1 | 0) {
       break label$6
      }
     }
     fimport$1(67439 | 0, 66269 | 0, 910 | 0, 66247 | 0);
     wasm2js_trap();
    }
    $89_1 = 24;
    HEAP32[($5_1 + 12 | 0) >> 2] = Math_imul(HEAP32[($5_1 + 12 | 0) >> 2] | 0, 10) + ((((HEAPU8[($5_1 + 7 | 0) >> 0] | 0) << $89_1 | 0) >> $89_1 | 0) - 48 | 0) | 0;
    HEAP32[($5_1 + 8 | 0) >> 2] = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + 1 | 0;
    label$8 : {
     if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) == (3 | 0) & 1 | 0)) {
      break label$8
     }
     $16(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, 10 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $0_1 + 12 | 0 | 0);
     HEAP32[($5_1 + 12 | 0) >> 2] = 0;
     HEAP32[($5_1 + 8 | 0) >> 2] = 0;
    }
    HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 28 | 0) >> 2] | 0) + 1 | 0;
    continue label$5;
   };
  }
  label$9 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
    break label$9
   }
   $16(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, 3) + 1 | 0 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $0_1 + 12 | 0 | 0);
  }
  label$10 : {
   if ((HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0) == (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0) {
    break label$10
   }
   fimport$1(65849 | 0, 66269 | 0, 921 | 0, 66247 | 0);
   wasm2js_trap();
  }
  HEAP32[($0_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  global$0 = $5_1 + 32 | 0;
  return;
 }
 
 function $11($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $17_1 = 0, $24_1 = 0, $45_1 = 0;
  $3_1 = global$0 - 16 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 8 | 0) >> 2] = $0_1;
  label$1 : {
   if ((HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66818 | 0, 66269 | 0, 825 | 0, 66175 | 0);
   wasm2js_trap();
  }
  label$2 : {
   label$3 : {
    label$4 : while (1) {
     $17_1 = 24;
     if (!(((HEAPU8[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $17_1 | 0) >> $17_1 | 0)) {
      break label$3
     }
     $24_1 = 24;
     label$5 : {
      if (!(($49(HEAP32[(0 + 68736 | 0) >> 2] | 0 | 0, ((HEAPU8[(HEAP32[($3_1 + 8 | 0) >> 2] | 0) >> 0] | 0) << $24_1 | 0) >> $24_1 | 0 | 0) | 0 | 0) == (0 | 0) & 1 | 0)) {
       break label$5
      }
      HEAP8[($3_1 + 15 | 0) >> 0] = 0 & 1 | 0;
      break label$2;
     }
     HEAP32[($3_1 + 8 | 0) >> 2] = (HEAP32[($3_1 + 8 | 0) >> 2] | 0) + 1 | 0;
     continue label$4;
    };
   }
   HEAP8[($3_1 + 15 | 0) >> 0] = 1 & 1 | 0;
  }
  $45_1 = (HEAPU8[($3_1 + 15 | 0) >> 0] | 0) & 1 | 0;
  global$0 = $3_1 + 16 | 0;
  return $45_1 | 0;
 }
 
 function $12($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $56_1 = 0, $63_1 = 0;
  $5_1 = global$0 - 32 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $2_1;
  label$1 : {
   if ((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66818 | 0, 66269 | 0, 929 | 0, 66200 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = $53(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[$0_1 >> 2] = 2;
  HEAP32[($5_1 + 16 | 0) >> 2] = $13(HEAP32[$0_1 >> 2] | 0 | 0, HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) | 0;
  label$2 : {
   if ((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) != (-1 | 0) & 1 | 0) {
    break label$2
   }
   fimport$1(66786 | 0, 66269 | 0, 934 | 0, 66200 | 0);
   wasm2js_trap();
  }
  HEAP32[($0_1 + 4 | 0) >> 2] = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
  label$3 : {
   if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
    break label$3
   }
   $42(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, 0 | 0, (((HEAP32[($5_1 + 16 | 0) >> 2] | 0) + 7 | 0) >>> 3 | 0) << 0 | 0 | 0) | 0;
  }
  HEAP32[($0_1 + 12 | 0) >> 2] = 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = 0;
  HEAP32[($5_1 + 8 | 0) >> 2] = 0;
  label$4 : {
   label$5 : while (1) {
    $56_1 = 24;
    if (!(((HEAPU8[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 0] | 0) << $56_1 | 0) >> $56_1 | 0)) {
     break label$4
    }
    $63_1 = 24;
    HEAP32[($5_1 + 4 | 0) >> 2] = $49(HEAP32[(0 + 68736 | 0) >> 2] | 0 | 0, ((HEAPU8[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 0] | 0) << $63_1 | 0) >> $63_1 | 0 | 0) | 0;
    label$6 : {
     if ((HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
      break label$6
     }
     fimport$1(66846 | 0, 66269 | 0, 944 | 0, 66200 | 0);
     wasm2js_trap();
    }
    HEAP32[($5_1 + 12 | 0) >> 2] = Math_imul(HEAP32[($5_1 + 12 | 0) >> 2] | 0, 45) + ((HEAP32[($5_1 + 4 | 0) >> 2] | 0) - (HEAP32[(0 + 68736 | 0) >> 2] | 0) | 0) | 0;
    HEAP32[($5_1 + 8 | 0) >> 2] = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + 1 | 0;
    label$7 : {
     if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) == (2 | 0) & 1 | 0)) {
      break label$7
     }
     $16(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, 11 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $0_1 + 12 | 0 | 0);
     HEAP32[($5_1 + 12 | 0) >> 2] = 0;
     HEAP32[($5_1 + 8 | 0) >> 2] = 0;
    }
    HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 28 | 0) >> 2] | 0) + 1 | 0;
    continue label$5;
   };
  }
  label$8 : {
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
    break label$8
   }
   $16(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, 6 | 0, HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, $0_1 + 12 | 0 | 0);
  }
  label$9 : {
   if ((HEAP32[($0_1 + 12 | 0) >> 2] | 0 | 0) == (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0) {
    break label$9
   }
   fimport$1(65849 | 0, 66269 | 0, 955 | 0, 66200 | 0);
   wasm2js_trap();
  }
  HEAP32[($0_1 + 8 | 0) >> 2] = HEAP32[($5_1 + 24 | 0) >> 2] | 0;
  global$0 = $5_1 + 32 | 0;
  return;
 }
 
 function $13($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $95_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $1_1;
  label$1 : {
   label$2 : {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0) >>> 0 > 32767 >>> 0 & 1 | 0)) {
     break label$2
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = -1;
    break label$1;
   }
   HEAP32[$4_1 >> 2] = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
   label$3 : {
    label$4 : {
     if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (1 | 0) & 1 | 0)) {
      break label$4
     }
     HEAP32[$4_1 >> 2] = (Math_imul(HEAP32[$4_1 >> 2] | 0, 10) + 2 | 0 | 0) / (3 | 0) | 0;
     break label$3;
    }
    label$5 : {
     label$6 : {
      if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (2 | 0) & 1 | 0)) {
       break label$6
      }
      HEAP32[$4_1 >> 2] = (Math_imul(HEAP32[$4_1 >> 2] | 0, 11) + 1 | 0 | 0) / (2 | 0) | 0;
      break label$5;
     }
     label$7 : {
      label$8 : {
       if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (4 | 0) & 1 | 0)) {
        break label$8
       }
       HEAP32[$4_1 >> 2] = (HEAP32[$4_1 >> 2] | 0) << 3 | 0;
       break label$7;
      }
      label$9 : {
       label$10 : {
        if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (8 | 0) & 1 | 0)) {
         break label$10
        }
        HEAP32[$4_1 >> 2] = Math_imul(HEAP32[$4_1 >> 2] | 0, 13);
        break label$9;
       }
       label$11 : {
        label$12 : {
         if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) == (7 | 0) & 1 | 0)) {
          break label$12
         }
         if (HEAP32[($4_1 + 4 | 0) >> 2] | 0) {
          break label$12
         }
         HEAP32[$4_1 >> 2] = 24;
         break label$11;
        }
        fimport$1(66063 | 0, 66269 | 0, 868 | 0, 65890 | 0);
        wasm2js_trap();
       }
      }
     }
    }
   }
   label$13 : {
    if ((HEAP32[$4_1 >> 2] | 0 | 0) >= (0 | 0) & 1 | 0) {
     break label$13
    }
    fimport$1(67186 | 0, 66269 | 0, 871 | 0, 65890 | 0);
    wasm2js_trap();
   }
   label$14 : {
    if (!((HEAP32[$4_1 >> 2] | 0 | 0) > (32767 | 0) & 1 | 0)) {
     break label$14
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = -1;
    break label$1;
   }
   HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[$4_1 >> 2] | 0;
  }
  $95_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  global$0 = $4_1 + 16 | 0;
  return $95_1 | 0;
 }
 
 function $14($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $37_1 = 0, $48_1 = 0, $52_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  HEAP32[$4_1 >> 2] = HEAP32[($4_1 + 8 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    if (!((0 | 0) <= (HEAP32[$4_1 >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[$4_1 >> 2] | 0 | 0) < (4 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(67154 | 0, 66269 | 0, 332 | 0, 65756 | 0);
   wasm2js_trap();
  }
  $37_1 = 24;
  $48_1 = 24;
  $52_1 = (($20(HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) | 0 | 0) / (8 | 0) | 0) - Math_imul(((HEAPU8[((68016 + Math_imul(HEAP32[$4_1 >> 2] | 0, 41) | 0) + (HEAP32[($4_1 + 4 | 0) >> 2] | 0) | 0) >> 0] | 0) << $37_1 | 0) >> $37_1 | 0, ((HEAPU8[((67840 + Math_imul(HEAP32[$4_1 >> 2] | 0, 41) | 0) + (HEAP32[($4_1 + 4 | 0) >> 2] | 0) | 0) >> 0] | 0) << $48_1 | 0) >> $48_1 | 0) | 0;
  global$0 = $4_1 + 16 | 0;
  return $52_1 | 0;
 }
 
 function $15($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $148 = 0;
  $5_1 = global$0 - 48 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $2_1;
  label$1 : {
   if ((HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   if (!(HEAP32[($5_1 + 36 | 0) >> 2] | 0)) {
    break label$1
   }
   fimport$1(67266 | 0, 66269 | 0, 992 | 0, 65633 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 28 | 0) >> 2] = 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = 0;
  label$2 : {
   label$3 : {
    label$4 : while (1) {
     if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0) >>> 0 < (HEAP32[($5_1 + 36 | 0) >> 2] | 0) >>> 0 & 1 | 0)) {
      break label$3
     }
     HEAP32[($5_1 + 20 | 0) >> 2] = HEAP32[(((HEAP32[($5_1 + 40 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 24 | 0) >> 2] | 0) << 4 | 0) | 0) + 4 | 0) >> 2] | 0;
     HEAP32[($5_1 + 16 | 0) >> 2] = HEAP32[(((HEAP32[($5_1 + 40 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 24 | 0) >> 2] | 0) << 4 | 0) | 0) + 12 | 0) >> 2] | 0;
     label$5 : {
      label$6 : {
       if (!((0 | 0) <= (HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$6
       }
       if ((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) <= (32767 | 0) & 1 | 0) {
        break label$5
       }
      }
      fimport$1(66643 | 0, 66269 | 0, 997 | 0, 65633 | 0);
      wasm2js_trap();
     }
     label$7 : {
      label$8 : {
       if (!((0 | 0) <= (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$8
       }
       if ((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) <= (32767 | 0) & 1 | 0) {
        break label$7
       }
      }
      fimport$1(66713 | 0, 66269 | 0, 998 | 0, 65633 | 0);
      wasm2js_trap();
     }
     HEAP32[($5_1 + 12 | 0) >> 2] = $17(HEAP32[((HEAP32[($5_1 + 40 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 24 | 0) >> 2] | 0) << 4 | 0) | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0) | 0;
     label$9 : {
      label$10 : {
       if (!((0 | 0) <= (HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$10
       }
       if ((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) <= (16 | 0) & 1 | 0) {
        break label$9
       }
      }
      fimport$1(67126 | 0, 66269 | 0, 1e3 | 0, 65633 | 0);
      wasm2js_trap();
     }
     label$11 : {
      if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) >= (1 << (HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0 | 0) & 1 | 0)) {
       break label$11
      }
      HEAP32[($5_1 + 44 | 0) >> 2] = -1;
      break label$2;
     }
     HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 28 | 0) >> 2] | 0) + (((HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 4 | 0) + (HEAP32[($5_1 + 16 | 0) >> 2] | 0) | 0) | 0;
     label$12 : {
      if (!((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) > (32767 | 0) & 1 | 0)) {
       break label$12
      }
      HEAP32[($5_1 + 44 | 0) >> 2] = -1;
      break label$2;
     }
     HEAP32[($5_1 + 24 | 0) >> 2] = (HEAP32[($5_1 + 24 | 0) >> 2] | 0) + 1 | 0;
     continue label$4;
    };
   }
   label$13 : {
    label$14 : {
     if (!((0 | 0) <= (HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
      break label$14
     }
     if ((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) <= (32767 | 0) & 1 | 0) {
      break label$13
     }
    }
    fimport$1(66608 | 0, 66269 | 0, 1007 | 0, 65633 | 0);
    wasm2js_trap();
   }
   HEAP32[($5_1 + 44 | 0) >> 2] = HEAP32[($5_1 + 28 | 0) >> 2] | 0;
  }
  $148 = HEAP32[($5_1 + 44 | 0) >> 2] | 0;
  global$0 = $5_1 + 48 | 0;
  return $148 | 0;
 }
 
 function $16($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $55_1 = 0, $63_1 = 0;
  $6_1 = global$0 - 32 | 0;
  global$0 = $6_1;
  HEAP32[($6_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 16 | 0) >> 2] = $3_1;
  label$1 : {
   label$2 : {
    if (!((0 | 0) <= (HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) <= (16 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($6_1 + 28 | 0) >> 2] | 0) >>> (HEAP32[($6_1 + 24 | 0) >> 2] | 0) | 0)) {
     break label$1
    }
   }
   fimport$1(67198 | 0, 66269 | 0, 189 | 0, 65802 | 0);
   wasm2js_trap();
  }
  HEAP32[($6_1 + 12 | 0) >> 2] = (HEAP32[($6_1 + 24 | 0) >> 2] | 0) - 1 | 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) >= (0 | 0) & 1 | 0)) {
     break label$3
    }
    $55_1 = (HEAP32[($6_1 + 20 | 0) >> 2] | 0) + ((HEAP32[(HEAP32[($6_1 + 16 | 0) >> 2] | 0) >> 2] | 0) >> 3 | 0) | 0;
    HEAP8[$55_1 >> 0] = (HEAPU8[$55_1 >> 0] | 0) & 255 | 0 | ((((HEAP32[($6_1 + 28 | 0) >> 2] | 0) >>> (HEAP32[($6_1 + 12 | 0) >> 2] | 0) | 0) & 1 | 0) << (7 - ((HEAP32[(HEAP32[($6_1 + 16 | 0) >> 2] | 0) >> 2] | 0) & 7 | 0) | 0) | 0) | 0;
    HEAP32[($6_1 + 12 | 0) >> 2] = (HEAP32[($6_1 + 12 | 0) >> 2] | 0) + -1 | 0;
    $63_1 = HEAP32[($6_1 + 16 | 0) >> 2] | 0;
    HEAP32[$63_1 >> 2] = (HEAP32[$63_1 >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  global$0 = $6_1 + 32 | 0;
  return;
 }
 
 function $17($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $24_1 = 0, $30_1 = 0, $60_1 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = $1_1;
  label$1 : {
   label$2 : {
    if (!((1 | 0) <= (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) <= (40 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(66377 | 0, 66269 | 0, 1015 | 0, 65601 | 0);
   wasm2js_trap();
  }
  $24_1 = 7;
  HEAP32[$4_1 >> 2] = ((HEAP32[($4_1 + 4 | 0) >> 2] | 0) + $24_1 | 0 | 0) / (17 | 0) | 0;
  $30_1 = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -1 | 0;
  label$3 : {
   label$4 : {
    switch ($30_1 | 0) {
    case 0:
     HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(68208 + ((HEAP32[$4_1 >> 2] | 0) << 2 | 0) | 0) >> 2] | 0;
     break label$3;
    case 1:
     HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(68220 + ((HEAP32[$4_1 >> 2] | 0) << 2 | 0) | 0) >> 2] | 0;
     break label$3;
    case 3:
     HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(68232 + ((HEAP32[$4_1 >> 2] | 0) << 2 | 0) | 0) >> 2] | 0;
     break label$3;
    case 7:
     HEAP32[($4_1 + 12 | 0) >> 2] = HEAP32[(68244 + ((HEAP32[$4_1 >> 2] | 0) << 2 | 0) | 0) >> 2] | 0;
     break label$3;
    case 6:
     HEAP32[($4_1 + 12 | 0) >> 2] = 0;
     break label$3;
    default:
     break label$4;
    };
   }
   fimport$1(66063 | 0, 66269 | 0, 1023 | 0, 65601 | 0);
   wasm2js_trap();
  }
  $60_1 = HEAP32[($4_1 + 12 | 0) >> 2] | 0;
  global$0 = $4_1 + 16 | 0;
  return $60_1 | 0;
 }
 
 function $18($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $47_1 = 0, $58_1 = 0;
  $6_1 = global$0 - 112 | 0;
  global$0 = $6_1;
  HEAP32[($6_1 + 108 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 104 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 100 | 0) >> 2] = $2_1;
  HEAP32[($6_1 + 96 | 0) >> 2] = $3_1;
  label$1 : {
   label$2 : {
    if (!((0 | 0) <= (HEAP32[($6_1 + 100 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($6_1 + 100 | 0) >> 2] | 0 | 0) < (4 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((1 | 0) <= (HEAP32[($6_1 + 104 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($6_1 + 104 | 0) >> 2] | 0 | 0) <= (40 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(66344 | 0, 66269 | 0, 299 | 0, 66043 | 0);
   wasm2js_trap();
  }
  $47_1 = 24;
  HEAP32[($6_1 + 92 | 0) >> 2] = ((HEAPU8[((67840 + Math_imul(HEAP32[($6_1 + 100 | 0) >> 2] | 0, 41) | 0) + (HEAP32[($6_1 + 104 | 0) >> 2] | 0) | 0) >> 0] | 0) << $47_1 | 0) >> $47_1 | 0;
  $58_1 = 24;
  HEAP32[($6_1 + 88 | 0) >> 2] = ((HEAPU8[((68016 + Math_imul(HEAP32[($6_1 + 100 | 0) >> 2] | 0, 41) | 0) + (HEAP32[($6_1 + 104 | 0) >> 2] | 0) | 0) >> 0] | 0) << $58_1 | 0) >> $58_1 | 0;
  HEAP32[($6_1 + 84 | 0) >> 2] = ($20(HEAP32[($6_1 + 104 | 0) >> 2] | 0 | 0) | 0 | 0) / (8 | 0) | 0;
  HEAP32[($6_1 + 80 | 0) >> 2] = $14(HEAP32[($6_1 + 104 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 100 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($6_1 + 76 | 0) >> 2] = (HEAP32[($6_1 + 92 | 0) >> 2] | 0) - ((HEAP32[($6_1 + 84 | 0) >> 2] | 0 | 0) % (HEAP32[($6_1 + 92 | 0) >> 2] | 0 | 0) | 0) | 0;
  HEAP32[($6_1 + 72 | 0) >> 2] = ((HEAP32[($6_1 + 84 | 0) >> 2] | 0 | 0) / (HEAP32[($6_1 + 92 | 0) >> 2] | 0 | 0) | 0) - (HEAP32[($6_1 + 88 | 0) >> 2] | 0) | 0;
  $26(HEAP32[($6_1 + 88 | 0) >> 2] | 0 | 0, $6_1 + 32 | 0 | 0);
  HEAP32[($6_1 + 28 | 0) >> 2] = HEAP32[($6_1 + 108 | 0) >> 2] | 0;
  HEAP32[($6_1 + 24 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 92 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($6_1 + 20 | 0) >> 2] = (HEAP32[($6_1 + 72 | 0) >> 2] | 0) + ((HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 76 | 0) >> 2] | 0 | 0) & 1 | 0 ? 0 : 1) | 0;
    HEAP32[($6_1 + 16 | 0) >> 2] = (HEAP32[($6_1 + 108 | 0) >> 2] | 0) + (HEAP32[($6_1 + 80 | 0) >> 2] | 0) | 0;
    $27(HEAP32[($6_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0, $6_1 + 32 | 0 | 0, HEAP32[($6_1 + 88 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 16 | 0) >> 2] | 0 | 0);
    HEAP32[($6_1 + 12 | 0) >> 2] = 0;
    HEAP32[($6_1 + 8 | 0) >> 2] = HEAP32[($6_1 + 24 | 0) >> 2] | 0;
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$5
      }
      label$7 : {
       if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) == (HEAP32[($6_1 + 72 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$7
       }
       HEAP32[($6_1 + 8 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) - (HEAP32[($6_1 + 76 | 0) >> 2] | 0) | 0;
      }
      HEAP8[((HEAP32[($6_1 + 96 | 0) >> 2] | 0) + (HEAP32[($6_1 + 8 | 0) >> 2] | 0) | 0) >> 0] = HEAPU8[((HEAP32[($6_1 + 28 | 0) >> 2] | 0) + (HEAP32[($6_1 + 12 | 0) >> 2] | 0) | 0) >> 0] | 0;
      HEAP32[($6_1 + 12 | 0) >> 2] = (HEAP32[($6_1 + 12 | 0) >> 2] | 0) + 1 | 0;
      HEAP32[($6_1 + 8 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) + (HEAP32[($6_1 + 92 | 0) >> 2] | 0) | 0;
      continue label$6;
     };
    }
    HEAP32[($6_1 + 4 | 0) >> 2] = 0;
    HEAP32[$6_1 >> 2] = (HEAP32[($6_1 + 80 | 0) >> 2] | 0) + (HEAP32[($6_1 + 24 | 0) >> 2] | 0) | 0;
    label$8 : {
     label$9 : while (1) {
      if (!((HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 88 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$8
      }
      HEAP8[((HEAP32[($6_1 + 96 | 0) >> 2] | 0) + (HEAP32[$6_1 >> 2] | 0) | 0) >> 0] = HEAPU8[((HEAP32[($6_1 + 16 | 0) >> 2] | 0) + (HEAP32[($6_1 + 4 | 0) >> 2] | 0) | 0) >> 0] | 0;
      HEAP32[($6_1 + 4 | 0) >> 2] = (HEAP32[($6_1 + 4 | 0) >> 2] | 0) + 1 | 0;
      HEAP32[$6_1 >> 2] = (HEAP32[$6_1 >> 2] | 0) + (HEAP32[($6_1 + 92 | 0) >> 2] | 0) | 0;
      continue label$9;
     };
    }
    HEAP32[($6_1 + 28 | 0) >> 2] = (HEAP32[($6_1 + 28 | 0) >> 2] | 0) + (HEAP32[($6_1 + 20 | 0) >> 2] | 0) | 0;
    HEAP32[($6_1 + 24 | 0) >> 2] = (HEAP32[($6_1 + 24 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  global$0 = $6_1 + 112 | 0;
  return;
 }
 
 function $19($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $36_1 = 0, $37_1 = 0, $116 = 0;
  $4_1 = global$0 - 32 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = ((HEAP32[($4_1 + 28 | 0) >> 2] | 0) << 2 | 0) + 17 | 0;
  $42(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0, 0 | 0, (((Math_imul(HEAP32[($4_1 + 20 | 0) >> 2] | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0) + 7 | 0 | 0) / (8 | 0) | 0) + 1 | 0) << 0 | 0 | 0) | 0;
  HEAP8[(HEAP32[($4_1 + 24 | 0) >> 2] | 0) >> 0] = HEAP32[($4_1 + 20 | 0) >> 2] | 0;
  $28(6 | 0, 0 | 0, 1 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  $28(0 | 0, 6 | 0, HEAP32[($4_1 + 20 | 0) >> 2] | 0 | 0, 1 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  $36_1 = 0;
  $37_1 = 9;
  $28($36_1 | 0, $36_1 | 0, $37_1 | 0, $37_1 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  $28((HEAP32[($4_1 + 20 | 0) >> 2] | 0) - 8 | 0 | 0, 0 | 0, 8 | 0, 9 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  $28(0 | 0, (HEAP32[($4_1 + 20 | 0) >> 2] | 0) - 8 | 0 | 0, 9 | 0, 8 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  HEAP32[($4_1 + 8 | 0) >> 2] = $29(HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0, $4_1 + 13 | 0 | 0) | 0;
  HEAP32[($4_1 + 4 | 0) >> 2] = 0;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP32[$4_1 >> 2] = 0;
    label$3 : {
     label$4 : while (1) {
      if (!((HEAP32[$4_1 >> 2] | 0 | 0) < (HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$3
      }
      label$5 : {
       label$6 : {
        if (HEAP32[($4_1 + 4 | 0) >> 2] | 0) {
         break label$6
        }
        if (!(HEAP32[$4_1 >> 2] | 0)) {
         break label$5
        }
       }
       label$7 : {
        if (HEAP32[($4_1 + 4 | 0) >> 2] | 0) {
         break label$7
        }
        if ((HEAP32[$4_1 >> 2] | 0 | 0) == ((HEAP32[($4_1 + 8 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0) {
         break label$5
        }
       }
       label$8 : {
        if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) == ((HEAP32[($4_1 + 8 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0)) {
         break label$8
        }
        if (!(HEAP32[$4_1 >> 2] | 0)) {
         break label$5
        }
       }
       $116 = 5;
       $28(((HEAPU8[(($4_1 + 13 | 0) + (HEAP32[($4_1 + 4 | 0) >> 2] | 0) | 0) >> 0] | 0) & 255 | 0) - 2 | 0 | 0, ((HEAPU8[(($4_1 + 13 | 0) + (HEAP32[$4_1 >> 2] | 0) | 0) >> 0] | 0) & 255 | 0) - 2 | 0 | 0, $116 | 0, $116 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
      }
      HEAP32[$4_1 >> 2] = (HEAP32[$4_1 >> 2] | 0) + 1 | 0;
      continue label$4;
     };
    }
    HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    continue label$2;
   };
  }
  label$9 : {
   if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) >= (7 | 0) & 1 | 0)) {
    break label$9
   }
   $28((HEAP32[($4_1 + 20 | 0) >> 2] | 0) - 11 | 0 | 0, 0 | 0, 3 | 0, 6 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
   $28(0 | 0, (HEAP32[($4_1 + 20 | 0) >> 2] | 0) - 11 | 0 | 0, 6 | 0, 3 | 0, HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0);
  }
  global$0 = $4_1 + 32 | 0;
  return;
 }
 
 function $20($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $82_1 = 0;
  $3_1 = global$0 - 16 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   label$2 : {
    if (!((1 | 0) <= (HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) <= (40 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(66283 | 0, 66269 | 0, 343 | 0, 65721 | 0);
   wasm2js_trap();
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = Math_imul(((HEAP32[($3_1 + 12 | 0) >> 2] | 0) << 4 | 0) + 128 | 0, HEAP32[($3_1 + 12 | 0) >> 2] | 0) + 64 | 0;
  label$3 : {
   if (!((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) >= (2 | 0) & 1 | 0)) {
    break label$3
   }
   HEAP32[($3_1 + 4 | 0) >> 2] = ((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) / (7 | 0) | 0) + 2 | 0;
   HEAP32[($3_1 + 8 | 0) >> 2] = (HEAP32[($3_1 + 8 | 0) >> 2] | 0) - (Math_imul(Math_imul(HEAP32[($3_1 + 4 | 0) >> 2] | 0, 25) - 10 | 0, HEAP32[($3_1 + 4 | 0) >> 2] | 0) - 55 | 0) | 0;
   label$4 : {
    if (!((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) >= (7 | 0) & 1 | 0)) {
     break label$4
    }
    HEAP32[($3_1 + 8 | 0) >> 2] = (HEAP32[($3_1 + 8 | 0) >> 2] | 0) - 36 | 0;
   }
  }
  label$5 : {
   label$6 : {
    if (!((208 | 0) <= (HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$6
    }
    if ((HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) <= (29648 | 0) & 1 | 0) {
     break label$5
    }
   }
   fimport$1(66975 | 0, 66269 | 0, 351 | 0, 65721 | 0);
   wasm2js_trap();
  }
  $82_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  global$0 = $3_1 + 16 | 0;
  return $82_1 | 0;
 }
 
 function $21($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $65_1 = 0;
  $5_1 = global$0 - 48 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 32 | 0) >> 2] = $30(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = (HEAP32[($5_1 + 32 | 0) >> 2] | 0) - 1 | 0;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
     break label$1
    }
    label$3 : {
     if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) == (6 | 0) & 1 | 0)) {
      break label$3
     }
     HEAP32[($5_1 + 24 | 0) >> 2] = 5;
    }
    HEAP32[($5_1 + 20 | 0) >> 2] = 0;
    label$4 : {
     label$5 : while (1) {
      if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) < (HEAP32[($5_1 + 32 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$4
      }
      HEAP32[($5_1 + 16 | 0) >> 2] = 0;
      label$6 : {
       label$7 : while (1) {
        if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) < (2 | 0) & 1 | 0)) {
         break label$6
        }
        HEAP32[($5_1 + 12 | 0) >> 2] = (HEAP32[($5_1 + 24 | 0) >> 2] | 0) - (HEAP32[($5_1 + 16 | 0) >> 2] | 0) | 0;
        HEAP8[($5_1 + 11 | 0) >> 0] = (((HEAP32[($5_1 + 24 | 0) >> 2] | 0) + 1 | 0) & 2 | 0 | 0) == (0 | 0) & 1 | 0;
        label$8 : {
         label$9 : {
          if (!((HEAPU8[($5_1 + 11 | 0) >> 0] | 0) & 1 | 0)) {
           break label$9
          }
          $65_1 = ((HEAP32[($5_1 + 32 | 0) >> 2] | 0) - 1 | 0) - (HEAP32[($5_1 + 20 | 0) >> 2] | 0) | 0;
          break label$8;
         }
         $65_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
        }
        HEAP32[($5_1 + 4 | 0) >> 2] = $65_1;
        label$10 : {
         if (($31(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0) {
          break label$10
         }
         if (!((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) < ((HEAP32[($5_1 + 40 | 0) >> 2] | 0) << 3 | 0 | 0) & 1 | 0)) {
          break label$10
         }
         HEAP8[($5_1 + 3 | 0) >> 0] = ($32((HEAPU8[((HEAP32[($5_1 + 44 | 0) >> 2] | 0) + ((HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 3 | 0) | 0) >> 0] | 0) & 255 | 0 | 0, 7 - ((HEAP32[($5_1 + 28 | 0) >> 2] | 0) & 7 | 0) | 0 | 0) | 0) & 1 | 0;
         $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0, (HEAPU8[($5_1 + 3 | 0) >> 0] | 0) & 1 | 0 | 0);
         HEAP32[($5_1 + 28 | 0) >> 2] = (HEAP32[($5_1 + 28 | 0) >> 2] | 0) + 1 | 0;
        }
        HEAP32[($5_1 + 16 | 0) >> 2] = (HEAP32[($5_1 + 16 | 0) >> 2] | 0) + 1 | 0;
        continue label$7;
       };
      }
      HEAP32[($5_1 + 20 | 0) >> 2] = (HEAP32[($5_1 + 20 | 0) >> 2] | 0) + 1 | 0;
      continue label$5;
     };
    }
    HEAP32[($5_1 + 24 | 0) >> 2] = (HEAP32[($5_1 + 24 | 0) >> 2] | 0) - 2 | 0;
    continue label$2;
   };
  }
  label$11 : {
   if ((HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0) == ((HEAP32[($5_1 + 40 | 0) >> 2] | 0) << 3 | 0 | 0) & 1 | 0) {
    break label$11
   }
   fimport$1(67008 | 0, 66269 | 0, 602 | 0, 65742 | 0);
   wasm2js_trap();
  }
  global$0 = $5_1 + 48 | 0;
  return;
 }
 
 function $22($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $49_1 = 0, $51_1 = 0, $55_1 = 0, $57_1 = 0, $67_1 = 0, $69_1 = 0, $208 = 0, $185 = 0, $195 = 0, $205 = 0;
  $4_1 = global$0 - 80 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 76 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 72 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 68 | 0) >> 2] = $30(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($4_1 + 64 | 0) >> 2] = 7;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($4_1 + 64 | 0) >> 2] | 0 | 0) < ((HEAP32[($4_1 + 68 | 0) >> 2] | 0) - 7 | 0 | 0) & 1 | 0)) {
     break label$1
    }
    $33(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, 6 | 0, HEAP32[($4_1 + 64 | 0) >> 2] | 0 | 0, 0 & 1 | 0 | 0);
    $33(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 64 | 0) >> 2] | 0 | 0, 6 | 0, 0 & 1 | 0 | 0);
    HEAP32[($4_1 + 64 | 0) >> 2] = (HEAP32[($4_1 + 64 | 0) >> 2] | 0) + 2 | 0;
    continue label$2;
   };
  }
  HEAP32[($4_1 + 60 | 0) >> 2] = -4;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($4_1 + 60 | 0) >> 2] | 0 | 0) <= (4 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($4_1 + 56 | 0) >> 2] = -4;
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[($4_1 + 56 | 0) >> 2] | 0 | 0) <= (4 | 0) & 1 | 0)) {
       break label$5
      }
      $49_1 = HEAP32[($4_1 + 56 | 0) >> 2] | 0;
      $51_1 = $49_1 >> 31 | 0;
      HEAP32[($4_1 + 52 | 0) >> 2] = ($49_1 ^ $51_1 | 0) - $51_1 | 0;
      $55_1 = HEAP32[($4_1 + 60 | 0) >> 2] | 0;
      $57_1 = $55_1 >> 31 | 0;
      label$7 : {
       if (!((($55_1 ^ $57_1 | 0) - $57_1 | 0 | 0) > (HEAP32[($4_1 + 52 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$7
       }
       $67_1 = HEAP32[($4_1 + 60 | 0) >> 2] | 0;
       $69_1 = $67_1 >> 31 | 0;
       HEAP32[($4_1 + 52 | 0) >> 2] = ($67_1 ^ $69_1 | 0) - $69_1 | 0;
      }
      label$8 : {
       label$9 : {
        if ((HEAP32[($4_1 + 52 | 0) >> 2] | 0 | 0) == (2 | 0) & 1 | 0) {
         break label$9
        }
        if (!((HEAP32[($4_1 + 52 | 0) >> 2] | 0 | 0) == (4 | 0) & 1 | 0)) {
         break label$8
        }
       }
       $34(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, (HEAP32[($4_1 + 56 | 0) >> 2] | 0) + 3 | 0 | 0, (HEAP32[($4_1 + 60 | 0) >> 2] | 0) + 3 | 0 | 0, 0 & 1 | 0 | 0);
       $34(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, ((HEAP32[($4_1 + 68 | 0) >> 2] | 0) - 4 | 0) + (HEAP32[($4_1 + 56 | 0) >> 2] | 0) | 0 | 0, (HEAP32[($4_1 + 60 | 0) >> 2] | 0) + 3 | 0 | 0, 0 & 1 | 0 | 0);
       $34(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, (HEAP32[($4_1 + 56 | 0) >> 2] | 0) + 3 | 0 | 0, ((HEAP32[($4_1 + 68 | 0) >> 2] | 0) - 4 | 0) + (HEAP32[($4_1 + 60 | 0) >> 2] | 0) | 0 | 0, 0 & 1 | 0 | 0);
      }
      HEAP32[($4_1 + 56 | 0) >> 2] = (HEAP32[($4_1 + 56 | 0) >> 2] | 0) + 1 | 0;
      continue label$6;
     };
    }
    HEAP32[($4_1 + 60 | 0) >> 2] = (HEAP32[($4_1 + 60 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  HEAP32[($4_1 + 40 | 0) >> 2] = $29(HEAP32[($4_1 + 72 | 0) >> 2] | 0 | 0, $4_1 + 45 | 0 | 0) | 0;
  HEAP32[($4_1 + 36 | 0) >> 2] = 0;
  label$10 : {
   label$11 : while (1) {
    if (!((HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$10
    }
    HEAP32[($4_1 + 32 | 0) >> 2] = 0;
    label$12 : {
     label$13 : while (1) {
      if (!((HEAP32[($4_1 + 32 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 40 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$12
      }
      label$14 : {
       label$15 : {
        label$16 : {
         label$17 : {
          if (HEAP32[($4_1 + 36 | 0) >> 2] | 0) {
           break label$17
          }
          if (!(HEAP32[($4_1 + 32 | 0) >> 2] | 0)) {
           break label$16
          }
         }
         label$18 : {
          if (HEAP32[($4_1 + 36 | 0) >> 2] | 0) {
           break label$18
          }
          if ((HEAP32[($4_1 + 32 | 0) >> 2] | 0 | 0) == ((HEAP32[($4_1 + 40 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0) {
           break label$16
          }
         }
         if (!((HEAP32[($4_1 + 36 | 0) >> 2] | 0 | 0) == ((HEAP32[($4_1 + 40 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0)) {
          break label$15
         }
         if (HEAP32[($4_1 + 32 | 0) >> 2] | 0) {
          break label$15
         }
        }
        break label$14;
       }
       HEAP32[($4_1 + 28 | 0) >> 2] = -1;
       label$19 : {
        label$20 : while (1) {
         if (!((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) <= (1 | 0) & 1 | 0)) {
          break label$19
         }
         HEAP32[($4_1 + 24 | 0) >> 2] = -1;
         label$21 : {
          label$22 : while (1) {
           if (!((HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) <= (1 | 0) & 1 | 0)) {
            break label$21
           }
           $185 = HEAP32[($4_1 + 76 | 0) >> 2] | 0;
           $195 = ((HEAPU8[(($4_1 + 45 | 0) + (HEAP32[($4_1 + 36 | 0) >> 2] | 0) | 0) >> 0] | 0) & 255 | 0) + (HEAP32[($4_1 + 24 | 0) >> 2] | 0) | 0;
           $205 = ((HEAPU8[(($4_1 + 45 | 0) + (HEAP32[($4_1 + 32 | 0) >> 2] | 0) | 0) >> 0] | 0) & 255 | 0) + (HEAP32[($4_1 + 28 | 0) >> 2] | 0) | 0;
           $208 = 0;
           label$23 : {
            if (HEAP32[($4_1 + 24 | 0) >> 2] | 0) {
             break label$23
            }
            $208 = (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) == (0 | 0);
           }
           $33($185 | 0, $195 | 0, $205 | 0, $208 & 1 | 0 | 0);
           HEAP32[($4_1 + 24 | 0) >> 2] = (HEAP32[($4_1 + 24 | 0) >> 2] | 0) + 1 | 0;
           continue label$22;
          };
         }
         HEAP32[($4_1 + 28 | 0) >> 2] = (HEAP32[($4_1 + 28 | 0) >> 2] | 0) + 1 | 0;
         continue label$20;
        };
       }
      }
      HEAP32[($4_1 + 32 | 0) >> 2] = (HEAP32[($4_1 + 32 | 0) >> 2] | 0) + 1 | 0;
      continue label$13;
     };
    }
    HEAP32[($4_1 + 36 | 0) >> 2] = (HEAP32[($4_1 + 36 | 0) >> 2] | 0) + 1 | 0;
    continue label$11;
   };
  }
  label$24 : {
   if (!((HEAP32[($4_1 + 72 | 0) >> 2] | 0 | 0) >= (7 | 0) & 1 | 0)) {
    break label$24
   }
   HEAP32[($4_1 + 20 | 0) >> 2] = HEAP32[($4_1 + 72 | 0) >> 2] | 0;
   HEAP32[($4_1 + 16 | 0) >> 2] = 0;
   label$25 : {
    label$26 : while (1) {
     if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) < (12 | 0) & 1 | 0)) {
      break label$25
     }
     HEAP32[($4_1 + 20 | 0) >> 2] = ((HEAP32[($4_1 + 20 | 0) >> 2] | 0) << 1 | 0) ^ Math_imul((HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 11 | 0, 7973) | 0;
     HEAP32[($4_1 + 16 | 0) >> 2] = (HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 1 | 0;
     continue label$26;
    };
   }
   HEAP32[($4_1 + 12 | 0) >> 2] = (HEAP32[($4_1 + 72 | 0) >> 2] | 0) << 12 | 0 | (HEAP32[($4_1 + 20 | 0) >> 2] | 0) | 0;
   label$27 : {
    if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 18 | 0)) {
     break label$27
    }
    fimport$1(67291 | 0, 66269 | 0, 501 | 0, 65696 | 0);
    wasm2js_trap();
   }
   HEAP32[($4_1 + 8 | 0) >> 2] = 0;
   label$28 : {
    label$29 : while (1) {
     if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) < (6 | 0) & 1 | 0)) {
      break label$28
     }
     HEAP32[($4_1 + 4 | 0) >> 2] = 0;
     label$30 : {
      label$31 : while (1) {
       if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) < (3 | 0) & 1 | 0)) {
        break label$30
       }
       HEAP32[$4_1 >> 2] = ((HEAP32[($4_1 + 68 | 0) >> 2] | 0) - 11 | 0) + (HEAP32[($4_1 + 4 | 0) >> 2] | 0) | 0;
       $33(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, ((HEAP32[($4_1 + 12 | 0) >> 2] | 0) & 1 | 0 | 0) != (0 | 0) & 1 | 0 | 0);
       $33(HEAP32[($4_1 + 76 | 0) >> 2] | 0 | 0, HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[$4_1 >> 2] | 0 | 0, ((HEAP32[($4_1 + 12 | 0) >> 2] | 0) & 1 | 0 | 0) != (0 | 0) & 1 | 0 | 0);
       HEAP32[($4_1 + 12 | 0) >> 2] = (HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 1 | 0;
       HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) + 1 | 0;
       continue label$31;
      };
     }
     HEAP32[($4_1 + 8 | 0) >> 2] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + 1 | 0;
     continue label$29;
    };
   }
  }
  global$0 = $4_1 + 80 | 0;
  return;
 }
 
 function $23($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $48_1 = 0;
  $5_1 = global$0 - 32 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  label$1 : {
   label$2 : {
    if (!((0 | 0) <= (HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) <= (7 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(67093 | 0, 66269 | 0, 612 | 0, 65880 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 16 | 0) >> 2] = $30(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) < (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($5_1 + 8 | 0) >> 2] = 0;
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) < (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$5
      }
      label$7 : {
       label$8 : {
        if (!(($31(HEAP32[($5_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
         break label$8
        }
        break label$7;
       }
       $48_1 = HEAP32[($5_1 + 20 | 0) >> 2] | 0;
       label$9 : {
        label$10 : {
         switch ($48_1 | 0) {
         case 0:
          HEAP8[($5_1 + 7 | 0) >> 0] = (((HEAP32[($5_1 + 8 | 0) >> 2] | 0) + (HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0 | 0) % (2 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 1:
          HEAP8[($5_1 + 7 | 0) >> 0] = ((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) % (2 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 2:
          HEAP8[($5_1 + 7 | 0) >> 0] = ((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) % (3 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 3:
          HEAP8[($5_1 + 7 | 0) >> 0] = (((HEAP32[($5_1 + 8 | 0) >> 2] | 0) + (HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0 | 0) % (3 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 4:
          HEAP8[($5_1 + 7 | 0) >> 0] = ((((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) / (3 | 0) | 0) + ((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) / (2 | 0) | 0) | 0 | 0) % (2 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 5:
          HEAP8[($5_1 + 7 | 0) >> 0] = (((Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0) % (2 | 0) | 0) + ((Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0) % (3 | 0) | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 6:
          HEAP8[($5_1 + 7 | 0) >> 0] = ((((Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0) % (2 | 0) | 0) + ((Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0) % (3 | 0) | 0) | 0 | 0) % (2 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         case 7:
          HEAP8[($5_1 + 7 | 0) >> 0] = (((((HEAP32[($5_1 + 8 | 0) >> 2] | 0) + (HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0 | 0) % (2 | 0) | 0) + ((Math_imul(HEAP32[($5_1 + 8 | 0) >> 2] | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0) % (3 | 0) | 0) | 0 | 0) % (2 | 0) | 0 | 0) == (0 | 0) & 1 | 0;
          break label$9;
         default:
          break label$10;
         };
        }
        fimport$1(66063 | 0, 66269 | 0, 628 | 0, 65880 | 0);
        wasm2js_trap();
       }
       HEAP8[($5_1 + 6 | 0) >> 0] = ($31(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
       $33(HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, (((HEAPU8[($5_1 + 6 | 0) >> 0] | 0) & 1 | 0) ^ ((HEAPU8[($5_1 + 7 | 0) >> 0] | 0) & 1 | 0) | 0 | 0) != (0 | 0) & 1 | 0 | 0);
      }
      HEAP32[($5_1 + 8 | 0) >> 2] = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + 1 | 0;
      continue label$6;
     };
    }
    HEAP32[($5_1 + 12 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  global$0 = $5_1 + 32 | 0;
  return;
 }
 
 function $24($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $100_1 = 0;
  $5_1 = global$0 - 48 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 44 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 40 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 36 | 0) >> 2] = $2_1;
  label$1 : {
   label$2 : {
    if (!((0 | 0) <= (HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($5_1 + 40 | 0) >> 2] | 0 | 0) <= (7 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(67093 | 0, 66269 | 0, 521 | 0, 65618 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 32 | 0) >> 2] = (HEAP32[(68192 + ((HEAP32[($5_1 + 44 | 0) >> 2] | 0) << 2 | 0) | 0) >> 2] | 0) << 3 | 0 | (HEAP32[($5_1 + 40 | 0) >> 2] | 0) | 0;
  HEAP32[($5_1 + 28 | 0) >> 2] = HEAP32[($5_1 + 32 | 0) >> 2] | 0;
  HEAP32[($5_1 + 24 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) < (10 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($5_1 + 28 | 0) >> 2] = ((HEAP32[($5_1 + 28 | 0) >> 2] | 0) << 1 | 0) ^ Math_imul((HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 9 | 0, 1335) | 0;
    HEAP32[($5_1 + 24 | 0) >> 2] = (HEAP32[($5_1 + 24 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  HEAP32[($5_1 + 20 | 0) >> 2] = ((HEAP32[($5_1 + 32 | 0) >> 2] | 0) << 10 | 0 | (HEAP32[($5_1 + 28 | 0) >> 2] | 0) | 0) ^ 21522 | 0;
  label$5 : {
   if (!((HEAP32[($5_1 + 20 | 0) >> 2] | 0) >> 15 | 0)) {
    break label$5
   }
   fimport$1(67323 | 0, 66269 | 0, 528 | 0, 65618 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 16 | 0) >> 2] = 0;
  label$6 : {
   label$7 : while (1) {
    if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) <= (5 | 0) & 1 | 0)) {
     break label$6
    }
    $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 8 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0);
    HEAP32[($5_1 + 16 | 0) >> 2] = (HEAP32[($5_1 + 16 | 0) >> 2] | 0) + 1 | 0;
    continue label$7;
   };
  }
  $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 8 | 0, 7 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, 6 | 0) | 0) & 1 | 0 | 0);
  $100_1 = 8;
  $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, $100_1 | 0, $100_1 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, 7 | 0) | 0) & 1 | 0 | 0);
  $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 7 | 0, 8 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, 8 | 0) | 0) & 1 | 0 | 0);
  HEAP32[($5_1 + 12 | 0) >> 2] = 9;
  label$8 : {
   label$9 : while (1) {
    if (!((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) < (15 | 0) & 1 | 0)) {
     break label$8
    }
    $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 14 - (HEAP32[($5_1 + 12 | 0) >> 2] | 0) | 0 | 0, 8 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0);
    HEAP32[($5_1 + 12 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + 1 | 0;
    continue label$9;
   };
  }
  HEAP32[($5_1 + 8 | 0) >> 2] = $30(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($5_1 + 4 | 0) >> 2] = 0;
  label$10 : {
   label$11 : while (1) {
    if (!((HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) < (8 | 0) & 1 | 0)) {
     break label$10
    }
    $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, ((HEAP32[($5_1 + 8 | 0) >> 2] | 0) - 1 | 0) - (HEAP32[($5_1 + 4 | 0) >> 2] | 0) | 0 | 0, 8 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0);
    HEAP32[($5_1 + 4 | 0) >> 2] = (HEAP32[($5_1 + 4 | 0) >> 2] | 0) + 1 | 0;
    continue label$11;
   };
  }
  HEAP32[$5_1 >> 2] = 8;
  label$12 : {
   label$13 : while (1) {
    if (!((HEAP32[$5_1 >> 2] | 0 | 0) < (15 | 0) & 1 | 0)) {
     break label$12
    }
    $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 8 | 0, ((HEAP32[($5_1 + 8 | 0) >> 2] | 0) - 15 | 0) + (HEAP32[$5_1 >> 2] | 0) | 0 | 0, ($32(HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[$5_1 >> 2] | 0 | 0) | 0) & 1 | 0 | 0);
    HEAP32[$5_1 >> 2] = (HEAP32[$5_1 >> 2] | 0) + 1 | 0;
    continue label$13;
   };
  }
  $33(HEAP32[($5_1 + 36 | 0) >> 2] | 0 | 0, 8 | 0, (HEAP32[($5_1 + 8 | 0) >> 2] | 0) - 8 | 0 | 0, 1 & 1 | 0 | 0);
  global$0 = $5_1 + 48 | 0;
  return;
 }
 
 function $25($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $397 = 0, $398 = 0, $340 = 0, $342 = 0, $81_1 = 0, $104_1 = 0, $184 = 0, $207 = 0, $394 = 0;
  $3_1 = global$0 - 160 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 156 | 0) >> 2] = $0_1;
  HEAP32[($3_1 + 152 | 0) >> 2] = $30(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0) | 0;
  HEAP32[($3_1 + 148 | 0) >> 2] = 0;
  HEAP32[($3_1 + 144 | 0) >> 2] = 0;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($3_1 + 144 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP8[($3_1 + 143 | 0) >> 0] = 0;
    HEAP32[($3_1 + 136 | 0) >> 2] = 0;
    HEAP32[($3_1 + 120 | 0) >> 2] = 0;
    i64toi32_i32$0 = 0;
    $397 = 0;
    i64toi32_i32$1 = $3_1 + 112 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $397;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $3_1;
    HEAP32[($3_1 + 104 | 0) >> 2] = $397;
    HEAP32[($3_1 + 108 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $3_1;
    HEAP32[($3_1 + 96 | 0) >> 2] = $397;
    HEAP32[($3_1 + 100 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($3_1 + 92 | 0) >> 2] = 0;
    label$3 : {
     label$4 : while (1) {
      if (!((HEAP32[($3_1 + 92 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$3
      }
      label$5 : {
       label$6 : {
        if (!((($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 92 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 144 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0) == ((HEAPU8[($3_1 + 143 | 0) >> 0] | 0) & 1 | 0 | 0) & 1 | 0)) {
         break label$6
        }
        HEAP32[($3_1 + 136 | 0) >> 2] = (HEAP32[($3_1 + 136 | 0) >> 2] | 0) + 1 | 0;
        label$7 : {
         label$8 : {
          if (!((HEAP32[($3_1 + 136 | 0) >> 2] | 0 | 0) == (5 | 0) & 1 | 0)) {
           break label$8
          }
          HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + 3 | 0;
          break label$7;
         }
         label$9 : {
          if (!((HEAP32[($3_1 + 136 | 0) >> 2] | 0 | 0) > (5 | 0) & 1 | 0)) {
           break label$9
          }
          HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + 1 | 0;
         }
        }
        break label$5;
       }
       $35(HEAP32[($3_1 + 136 | 0) >> 2] | 0 | 0, $3_1 + 96 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0);
       label$10 : {
        if ((HEAPU8[($3_1 + 143 | 0) >> 0] | 0) & 1 | 0) {
         break label$10
        }
        $81_1 = Math_imul($36($3_1 + 96 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) | 0, 40);
        HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + $81_1 | 0;
       }
       HEAP8[($3_1 + 143 | 0) >> 0] = ($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 92 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 144 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
       HEAP32[($3_1 + 136 | 0) >> 2] = 1;
      }
      HEAP32[($3_1 + 92 | 0) >> 2] = (HEAP32[($3_1 + 92 | 0) >> 2] | 0) + 1 | 0;
      continue label$4;
     };
    }
    $104_1 = Math_imul($37((HEAPU8[($3_1 + 143 | 0) >> 0] | 0) & 1 | 0 | 0, HEAP32[($3_1 + 136 | 0) >> 2] | 0 | 0, $3_1 + 96 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) | 0, 40);
    HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + $104_1 | 0;
    HEAP32[($3_1 + 144 | 0) >> 2] = (HEAP32[($3_1 + 144 | 0) >> 2] | 0) + 1 | 0;
    continue label$2;
   };
  }
  HEAP32[($3_1 + 88 | 0) >> 2] = 0;
  label$11 : {
   label$12 : while (1) {
    if (!((HEAP32[($3_1 + 88 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$11
    }
    HEAP8[($3_1 + 87 | 0) >> 0] = 0;
    HEAP32[($3_1 + 80 | 0) >> 2] = 0;
    HEAP32[($3_1 + 72 | 0) >> 2] = 0;
    i64toi32_i32$0 = 0;
    $398 = 0;
    i64toi32_i32$1 = $3_1 + 64 | 0;
    HEAP32[i64toi32_i32$1 >> 2] = $398;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $3_1;
    HEAP32[($3_1 + 56 | 0) >> 2] = $398;
    HEAP32[($3_1 + 60 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $3_1;
    HEAP32[($3_1 + 48 | 0) >> 2] = $398;
    HEAP32[($3_1 + 52 | 0) >> 2] = i64toi32_i32$0;
    HEAP32[($3_1 + 44 | 0) >> 2] = 0;
    label$13 : {
     label$14 : while (1) {
      if (!((HEAP32[($3_1 + 44 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$13
      }
      label$15 : {
       label$16 : {
        if (!((($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 88 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 44 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0) == ((HEAPU8[($3_1 + 87 | 0) >> 0] | 0) & 1 | 0 | 0) & 1 | 0)) {
         break label$16
        }
        HEAP32[($3_1 + 80 | 0) >> 2] = (HEAP32[($3_1 + 80 | 0) >> 2] | 0) + 1 | 0;
        label$17 : {
         label$18 : {
          if (!((HEAP32[($3_1 + 80 | 0) >> 2] | 0 | 0) == (5 | 0) & 1 | 0)) {
           break label$18
          }
          HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + 3 | 0;
          break label$17;
         }
         label$19 : {
          if (!((HEAP32[($3_1 + 80 | 0) >> 2] | 0 | 0) > (5 | 0) & 1 | 0)) {
           break label$19
          }
          HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + 1 | 0;
         }
        }
        break label$15;
       }
       $35(HEAP32[($3_1 + 80 | 0) >> 2] | 0 | 0, $3_1 + 48 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0);
       label$20 : {
        if ((HEAPU8[($3_1 + 87 | 0) >> 0] | 0) & 1 | 0) {
         break label$20
        }
        $184 = Math_imul($36($3_1 + 48 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) | 0, 40);
        HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + $184 | 0;
       }
       HEAP8[($3_1 + 87 | 0) >> 0] = ($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 88 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 44 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
       HEAP32[($3_1 + 80 | 0) >> 2] = 1;
      }
      HEAP32[($3_1 + 44 | 0) >> 2] = (HEAP32[($3_1 + 44 | 0) >> 2] | 0) + 1 | 0;
      continue label$14;
     };
    }
    $207 = Math_imul($37((HEAPU8[($3_1 + 87 | 0) >> 0] | 0) & 1 | 0 | 0, HEAP32[($3_1 + 80 | 0) >> 2] | 0 | 0, $3_1 + 48 | 0 | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) | 0, 40);
    HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + $207 | 0;
    HEAP32[($3_1 + 88 | 0) >> 2] = (HEAP32[($3_1 + 88 | 0) >> 2] | 0) + 1 | 0;
    continue label$12;
   };
  }
  HEAP32[($3_1 + 40 | 0) >> 2] = 0;
  label$21 : {
   label$22 : while (1) {
    if (!((HEAP32[($3_1 + 40 | 0) >> 2] | 0 | 0) < ((HEAP32[($3_1 + 152 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0)) {
     break label$21
    }
    HEAP32[($3_1 + 36 | 0) >> 2] = 0;
    label$23 : {
     label$24 : while (1) {
      if (!((HEAP32[($3_1 + 36 | 0) >> 2] | 0 | 0) < ((HEAP32[($3_1 + 152 | 0) >> 2] | 0) - 1 | 0 | 0) & 1 | 0)) {
       break label$23
      }
      HEAP8[($3_1 + 35 | 0) >> 0] = ($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 36 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 40 | 0) >> 2] | 0 | 0) | 0) & 1 | 0;
      label$25 : {
       if (!(((HEAPU8[($3_1 + 35 | 0) >> 0] | 0) & 1 | 0 | 0) == (($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, (HEAP32[($3_1 + 36 | 0) >> 2] | 0) + 1 | 0 | 0, HEAP32[($3_1 + 40 | 0) >> 2] | 0 | 0) | 0) & 1 | 0 | 0) & 1 | 0)) {
        break label$25
       }
       if (!(((HEAPU8[($3_1 + 35 | 0) >> 0] | 0) & 1 | 0 | 0) == (($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 36 | 0) >> 2] | 0 | 0, (HEAP32[($3_1 + 40 | 0) >> 2] | 0) + 1 | 0 | 0) | 0) & 1 | 0 | 0) & 1 | 0)) {
        break label$25
       }
       if (!(((HEAPU8[($3_1 + 35 | 0) >> 0] | 0) & 1 | 0 | 0) == (($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, (HEAP32[($3_1 + 36 | 0) >> 2] | 0) + 1 | 0 | 0, (HEAP32[($3_1 + 40 | 0) >> 2] | 0) + 1 | 0 | 0) | 0) & 1 | 0 | 0) & 1 | 0)) {
        break label$25
       }
       HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + 3 | 0;
      }
      HEAP32[($3_1 + 36 | 0) >> 2] = (HEAP32[($3_1 + 36 | 0) >> 2] | 0) + 1 | 0;
      continue label$24;
     };
    }
    HEAP32[($3_1 + 40 | 0) >> 2] = (HEAP32[($3_1 + 40 | 0) >> 2] | 0) + 1 | 0;
    continue label$22;
   };
  }
  HEAP32[($3_1 + 28 | 0) >> 2] = 0;
  HEAP32[($3_1 + 24 | 0) >> 2] = 0;
  label$26 : {
   label$27 : while (1) {
    if (!((HEAP32[($3_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$26
    }
    HEAP32[($3_1 + 20 | 0) >> 2] = 0;
    label$28 : {
     label$29 : while (1) {
      if (!((HEAP32[($3_1 + 20 | 0) >> 2] | 0 | 0) < (HEAP32[($3_1 + 152 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$28
      }
      label$30 : {
       if (!(($31(HEAP32[($3_1 + 156 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 20 | 0) >> 2] | 0 | 0, HEAP32[($3_1 + 24 | 0) >> 2] | 0 | 0) | 0) & 1 | 0)) {
        break label$30
       }
       HEAP32[($3_1 + 28 | 0) >> 2] = (HEAP32[($3_1 + 28 | 0) >> 2] | 0) + 1 | 0;
      }
      HEAP32[($3_1 + 20 | 0) >> 2] = (HEAP32[($3_1 + 20 | 0) >> 2] | 0) + 1 | 0;
      continue label$29;
     };
    }
    HEAP32[($3_1 + 24 | 0) >> 2] = (HEAP32[($3_1 + 24 | 0) >> 2] | 0) + 1 | 0;
    continue label$27;
   };
  }
  HEAP32[($3_1 + 16 | 0) >> 2] = Math_imul(HEAP32[($3_1 + 152 | 0) >> 2] | 0, HEAP32[($3_1 + 152 | 0) >> 2] | 0);
  $340 = Math_imul(HEAP32[($3_1 + 28 | 0) >> 2] | 0, 20) - Math_imul(HEAP32[($3_1 + 16 | 0) >> 2] | 0, 10) | 0;
  $342 = $340 >> 31 | 0;
  HEAP32[($3_1 + 12 | 0) >> 2] = ((((($340 ^ $342 | 0) - $342 | 0) + (HEAP32[($3_1 + 16 | 0) >> 2] | 0) | 0) - 1 | 0 | 0) / (HEAP32[($3_1 + 16 | 0) >> 2] | 0 | 0) | 0) - 1 | 0;
  label$31 : {
   label$32 : {
    if (!((0 | 0) <= (HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$32
    }
    if ((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) <= (9 | 0) & 1 | 0) {
     break label$31
    }
   }
   fimport$1(66958 | 0, 66269 | 0, 710 | 0, 66069 | 0);
   wasm2js_trap();
  }
  HEAP32[($3_1 + 148 | 0) >> 2] = (HEAP32[($3_1 + 148 | 0) >> 2] | 0) + Math_imul(HEAP32[($3_1 + 12 | 0) >> 2] | 0, 10) | 0;
  label$33 : {
   label$34 : {
    if (!((0 | 0) <= (HEAP32[($3_1 + 148 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$34
    }
    if ((HEAP32[($3_1 + 148 | 0) >> 2] | 0 | 0) <= (2568888 | 0) & 1 | 0) {
     break label$33
    }
   }
   fimport$1(66874 | 0, 66269 | 0, 712 | 0, 66069 | 0);
   wasm2js_trap();
  }
  $394 = HEAP32[($3_1 + 148 | 0) >> 2] | 0;
  global$0 = $3_1 + 160 | 0;
  return $394 | 0;
 }
 
 function $26($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $83_1 = 0, $60_1 = 0;
  $4_1 = global$0 - 32 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 24 | 0) >> 2] = $1_1;
  label$1 : {
   label$2 : {
    if (!((1 | 0) <= (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) <= (30 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(66549 | 0, 66269 | 0, 362 | 0, 65776 | 0);
   wasm2js_trap();
  }
  $42(HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0, 0 | 0, (HEAP32[($4_1 + 28 | 0) >> 2] | 0) << 0 | 0 | 0) | 0;
  HEAP8[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + ((HEAP32[($4_1 + 28 | 0) >> 2] | 0) - 1 | 0) | 0) >> 0] = 1;
  HEAP8[($4_1 + 23 | 0) >> 0] = 1;
  HEAP32[($4_1 + 16 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($4_1 + 16 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP32[($4_1 + 12 | 0) >> 2] = 0;
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[($4_1 + 12 | 0) >> 2] | 0 | 0) < (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$5
      }
      $60_1 = $39((HEAPU8[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + (HEAP32[($4_1 + 12 | 0) >> 2] | 0) | 0) >> 0] | 0) & 255 | 0 | 0, (HEAPU8[($4_1 + 23 | 0) >> 0] | 0) & 255 | 0 | 0) | 0;
      HEAP8[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + (HEAP32[($4_1 + 12 | 0) >> 2] | 0) | 0) >> 0] = $60_1;
      label$7 : {
       if (!(((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 1 | 0 | 0) < (HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0) & 1 | 0)) {
        break label$7
       }
       $83_1 = (HEAP32[($4_1 + 24 | 0) >> 2] | 0) + (HEAP32[($4_1 + 12 | 0) >> 2] | 0) | 0;
       HEAP8[$83_1 >> 0] = ((HEAPU8[$83_1 >> 0] | 0) & 255 | 0) ^ ((HEAPU8[((HEAP32[($4_1 + 24 | 0) >> 2] | 0) + ((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 1 | 0) | 0) >> 0] | 0) & 255 | 0) | 0;
      }
      HEAP32[($4_1 + 12 | 0) >> 2] = (HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 1 | 0;
      continue label$6;
     };
    }
    HEAP8[($4_1 + 23 | 0) >> 0] = $39((HEAPU8[($4_1 + 23 | 0) >> 0] | 0) & 255 | 0 | 0, 2 & 255 | 0 | 0) | 0;
    HEAP32[($4_1 + 16 | 0) >> 2] = (HEAP32[($4_1 + 16 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  global$0 = $4_1 + 32 | 0;
  return;
 }
 
 function $27($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0, $87_1 = 0, $84_1 = 0;
  $7_1 = global$0 - 32 | 0;
  global$0 = $7_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $4_1;
  label$1 : {
   label$2 : {
    if (!((1 | 0) <= (HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) <= (30 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(66549 | 0, 66269 | 0, 389 | 0, 65821 | 0);
   wasm2js_trap();
  }
  $42(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0, 0 | 0, (HEAP32[($7_1 + 16 | 0) >> 2] | 0) << 0 | 0 | 0) | 0;
  HEAP32[($7_1 + 8 | 0) >> 2] = 0;
  label$3 : {
   label$4 : while (1) {
    if (!((HEAP32[($7_1 + 8 | 0) >> 2] | 0 | 0) < (HEAP32[($7_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    HEAP8[($7_1 + 7 | 0) >> 0] = ((HEAPU8[((HEAP32[($7_1 + 28 | 0) >> 2] | 0) + (HEAP32[($7_1 + 8 | 0) >> 2] | 0) | 0) >> 0] | 0) & 255 | 0) ^ ((HEAPU8[(HEAP32[($7_1 + 12 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0) | 0;
    $41(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 12 | 0) >> 2] | 0) + 1 | 0 | 0, ((HEAP32[($7_1 + 16 | 0) >> 2] | 0) - 1 | 0) << 0 | 0 | 0) | 0;
    HEAP8[((HEAP32[($7_1 + 12 | 0) >> 2] | 0) + ((HEAP32[($7_1 + 16 | 0) >> 2] | 0) - 1 | 0) | 0) >> 0] = 0;
    HEAP32[$7_1 >> 2] = 0;
    label$5 : {
     label$6 : while (1) {
      if (!((HEAP32[$7_1 >> 2] | 0 | 0) < (HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$5
      }
      $84_1 = ($39((HEAPU8[((HEAP32[($7_1 + 20 | 0) >> 2] | 0) + (HEAP32[$7_1 >> 2] | 0) | 0) >> 0] | 0) & 255 | 0 | 0, (HEAPU8[($7_1 + 7 | 0) >> 0] | 0) & 255 | 0 | 0) | 0) & 255 | 0;
      $87_1 = (HEAP32[($7_1 + 12 | 0) >> 2] | 0) + (HEAP32[$7_1 >> 2] | 0) | 0;
      HEAP8[$87_1 >> 0] = ((HEAPU8[$87_1 >> 0] | 0) & 255 | 0) ^ $84_1 | 0;
      HEAP32[$7_1 >> 2] = (HEAP32[$7_1 >> 2] | 0) + 1 | 0;
      continue label$6;
     };
    }
    HEAP32[($7_1 + 8 | 0) >> 2] = (HEAP32[($7_1 + 8 | 0) >> 2] | 0) + 1 | 0;
    continue label$4;
   };
  }
  global$0 = $7_1 + 32 | 0;
  return;
 }
 
 function $28($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $7_1 = 0;
  $7_1 = global$0 - 32 | 0;
  global$0 = $7_1;
  HEAP32[($7_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($7_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($7_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($7_1 + 16 | 0) >> 2] = $3_1;
  HEAP32[($7_1 + 12 | 0) >> 2] = $4_1;
  HEAP32[($7_1 + 8 | 0) >> 2] = 0;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($7_1 + 8 | 0) >> 2] | 0 | 0) < (HEAP32[($7_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP32[($7_1 + 4 | 0) >> 2] = 0;
    label$3 : {
     label$4 : while (1) {
      if (!((HEAP32[($7_1 + 4 | 0) >> 2] | 0 | 0) < (HEAP32[($7_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
       break label$3
      }
      $33(HEAP32[($7_1 + 12 | 0) >> 2] | 0 | 0, (HEAP32[($7_1 + 28 | 0) >> 2] | 0) + (HEAP32[($7_1 + 4 | 0) >> 2] | 0) | 0 | 0, (HEAP32[($7_1 + 24 | 0) >> 2] | 0) + (HEAP32[($7_1 + 8 | 0) >> 2] | 0) | 0 | 0, 1 & 1 | 0 | 0);
      HEAP32[($7_1 + 4 | 0) >> 2] = (HEAP32[($7_1 + 4 | 0) >> 2] | 0) + 1 | 0;
      continue label$4;
     };
    }
    HEAP32[($7_1 + 8 | 0) >> 2] = (HEAP32[($7_1 + 8 | 0) >> 2] | 0) + 1 | 0;
    continue label$2;
   };
  }
  global$0 = $7_1 + 32 | 0;
  return;
 }
 
 function $29($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $26_1 = 0;
  $4_1 = global$0 - 32 | 0;
  HEAP32[($4_1 + 24 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 20 | 0) >> 2] = $1_1;
  label$1 : {
   label$2 : {
    if (!((HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) == (1 | 0) & 1 | 0)) {
     break label$2
    }
    HEAP32[($4_1 + 28 | 0) >> 2] = 0;
    break label$1;
   }
   HEAP32[($4_1 + 16 | 0) >> 2] = ((HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) / (7 | 0) | 0) + 2 | 0;
   label$3 : {
    label$4 : {
     if (!((HEAP32[($4_1 + 24 | 0) >> 2] | 0 | 0) == (32 | 0) & 1 | 0)) {
      break label$4
     }
     $26_1 = 26;
     break label$3;
    }
    $26_1 = (((((HEAP32[($4_1 + 24 | 0) >> 2] | 0) << 2 | 0) + ((HEAP32[($4_1 + 16 | 0) >> 2] | 0) << 1 | 0) | 0) + 1 | 0 | 0) / (((HEAP32[($4_1 + 16 | 0) >> 2] | 0) << 1 | 0) - 2 | 0 | 0) | 0) << 1 | 0;
   }
   HEAP32[($4_1 + 12 | 0) >> 2] = $26_1;
   HEAP32[($4_1 + 8 | 0) >> 2] = (HEAP32[($4_1 + 16 | 0) >> 2] | 0) - 1 | 0;
   HEAP32[($4_1 + 4 | 0) >> 2] = ((HEAP32[($4_1 + 24 | 0) >> 2] | 0) << 2 | 0) + 10 | 0;
   label$5 : {
    label$6 : while (1) {
     if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) >= (1 | 0) & 1 | 0)) {
      break label$5
     }
     HEAP8[((HEAP32[($4_1 + 20 | 0) >> 2] | 0) + (HEAP32[($4_1 + 8 | 0) >> 2] | 0) | 0) >> 0] = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
     HEAP32[($4_1 + 8 | 0) >> 2] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -1 | 0;
     HEAP32[($4_1 + 4 | 0) >> 2] = (HEAP32[($4_1 + 4 | 0) >> 2] | 0) - (HEAP32[($4_1 + 12 | 0) >> 2] | 0) | 0;
     continue label$6;
    };
   }
   HEAP8[(HEAP32[($4_1 + 20 | 0) >> 2] | 0) >> 0] = 6;
   HEAP32[($4_1 + 28 | 0) >> 2] = HEAP32[($4_1 + 16 | 0) >> 2] | 0;
  }
  return HEAP32[($4_1 + 28 | 0) >> 2] | 0 | 0;
 }
 
 function $30($0_1) {
  $0_1 = $0_1 | 0;
  var $3_1 = 0, $37_1 = 0;
  $3_1 = global$0 - 16 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 12 | 0) >> 2] = $0_1;
  label$1 : {
   if ((HEAP32[($3_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66859 | 0, 66269 | 0, 756 | 0, 65993 | 0);
   wasm2js_trap();
  }
  HEAP32[($3_1 + 8 | 0) >> 2] = (HEAPU8[(HEAP32[($3_1 + 12 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0;
  label$2 : {
   label$3 : {
    if (!((21 | 0) <= (HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$3
    }
    if ((HEAP32[($3_1 + 8 | 0) >> 2] | 0 | 0) <= (177 | 0) & 1 | 0) {
     break label$2
    }
   }
   fimport$1(67350 | 0, 66269 | 0, 759 | 0, 65993 | 0);
   wasm2js_trap();
  }
  $37_1 = HEAP32[($3_1 + 8 | 0) >> 2] | 0;
  global$0 = $3_1 + 16 | 0;
  return $37_1 | 0;
 }
 
 function $31($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $76_1 = 0;
  $5_1 = global$0 - 32 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 20 | 0) >> 2] = $2_1;
  HEAP32[($5_1 + 16 | 0) >> 2] = (HEAPU8[(HEAP32[($5_1 + 28 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0;
  label$1 : {
   label$2 : {
    if (!((21 | 0) <= (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) <= (177 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((0 | 0) <= (HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($5_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((0 | 0) <= (HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($5_1 + 20 | 0) >> 2] | 0 | 0) < (HEAP32[($5_1 + 16 | 0) >> 2] | 0 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(65915 | 0, 66269 | 0, 775 | 0, 66122 | 0);
   wasm2js_trap();
  }
  HEAP32[($5_1 + 12 | 0) >> 2] = Math_imul(HEAP32[($5_1 + 20 | 0) >> 2] | 0, HEAP32[($5_1 + 16 | 0) >> 2] | 0) + (HEAP32[($5_1 + 24 | 0) >> 2] | 0) | 0;
  $76_1 = ($32((HEAPU8[((HEAP32[($5_1 + 28 | 0) >> 2] | 0) + (((HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 3 | 0) + 1 | 0) | 0) >> 0] | 0) & 255 | 0 | 0, (HEAP32[($5_1 + 12 | 0) >> 2] | 0) & 7 | 0 | 0) | 0) & 1 | 0;
  global$0 = $5_1 + 32 | 0;
  return $76_1 | 0;
 }
 
 function $32($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  return (((HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> (HEAP32[($4_1 + 8 | 0) >> 2] | 0) | 0) & 1 | 0 | 0) != (0 | 0) & 1 | 0 | 0;
 }
 
 function $33($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $79_1 = 0, $91_1 = 0;
  $6_1 = global$0 - 32 | 0;
  global$0 = $6_1;
  HEAP32[($6_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 20 | 0) >> 2] = $2_1;
  HEAP8[($6_1 + 19 | 0) >> 0] = $3_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = (HEAPU8[(HEAP32[($6_1 + 28 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0;
  label$1 : {
   label$2 : {
    if (!((21 | 0) <= (HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) <= (177 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((0 | 0) <= (HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if (!((0 | 0) <= (HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
     break label$2
    }
    if ((HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0) {
     break label$1
    }
   }
   fimport$1(65915 | 0, 66269 | 0, 784 | 0, 66105 | 0);
   wasm2js_trap();
  }
  HEAP32[($6_1 + 8 | 0) >> 2] = Math_imul(HEAP32[($6_1 + 20 | 0) >> 2] | 0, HEAP32[($6_1 + 12 | 0) >> 2] | 0) + (HEAP32[($6_1 + 24 | 0) >> 2] | 0) | 0;
  HEAP32[($6_1 + 4 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) & 7 | 0;
  HEAP32[$6_1 >> 2] = ((HEAP32[($6_1 + 8 | 0) >> 2] | 0) >> 3 | 0) + 1 | 0;
  label$3 : {
   label$4 : {
    if (!((HEAPU8[($6_1 + 19 | 0) >> 0] | 0) & 1 | 0)) {
     break label$4
    }
    $79_1 = (HEAP32[($6_1 + 28 | 0) >> 2] | 0) + (HEAP32[$6_1 >> 2] | 0) | 0;
    HEAP8[$79_1 >> 0] = (HEAPU8[$79_1 >> 0] | 0) & 255 | 0 | (1 << (HEAP32[($6_1 + 4 | 0) >> 2] | 0) | 0) | 0;
    break label$3;
   }
   $91_1 = (HEAP32[($6_1 + 28 | 0) >> 2] | 0) + (HEAP32[$6_1 >> 2] | 0) | 0;
   HEAP8[$91_1 >> 0] = ((HEAPU8[$91_1 >> 0] | 0) & 255 | 0) & ((1 << (HEAP32[($6_1 + 4 | 0) >> 2] | 0) | 0) ^ 255 | 0) | 0;
  }
  global$0 = $6_1 + 32 | 0;
  return;
 }
 
 function $34($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0;
  $6_1 = global$0 - 32 | 0;
  global$0 = $6_1;
  HEAP32[($6_1 + 28 | 0) >> 2] = $0_1;
  HEAP32[($6_1 + 24 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 20 | 0) >> 2] = $2_1;
  HEAP8[($6_1 + 19 | 0) >> 0] = $3_1;
  HEAP32[($6_1 + 12 | 0) >> 2] = (HEAPU8[(HEAP32[($6_1 + 28 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0;
  label$1 : {
   if (!((0 | 0) <= (HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$1
   }
   if (!((HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$1
   }
   if (!((0 | 0) <= (HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$1
   }
   if (!((HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0) < (HEAP32[($6_1 + 12 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$1
   }
   $33(HEAP32[($6_1 + 28 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 24 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 20 | 0) >> 2] | 0 | 0, (HEAPU8[($6_1 + 19 | 0) >> 0] | 0) & 1 | 0 | 0);
  }
  global$0 = $6_1 + 32 | 0;
  return;
 }
 
 function $35($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var i64toi32_i32$0 = 0, $5_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$2 = 0, $13_1 = 0, $14_1 = 0, $15_1 = 0, $17_1 = 0, $23_1 = 0, $23$hi = 0, $24_1 = 0, $24$hi = 0, $25_1 = 0, $25$hi = 0;
  $5_1 = global$0 - 16 | 0;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$1 : {
   if (HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] | 0) {
    break label$1
   }
   HEAP32[($5_1 + 12 | 0) >> 2] = (HEAP32[($5_1 + 12 | 0) >> 2] | 0) + (HEAP32[($5_1 + 4 | 0) >> 2] | 0) | 0;
  }
  $13_1 = (HEAP32[($5_1 + 8 | 0) >> 2] | 0) + 4 | 0;
  $14_1 = HEAP32[($5_1 + 8 | 0) >> 2] | 0;
  $15_1 = 8;
  i64toi32_i32$2 = $14_1 + $15_1 | 0;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $23_1 = i64toi32_i32$0;
  $23$hi = i64toi32_i32$1;
  $17_1 = 16;
  i64toi32_i32$2 = $14_1 + $17_1 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $24_1 = i64toi32_i32$1;
  $24$hi = i64toi32_i32$0;
  i64toi32_i32$2 = $14_1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $25_1 = i64toi32_i32$0;
  $25$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $24$hi;
  i64toi32_i32$0 = $13_1 + $17_1 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $24_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$1 = $23$hi;
  i64toi32_i32$0 = $13_1 + $15_1 | 0;
  HEAP32[i64toi32_i32$0 >> 2] = $23_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  i64toi32_i32$1 = $25$hi;
  i64toi32_i32$0 = $13_1;
  HEAP32[i64toi32_i32$0 >> 2] = $25_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
  HEAP32[(HEAP32[($5_1 + 8 | 0) >> 2] | 0) >> 2] = HEAP32[($5_1 + 12 | 0) >> 2] | 0;
  return;
 }
 
 function $36($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $28_1 = 0, $71_1 = 0, $99_1 = 0, $94 = 0;
  $4_1 = global$0 - 16 | 0;
  global$0 = $4_1;
  HEAP32[($4_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($4_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($4_1 + 4 | 0) >> 2] = HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 4 | 0) >> 2] | 0;
  label$1 : {
   if ((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) <= (Math_imul(HEAP32[($4_1 + 8 | 0) >> 2] | 0, 3) | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(67170 | 0, 66269 | 0, 721 | 0, 65669 | 0);
   wasm2js_trap();
  }
  $28_1 = 0;
  label$2 : {
   if (!((HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) > (0 | 0) & 1 | 0)) {
    break label$2
   }
   $28_1 = 0;
   if (!((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 8 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $28_1 = 0;
   if (!((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 12 | 0) >> 2] | 0 | 0) == (Math_imul(HEAP32[($4_1 + 4 | 0) >> 2] | 0, 3) | 0) & 1 | 0)) {
    break label$2
   }
   $28_1 = 0;
   if (!((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 16 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $28_1 = (HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 20 | 0) >> 2] | 0 | 0) == (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  HEAP8[($4_1 + 3 | 0) >> 0] = $28_1 & 1 | 0;
  $71_1 = 0;
  label$3 : {
   if (!((HEAPU8[($4_1 + 3 | 0) >> 0] | 0) & 1 | 0)) {
    break label$3
   }
   $71_1 = 0;
   if (!((HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) >= ((HEAP32[($4_1 + 4 | 0) >> 2] | 0) << 2 | 0 | 0) & 1 | 0)) {
    break label$3
   }
   $71_1 = (HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 24 | 0) >> 2] | 0 | 0) >= (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  $94 = $71_1 & 1 | 0 ? 1 : 0;
  $99_1 = 0;
  label$4 : {
   if (!((HEAPU8[($4_1 + 3 | 0) >> 0] | 0) & 1 | 0)) {
    break label$4
   }
   $99_1 = 0;
   if (!((HEAP32[((HEAP32[($4_1 + 12 | 0) >> 2] | 0) + 24 | 0) >> 2] | 0 | 0) >= ((HEAP32[($4_1 + 4 | 0) >> 2] | 0) << 2 | 0 | 0) & 1 | 0)) {
    break label$4
   }
   $99_1 = (HEAP32[(HEAP32[($4_1 + 12 | 0) >> 2] | 0) >> 2] | 0 | 0) >= (HEAP32[($4_1 + 4 | 0) >> 2] | 0 | 0);
  }
  global$0 = $4_1 + 16 | 0;
  return $94 + ($99_1 & 1 | 0 ? 1 : 0) | 0 | 0;
 }
 
 function $37($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $6_1 = 0, $23_1 = 0;
  $6_1 = global$0 - 16 | 0;
  global$0 = $6_1;
  HEAP8[($6_1 + 15 | 0) >> 0] = $0_1;
  HEAP32[($6_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($6_1 + 4 | 0) >> 2] = $2_1;
  HEAP32[$6_1 >> 2] = $3_1;
  label$1 : {
   if (!((HEAPU8[($6_1 + 15 | 0) >> 0] | 0) & 1 | 0)) {
    break label$1
   }
   $35(HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$6_1 >> 2] | 0 | 0);
   HEAP32[($6_1 + 8 | 0) >> 2] = 0;
  }
  HEAP32[($6_1 + 8 | 0) >> 2] = (HEAP32[($6_1 + 8 | 0) >> 2] | 0) + (HEAP32[$6_1 >> 2] | 0) | 0;
  $35(HEAP32[($6_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$6_1 >> 2] | 0 | 0);
  $23_1 = $36(HEAP32[($6_1 + 4 | 0) >> 2] | 0 | 0, HEAP32[$6_1 >> 2] | 0 | 0) | 0;
  global$0 = $6_1 + 16 | 0;
  return $23_1 | 0;
 }
 
 function $38($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $5_1 = 0, $29_1 = 0;
  $5_1 = global$0 - 16 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 12 | 0) >> 2] = $0_1;
  HEAP32[($5_1 + 8 | 0) >> 2] = $1_1;
  HEAP32[($5_1 + 4 | 0) >> 2] = $2_1;
  label$1 : {
   if ((HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0) != (0 | 0) & 1 | 0) {
    break label$1
   }
   fimport$1(66859 | 0, 66269 | 0, 766 | 0, 66085 | 0);
   wasm2js_trap();
  }
  HEAP32[$5_1 >> 2] = (HEAPU8[(HEAP32[($5_1 + 12 | 0) >> 2] | 0) >> 0] | 0) & 255 | 0;
  $29_1 = 0;
  label$2 : {
   if (!((0 | 0) <= (HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $29_1 = 0;
   if (!((HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0) < (HEAP32[$5_1 >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $29_1 = 0;
   if (!((0 | 0) <= (HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $29_1 = 0;
   if (!((HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) < (HEAP32[$5_1 >> 2] | 0 | 0) & 1 | 0)) {
    break label$2
   }
   $29_1 = $31(HEAP32[($5_1 + 12 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 8 | 0) >> 2] | 0 | 0, HEAP32[($5_1 + 4 | 0) >> 2] | 0 | 0) | 0;
  }
  global$0 = $5_1 + 16 | 0;
  return $29_1 & 1 | 0 | 0;
 }
 
 function $39($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0;
  $4_1 = global$0 - 16 | 0;
  HEAP8[($4_1 + 15 | 0) >> 0] = $0_1;
  HEAP8[($4_1 + 14 | 0) >> 0] = $1_1;
  HEAP8[($4_1 + 13 | 0) >> 0] = 0;
  HEAP32[($4_1 + 8 | 0) >> 2] = 7;
  label$1 : {
   label$2 : while (1) {
    if (!((HEAP32[($4_1 + 8 | 0) >> 2] | 0 | 0) >= (0 | 0) & 1 | 0)) {
     break label$1
    }
    HEAP8[($4_1 + 13 | 0) >> 0] = (((HEAPU8[($4_1 + 13 | 0) >> 0] | 0) & 255 | 0) << 1 | 0) ^ Math_imul(((HEAPU8[($4_1 + 13 | 0) >> 0] | 0) & 255 | 0) >> 7 | 0, 285) | 0;
    HEAP8[($4_1 + 13 | 0) >> 0] = ((HEAPU8[($4_1 + 13 | 0) >> 0] | 0) & 255 | 0) ^ Math_imul((((HEAPU8[($4_1 + 14 | 0) >> 0] | 0) & 255 | 0) >> (HEAP32[($4_1 + 8 | 0) >> 2] | 0) | 0) & 1 | 0, (HEAPU8[($4_1 + 15 | 0) >> 0] | 0) & 255 | 0) | 0;
    HEAP32[($4_1 + 8 | 0) >> 2] = (HEAP32[($4_1 + 8 | 0) >> 2] | 0) + -1 | 0;
    continue label$2;
   };
  }
  return (HEAPU8[($4_1 + 13 | 0) >> 0] | 0) & 255 | 0 | 0;
 }
 
 function $40($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0;
  label$1 : {
   if ($2_1 >>> 0 < 512 >>> 0) {
    break label$1
   }
   fimport$2($0_1 | 0, $1_1 | 0, $2_1 | 0);
   return $0_1 | 0;
  }
  $3_1 = $0_1 + $2_1 | 0;
  label$2 : {
   label$3 : {
    if (($1_1 ^ $0_1 | 0) & 3 | 0) {
     break label$3
    }
    label$4 : {
     label$5 : {
      if ($0_1 & 3 | 0) {
       break label$5
      }
      $2_1 = $0_1;
      break label$4;
     }
     label$6 : {
      if ($2_1) {
       break label$6
      }
      $2_1 = $0_1;
      break label$4;
     }
     $2_1 = $0_1;
     label$7 : while (1) {
      HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
      $1_1 = $1_1 + 1 | 0;
      $2_1 = $2_1 + 1 | 0;
      if (!($2_1 & 3 | 0)) {
       break label$4
      }
      if ($2_1 >>> 0 < $3_1 >>> 0) {
       continue label$7
      }
      break label$7;
     };
    }
    label$8 : {
     $4_1 = $3_1 & -4 | 0;
     if ($4_1 >>> 0 < 64 >>> 0) {
      break label$8
     }
     $5_1 = $4_1 + -64 | 0;
     if ($2_1 >>> 0 > $5_1 >>> 0) {
      break label$8
     }
     label$9 : while (1) {
      HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
      HEAP32[($2_1 + 4 | 0) >> 2] = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
      HEAP32[($2_1 + 8 | 0) >> 2] = HEAP32[($1_1 + 8 | 0) >> 2] | 0;
      HEAP32[($2_1 + 12 | 0) >> 2] = HEAP32[($1_1 + 12 | 0) >> 2] | 0;
      HEAP32[($2_1 + 16 | 0) >> 2] = HEAP32[($1_1 + 16 | 0) >> 2] | 0;
      HEAP32[($2_1 + 20 | 0) >> 2] = HEAP32[($1_1 + 20 | 0) >> 2] | 0;
      HEAP32[($2_1 + 24 | 0) >> 2] = HEAP32[($1_1 + 24 | 0) >> 2] | 0;
      HEAP32[($2_1 + 28 | 0) >> 2] = HEAP32[($1_1 + 28 | 0) >> 2] | 0;
      HEAP32[($2_1 + 32 | 0) >> 2] = HEAP32[($1_1 + 32 | 0) >> 2] | 0;
      HEAP32[($2_1 + 36 | 0) >> 2] = HEAP32[($1_1 + 36 | 0) >> 2] | 0;
      HEAP32[($2_1 + 40 | 0) >> 2] = HEAP32[($1_1 + 40 | 0) >> 2] | 0;
      HEAP32[($2_1 + 44 | 0) >> 2] = HEAP32[($1_1 + 44 | 0) >> 2] | 0;
      HEAP32[($2_1 + 48 | 0) >> 2] = HEAP32[($1_1 + 48 | 0) >> 2] | 0;
      HEAP32[($2_1 + 52 | 0) >> 2] = HEAP32[($1_1 + 52 | 0) >> 2] | 0;
      HEAP32[($2_1 + 56 | 0) >> 2] = HEAP32[($1_1 + 56 | 0) >> 2] | 0;
      HEAP32[($2_1 + 60 | 0) >> 2] = HEAP32[($1_1 + 60 | 0) >> 2] | 0;
      $1_1 = $1_1 + 64 | 0;
      $2_1 = $2_1 + 64 | 0;
      if ($2_1 >>> 0 <= $5_1 >>> 0) {
       continue label$9
      }
      break label$9;
     };
    }
    if ($2_1 >>> 0 >= $4_1 >>> 0) {
     break label$2
    }
    label$10 : while (1) {
     HEAP32[$2_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
     $1_1 = $1_1 + 4 | 0;
     $2_1 = $2_1 + 4 | 0;
     if ($2_1 >>> 0 < $4_1 >>> 0) {
      continue label$10
     }
     break label$2;
    };
   }
   label$11 : {
    if ($3_1 >>> 0 >= 4 >>> 0) {
     break label$11
    }
    $2_1 = $0_1;
    break label$2;
   }
   label$12 : {
    $4_1 = $3_1 + -4 | 0;
    if ($4_1 >>> 0 >= $0_1 >>> 0) {
     break label$12
    }
    $2_1 = $0_1;
    break label$2;
   }
   $2_1 = $0_1;
   label$13 : while (1) {
    HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    HEAP8[($2_1 + 1 | 0) >> 0] = HEAPU8[($1_1 + 1 | 0) >> 0] | 0;
    HEAP8[($2_1 + 2 | 0) >> 0] = HEAPU8[($1_1 + 2 | 0) >> 0] | 0;
    HEAP8[($2_1 + 3 | 0) >> 0] = HEAPU8[($1_1 + 3 | 0) >> 0] | 0;
    $1_1 = $1_1 + 4 | 0;
    $2_1 = $2_1 + 4 | 0;
    if ($2_1 >>> 0 <= $4_1 >>> 0) {
     continue label$13
    }
    break label$13;
   };
  }
  label$14 : {
   if ($2_1 >>> 0 >= $3_1 >>> 0) {
    break label$14
   }
   label$15 : while (1) {
    HEAP8[$2_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    $1_1 = $1_1 + 1 | 0;
    $2_1 = $2_1 + 1 | 0;
    if (($2_1 | 0) != ($3_1 | 0)) {
     continue label$15
    }
    break label$15;
   };
  }
  return $0_1 | 0;
 }
 
 function $41($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0;
  label$1 : {
   if (($0_1 | 0) == ($1_1 | 0)) {
    break label$1
   }
   label$2 : {
    $3_1 = $0_1 + $2_1 | 0;
    if (($1_1 - $3_1 | 0) >>> 0 > (0 - ($2_1 << 1 | 0) | 0) >>> 0) {
     break label$2
    }
    return $40($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0 | 0;
   }
   $4_1 = ($1_1 ^ $0_1 | 0) & 3 | 0;
   label$3 : {
    label$4 : {
     label$5 : {
      if ($0_1 >>> 0 >= $1_1 >>> 0) {
       break label$5
      }
      label$6 : {
       if (!$4_1) {
        break label$6
       }
       $3_1 = $0_1;
       break label$3;
      }
      label$7 : {
       if ($0_1 & 3 | 0) {
        break label$7
       }
       $3_1 = $0_1;
       break label$4;
      }
      $3_1 = $0_1;
      label$8 : while (1) {
       if (!$2_1) {
        break label$1
       }
       HEAP8[$3_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
       $1_1 = $1_1 + 1 | 0;
       $2_1 = $2_1 + -1 | 0;
       $3_1 = $3_1 + 1 | 0;
       if (!($3_1 & 3 | 0)) {
        break label$4
       }
       continue label$8;
      };
     }
     label$9 : {
      if ($4_1) {
       break label$9
      }
      label$10 : {
       if (!($3_1 & 3 | 0)) {
        break label$10
       }
       label$11 : while (1) {
        if (!$2_1) {
         break label$1
        }
        $2_1 = $2_1 + -1 | 0;
        $3_1 = $0_1 + $2_1 | 0;
        HEAP8[$3_1 >> 0] = HEAPU8[($1_1 + $2_1 | 0) >> 0] | 0;
        if ($3_1 & 3 | 0) {
         continue label$11
        }
        break label$11;
       };
      }
      if ($2_1 >>> 0 <= 3 >>> 0) {
       break label$9
      }
      label$12 : while (1) {
       $2_1 = $2_1 + -4 | 0;
       HEAP32[($0_1 + $2_1 | 0) >> 2] = HEAP32[($1_1 + $2_1 | 0) >> 2] | 0;
       if ($2_1 >>> 0 > 3 >>> 0) {
        continue label$12
       }
       break label$12;
      };
     }
     if (!$2_1) {
      break label$1
     }
     label$13 : while (1) {
      $2_1 = $2_1 + -1 | 0;
      HEAP8[($0_1 + $2_1 | 0) >> 0] = HEAPU8[($1_1 + $2_1 | 0) >> 0] | 0;
      if ($2_1) {
       continue label$13
      }
      break label$1;
     };
    }
    if ($2_1 >>> 0 <= 3 >>> 0) {
     break label$3
    }
    label$14 : while (1) {
     HEAP32[$3_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
     $1_1 = $1_1 + 4 | 0;
     $3_1 = $3_1 + 4 | 0;
     $2_1 = $2_1 + -4 | 0;
     if ($2_1 >>> 0 > 3 >>> 0) {
      continue label$14
     }
     break label$14;
    };
   }
   if (!$2_1) {
    break label$1
   }
   label$15 : while (1) {
    HEAP8[$3_1 >> 0] = HEAPU8[$1_1 >> 0] | 0;
    $3_1 = $3_1 + 1 | 0;
    $1_1 = $1_1 + 1 | 0;
    $2_1 = $2_1 + -1 | 0;
    if ($2_1) {
     continue label$15
    }
    break label$15;
   };
  }
  return $0_1 | 0;
 }
 
 function $42($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, i64toi32_i32$0 = 0, $4_1 = 0, i64toi32_i32$1 = 0, $6_1 = 0, $5_1 = 0, $6$hi = 0;
  label$1 : {
   if (!$2_1) {
    break label$1
   }
   HEAP8[$0_1 >> 0] = $1_1;
   $3_1 = $0_1 + $2_1 | 0;
   HEAP8[($3_1 + -1 | 0) >> 0] = $1_1;
   if ($2_1 >>> 0 < 3 >>> 0) {
    break label$1
   }
   HEAP8[($0_1 + 2 | 0) >> 0] = $1_1;
   HEAP8[($0_1 + 1 | 0) >> 0] = $1_1;
   HEAP8[($3_1 + -3 | 0) >> 0] = $1_1;
   HEAP8[($3_1 + -2 | 0) >> 0] = $1_1;
   if ($2_1 >>> 0 < 7 >>> 0) {
    break label$1
   }
   HEAP8[($0_1 + 3 | 0) >> 0] = $1_1;
   HEAP8[($3_1 + -4 | 0) >> 0] = $1_1;
   if ($2_1 >>> 0 < 9 >>> 0) {
    break label$1
   }
   $4_1 = (0 - $0_1 | 0) & 3 | 0;
   $3_1 = $0_1 + $4_1 | 0;
   $1_1 = Math_imul($1_1 & 255 | 0, 16843009);
   HEAP32[$3_1 >> 2] = $1_1;
   $4_1 = ($2_1 - $4_1 | 0) & -4 | 0;
   $2_1 = $3_1 + $4_1 | 0;
   HEAP32[($2_1 + -4 | 0) >> 2] = $1_1;
   if ($4_1 >>> 0 < 9 >>> 0) {
    break label$1
   }
   HEAP32[($3_1 + 8 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 4 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -8 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -12 | 0) >> 2] = $1_1;
   if ($4_1 >>> 0 < 25 >>> 0) {
    break label$1
   }
   HEAP32[($3_1 + 24 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 20 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 16 | 0) >> 2] = $1_1;
   HEAP32[($3_1 + 12 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -16 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -20 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -24 | 0) >> 2] = $1_1;
   HEAP32[($2_1 + -28 | 0) >> 2] = $1_1;
   $5_1 = $3_1 & 4 | 0 | 24 | 0;
   $2_1 = $4_1 - $5_1 | 0;
   if ($2_1 >>> 0 < 32 >>> 0) {
    break label$1
   }
   i64toi32_i32$0 = 0;
   i64toi32_i32$1 = 1;
   i64toi32_i32$1 = __wasm_i64_mul($1_1 | 0, i64toi32_i32$0 | 0, 1 | 0, i64toi32_i32$1 | 0) | 0;
   i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
   $6_1 = i64toi32_i32$1;
   $6$hi = i64toi32_i32$0;
   $1_1 = $3_1 + $5_1 | 0;
   label$2 : while (1) {
    i64toi32_i32$0 = $6$hi;
    i64toi32_i32$1 = $1_1;
    HEAP32[($1_1 + 24 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 28 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1_1;
    HEAP32[($1_1 + 16 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 20 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1_1;
    HEAP32[($1_1 + 8 | 0) >> 2] = $6_1;
    HEAP32[($1_1 + 12 | 0) >> 2] = i64toi32_i32$0;
    i64toi32_i32$1 = $1_1;
    HEAP32[$1_1 >> 2] = $6_1;
    HEAP32[($1_1 + 4 | 0) >> 2] = i64toi32_i32$0;
    $1_1 = $1_1 + 32 | 0;
    $2_1 = $2_1 + -32 | 0;
    if ($2_1 >>> 0 > 31 >>> 0) {
     continue label$2
    }
    break label$2;
   };
  }
  return $0_1 | 0;
 }
 
 function $43($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0;
  $2_1 = global$0 - 16 | 0;
  global$0 = $2_1;
  HEAP32[($2_1 + 12 | 0) >> 2] = $1_1;
  $1_1 = $76(68744 | 0, $0_1 | 0, $1_1 | 0) | 0;
  global$0 = $2_1 + 16 | 0;
  return $1_1 | 0;
 }
 
 function $44($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0;
  $3_1 = global$0 - 16 | 0;
  global$0 = $3_1;
  HEAP32[($3_1 + 12 | 0) >> 2] = $2_1;
  $2_1 = $82($0_1 | 0, $1_1 | 0, $2_1 | 0) | 0;
  global$0 = $3_1 + 16 | 0;
  return $2_1 | 0;
 }
 
 function $45($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $4_1 = 0, $3_1 = 0, $5_1 = 0, $8_1 = 0, $6_1 = 0, $7_1 = 0, $9_1 = 0;
  $3_1 = global$0 - 32 | 0;
  global$0 = $3_1;
  $4_1 = HEAP32[($0_1 + 28 | 0) >> 2] | 0;
  HEAP32[($3_1 + 16 | 0) >> 2] = $4_1;
  $5_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
  HEAP32[($3_1 + 28 | 0) >> 2] = $2_1;
  HEAP32[($3_1 + 24 | 0) >> 2] = $1_1;
  $1_1 = $5_1 - $4_1 | 0;
  HEAP32[($3_1 + 20 | 0) >> 2] = $1_1;
  $6_1 = $1_1 + $2_1 | 0;
  $4_1 = $3_1 + 16 | 0;
  $7_1 = 2;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       if (!($83(fimport$3(HEAP32[($0_1 + 60 | 0) >> 2] | 0 | 0, $3_1 + 16 | 0 | 0, 2 | 0, $3_1 + 12 | 0 | 0) | 0 | 0) | 0)) {
        break label$5
       }
       $5_1 = $4_1;
       break label$4;
      }
      label$6 : while (1) {
       $1_1 = HEAP32[($3_1 + 12 | 0) >> 2] | 0;
       if (($6_1 | 0) == ($1_1 | 0)) {
        break label$3
       }
       label$7 : {
        if (($1_1 | 0) > (-1 | 0)) {
         break label$7
        }
        $5_1 = $4_1;
        break label$2;
       }
       $8_1 = HEAP32[($4_1 + 4 | 0) >> 2] | 0;
       $9_1 = $1_1 >>> 0 > $8_1 >>> 0;
       $5_1 = $4_1 + ($9_1 << 3 | 0) | 0;
       $8_1 = $1_1 - ($9_1 ? $8_1 : 0) | 0;
       HEAP32[$5_1 >> 2] = (HEAP32[$5_1 >> 2] | 0) + $8_1 | 0;
       $4_1 = $4_1 + ($9_1 ? 12 : 4) | 0;
       HEAP32[$4_1 >> 2] = (HEAP32[$4_1 >> 2] | 0) - $8_1 | 0;
       $6_1 = $6_1 - $1_1 | 0;
       $4_1 = $5_1;
       $7_1 = $7_1 - $9_1 | 0;
       if (!($83(fimport$3(HEAP32[($0_1 + 60 | 0) >> 2] | 0 | 0, $4_1 | 0, $7_1 | 0, $3_1 + 12 | 0 | 0) | 0 | 0) | 0)) {
        continue label$6
       }
       break label$6;
      };
     }
     if (($6_1 | 0) != (-1 | 0)) {
      break label$2
     }
    }
    $1_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
    HEAP32[($0_1 + 28 | 0) >> 2] = $1_1;
    HEAP32[($0_1 + 20 | 0) >> 2] = $1_1;
    HEAP32[($0_1 + 16 | 0) >> 2] = $1_1 + (HEAP32[($0_1 + 48 | 0) >> 2] | 0) | 0;
    $1_1 = $2_1;
    break label$1;
   }
   $1_1 = 0;
   HEAP32[($0_1 + 28 | 0) >> 2] = 0;
   HEAP32[($0_1 + 16 | 0) >> 2] = 0;
   HEAP32[($0_1 + 20 | 0) >> 2] = 0;
   HEAP32[$0_1 >> 2] = HEAP32[$0_1 >> 2] | 0 | 32 | 0;
   if (($7_1 | 0) == (2 | 0)) {
    break label$1
   }
   $1_1 = $2_1 - (HEAP32[($5_1 + 4 | 0) >> 2] | 0) | 0;
  }
  global$0 = $3_1 + 32 | 0;
  return $1_1 | 0;
 }
 
 function $46($0_1) {
  $0_1 = $0_1 | 0;
  return 0 | 0;
 }
 
 function $47($0_1, $1_1, $1$hi, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  i64toi32_i32$HIGH_BITS = 0;
  return 0 | 0;
 }
 
 function $48($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $52($0_1 + ($53($0_1 | 0) | 0) | 0 | 0, $1_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $49($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $0_1 = $50($0_1 | 0, $1_1 | 0) | 0;
  return ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($1_1 & 255 | 0 | 0) ? $0_1 : 0) | 0;
 }
 
 function $50($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $4_1 = 0, $3_1 = 0, $2_1 = 0;
  label$1 : {
   label$2 : {
    $2_1 = $1_1 & 255 | 0;
    if (!$2_1) {
     break label$2
    }
    label$3 : {
     if (!($0_1 & 3 | 0)) {
      break label$3
     }
     $3_1 = $1_1 & 255 | 0;
     label$4 : while (1) {
      $4_1 = HEAPU8[$0_1 >> 0] | 0;
      if (!$4_1) {
       break label$1
      }
      if (($4_1 | 0) == ($3_1 | 0)) {
       break label$1
      }
      $0_1 = $0_1 + 1 | 0;
      if ($0_1 & 3 | 0) {
       continue label$4
      }
      break label$4;
     };
    }
    label$5 : {
     $4_1 = HEAP32[$0_1 >> 2] | 0;
     if ((($4_1 ^ -1 | 0) & ($4_1 + -16843009 | 0) | 0) & -2139062144 | 0) {
      break label$5
     }
     $3_1 = Math_imul($2_1, 16843009);
     label$6 : while (1) {
      $4_1 = $4_1 ^ $3_1 | 0;
      if ((($4_1 ^ -1 | 0) & ($4_1 + -16843009 | 0) | 0) & -2139062144 | 0) {
       break label$5
      }
      $4_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
      $0_1 = $0_1 + 4 | 0;
      if (!((($4_1 ^ -1 | 0) & ($4_1 + -16843009 | 0) | 0) & -2139062144 | 0)) {
       continue label$6
      }
      break label$6;
     };
    }
    $1_1 = $1_1 & 255 | 0;
    label$7 : {
     label$8 : while (1) {
      $4_1 = $0_1;
      $3_1 = HEAPU8[$4_1 >> 0] | 0;
      if (!$3_1) {
       break label$7
      }
      $0_1 = $4_1 + 1 | 0;
      if (($3_1 | 0) != ($1_1 | 0)) {
       continue label$8
      }
      break label$8;
     };
    }
    return $4_1 | 0;
   }
   return $0_1 + ($53($0_1 | 0) | 0) | 0 | 0;
  }
  return $0_1 | 0;
 }
 
 function $51($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     if (!(($1_1 ^ $0_1 | 0) & 3 | 0)) {
      break label$3
     }
     $2_1 = HEAPU8[$1_1 >> 0] | 0;
     break label$2;
    }
    label$4 : {
     if (!($1_1 & 3 | 0)) {
      break label$4
     }
     label$5 : while (1) {
      $2_1 = HEAPU8[$1_1 >> 0] | 0;
      HEAP8[$0_1 >> 0] = $2_1;
      if (!$2_1) {
       break label$1
      }
      $0_1 = $0_1 + 1 | 0;
      $1_1 = $1_1 + 1 | 0;
      if ($1_1 & 3 | 0) {
       continue label$5
      }
      break label$5;
     };
    }
    $2_1 = HEAP32[$1_1 >> 2] | 0;
    if ((($2_1 ^ -1 | 0) & ($2_1 + -16843009 | 0) | 0) & -2139062144 | 0) {
     break label$2
    }
    label$6 : while (1) {
     HEAP32[$0_1 >> 2] = $2_1;
     $2_1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
     $0_1 = $0_1 + 4 | 0;
     $1_1 = $1_1 + 4 | 0;
     if (!((($2_1 ^ -1 | 0) & ($2_1 + -16843009 | 0) | 0) & -2139062144 | 0)) {
      continue label$6
     }
     break label$6;
    };
   }
   HEAP8[$0_1 >> 0] = $2_1;
   if (!($2_1 & 255 | 0)) {
    break label$1
   }
   label$7 : while (1) {
    $2_1 = HEAPU8[($1_1 + 1 | 0) >> 0] | 0;
    HEAP8[($0_1 + 1 | 0) >> 0] = $2_1;
    $0_1 = $0_1 + 1 | 0;
    $1_1 = $1_1 + 1 | 0;
    if ($2_1) {
     continue label$7
    }
    break label$7;
   };
  }
  return $0_1 | 0;
 }
 
 function $52($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $51($0_1 | 0, $1_1 | 0) | 0;
  return $0_1 | 0;
 }
 
 function $53($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $2_1 = 0, $3_1 = 0;
  $1_1 = $0_1;
  label$1 : {
   label$2 : {
    if (!($1_1 & 3 | 0)) {
     break label$2
    }
    label$3 : {
     if (HEAPU8[$1_1 >> 0] | 0) {
      break label$3
     }
     return $1_1 - $1_1 | 0 | 0;
    }
    $1_1 = $0_1;
    label$4 : while (1) {
     $1_1 = $1_1 + 1 | 0;
     if (!($1_1 & 3 | 0)) {
      break label$2
     }
     if (HEAPU8[$1_1 >> 0] | 0) {
      continue label$4
     }
     break label$1;
    };
   }
   label$5 : while (1) {
    $2_1 = $1_1;
    $1_1 = $1_1 + 4 | 0;
    $3_1 = HEAP32[$2_1 >> 2] | 0;
    if (!((($3_1 ^ -1 | 0) & ($3_1 + -16843009 | 0) | 0) & -2139062144 | 0)) {
     continue label$5
    }
    break label$5;
   };
   label$6 : while (1) {
    $1_1 = $2_1;
    $2_1 = $1_1 + 1 | 0;
    if (HEAPU8[$1_1 >> 0] | 0) {
     continue label$6
    }
    break label$6;
   };
  }
  return $1_1 - $0_1 | 0 | 0;
 }
 
 function $54($0_1) {
  $0_1 = $0_1 | 0;
  return 1 | 0;
 }
 
 function $55($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $56($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $57($0_1) {
  $0_1 = $0_1 | 0;
 }
 
 function $58() {
  $56(69928 | 0);
  return 69932 | 0;
 }
 
 function $59() {
  $57(69928 | 0);
 }
 
 function $60($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = HEAP32[($0_1 + 72 | 0) >> 2] | 0;
  HEAP32[($0_1 + 72 | 0) >> 2] = $1_1 + -1 | 0 | $1_1 | 0;
  label$1 : {
   $1_1 = HEAP32[$0_1 >> 2] | 0;
   if (!($1_1 & 8 | 0)) {
    break label$1
   }
   HEAP32[$0_1 >> 2] = $1_1 | 32 | 0;
   return -1 | 0;
  }
  HEAP32[($0_1 + 4 | 0) >> 2] = 0;
  HEAP32[($0_1 + 8 | 0) >> 2] = 0;
  $1_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
  HEAP32[($0_1 + 28 | 0) >> 2] = $1_1;
  HEAP32[($0_1 + 20 | 0) >> 2] = $1_1;
  HEAP32[($0_1 + 16 | 0) >> 2] = $1_1 + (HEAP32[($0_1 + 48 | 0) >> 2] | 0) | 0;
  return 0 | 0;
 }
 
 function $61($0_1) {
  $0_1 = $0_1 | 0;
  return ($0_1 + -48 | 0) >>> 0 < 10 >>> 0 | 0;
 }
 
 function $62($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0;
  $3_1 = ($2_1 | 0) != (0 | 0);
  label$1 : {
   label$2 : {
    label$3 : {
     if (!($0_1 & 3 | 0)) {
      break label$3
     }
     if (!$2_1) {
      break label$3
     }
     $4_1 = $1_1 & 255 | 0;
     label$4 : while (1) {
      if ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($4_1 | 0)) {
       break label$2
      }
      $2_1 = $2_1 + -1 | 0;
      $3_1 = ($2_1 | 0) != (0 | 0);
      $0_1 = $0_1 + 1 | 0;
      if (!($0_1 & 3 | 0)) {
       break label$3
      }
      if ($2_1) {
       continue label$4
      }
      break label$4;
     };
    }
    if (!$3_1) {
     break label$1
    }
    label$5 : {
     if ((HEAPU8[$0_1 >> 0] | 0 | 0) == ($1_1 & 255 | 0 | 0)) {
      break label$5
     }
     if ($2_1 >>> 0 < 4 >>> 0) {
      break label$5
     }
     $4_1 = Math_imul($1_1 & 255 | 0, 16843009);
     label$6 : while (1) {
      $3_1 = (HEAP32[$0_1 >> 2] | 0) ^ $4_1 | 0;
      if ((($3_1 ^ -1 | 0) & ($3_1 + -16843009 | 0) | 0) & -2139062144 | 0) {
       break label$2
      }
      $0_1 = $0_1 + 4 | 0;
      $2_1 = $2_1 + -4 | 0;
      if ($2_1 >>> 0 > 3 >>> 0) {
       continue label$6
      }
      break label$6;
     };
    }
    if (!$2_1) {
     break label$1
    }
   }
   $3_1 = $1_1 & 255 | 0;
   label$7 : while (1) {
    label$8 : {
     if ((HEAPU8[$0_1 >> 0] | 0 | 0) != ($3_1 | 0)) {
      break label$8
     }
     return $0_1 | 0;
    }
    $0_1 = $0_1 + 1 | 0;
    $2_1 = $2_1 + -1 | 0;
    if ($2_1) {
     continue label$7
    }
    break label$7;
   };
  }
  return 0 | 0;
 }
 
 function $63($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var $2_1 = 0;
  $2_1 = $62($0_1 | 0, 0 | 0, $1_1 | 0) | 0;
  return ($2_1 ? $2_1 - $0_1 | 0 : $1_1) | 0;
 }
 
 function $64() {
  return 69940 | 0;
 }
 
 function $65($0_1, $1_1) {
  $0_1 = +$0_1;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $3_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, $2_1 = 0, $10_1 = 0, $2$hi = 0;
  label$1 : {
   wasm2js_scratch_store_f64(+$0_1);
   i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
   $2_1 = wasm2js_scratch_load_i32(0 | 0) | 0;
   $2$hi = i64toi32_i32$0;
   i64toi32_i32$2 = $2_1;
   i64toi32_i32$1 = 0;
   i64toi32_i32$3 = 52;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$1 = 0;
    $10_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    $10_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
   }
   $3_1 = $10_1 & 2047 | 0;
   if (($3_1 | 0) == (2047 | 0)) {
    break label$1
   }
   label$2 : {
    if ($3_1) {
     break label$2
    }
    label$3 : {
     label$4 : {
      if ($0_1 != 0.0) {
       break label$4
      }
      $3_1 = 0;
      break label$3;
     }
     $0_1 = +$65(+($0_1 * 18446744073709551615.0), $1_1 | 0);
     $3_1 = (HEAP32[$1_1 >> 2] | 0) + -64 | 0;
    }
    HEAP32[$1_1 >> 2] = $3_1;
    return +$0_1;
   }
   HEAP32[$1_1 >> 2] = $3_1 + -1022 | 0;
   i64toi32_i32$1 = $2$hi;
   i64toi32_i32$0 = $2_1;
   i64toi32_i32$2 = -2146435073;
   i64toi32_i32$3 = -1;
   i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
   i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$3 | 0;
   i64toi32_i32$0 = 1071644672;
   i64toi32_i32$3 = 0;
   i64toi32_i32$0 = i64toi32_i32$2 | i64toi32_i32$0 | 0;
   wasm2js_scratch_store_i32(0 | 0, i64toi32_i32$1 | i64toi32_i32$3 | 0 | 0);
   wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$0 | 0);
   $0_1 = +wasm2js_scratch_load_f64();
  }
  return +$0_1;
 }
 
 function $66($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $4_1 = 0, $5_1 = 0;
  label$1 : {
   label$2 : {
    $3_1 = HEAP32[($2_1 + 16 | 0) >> 2] | 0;
    if ($3_1) {
     break label$2
    }
    $4_1 = 0;
    if ($60($2_1 | 0) | 0) {
     break label$1
    }
    $3_1 = HEAP32[($2_1 + 16 | 0) >> 2] | 0;
   }
   label$3 : {
    $4_1 = HEAP32[($2_1 + 20 | 0) >> 2] | 0;
    if (($3_1 - $4_1 | 0) >>> 0 >= $1_1 >>> 0) {
     break label$3
    }
    return FUNCTION_TABLE[HEAP32[($2_1 + 36 | 0) >> 2] | 0 | 0]($2_1, $0_1, $1_1) | 0 | 0;
   }
   label$4 : {
    label$5 : {
     if ((HEAP32[($2_1 + 80 | 0) >> 2] | 0 | 0) < (0 | 0)) {
      break label$5
     }
     if (!$1_1) {
      break label$5
     }
     $3_1 = $1_1;
     label$6 : {
      label$7 : while (1) {
       $5_1 = $0_1 + $3_1 | 0;
       if ((HEAPU8[($5_1 + -1 | 0) >> 0] | 0 | 0) == (10 | 0)) {
        break label$6
       }
       $3_1 = $3_1 + -1 | 0;
       if (!$3_1) {
        break label$5
       }
       continue label$7;
      };
     }
     $4_1 = FUNCTION_TABLE[HEAP32[($2_1 + 36 | 0) >> 2] | 0 | 0]($2_1, $0_1, $3_1) | 0;
     if ($4_1 >>> 0 < $3_1 >>> 0) {
      break label$1
     }
     $1_1 = $1_1 - $3_1 | 0;
     $4_1 = HEAP32[($2_1 + 20 | 0) >> 2] | 0;
     break label$4;
    }
    $5_1 = $0_1;
    $3_1 = 0;
   }
   $40($4_1 | 0, $5_1 | 0, $1_1 | 0) | 0;
   HEAP32[($2_1 + 20 | 0) >> 2] = (HEAP32[($2_1 + 20 | 0) >> 2] | 0) + $1_1 | 0;
   $4_1 = $3_1 + $1_1 | 0;
  }
  return $4_1 | 0;
 }
 
 function $67($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0, i64toi32_i32$0 = 0, $8_1 = 0, $6_1 = 0, $7_1 = 0;
  $5_1 = global$0 - 208 | 0;
  global$0 = $5_1;
  HEAP32[($5_1 + 204 | 0) >> 2] = $2_1;
  $42($5_1 + 160 | 0 | 0, 0 | 0, 40 | 0) | 0;
  HEAP32[($5_1 + 200 | 0) >> 2] = HEAP32[($5_1 + 204 | 0) >> 2] | 0;
  label$1 : {
   label$2 : {
    if (($68(0 | 0, $1_1 | 0, $5_1 + 200 | 0 | 0, $5_1 + 80 | 0 | 0, $5_1 + 160 | 0 | 0, $3_1 | 0, $4_1 | 0) | 0 | 0) >= (0 | 0)) {
     break label$2
    }
    $4_1 = -1;
    break label$1;
   }
   label$3 : {
    label$4 : {
     if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) >= (0 | 0)) {
      break label$4
     }
     $6_1 = 1;
     break label$3;
    }
    $6_1 = !($54($0_1 | 0) | 0);
   }
   $7_1 = HEAP32[$0_1 >> 2] | 0;
   HEAP32[$0_1 >> 2] = $7_1 & -33 | 0;
   label$5 : {
    label$6 : {
     label$7 : {
      label$8 : {
       if (HEAP32[($0_1 + 48 | 0) >> 2] | 0) {
        break label$8
       }
       HEAP32[($0_1 + 48 | 0) >> 2] = 80;
       HEAP32[($0_1 + 28 | 0) >> 2] = 0;
       i64toi32_i32$0 = 0;
       HEAP32[($0_1 + 16 | 0) >> 2] = 0;
       HEAP32[($0_1 + 20 | 0) >> 2] = i64toi32_i32$0;
       $8_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
       HEAP32[($0_1 + 44 | 0) >> 2] = $5_1;
       break label$7;
      }
      $8_1 = 0;
      if (HEAP32[($0_1 + 16 | 0) >> 2] | 0) {
       break label$6
      }
     }
     $2_1 = -1;
     if ($60($0_1 | 0) | 0) {
      break label$5
     }
    }
    $2_1 = $68($0_1 | 0, $1_1 | 0, $5_1 + 200 | 0 | 0, $5_1 + 80 | 0 | 0, $5_1 + 160 | 0 | 0, $3_1 | 0, $4_1 | 0) | 0;
   }
   $4_1 = $7_1 & 32 | 0;
   label$9 : {
    if (!$8_1) {
     break label$9
    }
    FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0 | 0]($0_1, 0, 0) | 0;
    HEAP32[($0_1 + 48 | 0) >> 2] = 0;
    HEAP32[($0_1 + 44 | 0) >> 2] = $8_1;
    HEAP32[($0_1 + 28 | 0) >> 2] = 0;
    $3_1 = HEAP32[($0_1 + 20 | 0) >> 2] | 0;
    i64toi32_i32$0 = 0;
    HEAP32[($0_1 + 16 | 0) >> 2] = 0;
    HEAP32[($0_1 + 20 | 0) >> 2] = i64toi32_i32$0;
    $2_1 = $3_1 ? $2_1 : -1;
   }
   $3_1 = HEAP32[$0_1 >> 2] | 0;
   HEAP32[$0_1 >> 2] = $3_1 | $4_1 | 0;
   $4_1 = $3_1 & 32 | 0 ? -1 : $2_1;
   if ($6_1) {
    break label$1
   }
   $55($0_1 | 0);
  }
  global$0 = $5_1 + 208 | 0;
  return $4_1 | 0;
 }
 
 function $68($0_1, $1_1, $2_1, $3_1, $4_1, $5_1, $6_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  $6_1 = $6_1 | 0;
  var $14_1 = 0, $7_1 = 0, $17_1 = 0, $22_1 = 0, i64toi32_i32$1 = 0, $19_1 = 0, $16_1 = 0, $20_1 = 0, $15_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, $13_1 = 0, $18_1 = 0, $21_1 = 0, $24_1 = 0, i64toi32_i32$3 = 0, i64toi32_i32$5 = 0, $11_1 = 0, $26_1 = 0, $12_1 = 0, $27_1 = 0, $27$hi = 0, $23_1 = 0, $25_1 = 0, $8_1 = 0, $9_1 = 0, $35_1 = 0, $36_1 = 0, $37_1 = 0, $10_1 = 0, $276 = 0;
  $7_1 = global$0 - 80 | 0;
  global$0 = $7_1;
  HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
  $8_1 = $4_1 + -192 | 0;
  $9_1 = $3_1 + -384 | 0;
  $10_1 = $7_1 + 55 | 0;
  $11_1 = $7_1 + 56 | 0;
  $12_1 = 0;
  $13_1 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : while (1) {
       $14_1 = 0;
       label$6 : while (1) {
        $15_1 = $1_1;
        if (($14_1 | 0) > ($13_1 ^ 2147483647 | 0 | 0)) {
         break label$4
        }
        $13_1 = $14_1 + $13_1 | 0;
        $14_1 = $1_1;
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             $16_1 = HEAPU8[$14_1 >> 0] | 0;
             if (!$16_1) {
              break label$11
             }
             label$12 : while (1) {
              label$13 : {
               label$14 : {
                label$15 : {
                 $16_1 = $16_1 & 255 | 0;
                 if ($16_1) {
                  break label$15
                 }
                 $1_1 = $14_1;
                 break label$14;
                }
                if (($16_1 | 0) != (37 | 0)) {
                 break label$13
                }
                $16_1 = $14_1;
                label$16 : while (1) {
                 label$17 : {
                  if ((HEAPU8[($16_1 + 1 | 0) >> 0] | 0 | 0) == (37 | 0)) {
                   break label$17
                  }
                  $1_1 = $16_1;
                  break label$14;
                 }
                 $14_1 = $14_1 + 1 | 0;
                 $17_1 = HEAPU8[($16_1 + 2 | 0) >> 0] | 0;
                 $1_1 = $16_1 + 2 | 0;
                 $16_1 = $1_1;
                 if (($17_1 | 0) == (37 | 0)) {
                  continue label$16
                 }
                 break label$16;
                };
               }
               $14_1 = $14_1 - $15_1 | 0;
               $16_1 = $13_1 ^ 2147483647 | 0;
               if (($14_1 | 0) > ($16_1 | 0)) {
                break label$4
               }
               label$18 : {
                if (!$0_1) {
                 break label$18
                }
                $69($0_1 | 0, $15_1 | 0, $14_1 | 0);
               }
               if ($14_1) {
                continue label$6
               }
               HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
               $14_1 = $1_1 + 1 | 0;
               $18_1 = -1;
               label$19 : {
                if (!($61(HEAP8[($1_1 + 1 | 0) >> 0] | 0 | 0) | 0)) {
                 break label$19
                }
                if ((HEAPU8[($1_1 + 2 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                 break label$19
                }
                $14_1 = $1_1 + 3 | 0;
                $18_1 = (HEAP8[($1_1 + 1 | 0) >> 0] | 0) + -48 | 0;
                $12_1 = 1;
               }
               HEAP32[($7_1 + 76 | 0) >> 2] = $14_1;
               $19_1 = 0;
               label$20 : {
                label$21 : {
                 $20_1 = HEAP8[$14_1 >> 0] | 0;
                 $1_1 = $20_1 + -32 | 0;
                 if ($1_1 >>> 0 <= 31 >>> 0) {
                  break label$21
                 }
                 $17_1 = $14_1;
                 break label$20;
                }
                $19_1 = 0;
                $17_1 = $14_1;
                $1_1 = 1 << $1_1 | 0;
                if (!($1_1 & 75913 | 0)) {
                 break label$20
                }
                label$22 : while (1) {
                 $17_1 = $14_1 + 1 | 0;
                 HEAP32[($7_1 + 76 | 0) >> 2] = $17_1;
                 $19_1 = $1_1 | $19_1 | 0;
                 $20_1 = HEAP8[($14_1 + 1 | 0) >> 0] | 0;
                 $1_1 = $20_1 + -32 | 0;
                 if ($1_1 >>> 0 >= 32 >>> 0) {
                  break label$20
                 }
                 $14_1 = $17_1;
                 $1_1 = 1 << $1_1 | 0;
                 if ($1_1 & 75913 | 0) {
                  continue label$22
                 }
                 break label$22;
                };
               }
               label$23 : {
                label$24 : {
                 if (($20_1 | 0) != (42 | 0)) {
                  break label$24
                 }
                 $20_1 = $17_1 + 1 | 0;
                 label$25 : {
                  label$26 : {
                   if (!($61(HEAP8[($17_1 + 1 | 0) >> 0] | 0 | 0) | 0)) {
                    break label$26
                   }
                   if ((HEAPU8[($17_1 + 2 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                    break label$26
                   }
                   $14_1 = HEAP8[$20_1 >> 0] | 0;
                   label$27 : {
                    label$28 : {
                     if ($0_1) {
                      break label$28
                     }
                     HEAP32[($8_1 + ($14_1 << 2 | 0) | 0) >> 2] = 10;
                     $21_1 = 0;
                     break label$27;
                    }
                    $21_1 = HEAP32[($9_1 + ($14_1 << 3 | 0) | 0) >> 2] | 0;
                   }
                   $20_1 = $17_1 + 3 | 0;
                   $12_1 = 1;
                   break label$25;
                  }
                  if ($12_1) {
                   break label$10
                  }
                  label$29 : {
                   if ($0_1) {
                    break label$29
                   }
                   HEAP32[($7_1 + 76 | 0) >> 2] = $20_1;
                   $12_1 = 0;
                   $21_1 = 0;
                   break label$23;
                  }
                  $14_1 = HEAP32[$2_1 >> 2] | 0;
                  HEAP32[$2_1 >> 2] = $14_1 + 4 | 0;
                  $21_1 = HEAP32[$14_1 >> 2] | 0;
                  $12_1 = 0;
                 }
                 HEAP32[($7_1 + 76 | 0) >> 2] = $20_1;
                 if (($21_1 | 0) > (-1 | 0)) {
                  break label$23
                 }
                 $21_1 = 0 - $21_1 | 0;
                 $19_1 = $19_1 | 8192 | 0;
                 break label$23;
                }
                $21_1 = $70($7_1 + 76 | 0 | 0) | 0;
                if (($21_1 | 0) < (0 | 0)) {
                 break label$4
                }
                $20_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
               }
               $14_1 = 0;
               $22_1 = -1;
               label$30 : {
                label$31 : {
                 if ((HEAPU8[$20_1 >> 0] | 0 | 0) == (46 | 0)) {
                  break label$31
                 }
                 $1_1 = $20_1;
                 $23_1 = 0;
                 break label$30;
                }
                label$32 : {
                 if ((HEAPU8[($20_1 + 1 | 0) >> 0] | 0 | 0) != (42 | 0)) {
                  break label$32
                 }
                 $1_1 = $20_1 + 2 | 0;
                 label$33 : {
                  label$34 : {
                   if (!($61(HEAP8[($20_1 + 2 | 0) >> 0] | 0 | 0) | 0)) {
                    break label$34
                   }
                   if ((HEAPU8[($20_1 + 3 | 0) >> 0] | 0 | 0) != (36 | 0)) {
                    break label$34
                   }
                   $17_1 = HEAP8[$1_1 >> 0] | 0;
                   label$35 : {
                    label$36 : {
                     if ($0_1) {
                      break label$36
                     }
                     HEAP32[($8_1 + ($17_1 << 2 | 0) | 0) >> 2] = 10;
                     $22_1 = 0;
                     break label$35;
                    }
                    $22_1 = HEAP32[($9_1 + ($17_1 << 3 | 0) | 0) >> 2] | 0;
                   }
                   $1_1 = $20_1 + 4 | 0;
                   break label$33;
                  }
                  if ($12_1) {
                   break label$10
                  }
                  label$37 : {
                   if ($0_1) {
                    break label$37
                   }
                   $22_1 = 0;
                   break label$33;
                  }
                  $17_1 = HEAP32[$2_1 >> 2] | 0;
                  HEAP32[$2_1 >> 2] = $17_1 + 4 | 0;
                  $22_1 = HEAP32[$17_1 >> 2] | 0;
                 }
                 HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
                 $23_1 = ($22_1 | 0) > (-1 | 0);
                 break label$30;
                }
                HEAP32[($7_1 + 76 | 0) >> 2] = $20_1 + 1 | 0;
                $23_1 = 1;
                $22_1 = $70($7_1 + 76 | 0 | 0) | 0;
                $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
               }
               label$38 : while (1) {
                $17_1 = $14_1;
                $24_1 = 28;
                $20_1 = $1_1;
                $14_1 = HEAP8[$1_1 >> 0] | 0;
                if (($14_1 + -123 | 0) >>> 0 < -58 >>> 0) {
                 break label$3
                }
                $1_1 = $1_1 + 1 | 0;
                $14_1 = HEAPU8[(($14_1 + Math_imul($17_1, 58) | 0) + 68191 | 0) >> 0] | 0;
                if (($14_1 + -1 | 0) >>> 0 < 8 >>> 0) {
                 continue label$38
                }
                break label$38;
               };
               HEAP32[($7_1 + 76 | 0) >> 2] = $1_1;
               label$39 : {
                label$40 : {
                 if (($14_1 | 0) == (27 | 0)) {
                  break label$40
                 }
                 if (!$14_1) {
                  break label$3
                 }
                 label$41 : {
                  if (($18_1 | 0) < (0 | 0)) {
                   break label$41
                  }
                  label$42 : {
                   if ($0_1) {
                    break label$42
                   }
                   HEAP32[($4_1 + ($18_1 << 2 | 0) | 0) >> 2] = $14_1;
                   continue label$5;
                  }
                  i64toi32_i32$2 = $3_1 + ($18_1 << 3 | 0) | 0;
                  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
                  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
                  $276 = i64toi32_i32$0;
                  i64toi32_i32$0 = $7_1;
                  HEAP32[($7_1 + 64 | 0) >> 2] = $276;
                  HEAP32[($7_1 + 68 | 0) >> 2] = i64toi32_i32$1;
                  break label$39;
                 }
                 if (!$0_1) {
                  break label$7
                 }
                 $71($7_1 + 64 | 0 | 0, $14_1 | 0, $2_1 | 0, $6_1 | 0);
                 break label$39;
                }
                if (($18_1 | 0) > (-1 | 0)) {
                 break label$3
                }
                $14_1 = 0;
                if (!$0_1) {
                 continue label$6
                }
               }
               if ((HEAPU8[$0_1 >> 0] | 0) & 32 | 0) {
                break label$2
               }
               $25_1 = $19_1 & -65537 | 0;
               $19_1 = $19_1 & 8192 | 0 ? $25_1 : $19_1;
               $18_1 = 0;
               $26_1 = 65545;
               $24_1 = $11_1;
               label$43 : {
                label$44 : {
                 label$45 : {
                  label$46 : {
                   label$47 : {
                    label$48 : {
                     label$49 : {
                      label$50 : {
                       label$51 : {
                        label$52 : {
                         label$53 : {
                          label$54 : {
                           label$55 : {
                            label$56 : {
                             label$57 : {
                              label$58 : {
                               $14_1 = HEAP8[$20_1 >> 0] | 0;
                               $14_1 = $17_1 ? (($14_1 & 15 | 0 | 0) == (3 | 0) ? $14_1 & -45 | 0 : $14_1) : $14_1;
                               switch ($14_1 + -88 | 0 | 0) {
                               case 11:
                                break label$43;
                               case 9:
                               case 13:
                               case 14:
                               case 15:
                                break label$44;
                               case 27:
                                break label$49;
                               case 12:
                               case 17:
                                break label$52;
                               case 23:
                                break label$53;
                               case 0:
                               case 32:
                                break label$54;
                               case 24:
                                break label$55;
                               case 22:
                                break label$56;
                               case 29:
                                break label$57;
                               case 1:
                               case 2:
                               case 3:
                               case 4:
                               case 5:
                               case 6:
                               case 7:
                               case 8:
                               case 10:
                               case 16:
                               case 18:
                               case 19:
                               case 20:
                               case 21:
                               case 25:
                               case 26:
                               case 28:
                               case 30:
                               case 31:
                                break label$8;
                               default:
                                break label$58;
                               };
                              }
                              $24_1 = $11_1;
                              label$59 : {
                               switch ($14_1 + -65 | 0 | 0) {
                               case 0:
                               case 4:
                               case 5:
                               case 6:
                                break label$44;
                               case 2:
                                break label$47;
                               case 1:
                               case 3:
                                break label$8;
                               default:
                                break label$59;
                               };
                              }
                              if (($14_1 | 0) == (83 | 0)) {
                               break label$48
                              }
                              break label$9;
                             }
                             $18_1 = 0;
                             $26_1 = 65545;
                             i64toi32_i32$2 = $7_1;
                             i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                             i64toi32_i32$0 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                             $27_1 = i64toi32_i32$1;
                             $27$hi = i64toi32_i32$0;
                             break label$51;
                            }
                            $14_1 = 0;
                            label$60 : {
                             switch ($17_1 & 255 | 0 | 0) {
                             case 0:
                              HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $13_1;
                              continue label$6;
                             case 1:
                              HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $13_1;
                              continue label$6;
                             case 2:
                              i64toi32_i32$1 = $13_1;
                              i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
                              i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                              HEAP32[i64toi32_i32$1 >> 2] = $13_1;
                              HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
                              continue label$6;
                             case 3:
                              HEAP16[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 1] = $13_1;
                              continue label$6;
                             case 4:
                              HEAP8[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 0] = $13_1;
                              continue label$6;
                             case 6:
                              HEAP32[(HEAP32[($7_1 + 64 | 0) >> 2] | 0) >> 2] = $13_1;
                              continue label$6;
                             case 7:
                              break label$60;
                             default:
                              continue label$6;
                             };
                            }
                            i64toi32_i32$1 = $13_1;
                            i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
                            i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                            HEAP32[i64toi32_i32$1 >> 2] = $13_1;
                            HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
                            continue label$6;
                           }
                           $22_1 = $22_1 >>> 0 > 8 >>> 0 ? $22_1 : 8;
                           $19_1 = $19_1 | 8 | 0;
                           $14_1 = 120;
                          }
                          i64toi32_i32$2 = $7_1;
                          i64toi32_i32$0 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                          i64toi32_i32$1 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                          $15_1 = $72(i64toi32_i32$0 | 0, i64toi32_i32$1 | 0, $11_1 | 0, $14_1 & 32 | 0 | 0) | 0;
                          $18_1 = 0;
                          $26_1 = 65545;
                          i64toi32_i32$2 = $7_1;
                          i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                          i64toi32_i32$0 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                          if (!(i64toi32_i32$1 | i64toi32_i32$0 | 0)) {
                           break label$50
                          }
                          if (!($19_1 & 8 | 0)) {
                           break label$50
                          }
                          $26_1 = ($14_1 >>> 4 | 0) + 65545 | 0;
                          $18_1 = 2;
                          break label$50;
                         }
                         $18_1 = 0;
                         $26_1 = 65545;
                         i64toi32_i32$2 = $7_1;
                         i64toi32_i32$0 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                         i64toi32_i32$1 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                         $15_1 = $73(i64toi32_i32$0 | 0, i64toi32_i32$1 | 0, $11_1 | 0) | 0;
                         if (!($19_1 & 8 | 0)) {
                          break label$50
                         }
                         $14_1 = $11_1 - $15_1 | 0;
                         $22_1 = ($22_1 | 0) > ($14_1 | 0) ? $22_1 : $14_1 + 1 | 0;
                         break label$50;
                        }
                        label$67 : {
                         i64toi32_i32$2 = $7_1;
                         i64toi32_i32$1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                         i64toi32_i32$0 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                         $27_1 = i64toi32_i32$1;
                         $27$hi = i64toi32_i32$0;
                         i64toi32_i32$2 = i64toi32_i32$1;
                         i64toi32_i32$1 = -1;
                         i64toi32_i32$3 = -1;
                         if ((i64toi32_i32$0 | 0) > (i64toi32_i32$1 | 0)) {
                          $35_1 = 1
                         } else {
                          if ((i64toi32_i32$0 | 0) >= (i64toi32_i32$1 | 0)) {
                           if (i64toi32_i32$2 >>> 0 <= i64toi32_i32$3 >>> 0) {
                            $36_1 = 0
                           } else {
                            $36_1 = 1
                           }
                           $37_1 = $36_1;
                          } else {
                           $37_1 = 0
                          }
                          $35_1 = $37_1;
                         }
                         if ($35_1) {
                          break label$67
                         }
                         i64toi32_i32$2 = $27$hi;
                         i64toi32_i32$2 = 0;
                         i64toi32_i32$3 = 0;
                         i64toi32_i32$0 = $27$hi;
                         i64toi32_i32$1 = $27_1;
                         i64toi32_i32$5 = (i64toi32_i32$3 >>> 0 < i64toi32_i32$1 >>> 0) + i64toi32_i32$0 | 0;
                         i64toi32_i32$5 = i64toi32_i32$2 - i64toi32_i32$5 | 0;
                         $27_1 = i64toi32_i32$3 - i64toi32_i32$1 | 0;
                         $27$hi = i64toi32_i32$5;
                         i64toi32_i32$3 = $7_1;
                         HEAP32[($7_1 + 64 | 0) >> 2] = $27_1;
                         HEAP32[($7_1 + 68 | 0) >> 2] = i64toi32_i32$5;
                         $18_1 = 1;
                         $26_1 = 65545;
                         break label$51;
                        }
                        label$68 : {
                         if (!($19_1 & 2048 | 0)) {
                          break label$68
                         }
                         $18_1 = 1;
                         $26_1 = 65546;
                         break label$51;
                        }
                        $18_1 = $19_1 & 1 | 0;
                        $26_1 = $18_1 ? 65547 : 65545;
                       }
                       i64toi32_i32$5 = $27$hi;
                       $15_1 = $74($27_1 | 0, i64toi32_i32$5 | 0, $11_1 | 0) | 0;
                      }
                      if ($23_1 & ($22_1 | 0) < (0 | 0) | 0) {
                       break label$4
                      }
                      $19_1 = $23_1 ? $19_1 & -65537 | 0 : $19_1;
                      label$69 : {
                       i64toi32_i32$2 = $7_1;
                       i64toi32_i32$5 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                       i64toi32_i32$3 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                       $27_1 = i64toi32_i32$5;
                       $27$hi = i64toi32_i32$3;
                       i64toi32_i32$2 = i64toi32_i32$5;
                       i64toi32_i32$5 = 0;
                       i64toi32_i32$1 = 0;
                       if ((i64toi32_i32$2 | 0) != (i64toi32_i32$1 | 0) | (i64toi32_i32$3 | 0) != (i64toi32_i32$5 | 0) | 0) {
                        break label$69
                       }
                       if ($22_1) {
                        break label$69
                       }
                       $15_1 = $11_1;
                       $24_1 = $15_1;
                       $22_1 = 0;
                       break label$8;
                      }
                      i64toi32_i32$2 = $27$hi;
                      $14_1 = ($11_1 - $15_1 | 0) + !($27_1 | i64toi32_i32$2 | 0) | 0;
                      $22_1 = ($22_1 | 0) > ($14_1 | 0) ? $22_1 : $14_1;
                      break label$9;
                     }
                     $14_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                     $15_1 = $14_1 ? $14_1 : 67343;
                     $14_1 = $63($15_1 | 0, ($22_1 >>> 0 < 2147483647 >>> 0 ? $22_1 : 2147483647) | 0) | 0;
                     $24_1 = $15_1 + $14_1 | 0;
                     label$70 : {
                      if (($22_1 | 0) <= (-1 | 0)) {
                       break label$70
                      }
                      $19_1 = $25_1;
                      $22_1 = $14_1;
                      break label$8;
                     }
                     $19_1 = $25_1;
                     $22_1 = $14_1;
                     if (HEAPU8[$24_1 >> 0] | 0) {
                      break label$4
                     }
                     break label$8;
                    }
                    label$71 : {
                     if (!$22_1) {
                      break label$71
                     }
                     $16_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                     break label$46;
                    }
                    $14_1 = 0;
                    $75($0_1 | 0, 32 | 0, $21_1 | 0, 0 | 0, $19_1 | 0);
                    break label$45;
                   }
                   HEAP32[($7_1 + 12 | 0) >> 2] = 0;
                   i64toi32_i32$1 = $7_1;
                   i64toi32_i32$2 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                   i64toi32_i32$3 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
                   HEAP32[($7_1 + 8 | 0) >> 2] = i64toi32_i32$2;
                   HEAP32[($7_1 + 64 | 0) >> 2] = $7_1 + 8 | 0;
                   $16_1 = $7_1 + 8 | 0;
                   $22_1 = -1;
                  }
                  $14_1 = 0;
                  label$72 : {
                   label$73 : while (1) {
                    $17_1 = HEAP32[$16_1 >> 2] | 0;
                    if (!$17_1) {
                     break label$72
                    }
                    $17_1 = $89($7_1 + 4 | 0 | 0, $17_1 | 0) | 0;
                    if (($17_1 | 0) < (0 | 0)) {
                     break label$2
                    }
                    if ($17_1 >>> 0 > ($22_1 - $14_1 | 0) >>> 0) {
                     break label$72
                    }
                    $16_1 = $16_1 + 4 | 0;
                    $14_1 = $17_1 + $14_1 | 0;
                    if ($14_1 >>> 0 < $22_1 >>> 0) {
                     continue label$73
                    }
                    break label$73;
                   };
                  }
                  $24_1 = 61;
                  if (($14_1 | 0) < (0 | 0)) {
                   break label$3
                  }
                  $75($0_1 | 0, 32 | 0, $21_1 | 0, $14_1 | 0, $19_1 | 0);
                  label$74 : {
                   if ($14_1) {
                    break label$74
                   }
                   $14_1 = 0;
                   break label$45;
                  }
                  $17_1 = 0;
                  $16_1 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
                  label$75 : while (1) {
                   $15_1 = HEAP32[$16_1 >> 2] | 0;
                   if (!$15_1) {
                    break label$45
                   }
                   $15_1 = $89($7_1 + 4 | 0 | 0, $15_1 | 0) | 0;
                   $17_1 = $15_1 + $17_1 | 0;
                   if ($17_1 >>> 0 > $14_1 >>> 0) {
                    break label$45
                   }
                   $69($0_1 | 0, $7_1 + 4 | 0 | 0, $15_1 | 0);
                   $16_1 = $16_1 + 4 | 0;
                   if ($17_1 >>> 0 < $14_1 >>> 0) {
                    continue label$75
                   }
                   break label$75;
                  };
                 }
                 $75($0_1 | 0, 32 | 0, $21_1 | 0, $14_1 | 0, $19_1 ^ 8192 | 0 | 0);
                 $14_1 = ($21_1 | 0) > ($14_1 | 0) ? $21_1 : $14_1;
                 continue label$6;
                }
                if ($23_1 & ($22_1 | 0) < (0 | 0) | 0) {
                 break label$4
                }
                $24_1 = 61;
                $14_1 = FUNCTION_TABLE[$5_1 | 0]($0_1, +HEAPF64[($7_1 + 64 | 0) >> 3], $21_1, $22_1, $19_1, $14_1) | 0;
                if (($14_1 | 0) >= (0 | 0)) {
                 continue label$6
                }
                break label$3;
               }
               i64toi32_i32$1 = $7_1;
               i64toi32_i32$3 = HEAP32[($7_1 + 64 | 0) >> 2] | 0;
               i64toi32_i32$2 = HEAP32[($7_1 + 68 | 0) >> 2] | 0;
               HEAP8[($7_1 + 55 | 0) >> 0] = i64toi32_i32$3;
               $22_1 = 1;
               $15_1 = $10_1;
               $24_1 = $11_1;
               $19_1 = $25_1;
               break label$8;
              }
              $16_1 = HEAPU8[($14_1 + 1 | 0) >> 0] | 0;
              $14_1 = $14_1 + 1 | 0;
              continue label$12;
             };
            }
            if ($0_1) {
             break label$1
            }
            if (!$12_1) {
             break label$7
            }
            $14_1 = 1;
            label$76 : {
             label$77 : while (1) {
              $16_1 = HEAP32[($4_1 + ($14_1 << 2 | 0) | 0) >> 2] | 0;
              if (!$16_1) {
               break label$76
              }
              $71($3_1 + ($14_1 << 3 | 0) | 0 | 0, $16_1 | 0, $2_1 | 0, $6_1 | 0);
              $13_1 = 1;
              $14_1 = $14_1 + 1 | 0;
              if (($14_1 | 0) != (10 | 0)) {
               continue label$77
              }
              break label$1;
             };
            }
            $13_1 = 1;
            if ($14_1 >>> 0 >= 10 >>> 0) {
             break label$1
            }
            label$78 : while (1) {
             if (HEAP32[($4_1 + ($14_1 << 2 | 0) | 0) >> 2] | 0) {
              break label$10
             }
             $13_1 = 1;
             $14_1 = $14_1 + 1 | 0;
             if (($14_1 | 0) == (10 | 0)) {
              break label$1
             }
             continue label$78;
            };
           }
           $24_1 = 28;
           break label$3;
          }
          $24_1 = $11_1;
         }
         $1_1 = $24_1 - $15_1 | 0;
         $20_1 = ($22_1 | 0) > ($1_1 | 0) ? $22_1 : $1_1;
         if (($20_1 | 0) > ($18_1 ^ 2147483647 | 0 | 0)) {
          break label$4
         }
         $24_1 = 61;
         $17_1 = $18_1 + $20_1 | 0;
         $14_1 = ($21_1 | 0) > ($17_1 | 0) ? $21_1 : $17_1;
         if (($14_1 | 0) > ($16_1 | 0)) {
          break label$3
         }
         $75($0_1 | 0, 32 | 0, $14_1 | 0, $17_1 | 0, $19_1 | 0);
         $69($0_1 | 0, $26_1 | 0, $18_1 | 0);
         $75($0_1 | 0, 48 | 0, $14_1 | 0, $17_1 | 0, $19_1 ^ 65536 | 0 | 0);
         $75($0_1 | 0, 48 | 0, $20_1 | 0, $1_1 | 0, 0 | 0);
         $69($0_1 | 0, $15_1 | 0, $1_1 | 0);
         $75($0_1 | 0, 32 | 0, $14_1 | 0, $17_1 | 0, $19_1 ^ 8192 | 0 | 0);
         $1_1 = HEAP32[($7_1 + 76 | 0) >> 2] | 0;
         continue label$6;
        }
        break label$6;
       };
       break label$5;
      };
      $13_1 = 0;
      break label$1;
     }
     $24_1 = 61;
    }
    HEAP32[($64() | 0) >> 2] = $24_1;
   }
   $13_1 = -1;
  }
  global$0 = $7_1 + 80 | 0;
  return $13_1 | 0;
 }
 
 function $69($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  label$1 : {
   if ((HEAPU8[$0_1 >> 0] | 0) & 32 | 0) {
    break label$1
   }
   $66($1_1 | 0, $2_1 | 0, $0_1 | 0) | 0;
  }
 }
 
 function $70($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, $3_1 = 0, $2_1 = 0;
  $1_1 = 0;
  label$1 : {
   if ($61(HEAP8[(HEAP32[$0_1 >> 2] | 0) >> 0] | 0 | 0) | 0) {
    break label$1
   }
   return 0 | 0;
  }
  label$2 : while (1) {
   $2_1 = HEAP32[$0_1 >> 2] | 0;
   $3_1 = -1;
   label$3 : {
    if ($1_1 >>> 0 > 214748364 >>> 0) {
     break label$3
    }
    $3_1 = (HEAP8[$2_1 >> 0] | 0) + -48 | 0;
    $1_1 = Math_imul($1_1, 10);
    $3_1 = ($3_1 | 0) > ($1_1 ^ 2147483647 | 0 | 0) ? -1 : $3_1 + $1_1 | 0;
   }
   HEAP32[$0_1 >> 2] = $2_1 + 1 | 0;
   $1_1 = $3_1;
   if ($61(HEAP8[($2_1 + 1 | 0) >> 0] | 0 | 0) | 0) {
    continue label$2
   }
   break label$2;
  };
  return $1_1 | 0;
 }
 
 function $71($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $21_1 = 0, $29_1 = 0, $37_1 = 0, $45_1 = 0, $55_1 = 0, $63_1 = 0, $71_1 = 0, $79_1 = 0, $87_1 = 0, $97_1 = 0, $105_1 = 0, $115 = 0, $125 = 0, $133 = 0, $141 = 0;
  label$1 : {
   switch ($1_1 + -9 | 0 | 0) {
   case 0:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    HEAP32[$0_1 >> 2] = HEAP32[$1_1 >> 2] | 0;
    return;
   case 1:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = i64toi32_i32$0 >> 31 | 0;
    $21_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $21_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 2:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$0 = 0;
    $29_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $29_1;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 4:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = i64toi32_i32$0 >> 31 | 0;
    $37_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $37_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 5:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$0 = 0;
    $45_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $45_1;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 3:
    $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
    $55_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $55_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 6:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$1 = HEAP16[$1_1 >> 1] | 0;
    i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
    $63_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $63_1;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 7:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAPU16[$1_1 >> 1] | 0;
    i64toi32_i32$1 = 0;
    $71_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $71_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 8:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$1 = HEAP8[$1_1 >> 0] | 0;
    i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
    $79_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $79_1;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 9:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAPU8[$1_1 >> 0] | 0;
    i64toi32_i32$1 = 0;
    $87_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $87_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 10:
    $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
    i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
    $97_1 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $97_1;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 11:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = 0;
    $105_1 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $105_1;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 12:
    $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
    i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$0 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
    $115 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $115;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 13:
    $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = HEAP32[($1_1 + 4 | 0) >> 2] | 0;
    $125 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $125;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 14:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$1 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
    $133 = i64toi32_i32$1;
    i64toi32_i32$1 = $0_1;
    HEAP32[i64toi32_i32$1 >> 2] = $133;
    HEAP32[(i64toi32_i32$1 + 4 | 0) >> 2] = i64toi32_i32$0;
    return;
   case 15:
    $1_1 = HEAP32[$2_1 >> 2] | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 4 | 0;
    i64toi32_i32$0 = HEAP32[$1_1 >> 2] | 0;
    i64toi32_i32$1 = 0;
    $141 = i64toi32_i32$0;
    i64toi32_i32$0 = $0_1;
    HEAP32[i64toi32_i32$0 >> 2] = $141;
    HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$1;
    return;
   case 16:
    $1_1 = ((HEAP32[$2_1 >> 2] | 0) + 7 | 0) & -8 | 0;
    HEAP32[$2_1 >> 2] = $1_1 + 8 | 0;
    HEAPF64[$0_1 >> 3] = +HEAPF64[$1_1 >> 3];
    return;
   case 17:
    FUNCTION_TABLE[$3_1 | 0]($0_1, $2_1);
    break;
   default:
    break label$1;
   };
  }
 }
 
 function $72($0_1, $0$hi, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $10_1 = 0, $3_1 = 0;
  label$1 : {
   i64toi32_i32$0 = $0$hi;
   if (!($0_1 | i64toi32_i32$0 | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$0 = $0$hi;
    HEAP8[$1_1 >> 0] = HEAPU8[(($0_1 & 15 | 0) + 68720 | 0) >> 0] | 0 | $2_1 | 0;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 15;
    $3_1 = i64toi32_i32$0 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$2 >>> 0 > i64toi32_i32$3 >>> 0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$1 = 4;
    i64toi32_i32$4 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = 0;
     $10_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
     $10_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
    }
    $0_1 = $10_1;
    $0$hi = i64toi32_i32$0;
    if ($3_1) {
     continue label$2
    }
    break label$2;
   };
  }
  return $1_1 | 0;
 }
 
 function $73($0_1, $0$hi, $1_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$3 = 0, $9_1 = 0, $2_1 = 0;
  label$1 : {
   i64toi32_i32$0 = $0$hi;
   if (!($0_1 | i64toi32_i32$0 | 0)) {
    break label$1
   }
   label$2 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$0 = $0$hi;
    HEAP8[$1_1 >> 0] = $0_1 & 7 | 0 | 48 | 0;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 0;
    i64toi32_i32$3 = 7;
    $2_1 = i64toi32_i32$0 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$2 >>> 0 > i64toi32_i32$3 >>> 0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$1 = 3;
    i64toi32_i32$4 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = 0;
     $9_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
     $9_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
    }
    $0_1 = $9_1;
    $0$hi = i64toi32_i32$0;
    if ($2_1) {
     continue label$2
    }
    break label$2;
   };
  }
  return $1_1 | 0;
 }
 
 function $74($0_1, $0$hi, $1_1) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $3_1 = 0, i64toi32_i32$5 = 0, i64toi32_i32$3 = 0, $2_1 = 0, $2$hi = 0, $4_1 = 0, $16_1 = 0, $16$hi = 0, $5_1 = 0;
  label$1 : {
   label$2 : {
    i64toi32_i32$0 = $0$hi;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$1 = 1;
    i64toi32_i32$3 = 0;
    if (i64toi32_i32$0 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$2 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
     break label$2
    }
    i64toi32_i32$2 = i64toi32_i32$0;
    $2_1 = $0_1;
    $2$hi = i64toi32_i32$2;
    break label$1;
   }
   label$3 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_udiv($0_1 | 0, i64toi32_i32$2 | 0, 10 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $2_1 = i64toi32_i32$0;
    $2$hi = i64toi32_i32$2;
    i64toi32_i32$0 = 0;
    i64toi32_i32$0 = __wasm_i64_mul($2_1 | 0, i64toi32_i32$2 | 0, 10 | 0, i64toi32_i32$0 | 0) | 0;
    i64toi32_i32$2 = i64toi32_i32$HIGH_BITS;
    $16_1 = i64toi32_i32$0;
    $16$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $0$hi;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$0 = $16$hi;
    i64toi32_i32$1 = $16_1;
    i64toi32_i32$5 = ($0_1 >>> 0 < i64toi32_i32$1 >>> 0) + i64toi32_i32$0 | 0;
    i64toi32_i32$5 = i64toi32_i32$2 - i64toi32_i32$5 | 0;
    HEAP8[$1_1 >> 0] = $0_1 - i64toi32_i32$1 | 0 | 48 | 0;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$5 = i64toi32_i32$2;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$3 = 9;
    i64toi32_i32$1 = -1;
    $3_1 = i64toi32_i32$5 >>> 0 > i64toi32_i32$3 >>> 0 | ((i64toi32_i32$5 | 0) == (i64toi32_i32$3 | 0) & i64toi32_i32$2 >>> 0 > i64toi32_i32$1 >>> 0 | 0) | 0;
    i64toi32_i32$2 = $2$hi;
    $0_1 = $2_1;
    $0$hi = i64toi32_i32$2;
    if ($3_1) {
     continue label$3
    }
    break label$3;
   };
  }
  label$4 : {
   i64toi32_i32$2 = $2$hi;
   $3_1 = $2_1;
   if (!$3_1) {
    break label$4
   }
   label$5 : while (1) {
    $1_1 = $1_1 + -1 | 0;
    $4_1 = ($3_1 >>> 0) / (10 >>> 0) | 0;
    HEAP8[$1_1 >> 0] = $3_1 - Math_imul($4_1, 10) | 0 | 48 | 0;
    $5_1 = $3_1 >>> 0 > 9 >>> 0;
    $3_1 = $4_1;
    if ($5_1) {
     continue label$5
    }
    break label$5;
   };
  }
  return $1_1 | 0;
 }
 
 function $75($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var $5_1 = 0;
  $5_1 = global$0 - 256 | 0;
  global$0 = $5_1;
  label$1 : {
   if (($2_1 | 0) <= ($3_1 | 0)) {
    break label$1
   }
   if ($4_1 & 73728 | 0) {
    break label$1
   }
   $3_1 = $2_1 - $3_1 | 0;
   $2_1 = $3_1 >>> 0 < 256 >>> 0;
   $42($5_1 | 0, $1_1 & 255 | 0 | 0, ($2_1 ? $3_1 : 256) | 0) | 0;
   label$2 : {
    if ($2_1) {
     break label$2
    }
    label$3 : while (1) {
     $69($0_1 | 0, $5_1 | 0, 256 | 0);
     $3_1 = $3_1 + -256 | 0;
     if ($3_1 >>> 0 > 255 >>> 0) {
      continue label$3
     }
     break label$3;
    };
   }
   $69($0_1 | 0, $5_1 | 0, $3_1 | 0);
  }
  global$0 = $5_1 + 256 | 0;
 }
 
 function $76($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return $67($0_1 | 0, $1_1 | 0, $2_1 | 0, 4 | 0, 5 | 0) | 0 | 0;
 }
 
 function $77($0_1, $1_1, $2_1, $3_1, $4_1, $5_1) {
  $0_1 = $0_1 | 0;
  $1_1 = +$1_1;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  $5_1 = $5_1 | 0;
  var $10_1 = 0, $11_1 = 0, $12_1 = 0, $18_1 = 0, $6_1 = 0, $21_1 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, $15_1 = 0, i64toi32_i32$4 = 0, $22_1 = 0, $23_1 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$5 = 0, $19_1 = 0, $17_1 = 0, $8_1 = 0, $26_1 = 0.0, $24_1 = 0, $13_1 = 0, $24$hi = 0, $14_1 = 0, $16_1 = 0, $20_1 = 0, $9_1 = 0, $7_1 = 0, $45_1 = 0, $46_1 = 0, $47_1 = 0, $25$hi = 0, $48_1 = 0, $25_1 = 0, $167 = 0, $169$hi = 0, $171$hi = 0, $173 = 0, $173$hi = 0, $175$hi = 0, $179 = 0, $179$hi = 0, $389 = 0.0, $853 = 0;
  $6_1 = global$0 - 560 | 0;
  global$0 = $6_1;
  $7_1 = 0;
  HEAP32[($6_1 + 44 | 0) >> 2] = 0;
  label$1 : {
   label$2 : {
    i64toi32_i32$0 = $79(+$1_1) | 0;
    i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    $24_1 = i64toi32_i32$0;
    $24$hi = i64toi32_i32$1;
    i64toi32_i32$2 = i64toi32_i32$0;
    i64toi32_i32$0 = -1;
    i64toi32_i32$3 = -1;
    if ((i64toi32_i32$1 | 0) > (i64toi32_i32$0 | 0)) {
     $45_1 = 1
    } else {
     if ((i64toi32_i32$1 | 0) >= (i64toi32_i32$0 | 0)) {
      if (i64toi32_i32$2 >>> 0 <= i64toi32_i32$3 >>> 0) {
       $46_1 = 0
      } else {
       $46_1 = 1
      }
      $47_1 = $46_1;
     } else {
      $47_1 = 0
     }
     $45_1 = $47_1;
    }
    if ($45_1) {
     break label$2
    }
    $8_1 = 1;
    $9_1 = 65555;
    $1_1 = -$1_1;
    i64toi32_i32$2 = $79(+$1_1) | 0;
    i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    $24_1 = i64toi32_i32$2;
    $24$hi = i64toi32_i32$1;
    break label$1;
   }
   label$3 : {
    if (!($4_1 & 2048 | 0)) {
     break label$3
    }
    $8_1 = 1;
    $9_1 = 65558;
    break label$1;
   }
   $8_1 = $4_1 & 1 | 0;
   $9_1 = $8_1 ? 65561 : 65556;
   $7_1 = !$8_1;
  }
  label$4 : {
   label$5 : {
    i64toi32_i32$1 = $24$hi;
    i64toi32_i32$3 = $24_1;
    i64toi32_i32$2 = 2146435072;
    i64toi32_i32$0 = 0;
    i64toi32_i32$2 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
    i64toi32_i32$1 = i64toi32_i32$3 & i64toi32_i32$0 | 0;
    i64toi32_i32$3 = 2146435072;
    i64toi32_i32$0 = 0;
    if ((i64toi32_i32$1 | 0) != (i64toi32_i32$0 | 0) | (i64toi32_i32$2 | 0) != (i64toi32_i32$3 | 0) | 0) {
     break label$5
    }
    $10_1 = $8_1 + 3 | 0;
    $75($0_1 | 0, 32 | 0, $2_1 | 0, $10_1 | 0, $4_1 & -65537 | 0 | 0);
    $69($0_1 | 0, $9_1 | 0, $8_1 | 0);
    $11_1 = $5_1 & 32 | 0;
    $69($0_1 | 0, ($1_1 != $1_1 ? ($11_1 ? 65876 : 66812) : $11_1 ? 65911 : 66908) | 0, 3 | 0);
    $75($0_1 | 0, 32 | 0, $2_1 | 0, $10_1 | 0, $4_1 ^ 8192 | 0 | 0);
    $12_1 = ($10_1 | 0) > ($2_1 | 0) ? $10_1 : $2_1;
    break label$4;
   }
   $13_1 = $6_1 + 16 | 0;
   label$6 : {
    label$7 : {
     label$8 : {
      label$9 : {
       $1_1 = +$65(+$1_1, $6_1 + 44 | 0 | 0);
       $1_1 = $1_1 + $1_1;
       if ($1_1 == 0.0) {
        break label$9
       }
       $10_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
       HEAP32[($6_1 + 44 | 0) >> 2] = $10_1 + -1 | 0;
       $14_1 = $5_1 | 32 | 0;
       if (($14_1 | 0) != (97 | 0)) {
        break label$8
       }
       break label$6;
      }
      $14_1 = $5_1 | 32 | 0;
      if (($14_1 | 0) == (97 | 0)) {
       break label$6
      }
      $15_1 = ($3_1 | 0) < (0 | 0) ? 6 : $3_1;
      $16_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
      break label$7;
     }
     $16_1 = $10_1 + -29 | 0;
     HEAP32[($6_1 + 44 | 0) >> 2] = $16_1;
     $15_1 = ($3_1 | 0) < (0 | 0) ? 6 : $3_1;
     $1_1 = $1_1 * 268435456.0;
    }
    $17_1 = ($6_1 + 48 | 0) + (($16_1 | 0) < (0 | 0) ? 0 : 288) | 0;
    $11_1 = $17_1;
    label$10 : while (1) {
     label$11 : {
      label$12 : {
       if (!($1_1 < 4294967296.0 & $1_1 >= 0.0 | 0)) {
        break label$12
       }
       $10_1 = ~~$1_1 >>> 0;
       break label$11;
      }
      $10_1 = 0;
     }
     HEAP32[$11_1 >> 2] = $10_1;
     $11_1 = $11_1 + 4 | 0;
     $1_1 = ($1_1 - +($10_1 >>> 0)) * 1.0e9;
     if ($1_1 != 0.0) {
      continue label$10
     }
     break label$10;
    };
    label$13 : {
     label$14 : {
      if (($16_1 | 0) >= (1 | 0)) {
       break label$14
      }
      $3_1 = $16_1;
      $10_1 = $11_1;
      $18_1 = $17_1;
      break label$13;
     }
     $18_1 = $17_1;
     $3_1 = $16_1;
     label$15 : while (1) {
      $3_1 = ($3_1 | 0) < (29 | 0) ? $3_1 : 29;
      label$16 : {
       $10_1 = $11_1 + -4 | 0;
       if ($10_1 >>> 0 < $18_1 >>> 0) {
        break label$16
       }
       i64toi32_i32$1 = 0;
       $25_1 = $3_1;
       $25$hi = i64toi32_i32$1;
       i64toi32_i32$1 = 0;
       $24_1 = 0;
       $24$hi = i64toi32_i32$1;
       label$17 : while (1) {
        $167 = $10_1;
        i64toi32_i32$0 = $10_1;
        i64toi32_i32$1 = HEAP32[$10_1 >> 2] | 0;
        i64toi32_i32$2 = 0;
        $169$hi = i64toi32_i32$2;
        i64toi32_i32$2 = $25$hi;
        i64toi32_i32$2 = $169$hi;
        i64toi32_i32$0 = i64toi32_i32$1;
        i64toi32_i32$1 = $25$hi;
        i64toi32_i32$3 = $25_1;
        i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
         $48_1 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
         $48_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
        }
        $171$hi = i64toi32_i32$1;
        i64toi32_i32$1 = $24$hi;
        i64toi32_i32$2 = $24_1;
        i64toi32_i32$0 = 0;
        i64toi32_i32$3 = -1;
        i64toi32_i32$0 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
        $173 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
        $173$hi = i64toi32_i32$0;
        i64toi32_i32$0 = $171$hi;
        i64toi32_i32$1 = $48_1;
        i64toi32_i32$2 = $173$hi;
        i64toi32_i32$3 = $173;
        i64toi32_i32$4 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
        i64toi32_i32$5 = i64toi32_i32$0 + i64toi32_i32$2 | 0;
        if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
         i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
        }
        $24_1 = i64toi32_i32$4;
        $24$hi = i64toi32_i32$5;
        $175$hi = i64toi32_i32$5;
        i64toi32_i32$1 = 0;
        i64toi32_i32$1 = __wasm_i64_udiv(i64toi32_i32$4 | 0, i64toi32_i32$5 | 0, 1e9 | 0, i64toi32_i32$1 | 0) | 0;
        i64toi32_i32$5 = i64toi32_i32$HIGH_BITS;
        $24_1 = i64toi32_i32$1;
        $24$hi = i64toi32_i32$5;
        i64toi32_i32$1 = 0;
        i64toi32_i32$1 = __wasm_i64_mul($24_1 | 0, i64toi32_i32$5 | 0, 1e9 | 0, i64toi32_i32$1 | 0) | 0;
        i64toi32_i32$5 = i64toi32_i32$HIGH_BITS;
        $179 = i64toi32_i32$1;
        $179$hi = i64toi32_i32$5;
        i64toi32_i32$5 = $175$hi;
        i64toi32_i32$0 = i64toi32_i32$4;
        i64toi32_i32$1 = $179$hi;
        i64toi32_i32$3 = $179;
        i64toi32_i32$2 = i64toi32_i32$0 - i64toi32_i32$3 | 0;
        i64toi32_i32$4 = (i64toi32_i32$0 >>> 0 < i64toi32_i32$3 >>> 0) + i64toi32_i32$1 | 0;
        i64toi32_i32$4 = i64toi32_i32$5 - i64toi32_i32$4 | 0;
        HEAP32[$167 >> 2] = i64toi32_i32$2;
        $10_1 = $10_1 + -4 | 0;
        if ($10_1 >>> 0 >= $18_1 >>> 0) {
         continue label$17
        }
        break label$17;
       };
       i64toi32_i32$4 = $24$hi;
       $10_1 = $24_1;
       if (!$10_1) {
        break label$16
       }
       $18_1 = $18_1 + -4 | 0;
       HEAP32[$18_1 >> 2] = $10_1;
      }
      label$18 : {
       label$19 : while (1) {
        $10_1 = $11_1;
        if ($10_1 >>> 0 <= $18_1 >>> 0) {
         break label$18
        }
        $11_1 = $10_1 + -4 | 0;
        if (!(HEAP32[$11_1 >> 2] | 0)) {
         continue label$19
        }
        break label$19;
       };
      }
      $3_1 = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) - $3_1 | 0;
      HEAP32[($6_1 + 44 | 0) >> 2] = $3_1;
      $11_1 = $10_1;
      if (($3_1 | 0) > (0 | 0)) {
       continue label$15
      }
      break label$15;
     };
    }
    label$20 : {
     if (($3_1 | 0) > (-1 | 0)) {
      break label$20
     }
     $19_1 = ((($15_1 + 25 | 0) >>> 0) / (9 >>> 0) | 0) + 1 | 0;
     $20_1 = ($14_1 | 0) == (102 | 0);
     label$21 : while (1) {
      $11_1 = 0 - $3_1 | 0;
      $21_1 = ($11_1 | 0) < (9 | 0) ? $11_1 : 9;
      label$22 : {
       label$23 : {
        if ($18_1 >>> 0 < $10_1 >>> 0) {
         break label$23
        }
        $11_1 = HEAP32[$18_1 >> 2] | 0;
        break label$22;
       }
       $22_1 = 1e9 >>> $21_1 | 0;
       $23_1 = (-1 << $21_1 | 0) ^ -1 | 0;
       $3_1 = 0;
       $11_1 = $18_1;
       label$24 : while (1) {
        $12_1 = HEAP32[$11_1 >> 2] | 0;
        HEAP32[$11_1 >> 2] = ($12_1 >>> $21_1 | 0) + $3_1 | 0;
        $3_1 = Math_imul($12_1 & $23_1 | 0, $22_1);
        $11_1 = $11_1 + 4 | 0;
        if ($11_1 >>> 0 < $10_1 >>> 0) {
         continue label$24
        }
        break label$24;
       };
       $11_1 = HEAP32[$18_1 >> 2] | 0;
       if (!$3_1) {
        break label$22
       }
       HEAP32[$10_1 >> 2] = $3_1;
       $10_1 = $10_1 + 4 | 0;
      }
      $3_1 = (HEAP32[($6_1 + 44 | 0) >> 2] | 0) + $21_1 | 0;
      HEAP32[($6_1 + 44 | 0) >> 2] = $3_1;
      $18_1 = $18_1 + (!$11_1 << 2 | 0) | 0;
      $11_1 = $20_1 ? $17_1 : $18_1;
      $10_1 = (($10_1 - $11_1 | 0) >> 2 | 0 | 0) > ($19_1 | 0) ? $11_1 + ($19_1 << 2 | 0) | 0 : $10_1;
      if (($3_1 | 0) < (0 | 0)) {
       continue label$21
      }
      break label$21;
     };
    }
    $3_1 = 0;
    label$25 : {
     if ($18_1 >>> 0 >= $10_1 >>> 0) {
      break label$25
     }
     $3_1 = Math_imul(($17_1 - $18_1 | 0) >> 2 | 0, 9);
     $11_1 = 10;
     $12_1 = HEAP32[$18_1 >> 2] | 0;
     if ($12_1 >>> 0 < 10 >>> 0) {
      break label$25
     }
     label$26 : while (1) {
      $3_1 = $3_1 + 1 | 0;
      $11_1 = Math_imul($11_1, 10);
      if ($12_1 >>> 0 >= $11_1 >>> 0) {
       continue label$26
      }
      break label$26;
     };
    }
    label$27 : {
     $11_1 = ($15_1 - (($14_1 | 0) == (102 | 0) ? 0 : $3_1) | 0) - (($15_1 | 0) != (0 | 0) & ($14_1 | 0) == (103 | 0) | 0) | 0;
     if (($11_1 | 0) >= (Math_imul(($10_1 - $17_1 | 0) >> 2 | 0, 9) + -9 | 0 | 0)) {
      break label$27
     }
     $12_1 = $11_1 + 9216 | 0;
     $22_1 = ($12_1 | 0) / (9 | 0) | 0;
     $19_1 = (($6_1 + 48 | 0) + (($16_1 | 0) < (0 | 0) ? 4 : 292) | 0) + ($22_1 << 2 | 0) | 0;
     $21_1 = $19_1 + -4096 | 0;
     $11_1 = 10;
     label$28 : {
      $12_1 = $12_1 - Math_imul($22_1, 9) | 0;
      if (($12_1 | 0) > (7 | 0)) {
       break label$28
      }
      label$29 : while (1) {
       $11_1 = Math_imul($11_1, 10);
       $12_1 = $12_1 + 1 | 0;
       if (($12_1 | 0) != (8 | 0)) {
        continue label$29
       }
       break label$29;
      };
     }
     $23_1 = $19_1 + -4092 | 0;
     label$30 : {
      label$31 : {
       $12_1 = HEAP32[$21_1 >> 2] | 0;
       $20_1 = ($12_1 >>> 0) / ($11_1 >>> 0) | 0;
       $22_1 = $12_1 - Math_imul($20_1, $11_1) | 0;
       if ($22_1) {
        break label$31
       }
       if (($23_1 | 0) == ($10_1 | 0)) {
        break label$30
       }
      }
      label$32 : {
       label$33 : {
        if ($20_1 & 1 | 0) {
         break label$33
        }
        $1_1 = 9007199254740992.0;
        if (($11_1 | 0) != (1e9 | 0)) {
         break label$32
        }
        if ($21_1 >>> 0 <= $18_1 >>> 0) {
         break label$32
        }
        if (!((HEAPU8[($19_1 + -4100 | 0) >> 0] | 0) & 1 | 0)) {
         break label$32
        }
       }
       $1_1 = 9007199254740994.0;
      }
      $389 = ($23_1 | 0) == ($10_1 | 0) ? 1.0 : 1.5;
      $23_1 = $11_1 >>> 1 | 0;
      $26_1 = $22_1 >>> 0 < $23_1 >>> 0 ? .5 : ($22_1 | 0) == ($23_1 | 0) ? $389 : 1.5;
      label$34 : {
       if ($7_1) {
        break label$34
       }
       if ((HEAPU8[$9_1 >> 0] | 0 | 0) != (45 | 0)) {
        break label$34
       }
       $26_1 = -$26_1;
       $1_1 = -$1_1;
      }
      $12_1 = $12_1 - $22_1 | 0;
      HEAP32[$21_1 >> 2] = $12_1;
      if ($1_1 + $26_1 == $1_1) {
       break label$30
      }
      $11_1 = $12_1 + $11_1 | 0;
      HEAP32[$21_1 >> 2] = $11_1;
      label$35 : {
       if ($11_1 >>> 0 < 1e9 >>> 0) {
        break label$35
       }
       label$36 : while (1) {
        HEAP32[$21_1 >> 2] = 0;
        label$37 : {
         $21_1 = $21_1 + -4 | 0;
         if ($21_1 >>> 0 >= $18_1 >>> 0) {
          break label$37
         }
         $18_1 = $18_1 + -4 | 0;
         HEAP32[$18_1 >> 2] = 0;
        }
        $11_1 = (HEAP32[$21_1 >> 2] | 0) + 1 | 0;
        HEAP32[$21_1 >> 2] = $11_1;
        if ($11_1 >>> 0 > 999999999 >>> 0) {
         continue label$36
        }
        break label$36;
       };
      }
      $3_1 = Math_imul(($17_1 - $18_1 | 0) >> 2 | 0, 9);
      $11_1 = 10;
      $12_1 = HEAP32[$18_1 >> 2] | 0;
      if ($12_1 >>> 0 < 10 >>> 0) {
       break label$30
      }
      label$38 : while (1) {
       $3_1 = $3_1 + 1 | 0;
       $11_1 = Math_imul($11_1, 10);
       if ($12_1 >>> 0 >= $11_1 >>> 0) {
        continue label$38
       }
       break label$38;
      };
     }
     $11_1 = $21_1 + 4 | 0;
     $10_1 = $10_1 >>> 0 > $11_1 >>> 0 ? $11_1 : $10_1;
    }
    label$39 : {
     label$40 : while (1) {
      $11_1 = $10_1;
      $12_1 = $10_1 >>> 0 <= $18_1 >>> 0;
      if ($12_1) {
       break label$39
      }
      $10_1 = $10_1 + -4 | 0;
      if (!(HEAP32[$10_1 >> 2] | 0)) {
       continue label$40
      }
      break label$40;
     };
    }
    label$41 : {
     label$42 : {
      if (($14_1 | 0) == (103 | 0)) {
       break label$42
      }
      $21_1 = $4_1 & 8 | 0;
      break label$41;
     }
     $10_1 = $15_1 ? $15_1 : 1;
     $21_1 = ($10_1 | 0) > ($3_1 | 0) & ($3_1 | 0) > (-5 | 0) | 0;
     $15_1 = ($21_1 ? $3_1 ^ -1 | 0 : -1) + $10_1 | 0;
     $5_1 = ($21_1 ? -1 : -2) + $5_1 | 0;
     $21_1 = $4_1 & 8 | 0;
     if ($21_1) {
      break label$41
     }
     $10_1 = -9;
     label$43 : {
      if ($12_1) {
       break label$43
      }
      $21_1 = HEAP32[($11_1 + -4 | 0) >> 2] | 0;
      if (!$21_1) {
       break label$43
      }
      $12_1 = 10;
      $10_1 = 0;
      if (($21_1 >>> 0) % (10 >>> 0) | 0) {
       break label$43
      }
      label$44 : while (1) {
       $22_1 = $10_1;
       $10_1 = $10_1 + 1 | 0;
       $12_1 = Math_imul($12_1, 10);
       if (!(($21_1 >>> 0) % ($12_1 >>> 0) | 0)) {
        continue label$44
       }
       break label$44;
      };
      $10_1 = $22_1 ^ -1 | 0;
     }
     $12_1 = Math_imul(($11_1 - $17_1 | 0) >> 2 | 0, 9);
     label$45 : {
      if (($5_1 & -33 | 0 | 0) != (70 | 0)) {
       break label$45
      }
      $21_1 = 0;
      $10_1 = ($12_1 + $10_1 | 0) + -9 | 0;
      $10_1 = ($10_1 | 0) > (0 | 0) ? $10_1 : 0;
      $15_1 = ($15_1 | 0) < ($10_1 | 0) ? $15_1 : $10_1;
      break label$41;
     }
     $21_1 = 0;
     $10_1 = (($3_1 + $12_1 | 0) + $10_1 | 0) + -9 | 0;
     $10_1 = ($10_1 | 0) > (0 | 0) ? $10_1 : 0;
     $15_1 = ($15_1 | 0) < ($10_1 | 0) ? $15_1 : $10_1;
    }
    $12_1 = -1;
    $22_1 = $15_1 | $21_1 | 0;
    if (($15_1 | 0) > (($22_1 ? 2147483645 : 2147483646) | 0)) {
     break label$4
    }
    $23_1 = ($15_1 + (($22_1 | 0) != (0 | 0)) | 0) + 1 | 0;
    label$46 : {
     label$47 : {
      $20_1 = $5_1 & -33 | 0;
      if (($20_1 | 0) != (70 | 0)) {
       break label$47
      }
      if (($3_1 | 0) > ($23_1 ^ 2147483647 | 0 | 0)) {
       break label$4
      }
      $10_1 = ($3_1 | 0) > (0 | 0) ? $3_1 : 0;
      break label$46;
     }
     label$48 : {
      $10_1 = $3_1 >> 31 | 0;
      i64toi32_i32$4 = 0;
      $10_1 = $74(($3_1 ^ $10_1 | 0) - $10_1 | 0 | 0, i64toi32_i32$4 | 0, $13_1 | 0) | 0;
      if (($13_1 - $10_1 | 0 | 0) > (1 | 0)) {
       break label$48
      }
      label$49 : while (1) {
       $10_1 = $10_1 + -1 | 0;
       HEAP8[$10_1 >> 0] = 48;
       if (($13_1 - $10_1 | 0 | 0) < (2 | 0)) {
        continue label$49
       }
       break label$49;
      };
     }
     $19_1 = $10_1 + -2 | 0;
     HEAP8[$19_1 >> 0] = $5_1;
     $12_1 = -1;
     HEAP8[($10_1 + -1 | 0) >> 0] = ($3_1 | 0) < (0 | 0) ? 45 : 43;
     $10_1 = $13_1 - $19_1 | 0;
     if (($10_1 | 0) > ($23_1 ^ 2147483647 | 0 | 0)) {
      break label$4
     }
    }
    $12_1 = -1;
    $10_1 = $10_1 + $23_1 | 0;
    if (($10_1 | 0) > ($8_1 ^ 2147483647 | 0 | 0)) {
     break label$4
    }
    $23_1 = $10_1 + $8_1 | 0;
    $75($0_1 | 0, 32 | 0, $2_1 | 0, $23_1 | 0, $4_1 | 0);
    $69($0_1 | 0, $9_1 | 0, $8_1 | 0);
    $75($0_1 | 0, 48 | 0, $2_1 | 0, $23_1 | 0, $4_1 ^ 65536 | 0 | 0);
    label$50 : {
     label$51 : {
      label$52 : {
       label$53 : {
        if (($20_1 | 0) != (70 | 0)) {
         break label$53
        }
        $21_1 = $6_1 + 16 | 0 | 8 | 0;
        $3_1 = $6_1 + 16 | 0 | 9 | 0;
        $12_1 = $18_1 >>> 0 > $17_1 >>> 0 ? $17_1 : $18_1;
        $18_1 = $12_1;
        label$54 : while (1) {
         i64toi32_i32$5 = $18_1;
         i64toi32_i32$4 = HEAP32[$18_1 >> 2] | 0;
         i64toi32_i32$0 = 0;
         $10_1 = $74(i64toi32_i32$4 | 0, i64toi32_i32$0 | 0, $3_1 | 0) | 0;
         label$55 : {
          label$56 : {
           if (($18_1 | 0) == ($12_1 | 0)) {
            break label$56
           }
           if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
            break label$55
           }
           label$57 : while (1) {
            $10_1 = $10_1 + -1 | 0;
            HEAP8[$10_1 >> 0] = 48;
            if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
             continue label$57
            }
            break label$55;
           };
          }
          if (($10_1 | 0) != ($3_1 | 0)) {
           break label$55
          }
          HEAP8[($6_1 + 24 | 0) >> 0] = 48;
          $10_1 = $21_1;
         }
         $69($0_1 | 0, $10_1 | 0, $3_1 - $10_1 | 0 | 0);
         $18_1 = $18_1 + 4 | 0;
         if ($18_1 >>> 0 <= $17_1 >>> 0) {
          continue label$54
         }
         break label$54;
        };
        label$58 : {
         if (!$22_1) {
          break label$58
         }
         $69($0_1 | 0, 67339 | 0, 1 | 0);
        }
        if ($18_1 >>> 0 >= $11_1 >>> 0) {
         break label$52
        }
        if (($15_1 | 0) < (1 | 0)) {
         break label$52
        }
        label$59 : while (1) {
         label$60 : {
          i64toi32_i32$5 = $18_1;
          i64toi32_i32$0 = HEAP32[$18_1 >> 2] | 0;
          i64toi32_i32$4 = 0;
          $10_1 = $74(i64toi32_i32$0 | 0, i64toi32_i32$4 | 0, $3_1 | 0) | 0;
          if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
           break label$60
          }
          label$61 : while (1) {
           $10_1 = $10_1 + -1 | 0;
           HEAP8[$10_1 >> 0] = 48;
           if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
            continue label$61
           }
           break label$61;
          };
         }
         $69($0_1 | 0, $10_1 | 0, (($15_1 | 0) < (9 | 0) ? $15_1 : 9) | 0);
         $10_1 = $15_1 + -9 | 0;
         $18_1 = $18_1 + 4 | 0;
         if ($18_1 >>> 0 >= $11_1 >>> 0) {
          break label$51
         }
         $12_1 = ($15_1 | 0) > (9 | 0);
         $15_1 = $10_1;
         if ($12_1) {
          continue label$59
         }
         break label$51;
        };
       }
       label$62 : {
        if (($15_1 | 0) < (0 | 0)) {
         break label$62
        }
        $22_1 = $11_1 >>> 0 > $18_1 >>> 0 ? $11_1 : $18_1 + 4 | 0;
        $17_1 = $6_1 + 16 | 0 | 8 | 0;
        $3_1 = $6_1 + 16 | 0 | 9 | 0;
        $11_1 = $18_1;
        label$63 : while (1) {
         label$64 : {
          i64toi32_i32$5 = $11_1;
          i64toi32_i32$4 = HEAP32[$11_1 >> 2] | 0;
          i64toi32_i32$0 = 0;
          $10_1 = $74(i64toi32_i32$4 | 0, i64toi32_i32$0 | 0, $3_1 | 0) | 0;
          if (($10_1 | 0) != ($3_1 | 0)) {
           break label$64
          }
          HEAP8[($6_1 + 24 | 0) >> 0] = 48;
          $10_1 = $17_1;
         }
         label$65 : {
          label$66 : {
           if (($11_1 | 0) == ($18_1 | 0)) {
            break label$66
           }
           if ($10_1 >>> 0 <= ($6_1 + 16 | 0) >>> 0) {
            break label$65
           }
           label$67 : while (1) {
            $10_1 = $10_1 + -1 | 0;
            HEAP8[$10_1 >> 0] = 48;
            if ($10_1 >>> 0 > ($6_1 + 16 | 0) >>> 0) {
             continue label$67
            }
            break label$65;
           };
          }
          $69($0_1 | 0, $10_1 | 0, 1 | 0);
          $10_1 = $10_1 + 1 | 0;
          if (!($15_1 | $21_1 | 0)) {
           break label$65
          }
          $69($0_1 | 0, 67339 | 0, 1 | 0);
         }
         $12_1 = $3_1 - $10_1 | 0;
         $69($0_1 | 0, $10_1 | 0, (($15_1 | 0) > ($12_1 | 0) ? $12_1 : $15_1) | 0);
         $15_1 = $15_1 - $12_1 | 0;
         $11_1 = $11_1 + 4 | 0;
         if ($11_1 >>> 0 >= $22_1 >>> 0) {
          break label$62
         }
         if (($15_1 | 0) > (-1 | 0)) {
          continue label$63
         }
         break label$63;
        };
       }
       $75($0_1 | 0, 48 | 0, $15_1 + 18 | 0 | 0, 18 | 0, 0 | 0);
       $69($0_1 | 0, $19_1 | 0, $13_1 - $19_1 | 0 | 0);
       break label$50;
      }
      $10_1 = $15_1;
     }
     $75($0_1 | 0, 48 | 0, $10_1 + 9 | 0 | 0, 9 | 0, 0 | 0);
    }
    $75($0_1 | 0, 32 | 0, $2_1 | 0, $23_1 | 0, $4_1 ^ 8192 | 0 | 0);
    $12_1 = ($23_1 | 0) > ($2_1 | 0) ? $23_1 : $2_1;
    break label$4;
   }
   $23_1 = $9_1 + ((($5_1 << 26 | 0) >> 31 | 0) & 9 | 0) | 0;
   label$68 : {
    if ($3_1 >>> 0 > 11 >>> 0) {
     break label$68
    }
    $10_1 = 12 - $3_1 | 0;
    $26_1 = 16.0;
    label$69 : while (1) {
     $26_1 = $26_1 * 16.0;
     $10_1 = $10_1 + -1 | 0;
     if ($10_1) {
      continue label$69
     }
     break label$69;
    };
    label$70 : {
     if ((HEAPU8[$23_1 >> 0] | 0 | 0) != (45 | 0)) {
      break label$70
     }
     $1_1 = -($26_1 + (-$1_1 - $26_1));
     break label$68;
    }
    $1_1 = $1_1 + $26_1 - $26_1;
   }
   label$71 : {
    $10_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
    $853 = $10_1;
    $10_1 = $10_1 >> 31 | 0;
    i64toi32_i32$0 = 0;
    $10_1 = $74(($853 ^ $10_1 | 0) - $10_1 | 0 | 0, i64toi32_i32$0 | 0, $13_1 | 0) | 0;
    if (($10_1 | 0) != ($13_1 | 0)) {
     break label$71
    }
    HEAP8[($6_1 + 15 | 0) >> 0] = 48;
    $10_1 = $6_1 + 15 | 0;
   }
   $21_1 = $8_1 | 2 | 0;
   $18_1 = $5_1 & 32 | 0;
   $11_1 = HEAP32[($6_1 + 44 | 0) >> 2] | 0;
   $22_1 = $10_1 + -2 | 0;
   HEAP8[$22_1 >> 0] = $5_1 + 15 | 0;
   HEAP8[($10_1 + -1 | 0) >> 0] = ($11_1 | 0) < (0 | 0) ? 45 : 43;
   $12_1 = $4_1 & 8 | 0;
   $11_1 = $6_1 + 16 | 0;
   label$72 : while (1) {
    $10_1 = $11_1;
    label$73 : {
     label$74 : {
      if (!(Math_abs($1_1) < 2147483648.0)) {
       break label$74
      }
      $11_1 = ~~$1_1;
      break label$73;
     }
     $11_1 = -2147483648;
    }
    HEAP8[$10_1 >> 0] = HEAPU8[($11_1 + 68720 | 0) >> 0] | 0 | $18_1 | 0;
    $1_1 = ($1_1 - +($11_1 | 0)) * 16.0;
    label$75 : {
     $11_1 = $10_1 + 1 | 0;
     if (($11_1 - ($6_1 + 16 | 0) | 0 | 0) != (1 | 0)) {
      break label$75
     }
     label$76 : {
      if ($12_1) {
       break label$76
      }
      if (($3_1 | 0) > (0 | 0)) {
       break label$76
      }
      if ($1_1 == 0.0) {
       break label$75
      }
     }
     HEAP8[($10_1 + 1 | 0) >> 0] = 46;
     $11_1 = $10_1 + 2 | 0;
    }
    if ($1_1 != 0.0) {
     continue label$72
    }
    break label$72;
   };
   $12_1 = -1;
   $18_1 = $13_1 - $22_1 | 0;
   $19_1 = $21_1 + $18_1 | 0;
   if ((2147483645 - $19_1 | 0 | 0) < ($3_1 | 0)) {
    break label$4
   }
   $10_1 = $11_1 - ($6_1 + 16 | 0) | 0;
   $3_1 = $3_1 ? (($10_1 + -2 | 0 | 0) < ($3_1 | 0) ? $3_1 + 2 | 0 : $10_1) : $10_1;
   $11_1 = $19_1 + $3_1 | 0;
   $75($0_1 | 0, 32 | 0, $2_1 | 0, $11_1 | 0, $4_1 | 0);
   $69($0_1 | 0, $23_1 | 0, $21_1 | 0);
   $75($0_1 | 0, 48 | 0, $2_1 | 0, $11_1 | 0, $4_1 ^ 65536 | 0 | 0);
   $69($0_1 | 0, $6_1 + 16 | 0 | 0, $10_1 | 0);
   $75($0_1 | 0, 48 | 0, $3_1 - $10_1 | 0 | 0, 0 | 0, 0 | 0);
   $69($0_1 | 0, $22_1 | 0, $18_1 | 0);
   $75($0_1 | 0, 32 | 0, $2_1 | 0, $11_1 | 0, $4_1 ^ 8192 | 0 | 0);
   $12_1 = ($11_1 | 0) > ($2_1 | 0) ? $11_1 : $2_1;
  }
  global$0 = $6_1 + 560 | 0;
  return $12_1 | 0;
 }
 
 function $78($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, $2_1 = 0, $12_1 = 0, $12$hi = 0, $15_1 = 0, $15$hi = 0;
  $2_1 = ((HEAP32[$1_1 >> 2] | 0) + 7 | 0) & -8 | 0;
  HEAP32[$1_1 >> 2] = $2_1 + 16 | 0;
  i64toi32_i32$2 = $2_1;
  i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$1 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $12_1 = i64toi32_i32$0;
  $12$hi = i64toi32_i32$1;
  i64toi32_i32$2 = i64toi32_i32$2 + 8 | 0;
  i64toi32_i32$1 = HEAP32[i64toi32_i32$2 >> 2] | 0;
  i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
  $15_1 = i64toi32_i32$1;
  $15$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $12$hi;
  i64toi32_i32$1 = $15$hi;
  HEAPF64[$0_1 >> 3] = +$92($12_1 | 0, i64toi32_i32$0 | 0, $15_1 | 0, i64toi32_i32$1 | 0);
 }
 
 function $79($0_1) {
  $0_1 = +$0_1;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  wasm2js_scratch_store_f64(+$0_1);
  i64toi32_i32$0 = wasm2js_scratch_load_i32(1 | 0) | 0;
  i64toi32_i32$1 = wasm2js_scratch_load_i32(0 | 0) | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function $80($0_1, $1_1, $2_1, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  var $4_1 = 0, $5_1 = 0, $6_1 = 0;
  $4_1 = global$0 - 160 | 0;
  global$0 = $4_1;
  $5_1 = $1_1 ? $0_1 : $4_1 + 158 | 0;
  HEAP32[($4_1 + 148 | 0) >> 2] = $5_1;
  $0_1 = -1;
  $6_1 = $1_1 + -1 | 0;
  HEAP32[($4_1 + 152 | 0) >> 2] = $6_1 >>> 0 > $1_1 >>> 0 ? 0 : $6_1;
  $4_1 = $42($4_1 | 0, 0 | 0, 144 | 0) | 0;
  HEAP32[($4_1 + 76 | 0) >> 2] = -1;
  HEAP32[($4_1 + 36 | 0) >> 2] = 6;
  HEAP32[($4_1 + 80 | 0) >> 2] = -1;
  HEAP32[($4_1 + 44 | 0) >> 2] = $4_1 + 159 | 0;
  HEAP32[($4_1 + 84 | 0) >> 2] = $4_1 + 148 | 0;
  label$1 : {
   label$2 : {
    if (($1_1 | 0) > (-1 | 0)) {
     break label$2
    }
    HEAP32[($64() | 0) >> 2] = 61;
    break label$1;
   }
   HEAP8[$5_1 >> 0] = 0;
   $0_1 = $76($4_1 | 0, $2_1 | 0, $3_1 | 0) | 0;
  }
  global$0 = $4_1 + 160 | 0;
  return $0_1 | 0;
 }
 
 function $81($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0, $5_1 = 0, $4_1 = 0, $7_1 = 0, $6_1 = 0;
  $3_1 = HEAP32[($0_1 + 84 | 0) >> 2] | 0;
  $4_1 = HEAP32[$3_1 >> 2] | 0;
  label$1 : {
   $5_1 = HEAP32[($3_1 + 4 | 0) >> 2] | 0;
   $6_1 = HEAP32[($0_1 + 28 | 0) >> 2] | 0;
   $7_1 = (HEAP32[($0_1 + 20 | 0) >> 2] | 0) - $6_1 | 0;
   $7_1 = $5_1 >>> 0 < $7_1 >>> 0 ? $5_1 : $7_1;
   if (!$7_1) {
    break label$1
   }
   $40($4_1 | 0, $6_1 | 0, $7_1 | 0) | 0;
   $4_1 = (HEAP32[$3_1 >> 2] | 0) + $7_1 | 0;
   HEAP32[$3_1 >> 2] = $4_1;
   $5_1 = (HEAP32[($3_1 + 4 | 0) >> 2] | 0) - $7_1 | 0;
   HEAP32[($3_1 + 4 | 0) >> 2] = $5_1;
  }
  label$2 : {
   $5_1 = $5_1 >>> 0 < $2_1 >>> 0 ? $5_1 : $2_1;
   if (!$5_1) {
    break label$2
   }
   $40($4_1 | 0, $1_1 | 0, $5_1 | 0) | 0;
   $4_1 = (HEAP32[$3_1 >> 2] | 0) + $5_1 | 0;
   HEAP32[$3_1 >> 2] = $4_1;
   HEAP32[($3_1 + 4 | 0) >> 2] = (HEAP32[($3_1 + 4 | 0) >> 2] | 0) - $5_1 | 0;
  }
  HEAP8[$4_1 >> 0] = 0;
  $3_1 = HEAP32[($0_1 + 44 | 0) >> 2] | 0;
  HEAP32[($0_1 + 28 | 0) >> 2] = $3_1;
  HEAP32[($0_1 + 20 | 0) >> 2] = $3_1;
  return $2_1 | 0;
 }
 
 function $82($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  return $80($0_1 | 0, 2147483647 | 0, $1_1 | 0, $2_1 | 0) | 0 | 0;
 }
 
 function $83($0_1) {
  $0_1 = $0_1 | 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   return 0 | 0;
  }
  HEAP32[($64() | 0) >> 2] = $0_1;
  return -1 | 0;
 }
 
 function $84() {
  return 42 | 0;
 }
 
 function $85() {
  return $84() | 0 | 0;
 }
 
 function $86() {
  return 7e4 | 0;
 }
 
 function $87() {
  HEAP32[(0 + 70096 | 0) >> 2] = 69976;
  HEAP32[(0 + 70024 | 0) >> 2] = $85() | 0;
 }
 
 function $88($0_1, $1_1, $2_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  var $3_1 = 0;
  $3_1 = 1;
  label$1 : {
   label$2 : {
    if (!$0_1) {
     break label$2
    }
    if ($1_1 >>> 0 <= 127 >>> 0) {
     break label$1
    }
    label$3 : {
     label$4 : {
      if (HEAP32[(HEAP32[(($86() | 0) + 96 | 0) >> 2] | 0) >> 2] | 0) {
       break label$4
      }
      if (($1_1 & -128 | 0 | 0) == (57216 | 0)) {
       break label$1
      }
      HEAP32[($64() | 0) >> 2] = 25;
      break label$3;
     }
     label$5 : {
      if ($1_1 >>> 0 > 2047 >>> 0) {
       break label$5
      }
      HEAP8[($0_1 + 1 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 6 | 0 | 192 | 0;
      return 2 | 0;
     }
     label$6 : {
      label$7 : {
       if ($1_1 >>> 0 < 55296 >>> 0) {
        break label$7
       }
       if (($1_1 & -8192 | 0 | 0) != (57344 | 0)) {
        break label$6
       }
      }
      HEAP8[($0_1 + 2 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 12 | 0 | 224 | 0;
      HEAP8[($0_1 + 1 | 0) >> 0] = ($1_1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      return 3 | 0;
     }
     label$8 : {
      if (($1_1 + -65536 | 0) >>> 0 > 1048575 >>> 0) {
       break label$8
      }
      HEAP8[($0_1 + 3 | 0) >> 0] = $1_1 & 63 | 0 | 128 | 0;
      HEAP8[$0_1 >> 0] = $1_1 >>> 18 | 0 | 240 | 0;
      HEAP8[($0_1 + 2 | 0) >> 0] = ($1_1 >>> 6 | 0) & 63 | 0 | 128 | 0;
      HEAP8[($0_1 + 1 | 0) >> 0] = ($1_1 >>> 12 | 0) & 63 | 0 | 128 | 0;
      return 4 | 0;
     }
     HEAP32[($64() | 0) >> 2] = 25;
    }
    $3_1 = -1;
   }
   return $3_1 | 0;
  }
  HEAP8[$0_1 >> 0] = $1_1;
  return 1 | 0;
 }
 
 function $89($0_1, $1_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   return 0 | 0;
  }
  return $88($0_1 | 0, $1_1 | 0, 0 | 0) | 0 | 0;
 }
 
 function $90($0_1, $1_1, $1$hi, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$1 = 0, i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$0 = 0, i64toi32_i32$3 = 0, $4$hi = 0, $18_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $11$hi = 0, $18$hi = 0, $19_1 = 0, $19$hi = 0, $4_1 = 0, $24$hi = 0;
  label$1 : {
   label$2 : {
    if (!($3_1 & 64 | 0)) {
     break label$2
    }
    i64toi32_i32$0 = $1$hi;
    i64toi32_i32$0 = 0;
    $11$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $1$hi;
    i64toi32_i32$2 = $1_1;
    i64toi32_i32$1 = $11$hi;
    i64toi32_i32$3 = $3_1 + -64 | 0;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
     $18_1 = 0;
    } else {
     i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
     $18_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
    }
    $2_1 = $18_1;
    $2$hi = i64toi32_i32$1;
    i64toi32_i32$1 = 0;
    $1_1 = 0;
    $1$hi = i64toi32_i32$1;
    break label$1;
   }
   if (!$3_1) {
    break label$1
   }
   i64toi32_i32$1 = $1$hi;
   i64toi32_i32$1 = 0;
   $18$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $1$hi;
   i64toi32_i32$0 = $1_1;
   i64toi32_i32$2 = $18$hi;
   i64toi32_i32$3 = 64 - $3_1 | 0;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = 0;
    $20_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
    $20_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
   }
   $19_1 = $20_1;
   $19$hi = i64toi32_i32$2;
   i64toi32_i32$2 = $2$hi;
   i64toi32_i32$2 = 0;
   $4_1 = $3_1;
   $4$hi = i64toi32_i32$2;
   i64toi32_i32$2 = $2$hi;
   i64toi32_i32$1 = $2_1;
   i64toi32_i32$0 = $4$hi;
   i64toi32_i32$3 = $3_1;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
    $21_1 = 0;
   } else {
    i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
    $21_1 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   }
   $24$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $19$hi;
   i64toi32_i32$2 = $19_1;
   i64toi32_i32$1 = $24$hi;
   i64toi32_i32$3 = $21_1;
   i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
   $2_1 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
   $2$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $1$hi;
   i64toi32_i32$1 = $4$hi;
   i64toi32_i32$1 = $1$hi;
   i64toi32_i32$0 = $1_1;
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$3 = $4_1;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    $22_1 = 0;
   } else {
    i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
    $22_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   }
   $1_1 = $22_1;
   $1$hi = i64toi32_i32$2;
  }
  i64toi32_i32$2 = $1$hi;
  i64toi32_i32$0 = $0_1;
  HEAP32[i64toi32_i32$0 >> 2] = $1_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
  i64toi32_i32$2 = $2$hi;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = $2_1;
  HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] = i64toi32_i32$2;
 }
 
 function $91($0_1, $1_1, $1$hi, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$4 = 0, i64toi32_i32$2 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $4$hi = 0, $18_1 = 0, $20_1 = 0, $21_1 = 0, $22_1 = 0, $11$hi = 0, $18$hi = 0, $19_1 = 0, $19$hi = 0, $4_1 = 0, $24$hi = 0;
  label$1 : {
   label$2 : {
    if (!($3_1 & 64 | 0)) {
     break label$2
    }
    i64toi32_i32$0 = $2$hi;
    i64toi32_i32$0 = 0;
    $11$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $2$hi;
    i64toi32_i32$2 = $2_1;
    i64toi32_i32$1 = $11$hi;
    i64toi32_i32$3 = $3_1 + -64 | 0;
    i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $18_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
     $18_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    $1_1 = $18_1;
    $1$hi = i64toi32_i32$1;
    i64toi32_i32$1 = 0;
    $2_1 = 0;
    $2$hi = i64toi32_i32$1;
    break label$1;
   }
   if (!$3_1) {
    break label$1
   }
   i64toi32_i32$1 = $2$hi;
   i64toi32_i32$1 = 0;
   $18$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $2$hi;
   i64toi32_i32$0 = $2_1;
   i64toi32_i32$2 = $18$hi;
   i64toi32_i32$3 = 64 - $3_1 | 0;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
    $20_1 = 0;
   } else {
    i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$0 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
    $20_1 = i64toi32_i32$0 << i64toi32_i32$4 | 0;
   }
   $19_1 = $20_1;
   $19$hi = i64toi32_i32$2;
   i64toi32_i32$2 = $1$hi;
   i64toi32_i32$2 = 0;
   $4_1 = $3_1;
   $4$hi = i64toi32_i32$2;
   i64toi32_i32$2 = $1$hi;
   i64toi32_i32$1 = $1_1;
   i64toi32_i32$0 = $4$hi;
   i64toi32_i32$3 = $3_1;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$0 = 0;
    $21_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
    $21_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
   }
   $24$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $19$hi;
   i64toi32_i32$2 = $19_1;
   i64toi32_i32$1 = $24$hi;
   i64toi32_i32$3 = $21_1;
   i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
   $1_1 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
   $1$hi = i64toi32_i32$1;
   i64toi32_i32$1 = $2$hi;
   i64toi32_i32$1 = $4$hi;
   i64toi32_i32$1 = $2$hi;
   i64toi32_i32$0 = $2_1;
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$3 = $4_1;
   i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = 0;
    $22_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   } else {
    i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
    $22_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
   }
   $2_1 = $22_1;
   $2$hi = i64toi32_i32$2;
  }
  i64toi32_i32$2 = $1$hi;
  i64toi32_i32$0 = $0_1;
  HEAP32[i64toi32_i32$0 >> 2] = $1_1;
  HEAP32[(i64toi32_i32$0 + 4 | 0) >> 2] = i64toi32_i32$2;
  i64toi32_i32$2 = $2$hi;
  HEAP32[(i64toi32_i32$0 + 8 | 0) >> 2] = $2_1;
  HEAP32[(i64toi32_i32$0 + 12 | 0) >> 2] = i64toi32_i32$2;
 }
 
 function $92($0_1, $0$hi, $1_1, $1$hi) {
  $0_1 = $0_1 | 0;
  $0$hi = $0$hi | 0;
  $1_1 = $1_1 | 0;
  $1$hi = $1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$5 = 0, i64toi32_i32$3 = 0, i64toi32_i32$1 = 0, $4_1 = 0, $4$hi = 0, $5$hi = 0, $5_1 = 0, $2_1 = 0, $3_1 = 0, $44_1 = 0, $45_1 = 0, $46_1 = 0, $47_1 = 0, $48_1 = 0, $49_1 = 0, $50_1 = 0, $12_1 = 0, $12$hi = 0, $14$hi = 0, $17_1 = 0, $17$hi = 0, $19$hi = 0, $33_1 = 0, $33$hi = 0, $36_1 = 0, $38_1 = 0, $43_1 = 0, $43$hi = 0, $45$hi = 0, $73_1 = 0, $73$hi = 0, $77$hi = 0, $80_1 = 0, $80$hi = 0, $82_1 = 0, $82$hi = 0, $86_1 = 0, $86$hi = 0, $88_1 = 0, $89$hi = 0, $98$hi = 0, $105_1 = 0, $105$hi = 0;
  $2_1 = global$0 - 32 | 0;
  global$0 = $2_1;
  label$1 : {
   label$2 : {
    i64toi32_i32$0 = $1$hi;
    i64toi32_i32$2 = $1_1;
    i64toi32_i32$1 = 2147483647;
    i64toi32_i32$3 = -1;
    i64toi32_i32$1 = i64toi32_i32$0 & i64toi32_i32$1 | 0;
    $4_1 = i64toi32_i32$2 & i64toi32_i32$3 | 0;
    $4$hi = i64toi32_i32$1;
    i64toi32_i32$0 = $4_1;
    i64toi32_i32$2 = -1006698496;
    i64toi32_i32$3 = 0;
    i64toi32_i32$4 = i64toi32_i32$0 + i64toi32_i32$3 | 0;
    i64toi32_i32$5 = i64toi32_i32$1 + i64toi32_i32$2 | 0;
    if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
    }
    $12_1 = i64toi32_i32$4;
    $12$hi = i64toi32_i32$5;
    i64toi32_i32$5 = $4$hi;
    i64toi32_i32$1 = $4_1;
    i64toi32_i32$0 = -1140785152;
    i64toi32_i32$3 = 0;
    i64toi32_i32$2 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
    i64toi32_i32$4 = i64toi32_i32$5 + i64toi32_i32$0 | 0;
    if (i64toi32_i32$2 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$4 = i64toi32_i32$4 + 1 | 0
    }
    $14$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $12$hi;
    i64toi32_i32$5 = $12_1;
    i64toi32_i32$1 = $14$hi;
    i64toi32_i32$3 = i64toi32_i32$2;
    if (i64toi32_i32$4 >>> 0 > i64toi32_i32$1 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$1 | 0) & i64toi32_i32$5 >>> 0 >= i64toi32_i32$2 >>> 0 | 0) | 0) {
     break label$2
    }
    i64toi32_i32$5 = $0$hi;
    i64toi32_i32$3 = $0_1;
    i64toi32_i32$4 = 0;
    i64toi32_i32$1 = 60;
    i64toi32_i32$0 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$4 = 0;
     $44_1 = i64toi32_i32$5 >>> i64toi32_i32$0 | 0;
    } else {
     i64toi32_i32$4 = i64toi32_i32$5 >>> i64toi32_i32$0 | 0;
     $44_1 = (((1 << i64toi32_i32$0 | 0) - 1 | 0) & i64toi32_i32$5 | 0) << (32 - i64toi32_i32$0 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$0 | 0) | 0;
    }
    $17_1 = $44_1;
    $17$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $1$hi;
    i64toi32_i32$5 = $1_1;
    i64toi32_i32$3 = 0;
    i64toi32_i32$1 = 4;
    i64toi32_i32$0 = i64toi32_i32$1 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$1 & 63 | 0) >>> 0) {
     i64toi32_i32$3 = i64toi32_i32$5 << i64toi32_i32$0 | 0;
     $45_1 = 0;
    } else {
     i64toi32_i32$3 = ((1 << i64toi32_i32$0 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$0 | 0) | 0) | 0 | (i64toi32_i32$4 << i64toi32_i32$0 | 0) | 0;
     $45_1 = i64toi32_i32$5 << i64toi32_i32$0 | 0;
    }
    $19$hi = i64toi32_i32$3;
    i64toi32_i32$3 = $17$hi;
    i64toi32_i32$4 = $17_1;
    i64toi32_i32$5 = $19$hi;
    i64toi32_i32$1 = $45_1;
    i64toi32_i32$5 = i64toi32_i32$3 | i64toi32_i32$5 | 0;
    $4_1 = i64toi32_i32$4 | i64toi32_i32$1 | 0;
    $4$hi = i64toi32_i32$5;
    label$3 : {
     i64toi32_i32$5 = $0$hi;
     i64toi32_i32$3 = $0_1;
     i64toi32_i32$4 = 268435455;
     i64toi32_i32$1 = -1;
     i64toi32_i32$4 = i64toi32_i32$5 & i64toi32_i32$4 | 0;
     $0_1 = i64toi32_i32$3 & i64toi32_i32$1 | 0;
     $0$hi = i64toi32_i32$4;
     i64toi32_i32$5 = $0_1;
     i64toi32_i32$3 = 134217728;
     i64toi32_i32$1 = 1;
     if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$3 | 0) & i64toi32_i32$5 >>> 0 < i64toi32_i32$1 >>> 0 | 0) | 0) {
      break label$3
     }
     i64toi32_i32$5 = $4$hi;
     i64toi32_i32$1 = $4_1;
     i64toi32_i32$4 = 1073741824;
     i64toi32_i32$3 = 1;
     i64toi32_i32$0 = i64toi32_i32$1 + i64toi32_i32$3 | 0;
     i64toi32_i32$2 = i64toi32_i32$5 + i64toi32_i32$4 | 0;
     if (i64toi32_i32$0 >>> 0 < i64toi32_i32$3 >>> 0) {
      i64toi32_i32$2 = i64toi32_i32$2 + 1 | 0
     }
     $5_1 = i64toi32_i32$0;
     $5$hi = i64toi32_i32$2;
     break label$1;
    }
    i64toi32_i32$2 = $4$hi;
    i64toi32_i32$5 = $4_1;
    i64toi32_i32$1 = 1073741824;
    i64toi32_i32$3 = 0;
    i64toi32_i32$4 = i64toi32_i32$5 + i64toi32_i32$3 | 0;
    i64toi32_i32$0 = i64toi32_i32$2 + i64toi32_i32$1 | 0;
    if (i64toi32_i32$4 >>> 0 < i64toi32_i32$3 >>> 0) {
     i64toi32_i32$0 = i64toi32_i32$0 + 1 | 0
    }
    $5_1 = i64toi32_i32$4;
    $5$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $0$hi;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$5 = 134217728;
    i64toi32_i32$3 = 0;
    if ((i64toi32_i32$2 | 0) != (i64toi32_i32$3 | 0) | (i64toi32_i32$0 | 0) != (i64toi32_i32$5 | 0) | 0) {
     break label$1
    }
    i64toi32_i32$2 = $5$hi;
    i64toi32_i32$2 = $4$hi;
    i64toi32_i32$3 = $4_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$5 = 1;
    i64toi32_i32$0 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
    $33_1 = i64toi32_i32$3 & i64toi32_i32$5 | 0;
    $33$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $5$hi;
    i64toi32_i32$2 = i64toi32_i32$4;
    i64toi32_i32$3 = $33$hi;
    i64toi32_i32$5 = $33_1;
    i64toi32_i32$1 = i64toi32_i32$2 + i64toi32_i32$5 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 + i64toi32_i32$3 | 0;
    if (i64toi32_i32$1 >>> 0 < i64toi32_i32$5 >>> 0) {
     i64toi32_i32$4 = i64toi32_i32$4 + 1 | 0
    }
    $5_1 = i64toi32_i32$1;
    $5$hi = i64toi32_i32$4;
    break label$1;
   }
   label$4 : {
    i64toi32_i32$4 = $0$hi;
    $36_1 = !($0_1 | i64toi32_i32$4 | 0);
    i64toi32_i32$4 = $4$hi;
    i64toi32_i32$0 = $4_1;
    i64toi32_i32$2 = 2147418112;
    i64toi32_i32$5 = 0;
    $38_1 = i64toi32_i32$4 >>> 0 < i64toi32_i32$2 >>> 0 | ((i64toi32_i32$4 | 0) == (i64toi32_i32$2 | 0) & i64toi32_i32$0 >>> 0 < i64toi32_i32$5 >>> 0 | 0) | 0;
    i64toi32_i32$0 = i64toi32_i32$4;
    i64toi32_i32$0 = i64toi32_i32$4;
    i64toi32_i32$5 = $4_1;
    i64toi32_i32$4 = 2147418112;
    i64toi32_i32$2 = 0;
    if ((i64toi32_i32$5 | 0) == (i64toi32_i32$2 | 0) & (i64toi32_i32$0 | 0) == (i64toi32_i32$4 | 0) | 0 ? $36_1 : $38_1) {
     break label$4
    }
    i64toi32_i32$5 = $0$hi;
    i64toi32_i32$2 = $0_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$4 = 60;
    i64toi32_i32$3 = i64toi32_i32$4 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$4 & 63 | 0) >>> 0) {
     i64toi32_i32$0 = 0;
     $46_1 = i64toi32_i32$5 >>> i64toi32_i32$3 | 0;
    } else {
     i64toi32_i32$0 = i64toi32_i32$5 >>> i64toi32_i32$3 | 0;
     $46_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$5 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$3 | 0) | 0;
    }
    $43_1 = $46_1;
    $43$hi = i64toi32_i32$0;
    i64toi32_i32$0 = $1$hi;
    i64toi32_i32$5 = $1_1;
    i64toi32_i32$2 = 0;
    i64toi32_i32$4 = 4;
    i64toi32_i32$3 = i64toi32_i32$4 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$4 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$3 | 0;
     $47_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$3 | 0) | 0;
     $47_1 = i64toi32_i32$5 << i64toi32_i32$3 | 0;
    }
    $45$hi = i64toi32_i32$2;
    i64toi32_i32$2 = $43$hi;
    i64toi32_i32$0 = $43_1;
    i64toi32_i32$5 = $45$hi;
    i64toi32_i32$4 = $47_1;
    i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
    i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$4 | 0;
    i64toi32_i32$0 = 524287;
    i64toi32_i32$4 = -1;
    i64toi32_i32$0 = i64toi32_i32$5 & i64toi32_i32$0 | 0;
    i64toi32_i32$5 = i64toi32_i32$2 & i64toi32_i32$4 | 0;
    i64toi32_i32$2 = 2146959360;
    i64toi32_i32$4 = 0;
    i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
    $5_1 = i64toi32_i32$5 | i64toi32_i32$4 | 0;
    $5$hi = i64toi32_i32$2;
    break label$1;
   }
   i64toi32_i32$2 = 2146435072;
   $5_1 = 0;
   $5$hi = i64toi32_i32$2;
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$0 = $4_1;
   i64toi32_i32$5 = 1140785151;
   i64toi32_i32$4 = -1;
   if (i64toi32_i32$2 >>> 0 > i64toi32_i32$5 >>> 0 | ((i64toi32_i32$2 | 0) == (i64toi32_i32$5 | 0) & i64toi32_i32$0 >>> 0 > i64toi32_i32$4 >>> 0 | 0) | 0) {
    break label$1
   }
   i64toi32_i32$0 = 0;
   $5_1 = 0;
   $5$hi = i64toi32_i32$0;
   i64toi32_i32$0 = i64toi32_i32$2;
   i64toi32_i32$0 = i64toi32_i32$2;
   i64toi32_i32$4 = $4_1;
   i64toi32_i32$2 = 0;
   i64toi32_i32$5 = 48;
   i64toi32_i32$3 = i64toi32_i32$5 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$5 & 63 | 0) >>> 0) {
    i64toi32_i32$2 = 0;
    $48_1 = i64toi32_i32$0 >>> i64toi32_i32$3 | 0;
   } else {
    i64toi32_i32$2 = i64toi32_i32$0 >>> i64toi32_i32$3 | 0;
    $48_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$4 >>> i64toi32_i32$3 | 0) | 0;
   }
   $3_1 = $48_1;
   if ($3_1 >>> 0 < 15249 >>> 0) {
    break label$1
   }
   i64toi32_i32$2 = $0$hi;
   i64toi32_i32$2 = $1$hi;
   i64toi32_i32$0 = $1_1;
   i64toi32_i32$4 = 65535;
   i64toi32_i32$5 = -1;
   i64toi32_i32$4 = i64toi32_i32$2 & i64toi32_i32$4 | 0;
   i64toi32_i32$2 = i64toi32_i32$0 & i64toi32_i32$5 | 0;
   i64toi32_i32$0 = 65536;
   i64toi32_i32$5 = 0;
   i64toi32_i32$0 = i64toi32_i32$4 | i64toi32_i32$0 | 0;
   $4_1 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
   $4$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $0$hi;
   i64toi32_i32$2 = $4$hi;
   $90($2_1 + 16 | 0 | 0, $0_1 | 0, i64toi32_i32$0 | 0, $4_1 | 0, i64toi32_i32$2 | 0, $3_1 + -15233 | 0 | 0);
   i64toi32_i32$2 = i64toi32_i32$0;
   i64toi32_i32$2 = $4$hi;
   i64toi32_i32$2 = i64toi32_i32$0;
   i64toi32_i32$0 = $4$hi;
   $91($2_1 | 0, $0_1 | 0, i64toi32_i32$2 | 0, $4_1 | 0, i64toi32_i32$0 | 0, 15361 - $3_1 | 0 | 0);
   i64toi32_i32$4 = $2_1;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$4 >> 2] | 0;
   i64toi32_i32$2 = HEAP32[(i64toi32_i32$4 + 4 | 0) >> 2] | 0;
   $4_1 = i64toi32_i32$0;
   $4$hi = i64toi32_i32$2;
   i64toi32_i32$4 = i64toi32_i32$0;
   i64toi32_i32$0 = 0;
   i64toi32_i32$5 = 60;
   i64toi32_i32$3 = i64toi32_i32$5 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$5 & 63 | 0) >>> 0) {
    i64toi32_i32$0 = 0;
    $49_1 = i64toi32_i32$2 >>> i64toi32_i32$3 | 0;
   } else {
    i64toi32_i32$0 = i64toi32_i32$2 >>> i64toi32_i32$3 | 0;
    $49_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$4 >>> i64toi32_i32$3 | 0) | 0;
   }
   $73_1 = $49_1;
   $73$hi = i64toi32_i32$0;
   i64toi32_i32$2 = $2_1 + 8 | 0;
   i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
   i64toi32_i32$4 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
   i64toi32_i32$2 = i64toi32_i32$0;
   i64toi32_i32$0 = 0;
   i64toi32_i32$5 = 4;
   i64toi32_i32$3 = i64toi32_i32$5 & 31 | 0;
   if (32 >>> 0 <= (i64toi32_i32$5 & 63 | 0) >>> 0) {
    i64toi32_i32$0 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
    $50_1 = 0;
   } else {
    i64toi32_i32$0 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$4 << i64toi32_i32$3 | 0) | 0;
    $50_1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
   }
   $77$hi = i64toi32_i32$0;
   i64toi32_i32$0 = $73$hi;
   i64toi32_i32$4 = $73_1;
   i64toi32_i32$2 = $77$hi;
   i64toi32_i32$5 = $50_1;
   i64toi32_i32$2 = i64toi32_i32$0 | i64toi32_i32$2 | 0;
   $5_1 = i64toi32_i32$4 | i64toi32_i32$5 | 0;
   $5$hi = i64toi32_i32$2;
   label$5 : {
    i64toi32_i32$2 = $4$hi;
    i64toi32_i32$0 = $4_1;
    i64toi32_i32$4 = 268435455;
    i64toi32_i32$5 = -1;
    i64toi32_i32$4 = i64toi32_i32$2 & i64toi32_i32$4 | 0;
    $80_1 = i64toi32_i32$0 & i64toi32_i32$5 | 0;
    $80$hi = i64toi32_i32$4;
    i64toi32_i32$2 = $2_1;
    i64toi32_i32$4 = HEAP32[(i64toi32_i32$2 + 16 | 0) >> 2] | 0;
    i64toi32_i32$0 = HEAP32[(i64toi32_i32$2 + 20 | 0) >> 2] | 0;
    $82_1 = i64toi32_i32$4;
    $82$hi = i64toi32_i32$0;
    i64toi32_i32$2 = (i64toi32_i32$2 + 16 | 0) + 8 | 0;
    i64toi32_i32$0 = HEAP32[i64toi32_i32$2 >> 2] | 0;
    i64toi32_i32$4 = HEAP32[(i64toi32_i32$2 + 4 | 0) >> 2] | 0;
    $86_1 = i64toi32_i32$0;
    $86$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $82$hi;
    i64toi32_i32$2 = $82_1;
    i64toi32_i32$0 = $86$hi;
    i64toi32_i32$5 = $86_1;
    i64toi32_i32$0 = i64toi32_i32$4 | i64toi32_i32$0 | 0;
    i64toi32_i32$4 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
    i64toi32_i32$2 = 0;
    i64toi32_i32$5 = 0;
    $88_1 = (i64toi32_i32$4 | 0) != (i64toi32_i32$5 | 0) | (i64toi32_i32$0 | 0) != (i64toi32_i32$2 | 0) | 0;
    i64toi32_i32$4 = 0;
    $89$hi = i64toi32_i32$4;
    i64toi32_i32$4 = $80$hi;
    i64toi32_i32$5 = $80_1;
    i64toi32_i32$0 = $89$hi;
    i64toi32_i32$2 = $88_1;
    i64toi32_i32$0 = i64toi32_i32$4 | i64toi32_i32$0 | 0;
    $4_1 = i64toi32_i32$5 | i64toi32_i32$2 | 0;
    $4$hi = i64toi32_i32$0;
    i64toi32_i32$4 = $4_1;
    i64toi32_i32$5 = 134217728;
    i64toi32_i32$2 = 1;
    if (i64toi32_i32$0 >>> 0 < i64toi32_i32$5 >>> 0 | ((i64toi32_i32$0 | 0) == (i64toi32_i32$5 | 0) & i64toi32_i32$4 >>> 0 < i64toi32_i32$2 >>> 0 | 0) | 0) {
     break label$5
    }
    i64toi32_i32$4 = $5$hi;
    i64toi32_i32$2 = $5_1;
    i64toi32_i32$0 = 0;
    i64toi32_i32$5 = 1;
    i64toi32_i32$3 = i64toi32_i32$2 + i64toi32_i32$5 | 0;
    i64toi32_i32$1 = i64toi32_i32$4 + i64toi32_i32$0 | 0;
    if (i64toi32_i32$3 >>> 0 < i64toi32_i32$5 >>> 0) {
     i64toi32_i32$1 = i64toi32_i32$1 + 1 | 0
    }
    $5_1 = i64toi32_i32$3;
    $5$hi = i64toi32_i32$1;
    break label$1;
   }
   i64toi32_i32$1 = $4$hi;
   i64toi32_i32$4 = $4_1;
   i64toi32_i32$2 = 134217728;
   i64toi32_i32$5 = 0;
   if ((i64toi32_i32$4 | 0) != (i64toi32_i32$5 | 0) | (i64toi32_i32$1 | 0) != (i64toi32_i32$2 | 0) | 0) {
    break label$1
   }
   i64toi32_i32$4 = $5$hi;
   i64toi32_i32$5 = $5_1;
   i64toi32_i32$1 = 0;
   i64toi32_i32$2 = 1;
   i64toi32_i32$1 = i64toi32_i32$4 & i64toi32_i32$1 | 0;
   $98$hi = i64toi32_i32$1;
   i64toi32_i32$1 = i64toi32_i32$4;
   i64toi32_i32$1 = $98$hi;
   i64toi32_i32$4 = i64toi32_i32$5 & i64toi32_i32$2 | 0;
   i64toi32_i32$5 = $5$hi;
   i64toi32_i32$2 = $5_1;
   i64toi32_i32$0 = i64toi32_i32$4 + i64toi32_i32$2 | 0;
   i64toi32_i32$3 = i64toi32_i32$1 + i64toi32_i32$5 | 0;
   if (i64toi32_i32$0 >>> 0 < i64toi32_i32$2 >>> 0) {
    i64toi32_i32$3 = i64toi32_i32$3 + 1 | 0
   }
   $5_1 = i64toi32_i32$0;
   $5$hi = i64toi32_i32$3;
  }
  global$0 = $2_1 + 32 | 0;
  i64toi32_i32$3 = $5$hi;
  i64toi32_i32$3 = $1$hi;
  i64toi32_i32$1 = $1_1;
  i64toi32_i32$4 = -2147483648;
  i64toi32_i32$2 = 0;
  i64toi32_i32$4 = i64toi32_i32$3 & i64toi32_i32$4 | 0;
  $105_1 = i64toi32_i32$1 & i64toi32_i32$2 | 0;
  $105$hi = i64toi32_i32$4;
  i64toi32_i32$4 = $5$hi;
  i64toi32_i32$3 = $5_1;
  i64toi32_i32$1 = $105$hi;
  i64toi32_i32$2 = $105_1;
  i64toi32_i32$1 = i64toi32_i32$4 | i64toi32_i32$1 | 0;
  wasm2js_scratch_store_i32(0 | 0, i64toi32_i32$3 | i64toi32_i32$2 | 0 | 0);
  wasm2js_scratch_store_i32(1 | 0, i64toi32_i32$1 | 0);
  return +(+wasm2js_scratch_load_f64());
 }
 
 function $93($0_1) {
  $0_1 = $0_1 | 0;
  global$1 = $0_1;
 }
 
 function $95() {
  global$3 = 65536;
  global$2 = (0 + 15 | 0) & -16 | 0;
 }
 
 function $96() {
  return global$0 - global$2 | 0 | 0;
 }
 
 function $97() {
  return global$3 | 0;
 }
 
 function $98() {
  return global$2 | 0;
 }
 
 function $99($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0, i64toi32_i32$1 = 0, $2_1 = 0, i64toi32_i32$0 = 0, $3_1 = 0;
  label$1 : {
   if ($0_1) {
    break label$1
   }
   $1_1 = 0;
   label$2 : {
    if (!(HEAP32[(0 + 68888 | 0) >> 2] | 0)) {
     break label$2
    }
    $1_1 = $99(HEAP32[(0 + 68888 | 0) >> 2] | 0 | 0) | 0;
   }
   label$3 : {
    if (!(HEAP32[(0 + 69936 | 0) >> 2] | 0)) {
     break label$3
    }
    $1_1 = $99(HEAP32[(0 + 69936 | 0) >> 2] | 0 | 0) | 0 | $1_1 | 0;
   }
   label$4 : {
    $0_1 = HEAP32[($58() | 0) >> 2] | 0;
    if (!$0_1) {
     break label$4
    }
    label$5 : while (1) {
     $2_1 = 0;
     label$6 : {
      if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) < (0 | 0)) {
       break label$6
      }
      $2_1 = $54($0_1 | 0) | 0;
     }
     label$7 : {
      if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0 | 0) == (HEAP32[($0_1 + 28 | 0) >> 2] | 0 | 0)) {
       break label$7
      }
      $1_1 = $99($0_1 | 0) | 0 | $1_1 | 0;
     }
     label$8 : {
      if (!$2_1) {
       break label$8
      }
      $55($0_1 | 0);
     }
     $0_1 = HEAP32[($0_1 + 56 | 0) >> 2] | 0;
     if ($0_1) {
      continue label$5
     }
     break label$5;
    };
   }
   $59();
   return $1_1 | 0;
  }
  label$9 : {
   label$10 : {
    if ((HEAP32[($0_1 + 76 | 0) >> 2] | 0 | 0) >= (0 | 0)) {
     break label$10
    }
    $2_1 = 1;
    break label$9;
   }
   $2_1 = !($54($0_1 | 0) | 0);
  }
  label$11 : {
   label$12 : {
    label$13 : {
     if ((HEAP32[($0_1 + 20 | 0) >> 2] | 0 | 0) == (HEAP32[($0_1 + 28 | 0) >> 2] | 0 | 0)) {
      break label$13
     }
     FUNCTION_TABLE[HEAP32[($0_1 + 36 | 0) >> 2] | 0 | 0]($0_1, 0, 0) | 0;
     if (HEAP32[($0_1 + 20 | 0) >> 2] | 0) {
      break label$13
     }
     $1_1 = -1;
     if (!$2_1) {
      break label$12
     }
     break label$11;
    }
    label$14 : {
     $1_1 = HEAP32[($0_1 + 4 | 0) >> 2] | 0;
     $3_1 = HEAP32[($0_1 + 8 | 0) >> 2] | 0;
     if (($1_1 | 0) == ($3_1 | 0)) {
      break label$14
     }
     i64toi32_i32$1 = $1_1 - $3_1 | 0;
     i64toi32_i32$0 = i64toi32_i32$1 >> 31 | 0;
     i64toi32_i32$0 = FUNCTION_TABLE[HEAP32[($0_1 + 40 | 0) >> 2] | 0 | 0]($0_1, i64toi32_i32$1, i64toi32_i32$0, 1) | 0;
     i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
    }
    $1_1 = 0;
    HEAP32[($0_1 + 28 | 0) >> 2] = 0;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$1 = 0;
    HEAP32[($0_1 + 16 | 0) >> 2] = 0;
    HEAP32[($0_1 + 20 | 0) >> 2] = i64toi32_i32$1;
    i64toi32_i32$0 = $0_1;
    i64toi32_i32$1 = 0;
    HEAP32[($0_1 + 4 | 0) >> 2] = 0;
    HEAP32[($0_1 + 8 | 0) >> 2] = i64toi32_i32$1;
    if ($2_1) {
     break label$11
    }
   }
   $55($0_1 | 0);
  }
  return $1_1 | 0;
 }
 
 function $100() {
  return global$0 | 0;
 }
 
 function $101($0_1) {
  $0_1 = $0_1 | 0;
  global$0 = $0_1;
 }
 
 function $102($0_1) {
  $0_1 = $0_1 | 0;
  var $1_1 = 0;
  $1_1 = (global$0 - $0_1 | 0) & -16 | 0;
  global$0 = $1_1;
  return $1_1 | 0;
 }
 
 function $103() {
  return global$0 | 0;
 }
 
 function $104($0_1, $1_1, $2_1, $2$hi, $3_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $2$hi = $2$hi | 0;
  $3_1 = $3_1 | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = $2$hi;
  i64toi32_i32$0 = FUNCTION_TABLE[$0_1 | 0]($1_1, $2_1, i64toi32_i32$0, $3_1) | 0;
  i64toi32_i32$1 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$0 | 0;
 }
 
 function $105($0_1, $1_1, $2_1, $3_1, $4_1) {
  $0_1 = $0_1 | 0;
  $1_1 = $1_1 | 0;
  $2_1 = $2_1 | 0;
  $3_1 = $3_1 | 0;
  $4_1 = $4_1 | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, i64toi32_i32$3 = 0, $17_1 = 0, $18_1 = 0, $6_1 = 0, $7_1 = 0, $9_1 = 0, $9$hi = 0, $12$hi = 0, $5_1 = 0, $5$hi = 0;
  $6_1 = $0_1;
  $7_1 = $1_1;
  i64toi32_i32$0 = 0;
  $9_1 = $2_1;
  $9$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$2 = $3_1;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
   $17_1 = 0;
  } else {
   i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$0 << i64toi32_i32$4 | 0) | 0;
   $17_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
  }
  $12$hi = i64toi32_i32$1;
  i64toi32_i32$1 = $9$hi;
  i64toi32_i32$0 = $9_1;
  i64toi32_i32$2 = $12$hi;
  i64toi32_i32$3 = $17_1;
  i64toi32_i32$2 = i64toi32_i32$1 | i64toi32_i32$2 | 0;
  i64toi32_i32$2 = $104($6_1 | 0, $7_1 | 0, i64toi32_i32$0 | i64toi32_i32$3 | 0 | 0, i64toi32_i32$2 | 0, $4_1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  $5_1 = i64toi32_i32$2;
  $5$hi = i64toi32_i32$0;
  i64toi32_i32$1 = i64toi32_i32$2;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $18_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $18_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$1 >>> i64toi32_i32$4 | 0) | 0;
  }
  $93($18_1 | 0);
  i64toi32_i32$2 = $5$hi;
  return $5_1 | 0;
 }
 
 function _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$4 = 0, i64toi32_i32$0 = 0, i64toi32_i32$1 = 0, var$2 = 0, i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, var$3 = 0, var$4 = 0, var$5 = 0, $21_1 = 0, $22_1 = 0, var$6 = 0, $24_1 = 0, $17_1 = 0, $18_1 = 0, $23_1 = 0, $29_1 = 0, $45_1 = 0, $56$hi = 0, $62$hi = 0;
  i64toi32_i32$0 = var$1$hi;
  var$2 = var$1;
  var$4 = var$2 >>> 16 | 0;
  i64toi32_i32$0 = var$0$hi;
  var$3 = var$0;
  var$5 = var$3 >>> 16 | 0;
  $17_1 = Math_imul(var$4, var$5);
  $18_1 = var$2;
  i64toi32_i32$2 = var$3;
  i64toi32_i32$1 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$1 = 0;
   $21_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
   $21_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
  }
  $23_1 = $17_1 + Math_imul($18_1, $21_1) | 0;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$0 = var$1;
  i64toi32_i32$2 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$2 = 0;
   $22_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
  } else {
   i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
   $22_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
  }
  $29_1 = $23_1 + Math_imul($22_1, var$3) | 0;
  var$2 = var$2 & 65535 | 0;
  var$3 = var$3 & 65535 | 0;
  var$6 = Math_imul(var$2, var$3);
  var$2 = (var$6 >>> 16 | 0) + Math_imul(var$2, var$5) | 0;
  $45_1 = $29_1 + (var$2 >>> 16 | 0) | 0;
  var$2 = (var$2 & 65535 | 0) + Math_imul(var$4, var$3) | 0;
  i64toi32_i32$2 = 0;
  i64toi32_i32$1 = $45_1 + (var$2 >>> 16 | 0) | 0;
  i64toi32_i32$0 = 0;
  i64toi32_i32$3 = 32;
  i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
  if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
   i64toi32_i32$0 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
   $24_1 = 0;
  } else {
   i64toi32_i32$0 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$1 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$2 << i64toi32_i32$4 | 0) | 0;
   $24_1 = i64toi32_i32$1 << i64toi32_i32$4 | 0;
  }
  $56$hi = i64toi32_i32$0;
  i64toi32_i32$0 = 0;
  $62$hi = i64toi32_i32$0;
  i64toi32_i32$0 = $56$hi;
  i64toi32_i32$2 = $24_1;
  i64toi32_i32$1 = $62$hi;
  i64toi32_i32$3 = var$2 << 16 | 0 | (var$6 & 65535 | 0) | 0;
  i64toi32_i32$1 = i64toi32_i32$0 | i64toi32_i32$1 | 0;
  i64toi32_i32$2 = i64toi32_i32$2 | i64toi32_i32$3 | 0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
  return i64toi32_i32$2 | 0;
 }
 
 function _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$2 = 0, i64toi32_i32$3 = 0, i64toi32_i32$4 = 0, i64toi32_i32$1 = 0, i64toi32_i32$0 = 0, i64toi32_i32$5 = 0, var$2 = 0, var$3 = 0, var$4 = 0, var$5 = 0, var$5$hi = 0, var$6 = 0, var$6$hi = 0, i64toi32_i32$6 = 0, $37_1 = 0, $38_1 = 0, $39_1 = 0, $40_1 = 0, $41_1 = 0, $42_1 = 0, $43_1 = 0, $44_1 = 0, var$8$hi = 0, $45_1 = 0, $46_1 = 0, $47_1 = 0, $48_1 = 0, var$7$hi = 0, $49_1 = 0, $63$hi = 0, $65_1 = 0, $65$hi = 0, $120$hi = 0, $129$hi = 0, $134$hi = 0, var$8 = 0, $140 = 0, $140$hi = 0, $142$hi = 0, $144 = 0, $144$hi = 0, $151 = 0, $151$hi = 0, $154$hi = 0, var$7 = 0, $165$hi = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$8 : {
          label$9 : {
           label$10 : {
            label$11 : {
             i64toi32_i32$0 = var$0$hi;
             i64toi32_i32$2 = var$0;
             i64toi32_i32$1 = 0;
             i64toi32_i32$3 = 32;
             i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
             if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
              i64toi32_i32$1 = 0;
              $37_1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
             } else {
              i64toi32_i32$1 = i64toi32_i32$0 >>> i64toi32_i32$4 | 0;
              $37_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$0 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
             }
             var$2 = $37_1;
             if (var$2) {
              i64toi32_i32$1 = var$1$hi;
              var$3 = var$1;
              if (!var$3) {
               break label$11
              }
              i64toi32_i32$0 = var$3;
              i64toi32_i32$2 = 0;
              i64toi32_i32$3 = 32;
              i64toi32_i32$4 = i64toi32_i32$3 & 31 | 0;
              if (32 >>> 0 <= (i64toi32_i32$3 & 63 | 0) >>> 0) {
               i64toi32_i32$2 = 0;
               $38_1 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
              } else {
               i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$4 | 0;
               $38_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$0 >>> i64toi32_i32$4 | 0) | 0;
              }
              var$4 = $38_1;
              if (!var$4) {
               break label$9
              }
              var$2 = Math_clz32(var$4) - Math_clz32(var$2) | 0;
              if (var$2 >>> 0 <= 31 >>> 0) {
               break label$8
              }
              break label$2;
             }
             i64toi32_i32$2 = var$1$hi;
             i64toi32_i32$1 = var$1;
             i64toi32_i32$0 = 1;
             i64toi32_i32$3 = 0;
             if (i64toi32_i32$2 >>> 0 > i64toi32_i32$0 >>> 0 | ((i64toi32_i32$2 | 0) == (i64toi32_i32$0 | 0) & i64toi32_i32$1 >>> 0 >= i64toi32_i32$3 >>> 0 | 0) | 0) {
              break label$2
             }
             i64toi32_i32$1 = var$0$hi;
             var$2 = var$0;
             i64toi32_i32$1 = i64toi32_i32$2;
             i64toi32_i32$1 = i64toi32_i32$2;
             var$3 = var$1;
             var$2 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
             i64toi32_i32$1 = 0;
             __wasm_intrinsics_temp_i64 = var$0 - Math_imul(var$2, var$3) | 0;
             __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
             i64toi32_i32$1 = 0;
             i64toi32_i32$2 = var$2;
             i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
             return i64toi32_i32$2 | 0;
            }
            i64toi32_i32$2 = var$1$hi;
            i64toi32_i32$3 = var$1;
            i64toi32_i32$1 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$1 = 0;
             $39_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
            } else {
             i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
             $39_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
            }
            var$3 = $39_1;
            i64toi32_i32$1 = var$0$hi;
            if (!var$0) {
             break label$7
            }
            if (!var$3) {
             break label$6
            }
            var$4 = var$3 + -1 | 0;
            if (var$4 & var$3 | 0) {
             break label$6
            }
            i64toi32_i32$1 = 0;
            i64toi32_i32$2 = var$4 & var$2 | 0;
            i64toi32_i32$3 = 0;
            i64toi32_i32$0 = 32;
            i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
            if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
             i64toi32_i32$3 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
             $40_1 = 0;
            } else {
             i64toi32_i32$3 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
             $40_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
            }
            $63$hi = i64toi32_i32$3;
            i64toi32_i32$3 = var$0$hi;
            i64toi32_i32$1 = var$0;
            i64toi32_i32$2 = 0;
            i64toi32_i32$0 = -1;
            i64toi32_i32$2 = i64toi32_i32$3 & i64toi32_i32$2 | 0;
            $65_1 = i64toi32_i32$1 & i64toi32_i32$0 | 0;
            $65$hi = i64toi32_i32$2;
            i64toi32_i32$2 = $63$hi;
            i64toi32_i32$3 = $40_1;
            i64toi32_i32$1 = $65$hi;
            i64toi32_i32$0 = $65_1;
            i64toi32_i32$1 = i64toi32_i32$2 | i64toi32_i32$1 | 0;
            __wasm_intrinsics_temp_i64 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
            __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
            i64toi32_i32$1 = 0;
            i64toi32_i32$3 = var$2 >>> ((__wasm_ctz_i32(var$3 | 0) | 0) & 31 | 0) | 0;
            i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
            return i64toi32_i32$3 | 0;
           }
          }
          var$4 = var$3 + -1 | 0;
          if (!(var$4 & var$3 | 0)) {
           break label$5
          }
          var$2 = (Math_clz32(var$3) + 33 | 0) - Math_clz32(var$2) | 0;
          var$3 = 0 - var$2 | 0;
          break label$3;
         }
         var$3 = 63 - var$2 | 0;
         var$2 = var$2 + 1 | 0;
         break label$3;
        }
        var$4 = (var$2 >>> 0) / (var$3 >>> 0) | 0;
        i64toi32_i32$3 = 0;
        i64toi32_i32$2 = var$2 - Math_imul(var$4, var$3) | 0;
        i64toi32_i32$1 = 0;
        i64toi32_i32$0 = 32;
        i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
        if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
         i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
         $41_1 = 0;
        } else {
         i64toi32_i32$1 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
         $41_1 = i64toi32_i32$2 << i64toi32_i32$4 | 0;
        }
        __wasm_intrinsics_temp_i64 = $41_1;
        __wasm_intrinsics_temp_i64$hi = i64toi32_i32$1;
        i64toi32_i32$1 = 0;
        i64toi32_i32$2 = var$4;
        i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
        return i64toi32_i32$2 | 0;
       }
       var$2 = Math_clz32(var$3) - Math_clz32(var$2) | 0;
       if (var$2 >>> 0 < 31 >>> 0) {
        break label$4
       }
       break label$2;
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      __wasm_intrinsics_temp_i64 = var$4 & var$0 | 0;
      __wasm_intrinsics_temp_i64$hi = i64toi32_i32$2;
      if ((var$3 | 0) == (1 | 0)) {
       break label$1
      }
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$2 = 0;
      $120$hi = i64toi32_i32$2;
      i64toi32_i32$2 = var$0$hi;
      i64toi32_i32$3 = var$0;
      i64toi32_i32$1 = $120$hi;
      i64toi32_i32$0 = __wasm_ctz_i32(var$3 | 0) | 0;
      i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
      if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
       i64toi32_i32$1 = 0;
       $42_1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
      } else {
       i64toi32_i32$1 = i64toi32_i32$2 >>> i64toi32_i32$4 | 0;
       $42_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$2 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$3 >>> i64toi32_i32$4 | 0) | 0;
      }
      i64toi32_i32$3 = $42_1;
      i64toi32_i32$HIGH_BITS = i64toi32_i32$1;
      return i64toi32_i32$3 | 0;
     }
     var$3 = 63 - var$2 | 0;
     var$2 = var$2 + 1 | 0;
    }
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$3 = 0;
    $129$hi = i64toi32_i32$3;
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$2 = var$0;
    i64toi32_i32$1 = $129$hi;
    i64toi32_i32$0 = var$2 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$1 = 0;
     $43_1 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
    } else {
     i64toi32_i32$1 = i64toi32_i32$3 >>> i64toi32_i32$4 | 0;
     $43_1 = (((1 << i64toi32_i32$4 | 0) - 1 | 0) & i64toi32_i32$3 | 0) << (32 - i64toi32_i32$4 | 0) | 0 | (i64toi32_i32$2 >>> i64toi32_i32$4 | 0) | 0;
    }
    var$5 = $43_1;
    var$5$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$1 = 0;
    $134$hi = i64toi32_i32$1;
    i64toi32_i32$1 = var$0$hi;
    i64toi32_i32$3 = var$0;
    i64toi32_i32$2 = $134$hi;
    i64toi32_i32$0 = var$3 & 63 | 0;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
     $44_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$3 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$1 << i64toi32_i32$4 | 0) | 0;
     $44_1 = i64toi32_i32$3 << i64toi32_i32$4 | 0;
    }
    var$0 = $44_1;
    var$0$hi = i64toi32_i32$2;
    label$13 : {
     if (var$2) {
      i64toi32_i32$2 = var$1$hi;
      i64toi32_i32$1 = var$1;
      i64toi32_i32$3 = -1;
      i64toi32_i32$0 = -1;
      i64toi32_i32$4 = i64toi32_i32$1 + i64toi32_i32$0 | 0;
      i64toi32_i32$5 = i64toi32_i32$2 + i64toi32_i32$3 | 0;
      if (i64toi32_i32$4 >>> 0 < i64toi32_i32$0 >>> 0) {
       i64toi32_i32$5 = i64toi32_i32$5 + 1 | 0
      }
      var$8 = i64toi32_i32$4;
      var$8$hi = i64toi32_i32$5;
      label$15 : while (1) {
       i64toi32_i32$5 = var$5$hi;
       i64toi32_i32$2 = var$5;
       i64toi32_i32$1 = 0;
       i64toi32_i32$0 = 1;
       i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
        i64toi32_i32$1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
        $45_1 = 0;
       } else {
        i64toi32_i32$1 = ((1 << i64toi32_i32$3 | 0) - 1 | 0) & (i64toi32_i32$2 >>> (32 - i64toi32_i32$3 | 0) | 0) | 0 | (i64toi32_i32$5 << i64toi32_i32$3 | 0) | 0;
        $45_1 = i64toi32_i32$2 << i64toi32_i32$3 | 0;
       }
       $140 = $45_1;
       $140$hi = i64toi32_i32$1;
       i64toi32_i32$1 = var$0$hi;
       i64toi32_i32$5 = var$0;
       i64toi32_i32$2 = 0;
       i64toi32_i32$0 = 63;
       i64toi32_i32$3 = i64toi32_i32$0 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
        i64toi32_i32$2 = 0;
        $46_1 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
       } else {
        i64toi32_i32$2 = i64toi32_i32$1 >>> i64toi32_i32$3 | 0;
        $46_1 = (((1 << i64toi32_i32$3 | 0) - 1 | 0) & i64toi32_i32$1 | 0) << (32 - i64toi32_i32$3 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$3 | 0) | 0;
       }
       $142$hi = i64toi32_i32$2;
       i64toi32_i32$2 = $140$hi;
       i64toi32_i32$1 = $140;
       i64toi32_i32$5 = $142$hi;
       i64toi32_i32$0 = $46_1;
       i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
       var$5 = i64toi32_i32$1 | i64toi32_i32$0 | 0;
       var$5$hi = i64toi32_i32$5;
       $144 = var$5;
       $144$hi = i64toi32_i32$5;
       i64toi32_i32$5 = var$8$hi;
       i64toi32_i32$5 = var$5$hi;
       i64toi32_i32$5 = var$8$hi;
       i64toi32_i32$2 = var$8;
       i64toi32_i32$1 = var$5$hi;
       i64toi32_i32$0 = var$5;
       i64toi32_i32$3 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
       i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
       i64toi32_i32$4 = i64toi32_i32$6 + i64toi32_i32$1 | 0;
       i64toi32_i32$4 = i64toi32_i32$5 - i64toi32_i32$4 | 0;
       i64toi32_i32$5 = i64toi32_i32$3;
       i64toi32_i32$2 = 0;
       i64toi32_i32$0 = 63;
       i64toi32_i32$1 = i64toi32_i32$0 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
        i64toi32_i32$2 = i64toi32_i32$4 >> 31 | 0;
        $47_1 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
       } else {
        i64toi32_i32$2 = i64toi32_i32$4 >> i64toi32_i32$1 | 0;
        $47_1 = (((1 << i64toi32_i32$1 | 0) - 1 | 0) & i64toi32_i32$4 | 0) << (32 - i64toi32_i32$1 | 0) | 0 | (i64toi32_i32$5 >>> i64toi32_i32$1 | 0) | 0;
       }
       var$6 = $47_1;
       var$6$hi = i64toi32_i32$2;
       i64toi32_i32$2 = var$1$hi;
       i64toi32_i32$2 = var$6$hi;
       i64toi32_i32$4 = var$6;
       i64toi32_i32$5 = var$1$hi;
       i64toi32_i32$0 = var$1;
       i64toi32_i32$5 = i64toi32_i32$2 & i64toi32_i32$5 | 0;
       $151 = i64toi32_i32$4 & i64toi32_i32$0 | 0;
       $151$hi = i64toi32_i32$5;
       i64toi32_i32$5 = $144$hi;
       i64toi32_i32$2 = $144;
       i64toi32_i32$4 = $151$hi;
       i64toi32_i32$0 = $151;
       i64toi32_i32$1 = i64toi32_i32$2 - i64toi32_i32$0 | 0;
       i64toi32_i32$6 = i64toi32_i32$2 >>> 0 < i64toi32_i32$0 >>> 0;
       i64toi32_i32$3 = i64toi32_i32$6 + i64toi32_i32$4 | 0;
       i64toi32_i32$3 = i64toi32_i32$5 - i64toi32_i32$3 | 0;
       var$5 = i64toi32_i32$1;
       var$5$hi = i64toi32_i32$3;
       i64toi32_i32$3 = var$0$hi;
       i64toi32_i32$5 = var$0;
       i64toi32_i32$2 = 0;
       i64toi32_i32$0 = 1;
       i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
       if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
        i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
        $48_1 = 0;
       } else {
        i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
        $48_1 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
       }
       $154$hi = i64toi32_i32$2;
       i64toi32_i32$2 = var$7$hi;
       i64toi32_i32$2 = $154$hi;
       i64toi32_i32$3 = $48_1;
       i64toi32_i32$5 = var$7$hi;
       i64toi32_i32$0 = var$7;
       i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
       var$0 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
       var$0$hi = i64toi32_i32$5;
       i64toi32_i32$5 = var$6$hi;
       i64toi32_i32$2 = var$6;
       i64toi32_i32$3 = 0;
       i64toi32_i32$0 = 1;
       i64toi32_i32$3 = i64toi32_i32$5 & i64toi32_i32$3 | 0;
       var$6 = i64toi32_i32$2 & i64toi32_i32$0 | 0;
       var$6$hi = i64toi32_i32$3;
       var$7 = var$6;
       var$7$hi = i64toi32_i32$3;
       var$2 = var$2 + -1 | 0;
       if (var$2) {
        continue label$15
       }
       break label$15;
      };
      break label$13;
     }
    }
    i64toi32_i32$3 = var$5$hi;
    __wasm_intrinsics_temp_i64 = var$5;
    __wasm_intrinsics_temp_i64$hi = i64toi32_i32$3;
    i64toi32_i32$3 = var$0$hi;
    i64toi32_i32$5 = var$0;
    i64toi32_i32$2 = 0;
    i64toi32_i32$0 = 1;
    i64toi32_i32$4 = i64toi32_i32$0 & 31 | 0;
    if (32 >>> 0 <= (i64toi32_i32$0 & 63 | 0) >>> 0) {
     i64toi32_i32$2 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
     $49_1 = 0;
    } else {
     i64toi32_i32$2 = ((1 << i64toi32_i32$4 | 0) - 1 | 0) & (i64toi32_i32$5 >>> (32 - i64toi32_i32$4 | 0) | 0) | 0 | (i64toi32_i32$3 << i64toi32_i32$4 | 0) | 0;
     $49_1 = i64toi32_i32$5 << i64toi32_i32$4 | 0;
    }
    $165$hi = i64toi32_i32$2;
    i64toi32_i32$2 = var$6$hi;
    i64toi32_i32$2 = $165$hi;
    i64toi32_i32$3 = $49_1;
    i64toi32_i32$5 = var$6$hi;
    i64toi32_i32$0 = var$6;
    i64toi32_i32$5 = i64toi32_i32$2 | i64toi32_i32$5 | 0;
    i64toi32_i32$3 = i64toi32_i32$3 | i64toi32_i32$0 | 0;
    i64toi32_i32$HIGH_BITS = i64toi32_i32$5;
    return i64toi32_i32$3 | 0;
   }
   i64toi32_i32$3 = var$0$hi;
   __wasm_intrinsics_temp_i64 = var$0;
   __wasm_intrinsics_temp_i64$hi = i64toi32_i32$3;
   i64toi32_i32$3 = 0;
   var$0 = 0;
   var$0$hi = i64toi32_i32$3;
  }
  i64toi32_i32$3 = var$0$hi;
  i64toi32_i32$5 = var$0;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$3;
  return i64toi32_i32$5 | 0;
 }
 
 function __wasm_i64_mul(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int3mul3Mul3mul17h070e9a1c69faec5bE(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_i64_udiv(var$0, var$0$hi, var$1, var$1$hi) {
  var$0 = var$0 | 0;
  var$0$hi = var$0$hi | 0;
  var$1 = var$1 | 0;
  var$1$hi = var$1$hi | 0;
  var i64toi32_i32$0 = 0, i64toi32_i32$1 = 0;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$0 = var$1$hi;
  i64toi32_i32$0 = var$0$hi;
  i64toi32_i32$1 = var$1$hi;
  i64toi32_i32$1 = _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E(var$0 | 0, i64toi32_i32$0 | 0, var$1 | 0, i64toi32_i32$1 | 0) | 0;
  i64toi32_i32$0 = i64toi32_i32$HIGH_BITS;
  i64toi32_i32$HIGH_BITS = i64toi32_i32$0;
  return i64toi32_i32$1 | 0;
 }
 
 function __wasm_ctz_i32(var$0) {
  var$0 = var$0 | 0;
  if (var$0) {
   return 31 - Math_clz32((var$0 + -1 | 0) ^ var$0 | 0) | 0 | 0
  }
  return 32 | 0;
 }
 
 // EMSCRIPTEN_END_FUNCS
;
 bufferView = HEAPU8;
 initActiveSegments(imports);
 var FUNCTION_TABLE = Table([null, $46, $45, $47, $77, $78, $81]);
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }
 
 return {
  "__wasm_call_ctors": $0, 
  "genQrCode": $2, 
  "main": $5, 
  "__indirect_function_table": FUNCTION_TABLE, 
  "__errno_location": $64, 
  "fflush": $99, 
  "emscripten_stack_init": $95, 
  "emscripten_stack_get_free": $96, 
  "emscripten_stack_get_base": $97, 
  "emscripten_stack_get_end": $98, 
  "stackSave": $100, 
  "stackRestore": $101, 
  "stackAlloc": $102, 
  "emscripten_stack_get_current": $103, 
  "dynCall_jiji": $105
 };
}

  return asmFunc(info);
}

)(info);
  },

  instantiate: /** @suppress{checkTypes} */ function(binary, info) {
    return {
      then: function(ok) {
        var module = new WebAssembly.Module(binary);
        ok({
          'instance': new WebAssembly.Instance(module, info)
        });
        // Emulate a simple WebAssembly.instantiate(..).then(()=>{}).catch(()=>{}) syntax.
        return { catch: function() {} };
      }
    };
  },

  RuntimeError: Error
};

// We don't need to actually download a wasm binary, mark it as present but empty.
wasmBinary = [];
// end include: wasm2js.js
if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// include: base64Utils.js
// Converts a string of base64 into a byte array (Uint8Array).
function intArrayFromBase64(s) {

  var decoded = atob(s);
  var bytes = new Uint8Array(decoded.length);
  for (var i = 0 ; i < decoded.length ; ++i) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
// end include: base64Utils.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort("malloc() called but not included in the build - add '_malloc' to EXPORTED_FUNCTIONS");
}
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort("free() called but not included in the build - add '_free' to EXPORTED_FUNCTIONS");
}

// Memory management

var HEAP,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  Module['HEAP8'] = HEAP8 = new Int8Array(b);
  Module['HEAP16'] = HEAP16 = new Int16Array(b);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
  Module['HEAP32'] = HEAP32 = new Int32Array(b);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
}

assert(!Module['STACK_SIZE'], 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')

assert(typeof Int32Array != 'undefined' && typeof Float64Array !== 'undefined' && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined,
       'JS engine does not provide full typed array support');

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;legacyModuleProp('INITIAL_MEMORY', 'INITIAL_MEMORY');

assert(INITIAL_MEMORY >= 65536, 'INITIAL_MEMORY should be larger than STACK_SIZE, was ' + INITIAL_MEMORY + '! (STACK_SIZE=' + 65536 + ')');
  
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_MEMORY / 65536,
      'maximum': INITIAL_MEMORY / 65536,
    });
  }

updateMemoryViews();

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['INITIAL_MEMORY'].
INITIAL_MEMORY = wasmMemory.buffer.byteLength;
assert(INITIAL_MEMORY % 65536 === 0);
// end include: runtime_init_memory.js

// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_assertions.js
// Endianness check
(function() {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) throw 'Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)';
})();

// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  checkStackCookie();
  
  callRuntimeCallbacks(__ATMAIN__);
}

function postRun() {
  checkStackCookie();

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

assert(Math.imul, 'This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.fround, 'This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.clz32, 'This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
assert(Math.trunc, 'This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill');
// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

function getUniqueRunDependency(id) {
  var orig = id;
  while (1) {
    if (!runDependencyTracking[id]) return id;
    id = orig + Math.random();
  }
}

function addRunDependency(id) {
  runDependencies++;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != 'undefined') {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err('still waiting on run dependencies:');
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err('(end of list)');
        }
      }, 10000);
    }
  } else {
    err('warning: run dependency added without ID');
  }
}

function removeRunDependency(id) {
  runDependencies--;

  Module['monitorRunDependencies']?.(runDependencies);

  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err('warning: run dependency removed without ID');
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init() { FS.error() },
  createDataFile() { FS.error() },
  createPreloadedFile() { FS.error() },
  createLazyFile() { FS.error() },
  open() { FS.error() },
  mkdev() { FS.error() },
  registerDevice() { FS.error() },
  analyzePath() { FS.error() },

  ErrnoError() { FS.error() },
};
Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

// include: URIUtils.js
// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

/**
 * Indicates whether filename is a base64 data URI.
 * @noinline
 */
var isDataURI = (filename) => filename.startsWith(dataURIPrefix);

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');
// end include: URIUtils.js
function createExportWrapper(name) {
  return function() {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    return f.apply(null, arguments);
  };
}

// include: runtime_exceptions.js
// end include: runtime_exceptions.js
var wasmBinaryFile;
  wasmBinaryFile = 'gen.wasm';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var binary = tryParseAsDataURI(file);
  if (binary) {
    return binary;
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw "both async and sync fetching of the wasm failed";
}

function getBinaryPromise(binaryFile) {
  // If we don't have the binary yet, try to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary
      && !isDataURI(binaryFile)
      && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
    ) {
      return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + binaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(() => getBinarySync(binaryFile));
    }
  }

  // Otherwise, getBinarySync should be able to get it synchronously
  return Promise.resolve().then(() => getBinarySync(binaryFile));
}

function instantiateArrayBuffer(binaryFile, imports, receiver) {
  return getBinaryPromise(binaryFile).then((binary) => {
    return WebAssembly.instantiate(binary, imports);
  }).then((instance) => {
    return instance;
  }).then(receiver, (reason) => {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  });
}

function instantiateAsync(binary, binaryFile, imports, callback) {
  if (!binary &&
      typeof WebAssembly.instantiateStreaming == 'function' &&
      !isDataURI(binaryFile) &&
      typeof fetch == 'function') {
    return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
      // Suppress closure warning here since the upstream definition for
      // instantiateStreaming only allows Promise<Repsponse> rather than
      // an actual Response.
      // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
      /** @suppress {checkTypes} */
      var result = WebAssembly.instantiateStreaming(response, imports);

      return result.then(
        callback,
        function(reason) {
          // We expect the most common failure cause to be a bad MIME type for the binary,
          // in which case falling back to ArrayBuffer instantiation should work.
          err(`wasm streaming compile failed: ${reason}`);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(binaryFile, imports, callback);
        });
    });
  }
  return instantiateArrayBuffer(binaryFile, imports, callback);
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    

    addOnInit(wasmExports['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {

    try {
      return Module['instantiateWasm'](info, receiveInstance);
    } catch(e) {
      err(`Module.instantiateWasm callback failed with error: ${e}`);
        // If instantiation fails, reject the module ready promise.
        readyPromiseReject(e);
    }
  }

  // If instantiation fails, reject the module ready promise.
  instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// include: runtime_debug.js
function legacyModuleProp(prop, newName, incomming=true) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      get() {
        let extra = incomming ? ' (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)' : '';
        abort(`\`Module.${prop}\` has been replaced by \`${newName}\`` + extra);

      }
    });
  }
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingGlobal(sym, msg) {
  if (typeof globalThis !== 'undefined') {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
        return undefined;
      }
    });
  }
}

missingGlobal('buffer', 'Please use HEAP8.buffer or wasmMemory.buffer');
missingGlobal('asm', 'Please use wasmExports instead');

function missingLibrarySymbol(sym) {
  if (typeof globalThis !== 'undefined' && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        // Can't `abort()` here because it would break code that does runtime
        // checks.  e.g. `if (typeof SDL === 'undefined')`.
        var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
        // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
        // library.js, which means $name for a JS name with no prefix, or name
        // for a JS name like _name.
        var librarySymbol = sym;
        if (!librarySymbol.startsWith('_')) {
          librarySymbol = '$' + sym;
        }
        msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        warnOnce(msg);
        return undefined;
      }
    });
  }
  // Any symbol that is not included from the JS libary is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      }
    });
  }
}

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(text) {
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn.apply(console, arguments);
}
// end include: runtime_debug.js
// === Body ===

// end include: preamble.js

  /** @constructor */
  function ExitStatus(status) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${status})`;
      this.status = status;
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };

  
    /**
     * @param {number} ptr
     * @param {string} type
     */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': abort('to do getValue(i64) use WASM_BIGINT');
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = Module['noExitRuntime'] || true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number');
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': abort('to do setValue(i64) use WASM_BIGINT');
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };

  var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;
  
    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */
  var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.  Also, use the length info to avoid running tiny
      // strings through TextDecoder, since .subarray() allocates garbage.
      // (As a tiny code save trick, compare endPtr against endIdx using a negation,
      // so that undefined means Infinity)
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      // If building with TextDecoder, we have already computed the string length
      // above, so test loop end condition against that
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */
  var UTF8ToString = (ptr, maxBytesToRead) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
    };
  var ___assert_fail = (condition, filename, line, func) => {
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);
    };

  var _emscripten_get_now;
      // Modern environment where performance.now() is supported:
      // N.B. a shorter form "_emscripten_get_now = performance.now;" is
      // unfortunately not allowed even in current browsers (e.g. FF Nightly 75).
      _emscripten_get_now = () => performance.now();
  ;

  var _emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  var SYSCALLS = {
  varargs:undefined,
  get() {
        assert(SYSCALLS.varargs != undefined);
        // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
        var ret = HEAP32[((+SYSCALLS.varargs)>>2)];
        SYSCALLS.varargs += 4;
        return ret;
      },
  getp() { return SYSCALLS.get() },
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  var _fd_write = (fd, iov, iovcnt, pnum) => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    };

  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        readyPromiseReject(msg);
        err(msg);
      }
  
      _proc_exit(status);
    };

  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };

  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.charCodeAt(i); // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) {
          var u1 = str.charCodeAt(++i);
          u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
        }
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
    /**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
     * @param {Object=} opts
     */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };

  
  
    /**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return function() {
        return ccall(ident, returnType, argTypes, arguments, opts);
      }
    };
function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}
var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  emscripten_get_now: _emscripten_get_now,
  /** @export */
  emscripten_memcpy_js: _emscripten_memcpy_js,
  /** @export */
  fd_write: _fd_write,
  /** @export */
  memory: wasmMemory
};
var wasmExports = createWasm();
var ___wasm_call_ctors = createExportWrapper('__wasm_call_ctors');
var _genQrCode = Module['_genQrCode'] = createExportWrapper('genQrCode');
var _main = createExportWrapper('main');
var ___errno_location = createExportWrapper('__errno_location');
var _fflush = Module['_fflush'] = createExportWrapper('fflush');
var _emscripten_stack_init = () => (_emscripten_stack_init = wasmExports['emscripten_stack_init'])();
var _emscripten_stack_get_free = () => (_emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'])();
var _emscripten_stack_get_base = () => (_emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'])();
var _emscripten_stack_get_end = () => (_emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'])();
var stackSave = createExportWrapper('stackSave');
var stackRestore = createExportWrapper('stackRestore');
var stackAlloc = createExportWrapper('stackAlloc');
var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'])();
var dynCall_jiji = Module['dynCall_jiji'] = createExportWrapper('dynCall_jiji');


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

Module['ccall'] = ccall;
Module['cwrap'] = cwrap;
var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'zeroMemory',
  'getHeapMax',
  'abortOnCannotGrowMemory',
  'growMemory',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'setErrNo',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'getHostByName',
  'initRandomFill',
  'randomFill',
  'getCallstack',
  'emscriptenLog',
  'convertPCtoSourceLocation',
  'readEmAsmArgs',
  'jstoi_q',
  'jstoi_s',
  'getExecutableName',
  'listenOnce',
  'autoResumeAudioContext',
  'dynCallLegacy',
  'getDynCaller',
  'dynCall',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'handleAllocatorInit',
  'HandleAllocator',
  'getNativeTypeSize',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'uleb128Encode',
  'sigToWasmTypes',
  'generateFuncType',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'reallyNegative',
  'unSign',
  'strLen',
  'reSign',
  'formatString',
  'intArrayFromString',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'findCanvasEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'disableGamepadApiIfItThrows',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'battery',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'demangle',
  'demangleAll',
  'jsStackTrace',
  'stackTrace',
  'getEnvStrings',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'createDyncallWrapper',
  'safeSetTimeout',
  'setImmediateWrapped',
  'clearImmediateWrapped',
  'polyfillSetImmediate',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'setMainLoop',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar',
  'FS_createDataFile',
  'FS_unlink',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'heapAccessShiftForWebGLHeap',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  '__glGenObject',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'SDL_unicode',
  'SDL_ttfContext',
  'SDL_audio',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

var unexportedSymbols = [
  'run',
  'addOnPreRun',
  'addOnInit',
  'addOnPreMain',
  'addOnExit',
  'addOnPostRun',
  'addRunDependency',
  'removeRunDependency',
  'FS_createFolder',
  'FS_createPath',
  'FS_createLazyFile',
  'FS_createLink',
  'FS_createDevice',
  'FS_readFile',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmMemory',
  'wasmExports',
  'stackAlloc',
  'stackSave',
  'stackRestore',
  'getTempRet0',
  'setTempRet0',
  'writeStackCookie',
  'checkStackCookie',
  'intArrayFromBase64',
  'tryParseAsDataURI',
  'ptrToString',
  'exitJS',
  'ENV',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'ERRNO_CODES',
  'ERRNO_MESSAGES',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'UNWIND_CACHE',
  'readEmAsmArgsArray',
  'handleException',
  'keepRuntimeAlive',
  'wasmTable',
  'noExitRuntime',
  'getCFunc',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'UTF16Decoder',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'ExitStatus',
  'flush_NO_FILESYSTEM',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'Browser',
  'wget',
  'SYSCALLS',
  'preloadPlugins',
  'FS_stdin_getChar_buffer',
  'FS',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'emscripten_webgl_power_preferences',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'allocateUTF8',
  'allocateUTF8OnStack',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);



var calledRun;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

function callMain() {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = _main;

  var argc = 0;
  var argv = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  }
  catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  if (runDependencies > 0) {
    return;
  }

    stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (shouldRunNow) callMain();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;

if (Module['noInitialRun']) shouldRunNow = false;

run();


// end include: postamble.js


  return moduleArg.ready
}
);
})();
;
if (typeof exports === 'object' && typeof module === 'object')
  module.exports = Module;
else if (typeof define === 'function' && define['amd'])
  define([], () => Module);
