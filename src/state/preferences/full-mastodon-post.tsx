import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['renderFullMastodonPostText']
type SetContext = (v: persisted.Schema['renderFullMastodonPostText']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.renderFullMastodonPostText,
)
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['renderFullMastodonPostText']) => {},
)

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(
    persisted.get('renderFullMastodonPostText'),
  )

  const setStateWrapped = React.useCallback(
    (
      renderFullMastodonPostText: persisted.Schema['renderFullMastodonPostText'],
    ) => {
      setState(renderFullMastodonPostText)
      persisted.write('renderFullMastodonPostText', renderFullMastodonPostText)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'renderFullMastodonPostText',
      nextRenderFullMastodonPostText => {
        setState(nextRenderFullMastodonPostText)
      },
    )
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useRenderFullMastodonPostText() {
  return React.useContext(stateContext)
}

export function useSetRenderFullMastodonPostText() {
  return React.useContext(setContext)
}
