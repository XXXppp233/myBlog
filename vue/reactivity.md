# Understanding Vue 3 Reactivity

Vue 3 uses JavaScript Proxies for its reactivity system, which is a significant change from the `Object.defineProperty` approach used in Vue 2.

## Ref vs Reactive

- `ref`: Recommended for primitive values (string, number, boolean).
- `reactive`: Recommended for objects.

```javascript
import { ref, reactive } from 'vue'

const count = ref(0)
const state = reactive({ count: 0 })
```
