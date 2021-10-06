import * as getReducer from './getReducer'
import userReducer from './userReducer'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    user: userReducer,
    ...getReducer.default,
}