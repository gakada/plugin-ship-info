import { observer } from 'redux-observers'
import { isEqual, omit } from 'lodash'

import { extensionSelectorFactory } from 'views/utils/selectors'

export const PLUGIN_KEY = 'poi-plugin-ship-info'

let initState = {}

try {
  initState = JSON.parse(localStorage.getItem(PLUGIN_KEY)) || {}
  if ('bookmark' in initState && 'planner' in initState) {
    initState = initState.bookmark
  }
} catch (e) {
  console.error(e.stack)
}


export const reducer = (state = initState, action) => {
  const { type, bookmark, settings } = action
  switch (type) {
    case '@@poi-plugin-ship-info@update':
      return {
        ...state,
        [bookmark]: {
          ...omit(settings, 'shipTypeChecked'),
          name: bookmark,
        },
      }
    case '@@poi-plugin-ship-info@delete': {
      return omit(state, bookmark)
    }
    default:
      return state
  }
}

// actions
export const onUpdate = ({ bookmark, settings }) => ({
  type: '@@poi-plugin-ship-info@update',
  bookmark,
  settings,
})

export const onDelete = ({ bookmark }) => ({
  type: '@@poi-plugin-ship-info@delete',
  bookmark,
})

// observers
export const bookmarksObserver = observer(
  extensionSelectorFactory(PLUGIN_KEY),
  (dispatch, current = {}, previous) => {
    // avoid initial state overwrites file
    if (!isEqual(current, previous) && Object.keys(current).length > 0) {
      localStorage.setItem(PLUGIN_KEY, JSON.stringify(current))
    }
  }
)
