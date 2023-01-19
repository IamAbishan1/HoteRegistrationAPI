const requestModifier = {

    customErrorLayer: function(req, res, next) {
        // adding custom errors layer
        req.customErrors = {
            all: {},
            set: function(key, error) {
                this.all[key] = error
            },
            get: function(key) {
                if (this.all.hasOwnProperty(key)) return this.all[key]
                else return null;
            }
        }
        next();
    }

}

module.exports = requestModifier