import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.repostAsEnabled),
)
const setContext = React.createContext<SetContext>((_: boolean) => {})

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('repostAsEnabled')),
  )

  const setStateWrapped = React.useCallback(
    (value: persisted.Schema['repostAsEnabled']) => {
      setState(Boolean(value))
      persisted.write('repostAsEnabled', value)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('repostAsEnabled', nextValue => {
      setState(Boolean(nextValue))
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

export const useRepostAsEnabled = () => React.useContext(stateContext)
export const useSetRepostAsEnabled = () => React.useContext(setContext)
