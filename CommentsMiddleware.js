import {
  COMMENTS_CREATE,
  COMMENTS_REQUEST,
  commentsAvailable,
  addComment,
} from 'CommentsStore';

let dispatch = null;

// eslint-disable-next-line
const CommentsMiddleware = store => next => action => {
  dispatch = store.dispatch;

  switch (action.type) {
  case COMMENTS_CREATE:
    createComment(action.productId, action.comment);
    break;
  case COMMENTS_REQUEST:
    fetchComments(action.productId);
    break;
  default:
    break;
  }

  return next(action);
};

function createComment(productId, comment) {
  const payload = {
    productId,
    comment,
    format: 'json',
  };
  const fetchInit = {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  };

  const url = getUrl('http://localhost/comments/:productId/create', productId);
  return fetch(url, fetchInit)
    .then(response => response.json())
    .then((response) => {
      const _comment = response.data;
      const id = _comment.id;
      const decorated = decorateComments({ [id]: _comment });
      dispatch(addComment(productId, id, decorated[id]));
    });
}

function fetchComments(productId) {
  const fetchInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };

  const url = getUrl('http://localhost/comments/:productId', productId);
  return fetch(url, fetchInit)
    .then(response => response.json())
    .then((response) => {
      dispatch(commentsAvailable(productId, decorateComments(response.data)));
    });
}

export function decorateComments(data = {}) {
  const comments = {};
  Object.keys(data).forEach(id => {
    const comment = data[id];
    const author = comment.author || {};
    comments[id] = {
      id,
      text: comment.body,
      created: comment.created_at,
      author: {
        id: author.id,
        name: author.display_name,
        avatar: author.small_avatar,
      },
    };
  });

  return comments;
}

export default CommentsMiddleware;
