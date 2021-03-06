import { Props, ReferenceElement, Targets, VirtualReference } from './types'
import { arrayFrom, matches } from './ponyfills'
import { isUCBrowser } from './browser'
import { getDataAttributeOptions } from './reference'

/**
 * Determines if a value is a "bare" virtual element (before mutations done
 * by `polyfillElementPrototypeProperties()`). JSDOM elements show up as
 * [object Object], we can check if the value is "element-like" if it has
 * `addEventListener`
 */
export function isBareVirtualElement(value: any): boolean {
  return (
    {}.toString.call(value) === '[object Object]' && !value.addEventListener
  )
}

/**
 * Safe .hasOwnProperty check, for prototype-less objects
 */
export function hasOwnProperty(obj: object, key: string): boolean {
  return {}.hasOwnProperty.call(obj, key)
}

/**
 * Returns an array of elements based on the value
 */
export function getArrayOfElements(value: Targets): Element[] {
  if (isSingular(value)) {
    // TODO: VirtualReference is not compatible to type Element
    return [value as Element]
  }

  if (value instanceof NodeList) {
    return arrayFrom(value)
  }

  if (Array.isArray(value)) {
    return value
  }

  try {
    return arrayFrom(document.querySelectorAll(value))
  } catch (e) {
    return []
  }
}

/**
 * Returns a value at a given index depending on if it's an array or number
 */
export function getValue(value: any, index: number, defaultValue: any): any {
  if (Array.isArray(value)) {
    const v = value[index]
    return v == null ? defaultValue : v
  }
  return value
}

/**
 * Debounce utility
 */
export function debounce(fn: Function, ms: number): () => void {
  let timeoutId: number
  return function() {
    clearTimeout(timeoutId)
    // @ts-ignore
    timeoutId = setTimeout(() => fn.apply(this, arguments), ms)
  }
}

/**
 * Prevents errors from being thrown while accessing nested modifier objects
 * in `popperOptions`
 */
export function getModifier(obj: any, key: string): any {
  return obj && obj.modifiers && obj.modifiers[key]
}

/**
 * Determines if an array or string includes a value
 */
export function includes(a: any[] | string, b: any): boolean {
  return a.indexOf(b) > -1
}

/**
 * Determines if the value is singular-like
 */
export function isSingular(value: any): value is VirtualReference | Element {
  return (
    !!(value && hasOwnProperty(value, 'isVirtual')) || value instanceof Element
  )
}

/**
 * Firefox extensions don't allow setting .innerHTML directly, this will trick it
 */
export function innerHTML(): 'innerHTML' {
  return 'innerHTML'
}

/**
 * Evaluates a function if one, or returns the value
 */
export function evaluateValue(value: any, args: any[]): any {
  return typeof value === 'function' ? value.apply(null, args) : value
}

/**
 * Sets a popperInstance `flip` modifier's enabled state
 */
export function setFlipModifierEnabled(modifiers: any[], value: any): void {
  modifiers.filter(m => m.name === 'flip')[0].enabled = value
}

/**
 * Determines if an element can receive focus
 * Always returns true for virtual objects
 */
export function canReceiveFocus(element: Element): boolean {
  return element instanceof Element
    ? matches.call(
        element,
        'a[href],area[href],button,details,input,textarea,select,iframe,[tabindex]',
      ) && !element.hasAttribute('disabled')
    : true
}

/**
 * Returns a new `div` element
 */
export function div(): HTMLDivElement {
  return document.createElement('div')
}

/**
 * Evaluates the props object by merging data attributes and
 * disabling conflicting options where necessary
 */
export function evaluateProps(
  reference: ReferenceElement,
  props: Props,
): Props {
  const out = {
    ...props,
    content: evaluateValue(props.content, [reference]),
    ...(props.ignoreAttributes ? {} : getDataAttributeOptions(reference)),
  }

  if (out.arrow || isUCBrowser) {
    out.animateFill = false
  }

  return out
}

/**
 * Validates an object of options with the valid default props object
 */
export function validateOptions(options = {}, defaults: Props): void {
  Object.keys(options).forEach(option => {
    if (!hasOwnProperty(defaults, option)) {
      throw new Error(`[tippy]: \`${option}\` is not a valid option`)
    }
  })
}
