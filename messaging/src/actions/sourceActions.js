import * as types from '../constants/actionTypes';
import * as api from '../api';

function fetchSourcesSucceeded(sources) {
  return {
    type: types.FETCH_SOURCES_SUCCEEDED,
    sources
  };
}

function fetchSourcesFailed(error) {
  return {
    type: types.FETCH_SOURCES_FAILED,
    error
  };
}

// thunk
export function fetchSources() {
  return dispatch => {
    api
      .fetchSources()
      .then(resp => {
        return dispatch(fetchSourcesSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchSourcesFailed(err.message));
      });
  };
}

function fetchSourceSucceeded(source) {
  return {
    type: types.FETCH_SOURCE_SUCCEEDED,
    source
  };
}

function fetchSourceFailed(error) {
  return {
    type: types.FETCH_SOURCE_FAILED,
    error
  };
}

// thunk
export function fetchSource(id) {
  return dispatch => {
    api
      .fetchSource(id)
      .then(resp => {
        return dispatch(fetchSourceSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchSourceFailed(err.message));
      });
  };
}

function fetchMessagesForSourceSucceeded(messages) {
  return {
    type: types.FETCH_MESSAGES_FOR_SOURCE_SUCCEEDED,
    messages
  };
}

function fetchMessagesForSourceFailed(error) {
  return {
    type: types.FETCH_MESSAGES_FOR_SOURCE_FAILED,
    error
  };
}

// thunk
export function fetchMessagesForSource(sourceId) {
  return dispatch => {
    api
      .fetchMessagesForSource(sourceId)
      .then(resp => {
        return dispatch(fetchMessagesForSourceSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchMessagesForSourceFailed(err.message));
      });
  };
}
