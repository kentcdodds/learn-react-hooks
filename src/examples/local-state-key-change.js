// useEffect: persistent state
// flexible localStorage hook - changing the key in localStorage
// http://localhost:3000/isolated/examples/local-state-key-change.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // the try/catch is here in case the localStorage value was set before
      // we had the serialization in place (like we do in previous extra credits)
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  const [key, setKey] = React.useState('name');
  const [name, setName] = useLocalStorageState(key, initialName)

  function handleClick() {
    if (key === 'name') {
      setKey('firstName');
    } else if (key === 'firstName') {
      setKey('Name')
    } else {
      setKey('name')
    }
  }

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <button type="button" onClick={handleClick}>Change key!</button>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

export default Greeting
