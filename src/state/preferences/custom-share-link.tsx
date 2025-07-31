import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['customShareLink']
type SetContext = (v: persisted.Schema['customShareLink']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.customShareLink,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['customShareLink']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('customShareLink'))

  const setStateWrapped = React.useCallback(
    (customShareLink: persisted.Schema['customShareLink']) => {
      setState(customShareLink)
      persisted.write('customShareLink', customShareLink)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('customShareLink', nextCustomShareLink => {
      setState(nextCustomShareLink)
    })
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useCustomShareLink() {
  return React.useContext(stateContext)
}

export function useSetCustomShareLink() {
  return React.useContext(setContext)
}

export function getCustomShareLink() {
  return persisted.get('customShareLink') || persisted.defaults.customShareLink!
}
