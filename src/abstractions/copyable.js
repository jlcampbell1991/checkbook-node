module.exports =  class {
    copy(opts) {
        Object.entries(opts).forEach(([key, value]) => {
            this[key] = value;
        })
        return this;
    }
}