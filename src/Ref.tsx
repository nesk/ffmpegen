import { ForwardedRef, MutableRefObject, RefObject } from "react"

type Reference<T> = RefObject<T | null> | MutableRefObject<T> | ForwardedRef<T>

function isRefObject<T>(ref: Reference<T>): ref is RefObject<T | null> {
  const properties = Object.getOwnPropertyNames(ref)
  return properties.length === 1 && properties[0] === "current"
}

/**
 * Returns the current value of a reference, either its a RefObject, a MutableRefObject or a ForwardedRef.
 */
export function getCurrentRef<T>(ref: Reference<T>): T | null {
  return isRefObject(ref) ? ref.current : null
}

/**
 * Inspects the reference and executes the provided callbacks.
 *
 * @param then Callback executed when the current value is not null.
 * @param otherwise Callback executed when the current value is null.
 * @returns The value returned by the executed callback, either `then` or `otherwise`.
 */
export function onCurrentRef<T, R>(ref: Reference<T>, then?: (current: T) => R): R | undefined {
  const current = getCurrentRef(ref)
  if (then && current !== null) {
    return then(current)
  }
}

/**
 * Inspects the reference and executes the provided callbacks.
 *
 * Unlike `onCurrentRef`, this function accepts a ref and returns an anonymous function to provide the `then` parameter.
 *
 * @param then Callback executed when the current value is not null.
 * @param otherwise Callback executed when the current value is null.
 * @returns The value returned by the executed callback, either `then` or `otherwise`.
 */
export function onPartialCurrentRef<T>(ref: Reference<T>): <R>(then?: (current: T) => R) => R | undefined {
  return then => onCurrentRef(ref, then)
}
