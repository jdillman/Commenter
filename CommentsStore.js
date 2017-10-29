// Great library for dealing with immutible updates. 
import update from 'immutability-helper';

// Define your actions
export const COMMENTS_REQUEST = 'comments:request';
export const COMMENTS_AVAILABLE = 'comments:available';
export const COMMENTS_CREATE = 'comments:create';
export const COMMENTS_DELETE = 'comments:delete';

// Deletes the comment
export function deleteComment(commentId) {
  return { type: COMMENTS_DELETE, commentId };
}

// Creates a comment
export function createComment(productId, comment) {
  return { type: COMMENTS_CREATE, productId, comment };
}

// Fetch all the comments from the server
export function getComments(productId) {
  return { type: COMMENTS_REQUEST, productId };
}

// Adds the comments to the local state
export function commentsAvailable(productId, comments) {
  return { type: COMMENTS_AVAILABLE, productId, comments };
}

// Initial state of store
const initialState = {
  byProductId: {},
};

const initialCommentState = {
  author: null,
  text: null,
  created: null
}

// Reducers (changing the redux state with immutible actions)
export default function reducer(state = initialState, action) {
  switch (action.type) {
  case COMMENTS_ADD:
    return insertComment(state, action);
  case COMMENTS_AVAILABLE:
    return update(state, { $merge: { byproductId: {
      [action.productId]: transformComments(action.comments),
    } } });
  default:
    return state;
  }
}

function insertComment(state, action) {
  const { commentId, comment } = action;
  return update(state, { byproductId: {
    [action.productId]: {
      order: { $push: [commentId] },
      byId: { $merge: {
        [commentId]: { ...comment, isNew: true },
      } },
    },
  } });
}

function sortByDate(comments) {
  return Object.keys(comments).sort((a, b) =>
    comments[a].created - comments[b].created);
}

// By keeping the
function transformComments(comments = {}) {
  return {
    order: sortByDate(comments),
    byId: comments,
  };
}
