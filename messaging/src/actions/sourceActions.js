import * as types from '../constants/actionTypes';
import * as api from '../api';

// Non-thunks are exported only for tests

export function fetchSourcesSucceeded(sources) {
  return {
    type: types.FETCH_SOURCES_SUCCEEDED,
    sources
  };
}

export function fetchSourcesFailed(error) {
  return {
    type: types.FETCH_SOURCES_FAILED,
    error
  };
}

// thunk
export function fetchSources() {
  return dispatch =>
    api
      .fetchSources()
      .then(resp => {
        return dispatch(fetchSourcesSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchSourcesFailed(err.message));
      });
}

export function fetchSourceSucceeded(source) {
  return {
    type: types.FETCH_SOURCE_SUCCEEDED,
    source
  };
}

export function fetchSourceFailed(error) {
  return {
    type: types.FETCH_SOURCE_FAILED,
    error
  };
}

// thunk
export function fetchSource(id) {
  return dispatch =>
    api
      .fetchSource(id)
      .then(resp => {
        return dispatch(fetchSourceSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchSourceFailed(err.message));
      });
}

export function fetchMessagesForSourceSucceeded(messages) {
  return {
    type: types.FETCH_MESSAGES_FOR_SOURCE_SUCCEEDED,
    messages
  };
}

export function fetchMessagesForSourceFailed(error) {
  return {
    type: types.FETCH_MESSAGES_FOR_SOURCE_FAILED,
    error
  };
}

// thunk - status (filter) is optional
export function fetchMessagesForSource(sourceId, status, page) {
  return dispatch =>
    api
      .fetchMessagesForSource(sourceId, status, page)
      .then(resp => {
        return dispatch(fetchMessagesForSourceSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchMessagesForSourceFailed(err.message));
      });
}

export function fetchMessageStatusCountsForSourceSucceeded(counts) {
  return {
    type: types.FETCH_MESSAGE_STATUS_COUNTS_FOR_SOURCE_SUCCEEDED,
    counts
  };
}

export function fetchMessageStatusCountsForSourceFailed(error) {
  return {
    type: types.FETCH_MESSAGE_STATUS_COUNTS_FOR_SOURCE_FAILED,
    error
  };
}

// thunk
export function fetchMessageStatusCountsForSource(sourceId) {
  return dispatch =>
    api
      .fetchMessageStatusCountsForSource(sourceId)
      .then(resp => {
        return dispatch(fetchMessageStatusCountsForSourceSucceeded(resp.data));
      })
      .catch(err => {
        return dispatch(fetchMessageStatusCountsForSourceFailed(err.message));
      });
}
