module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./config/config.js":
/*!**************************!*\
  !*** ./config/config.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst config = {\n  env: \"development\" || false,\n  port: process.env.PORT || 8080,\n  jwtSecret: process.env.JWT_SECRET || \"YOUR_secret_key\",\n  mongoUri: process.env.MONGODB_URI || process.env.MONGO_HOST || 'mongodb://' + (process.env.IP || 'localhost') + ':' + (process.env.MONGO_PORT || '27017') + '/social'\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (config);\n\n//# sourceURL=webpack:///./config/config.js?");

/***/ }),

/***/ "./server/controllers/auth.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/auth.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! express-jwt */ \"express-jwt\");\n/* harmony import */ var express_jwt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(express_jwt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../config/config */ \"./config/config.js\");\n\n\n\n\n\nconst signin = (req, res) => {\n  _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findOne({\n    \"email\": req.body.email\n  }, (err, user) => {\n    if (err || !user) return res.status('401').json({\n      error: \"User not found\"\n    });\n\n    if (!user.authenticate(req.body.password)) {\n      return res.status('401').send({\n        error: \"Email and password don't match.\"\n      });\n    }\n\n    const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default.a.sign({\n      _id: user._id\n    }, _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret);\n    res.cookie(\"t\", token, {\n      expire: new Date() + 9999\n    });\n    return res.json({\n      token,\n      user: {\n        _id: user._id,\n        name: user.name,\n        email: user.email\n      }\n    });\n  });\n};\n\nconst signout = (req, res) => {\n  res.clearCookie(\"t\");\n  return res.status('200').json({\n    message: \"signed out\"\n  });\n};\n\nconst requireSignin = express_jwt__WEBPACK_IMPORTED_MODULE_2___default()({\n  secret: _config_config__WEBPACK_IMPORTED_MODULE_3__[\"default\"].jwtSecret,\n  userProperty: 'auth'\n});\n\nconst hasAuthorization = (req, res, next) => {\n  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;\n\n  if (!authorized) {\n    return res.status('403').json({\n      error: \"User is not authorized\"\n    });\n  }\n\n  next();\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  signin,\n  signout,\n  requireSignin,\n  hasAuthorization\n});\n\n//# sourceURL=webpack:///./server/controllers/auth.controller.js?");

/***/ }),

/***/ "./server/controllers/token.controller.js":
/*!************************************************!*\
  !*** ./server/controllers/token.controller.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_token_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/token.model */ \"./server/models/token.model.js\");\n/* harmony import */ var _models_token_model__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_models_token_model__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! request */ \"request\");\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! moment */ \"moment\");\n/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\n\nfunction getToken(_callback) {\n  //check if token in the database\n  _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.count((err, token) => {\n    if (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    } //check if token exist in the database\n\n\n    if (token == 0) {\n      //request for token\n      request__WEBPACK_IMPORTED_MODULE_3___default()({\n        url: `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=eyJhbGciOiJIUzUxMiIsInYiOiIyLjAiLCJraWQiOiI1MjQxMDIzNC1jNWVhLTRlMTEtOWY3NS0xOWIyNTVjNTVlZTAifQ.eyJ2ZXIiOjcsImF1aWQiOiIxMjg0ODFlNjE2MDNhY2I0ZjBkYTk5ZmYyYzk2MmM3MiIsImNvZGUiOiJOQm5VZFpiS1pQXzc0UmpWTFlIU0VHUV9IM0ZEYlYtT1EiLCJpc3MiOiJ6bTpjaWQ6eFhuY2N5eXhTMFNmNUhhS0FtcnZhQSIsImdubyI6MCwidHlwZSI6MSwidGlkIjoyLCJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiI3NFJqVkxZSFNFR1FfSDNGRGJWLU9RIiwibmJmIjoxNTk1NDM2NTcxLCJleHAiOjIwNjg0NzY1NzEsImlhdCI6MTU5NTQzNjU3MSwiYWlkIjoiRFBISGcyQnlUNXV2MVBDeXlIYlZHdyIsImp0aSI6ImNkZmU4NzVlLWExYTUtNGZhNi05M2JmLWIwNTkwMTA1ZjM5OCJ9.gFfzgxZjRpZuK5FG4BAKmbkxncMaJKszhtjdsyNoKmiHFUiB6n3icefMSSFVg9TOQyLuMCPHGjzO6EEhJA38SQ`,\n        method: 'POST',\n        headers: {\n          'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64')\n        }\n      }, (error, httpResponse, body) => {\n        if (error) {\n          console.log('Error getting token from Zoom.', error);\n        } else {\n          body = JSON.parse(body);\n          console.log(body);\n          body.createDate = Date.now();\n          const token_ = new _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a(body); //save token in the database\n\n          token_.save((err, result) => {\n            if (err) {\n              return res.status(400).json({\n                error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n              });\n            }\n\n            console.log(result);\n\n            _callback();\n          });\n        }\n      });\n    } else {\n      //check token in the database\n      _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.find((err, token) => {\n        if (err) {\n          return res.status(400).json({\n            error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n          });\n        }\n\n        var tokenList = token[0];\n        var currentTime = Date.now();\n        var tokenTime = tokenList.createDate;\n        let diff = moment__WEBPACK_IMPORTED_MODULE_4___default()(currentTime).diff(tokenTime, 'minute');\n\n        if (diff >= 0) {\n          //request for another\n          request__WEBPACK_IMPORTED_MODULE_3___default()({\n            url: 'https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=' + tokenList.refresh_token,\n            method: 'POST',\n            headers: {\n              'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64')\n            }\n          }, (error, httpResponse, body) => {\n            if (error) {\n              console.log('Error getting token from Zoom.', error);\n            } else {\n              body = JSON.parse(body);\n              console.log('first: ' + body.access_token);\n              body.createDate = Date.now();\n              _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.findByIdAndUpdate(tokenList._id, {\n                $set: {\n                  access_token: body.access_token,\n                  refresh_token: body.refresh_token,\n                  createDate: Date.now()\n                }\n              }, {\n                new: true\n              }).exec((err, result) => {\n                if (err) {\n                  return res.status(400).json({\n                    error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n                  });\n                }\n\n                _callback();\n              });\n            }\n          });\n        }\n      });\n    }\n  });\n}\n\nconst signature = (req, res) => {\n  function generateSignature(apiKey, apiSecret, meetingNumber, role) {\n    // Prevent time sync issue between client signature generation and zoom \n    const timestamp = new Date().getTime() - 30000;\n    const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');\n    const hash = crypto__WEBPACK_IMPORTED_MODULE_5___default.a.createHmac(`sha256`, `${apiSecret}`).update(msg).digest('base64');\n    const signature_ = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64');\n    return signature_;\n  } // pass in your Zoom JWT API Key, Zoom JWT API Secret, Zoom Meeting Number, and 0 to join meeting or webinar or 1 to start meeting\n\n\n  var signature = generateSignature(process.env.API_KEY, process.env.API_SECRET, 95339654036, 0);\n  console.log(signature);\n  return res.json({\n    signature\n  });\n};\n\nconst check = (req, res) => {\n  let signature = 'success';\n  return res.json({\n    signature\n  });\n};\n\nconst home = (req, res) => {\n  getToken(function () {\n    _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.find((err, token) => {\n      if (err) {\n        return res.status(400).json({\n          error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n        });\n      }\n\n      var tokenList = token[0];\n      console.log('second: ' + tokenList.access_token);\n    });\n    res.render('home', {\n      title: 'Welcome'\n    });\n  });\n};\n\nconst main = (req, res) => {\n  getToken(function () {\n    _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.find((err, token) => {\n      if (err) {\n        return res.status(400).json({\n          error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n        });\n      }\n\n      var tokenList = token[0];\n      request__WEBPACK_IMPORTED_MODULE_3___default.a.get('https://api.zoom.us/v2/users/me', (error, response, body) => {\n        if (error) {\n          console.log('API Response Error: ', error);\n        } else {\n          body = JSON.parse(body); // Display response in console\n\n          console.log('API call ', body); // Display response in browser\n\n          var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>';\n          res.send(`\n                            <style>\n                                @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: \"👋\";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}\n                            </style>\n                            <div class=\"container\">\n                                <div class=\"info\">\n                                    <img src=\"${body.pic_url}\" alt=\"User photo\" />\n                                    <div>\n                                        <span>Hello World!</span>\n                                        <h2>${body.first_name} ${body.last_name}</h2>\n                                        <p>${body.role_name}, ${body.company}</p>\n                                    </div>\n                                </div>\n                                <div class=\"response\">\n                                    <h4>JSON Response:</h4>\n                                    <a href=\"https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user\" target=\"_blank\">\n                                        API Reference\n                                    </a>\n                                    ${JSONResponse}\n                                </div>\n                            </div>\n                        `);\n        }\n      }).auth(null, null, true, tokenList.access_token);\n    });\n  });\n};\n\nconst createUser = (req, res) => {\n  getToken(function () {\n    _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.find((err, token) => {\n      if (err) {\n        return res.status(400).json({\n          error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n        });\n      }\n\n      res.render('users', {\n        title: 'User Management'\n      });\n    });\n  });\n};\n\nconst createUsers = (req, res) => {\n  getToken(function () {\n    _models_token_model__WEBPACK_IMPORTED_MODULE_0___default.a.find((err, token) => {\n      if (err) {\n        return res.status(400).json({\n          error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n        });\n      }\n\n      var tokenList = token[0];\n      request__WEBPACK_IMPORTED_MODULE_3___default()({\n        url: 'https://api.zoom.us/v2/users',\n        method: 'POST',\n        json: true,\n        body: {\n          \"action\": \"create\",\n          \"user_info\": {\n            \"email\": req.body.email,\n            \"type\": 1,\n            \"first_name\": req.body.fname,\n            \"last_name\": req.body.lname\n          }\n        },\n        headers: {\n          'Content-Type': 'application/json',\n          'Authorization': 'Basic ' + Buffer.from(process.env.clientID + ':' + process.env.clientSecret).toString('base64'),\n          'cache-control': 'no-cache'\n        }\n      }, (error, httpResponse, body) => {\n        if (error) {\n          console.log(error);\n        } else {\n          console.log(body);\n          res.redirect('/createUser');\n        }\n      }).auth(null, null, true, tokenList.access_token);\n    });\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  signature,\n  check,\n  home,\n  main,\n  createUser,\n  createUsers\n});\n\n//# sourceURL=webpack:///./server/controllers/token.controller.js?");

/***/ }),

/***/ "./server/controllers/user.controller.js":
/*!***********************************************!*\
  !*** ./server/controllers/user.controller.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _models_user_model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/user.model */ \"./server/models/user.model.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../helpers/dbErrorHandler */ \"./server/helpers/dbErrorHandler.js\");\n\n\n\n\nconst create = (req, res) => {\n  const user = new _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"](req.body);\n  user.save((err, result) => {\n    if (err) {\n      console.log(_helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err));\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n\n    res.status(200).json({\n      message: \"Successfully signed up!\"\n    });\n  });\n};\n/**\r\n * Load user and append to req.\r\n */\n\n\nconst userByID = (req, res, next, id) => {\n  _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].findById(id).exec((err, user) => {\n    if (err || !user) return res.status('400').json({\n      error: \"User not found\"\n    });\n    req.profile = user;\n    next();\n  });\n};\n\nconst read = (req, res) => {\n  req.profile.hashed_password = undefined;\n  req.profile.salt = undefined;\n  return res.json(req.profile);\n};\n\nconst list = (req, res) => {\n  console.log(12);\n  _models_user_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].find((err, users) => {\n    if (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n\n    res.json(users);\n  }).select('name email updated created');\n};\n\nconst update = (req, res, next) => {\n  let user = req.profile;\n  user = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.extend(user, req.body);\n  user.updated = Date.now();\n  user.save(err => {\n    if (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n\n    user.hashed_password = undefined;\n    user.salt = undefined;\n    res.json(user);\n  });\n};\n\nconst remove = (req, res, next) => {\n  let user = req.profile;\n  user.remove((err, deletedUser) => {\n    if (err) {\n      return res.status(400).json({\n        error: _helpers_dbErrorHandler__WEBPACK_IMPORTED_MODULE_2__[\"default\"].getErrorMessage(err)\n      });\n    }\n\n    deletedUser.hashed_password = undefined;\n    deletedUser.salt = undefined;\n    res.json(deletedUser);\n  });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  create,\n  userByID,\n  read,\n  list,\n  remove,\n  update\n});\n\n//# sourceURL=webpack:///./server/controllers/user.controller.js?");

/***/ }),

/***/ "./server/express.js":
/*!***************************!*\
  !*** ./server/express.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv/config */ \"dotenv/config\");\n/* harmony import */ var dotenv_config__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv_config__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\n/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(cookie_parser__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! compression */ \"compression\");\n/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(compression__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! helmet */ \"helmet\");\n/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(helmet__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _routes_token_route__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./routes/token.route */ \"./server/routes/token.route.js\");\n/* harmony import */ var _routes_user_route__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./routes/user.route */ \"./server/routes/user.route.js\");\n/* harmony import */ var _routes_auth_route__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./routes/auth.route */ \"./server/routes/auth.route.js\");\n\n\n\n\n\n\n\n\n\n\n\n\nconst CURRENT_WORKING_DIR = process.cwd();\nconst app = express__WEBPACK_IMPORTED_MODULE_6___default()();\napp.set('views', './client/views');\napp.set('view engine', 'jade'); // parse body params and attache them to req.body\n\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_8___default.a.json());\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_8___default.a.urlencoded({\n  extended: true\n}));\napp.use(cookie_parser__WEBPACK_IMPORTED_MODULE_2___default()());\napp.use(compression__WEBPACK_IMPORTED_MODULE_3___default()()); // secure apps by setting various HTTP headers\n\napp.use(helmet__WEBPACK_IMPORTED_MODULE_5___default()()); // enable CORS - Cross Origin Resource Sharing\n\napp.use('/dist', express__WEBPACK_IMPORTED_MODULE_6___default.a.static(path__WEBPACK_IMPORTED_MODULE_7___default.a.join(CURRENT_WORKING_DIR, 'dist')));\napp.use(express__WEBPACK_IMPORTED_MODULE_6___default.a.static(path__WEBPACK_IMPORTED_MODULE_7___default.a.join(__dirname, 'client/public')));\napp.use(cors__WEBPACK_IMPORTED_MODULE_4___default()());\napp.use(function (req, res, next) {\n  res.header(\"Access-Control-Allow-Credentials\", true);\n  res.header(\"Access-Control-Allow-Origin\", req.headers.origin);\n  res.header(\"Access-Control-Allow-Methods\", \"GET,PUT,POST,DELETE\");\n  res.header(\"Access-Control-Allow-Headers\", \"X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept\");\n\n  if (\"OPTIONS\" == req.method) {\n    res.send(200);\n  } else {\n    next();\n  }\n});\napp.use('/', _routes_token_route__WEBPACK_IMPORTED_MODULE_9__[\"default\"]);\napp.use('/', _routes_user_route__WEBPACK_IMPORTED_MODULE_10__[\"default\"]);\napp.use('/', _routes_auth_route__WEBPACK_IMPORTED_MODULE_11__[\"default\"]); // Catch unauthorised errors\n\napp.use((err, req, res, next) => {\n  if (err.name === 'UnauthorizedError') {\n    res.status(401).json({\n      \"error\": err.name + \": \" + err.message\n    });\n  }\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (app);\n/* WEBPACK VAR INJECTION */}.call(this, \"/\"))\n\n//# sourceURL=webpack:///./server/express.js?");

/***/ }),

/***/ "./server/helpers/dbErrorHandler.js":
/*!******************************************!*\
  !*** ./server/helpers/dbErrorHandler.js ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n\n/**\r\n * Get unique error field name\r\n */\n\nconst getUniqueErrorMessage = err => {\n  let output;\n  let fieldName_ = 'input';\n\n  try {\n    let fieldName = err.message.substring(err.message.lastIndexOf('index: ') + 7, err.message.lastIndexOf('_1'));\n    fieldName_ = fieldName;\n    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';\n  } catch (ex) {\n    output = 'Unique field already exists';\n  }\n\n  return [fieldName_, output];\n}; //11000 duplicate key error collection: elearn.users index: email already exists\n\n/**\r\n * Get the error message from error object\r\n */\n\n\nconst getErrorMessage = err => {\n  let message = '';\n\n  if (err.code) {\n    switch (err.code) {\n      case 11000:\n      case 11001:\n        message = getUniqueErrorMessage(err);\n        break;\n\n      default:\n        message = 'Something went wrong';\n    }\n  } else {\n    for (let errName in err.errors) {\n      if (err.errors[errName].message) message = err.errors[errName].message;\n    }\n  }\n\n  return message;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  getErrorMessage\n});\n\n//# sourceURL=webpack:///./server/helpers/dbErrorHandler.js?");

/***/ }),

/***/ "./server/models/token.model.js":
/*!**************************************!*\
  !*** ./server/models/token.model.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\n\nconst TokenSchema = mongoose.model('token', new mongoose.Schema({\n  access_token: {\n    type: String,\n    required: 'Title is required'\n  },\n  refresh_token: {\n    type: String,\n    required: 'Title is required'\n  },\n  createDate: {\n    type: Date,\n    default: Date.now\n  }\n}));\nmodule.exports = TokenSchema;\n\n//# sourceURL=webpack:///./server/models/token.model.js?");

/***/ }),

/***/ "./server/models/user.model.js":
/*!*************************************!*\
  !*** ./server/models/user.model.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst UserSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.Schema({\n  fullName: {\n    type: String,\n    trim: true,\n    required: 'Name is required'\n  },\n  displayName: {\n    type: String,\n    trim: true\n  },\n  email: {\n    type: String,\n    trim: true,\n    unique: 'Email already exists',\n    match: [/.+\\@.+\\..+/, 'Please fill a valid email address'],\n    required: 'Email is required'\n  },\n  about: {\n    type: String,\n    trim: true,\n    required: 'About is required'\n  },\n  phoneNumber: {\n    type: String,\n    trim: true\n  },\n  link: {\n    type: String,\n    trim: true,\n    required: 'Link is required'\n  },\n  hashed_password: {\n    type: String,\n    required: \"Password is required\"\n  },\n  salt: String,\n  updated: Date,\n  created: {\n    type: Date,\n    default: Date.now\n  }\n});\nUserSchema.virtual('password').set(function (password) {\n  this._password = password;\n  this.salt = this.makeSalt();\n  this.hashed_password = this.encryptPassword(password);\n}).get(function () {\n  return this._password;\n});\nUserSchema.path('hashed_password').validate(function (v) {\n  if (this._password && this._password.length < 6) {\n    this.invalidate('password', 'Password must be at least 6 characters.');\n  }\n\n  if (this.isNew && !this._password) {\n    this.invalidate('password', 'Password is required');\n  }\n}, null);\nUserSchema.methods = {\n  authenticate: function (plainText) {\n    return this.encryptPassword(plainText) === this.hashed_password;\n  },\n  encryptPassword: function (password) {\n    if (!password) return '';\n\n    try {\n      return crypto__WEBPACK_IMPORTED_MODULE_1___default.a.createHmac('sha1', this.salt).update(password).digest('hex');\n    } catch (err) {\n      return '';\n    }\n  },\n  makeSalt: function () {\n    return Math.round(new Date().valueOf() * Math.random()) + '';\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (mongoose__WEBPACK_IMPORTED_MODULE_0___default.a.model('User', UserSchema));\n\n//# sourceURL=webpack:///./server/models/user.model.js?");

/***/ }),

/***/ "./server/routes/auth.route.js":
/*!*************************************!*\
  !*** ./server/routes/auth.route.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/auth.controller */ \"./server/controllers/auth.controller.js\");\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/auth/signin').post(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signin);\nrouter.route('/auth/signout').get(_controllers_auth_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signout);\n/* harmony default export */ __webpack_exports__[\"default\"] = (router);\n\n//# sourceURL=webpack:///./server/routes/auth.route.js?");

/***/ }),

/***/ "./server/routes/token.route.js":
/*!**************************************!*\
  !*** ./server/routes/token.route.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/token.controller */ \"./server/controllers/token.controller.js\");\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/api/signature').get(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].signature);\nrouter.route('/api/check').get(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].check);\nrouter.route('/api/home').get(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].home);\nrouter.route('/api/main').get(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].main);\nrouter.route('/api/createUser').get(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createUser).post(_controllers_token_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].createUsers);\n/* harmony default export */ __webpack_exports__[\"default\"] = (router);\n\n//# sourceURL=webpack:///./server/routes/token.route.js?");

/***/ }),

/***/ "./server/routes/user.route.js":
/*!*************************************!*\
  !*** ./server/routes/user.route.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/user.controller */ \"./server/controllers/user.controller.js\");\n/* harmony import */ var _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../controllers/auth.controller.js */ \"./server/controllers/auth.controller.js\");\n\n\n\nconst router = express__WEBPACK_IMPORTED_MODULE_0___default.a.Router();\nrouter.route('/api/users').get(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].list).post(_controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].create);\nrouter.route('/api/users/:userId').get(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].read).put(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].update).delete(_controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].requireSignin, _controllers_auth_controller_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"].hasAuthorization, _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].remove);\nrouter.param('userId', _controllers_user_controller__WEBPACK_IMPORTED_MODULE_1__[\"default\"].userByID);\n/* harmony default export */ __webpack_exports__[\"default\"] = (router);\n\n//# sourceURL=webpack:///./server/routes/user.route.js?");

/***/ }),

/***/ "./server/server.js":
/*!**************************!*\
  !*** ./server/server.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../config/config */ \"./config/config.js\");\n/* harmony import */ var _express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./express */ \"./server/express.js\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.set('useNewUrlParser', true);\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.set('useFindAndModify', false);\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.set('useCreateIndex', true);\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.set('useUnifiedTopology', true);\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.Promise = global.Promise;\nconst uri = \"mongodb+srv://richard01:seun08167739200@cluster0-xsh4r.mongodb.net/elearn?retryWrites=false&w=majority\";\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connect(uri); //mongoose.connect(config.mongoUri)\n\nmongoose__WEBPACK_IMPORTED_MODULE_2___default.a.connection.on('error', () => {\n  throw new Error(`unable to connect to database: ${uri}`);\n});\n_express__WEBPACK_IMPORTED_MODULE_1__[\"default\"].listen(4000, () => console.log(` app listening at PORT: 4000`));\n\n//# sourceURL=webpack:///./server/server.js?");

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./server/server.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! C:\\Javascript\\Application\\socialback\\server\\server.js */\"./server/server.js\");\n\n\n//# sourceURL=webpack:///multi_./server/server.js?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "compression":
/*!******************************!*\
  !*** external "compression" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"compression\");\n\n//# sourceURL=webpack:///external_%22compression%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv/config\");\n\n//# sourceURL=webpack:///external_%22dotenv/config%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "express-jwt":
/*!******************************!*\
  !*** external "express-jwt" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express-jwt\");\n\n//# sourceURL=webpack:///external_%22express-jwt%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"moment\");\n\n//# sourceURL=webpack:///external_%22moment%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"request\");\n\n//# sourceURL=webpack:///external_%22request%22?");

/***/ })

/******/ });