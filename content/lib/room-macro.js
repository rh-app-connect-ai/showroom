'use strict'

// Inline macro: roomof:user12[] → "room12". No space after the colon.

module.exports.register = function (registry) {
  registry.inlineMacro('roomof', function () {
    const self = this
    this.process(function (parent, target) {
      const roomName = (target || '').trim().replace(/^user/, 'room')
      return self.createInline(parent, 'quoted', roomName)
    })
  })
}
