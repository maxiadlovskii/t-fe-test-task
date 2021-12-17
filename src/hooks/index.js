import { useCallback, useMemo, useReducer } from 'react';

import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { FAILED, REQUEST, SUCCESS } from '../constants/actions';

const initialFetchState = {
    isFetching: false,
    isFailed: false,
    isSuccess: false,
    data: null,
    error: null,
};
const defaultDataTransformer = (d) => d.data;
const dispatcher =
    ({ fetcher, dataTransformer = defaultDataTransformer, dispatch }) =>
    async (...params) => {
        try {
            dispatch({ type: REQUEST });
            const response = await fetcher(...params);
            const payload = dataTransformer(response);
            dispatch({ type: SUCCESS, payload });

            return Promise.resolve(payload);
        } catch (error) {
            dispatch({ type: FAILED, payload: error });
            return Promise.reject(error);
        }
    };

const fetchReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case REQUEST:
            return {
                ...state,
                isFetching: true,
                isFailed: false,
                isSuccess: false,
            };
        case SUCCESS:
            return {
                ...state,
                isFetching: false,
                isSuccess: true,
                data: payload,
            };
        case FAILED:
            return {
                ...state,
                isFetching: false,
                isFailed: true,
                error: get(payload, 'response.data', {
                    description: 'Smth went wrong :(... try again',
                }),
            };
        default:
            throw new Error();
    }
};
const useFetch = (fetcher, dataTransformer) => {
    const [state, dispatch] = useReducer(fetchReducer, initialFetchState);
    const fetchData = useMemo(
        () => dispatcher({ fetcher, dataTransformer, dispatch }),
        [dispatch, dataTransformer, fetcher],
    );
    const setData = useCallback(
        (data) => {
            const payload = isFunction(data) ? data(state.data) : data;
            dispatch({ type: SUCCESS, payload });
        },
        [dispatch, state.data],
    );
    return [state, fetchData, { setData }];
};

export default useFetch;
