// Fungsi ini membungkus request handler untuk menangkap error dan meneruskannya ke error handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;