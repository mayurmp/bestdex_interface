import EventEmitter from 'eventemitter3'
import { EmitterCommand, EmitterCallback } from './types'
const eventEmitter = new EventEmitter()

export default class Emitter {
  on = (command: EmitterCommand, fn: (arg: EmitterCallback) => void) => {
    eventEmitter.on(command, fn)
  }

  off = (command: EmitterCommand, fn: (args: EmitterCallback) => void) => {
    eventEmitter.off(command, fn)
  }

  emit = (command: EmitterCommand, args?: EmitterCallback) => {
    eventEmitter.emit(command, args != null ? args : {})
  }
}
