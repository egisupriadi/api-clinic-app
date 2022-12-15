const CryptoJS = require("crypto-js");
const SECRET_KEY = 'UTAMA2022'

exports.encrypt = (text) => (CryptoJS.AES.encrypt(text, SECRET_KEY).toString())
exports.decrypt = (text) => (CryptoJS.AES.decrypt(text, SECRET_KEY).toString(CryptoJS.enc.Utf8))