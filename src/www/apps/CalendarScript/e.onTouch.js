module.exports = function(info) {
  return info.devbin.utils.touchFile(`@/src/www/apps/CalendarScript/index.html`, {
    ignoreOnTouchEvent: true,
  });
};