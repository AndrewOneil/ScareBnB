//this function will be used to wrap async functions to catch any errors without breaking the site
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  }
}