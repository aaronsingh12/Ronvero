/**
 * Joins conditional class names together, skipping falsy values.
 * A tiny hand-rolled stand-in for clsx so we don't add a dependency
 * outside the requested stack.
 *
 * cn('btn', isActive && 'btn-active', ['a', 'b']) -> 'btn btn-active a b'
 */
export function cn(...args) {
  const out = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string') out.push(arg);
    else if (Array.isArray(arg)) out.push(cn(...arg));
    else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) out.push(key);
      }
    }
  }
  return out.join(' ');
}
