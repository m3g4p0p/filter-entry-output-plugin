module.exports = class FilterEntryOutputPlugin {
  constructor ({
    test = /\.(c|sc|sa)ss$/,
    remove = /\.js$/,
    exclude = false,
    keep = false,
    multi = false
  } = {}) {
    this.test = test
    this.remove = remove
    this.exclude = exclude
    this.keep = keep
    this.multi = multi
  }

  testRequest (request) {
    return this.test.test(request) && (
      !this.exclude ||
      !this.exclude.test(request)
    )
  }

  testChunk ({ entryModule }) {
    return (
      entryModule.rawRequest &&
      this.testRequest(entryModule.rawRequest)
    ) || (
      this.multi &&
      entryModule.dependencies.some(({ request }) => {
        return this.testRequest(request)
      })
    )
  }

  testFile (file) {
    return this.remove.test(file) && (
      !this.keep ||
      !this.keep.test(file)
    )
  }

  apply (compiler) {
    compiler.hooks.emit.tap('FilterEntryOutputPlugin', compilation => {
      compilation.chunks
        .filter(chunk => this.testChunk(chunk))
        .forEach(chunk => chunk.files
          .filter(file => this.testFile(file))
          .forEach(file => {
            delete compilation.assets[file]
          })
        )
    })
  }
}
