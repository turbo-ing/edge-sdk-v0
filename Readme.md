# Turbo Edge SDK V0

The Turbo Edge SDK allows for the development and deployment of low-latency, online multiplayer games that are entirely peer-to-peer, eliminating the need for servers. Even students can deploy and share their games with classmates without incurring any recurring monthly server costs. Players in the same geographic region can play together with low-latency without having game developers spend millions of dollars deploying servers worldwide.

With just a few lines of additional code, your offline game can be transformed into an online multiplayer game.

## TurboEdgeProviderV0

TurboEdgeProviderV0 is a required context provider for React applications using Turbo Edge. It enables Turbo Edge features, such as the `useEdgeReducerV0` hook, by making the necessary context available throughout your app.

Wrap your application’s root component with the `TurboEdgeProviderV0`. This allows any child component to access Turbo Edge functionalities.

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { TurboEdgeProviderV0 } from '@turbo-ing/edge-v0'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TurboEdgeProviderV0>
      <App />
    </TurboEdgeProviderV0>
  </StrictMode>,
)
```

## React useReducer vs Turbo Edge useEdgeReducerV0

The design pattern is inspired by the action reducer pattern commonly used in Redux and React, allowing developers to quickly adapt and start working with the Turbo Edge SDK with minimal learning curve.

### React useReducer

Here is an example of code for moving a player's location in an offline single-player game.

```javascript
const initState = { pos: [0, 0] }

function reducer(state, action) {
  switch (action.type) {
    case 'move':
      const s = cloneDeep(state)
      s.pos[0] += action.pos[0]
      s.pos[1] += action.pos[1]
      return s
    default: return state
  }
}

function GameComponent() {
  const [state, dispatch] =
    useReducer(reducer, initState)

  const move = (pos) => dispatch({
    type: 'move', pos
  })

  // ... [ Use with state.pos ] ...
}
```

### Turbo Edge useEdgeReducerV0

Here is an example of code for syncing a player's location across peers. It's mostly identical to the React `useReducer` hook. You just need to select a topic for your game/room and use `action.peerId` to identify the player performing the action.

```javascript
const initState = { pos: {} }

function reducer(state, action) {
  switch (action.type) {
    case 'move':
      const s = cloneDeep(state)
      s.pos[action.peerId][0] += action.pos[0]
      s.pos[action.peerId][0] += action.pos[1]
      return s
    default: return state
  }
}

function GameComponent() {
  const [state, dispatch, connected] =
    useEdgeReducerV0(reducer, initState, {
      topic: '...',
    })

  const move = async (pos) => await dispatch({
    type: 'move', pos
  })

  // ... [ Use with state.pos[userId] ] ...
}
```
