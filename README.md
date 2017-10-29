# Example React/Redux Commenting Component

*Interview discussion project, not a real product*

This was done as a way to demonstrate building a medium complexity system as a Frontend Engineer using React and Redux with an agile process.

*tldr; heres some code*

[CommentsStore](https://github.com/jdillman/example/blob/master/CommentsStore.js)

[CommentsMiddleware](https://github.com/jdillman/example/blob/master/CommentsMiddleware.js)

[CommentsComponents](https://github.com/jdillman/example/blob/master/CommentsComponents.jsx)

# Scenario #

We want comments on our product pages. This will help engagement and allow our users to discuss the product with their friends!

## Design ##

Meet with product team to discuss acceptance criteria. Create tasks and start high level estimating. Discuss what expectations are for MVP and reduce scope where necessary.

Once you've ensured mockups and acceptance criteria tell the same story start planning how to deliver the product. Ensure your tasks are ranked well and the priority has been set (i.e don't waste 3 days building a complex delete and report comment menu if nobody cares about that for v1).

## State and Component Design ##

Using the mockups and acceptance criteria as a guide I build a quick prototype version of the Comments component.
```javascript
export default class Comments extends React.PureComponent {
  render() {
    return (
      <div className="comments">
      { 
        this.props.comments.map((comment) => (
          <div className="comment"
            <img src={comment.avatar} />
            <span>{comment.author}</span>
            <p>{comment.text}</p>
            <button onClick={() => console.log('deleted')}>Delete</button>
          </div>
        ))
      }
      </div>
    );
  }
}
```
This helps identify what is state and what is just UI and what actions will be needed.

Next i mock out the comment structure and data store. Assuming I'll be using an API for the actual data I also like to write a decorate function that transforms the data into something sane to work with, handling sanity checks as soon as the data comes into your system tends to work best.

```json
{
  "avatar": <String>,
  "name": <String>,
  "text": <String>,
  "created": <Timestamp>,
}
```

Comment Store
```json
{
  "byProductId": {
    "prd123": {
      "order": ["cid123"],
      "byId": {
        "cid123": { ... },
      },
    },
  },
}
```

In this particular instance another team will be building the backend component so I stub as much data as I can to keep myself unblocked and moving forward. 
```javascript
// TODO plug in real API
fetchComments(productId) {
  return {
    cid123: {
      avatar: 'https://example.com/avatar.png',
      author: 'jon',
      text: 'Comment text',
      created: 1508869014,
    }
  };
}
```

The fake store has a single product `prd123` with a single comment `cid123`. I've structured the store with separate `order` and `byId` fields to allow easier sorting via a transformComments function. If you're using typeScript or flow you'll want to ensure your data is properly typed here as well.

After I've built enough of the store I go back and hook it up to my component.
```javascript
import { getComments, deleteComment } from "CommentsStore"
export default class Comments extends React.PureComponent {
  componentDidMount() {
    this.props.getComments(this.props.productId);
  }

  deleteComment = () => {
    this.props.deleteComment(this.props.productId)
  }

  render() {
    return (
      <div className="comments">
      { 
        this.props.comments.map((comment) => (
          <div className="comment"
            <img src={comment.avatar} />
            <span>{author}</span>
            <p>{comment}</p>
            <button onClick={this.deleteComment}>Delete</button>
          </div>
        ))
      }
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const comments = state.comments.byProductId[props.productId];
  return {
    comments: comments.order.map(id =>
      Object.assign({}, comments.byId[id])
    ),
  }
}

export default connect(mapStateToProps, { getComments })(Comments);
```

And since we'll be dealing with an API we'll need a middleware for handling actions with side effects
```javascript
import { COMMENTS_REQUEST, commentsAvailable } from 'CommentsStore';

const CommentsMiddleware = store => next => action => {
  dispatch = store.dispatch;

  switch (action.type) {
  case COMMENTS_REQUEST:
    fetchComments(dispatch, action.productId);
    break;
  default:
    break;
  }

  return next(action);
};

function fetchComments(dispatch, productId) {
  const fetchInit = {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  };

  const url = getCommentsUrl(productId);
  return fetch(url, fetchInit)
    .then(response => response.json())
    .then(data => 
      dispatch(commentsAvailable(productId, data));
    });
}

export default CommentsMiddleware;
```

Once I have the full flow working I add enough CSS and JS to give a working demo to show to other stakeholders. Getting feedback early helps shake out UX issues that may not have been captured in a static mockup.

Assuming the demo shows we're on the right path I add tests to the critical paths, start on the real CSS and start breaking out my prototype component into manageable chunks.

## Other considerations ##

Always assume you'll want to AB test or otherwise feature flag components, besides just being a good idea it'll force you to keep your integration footprint small.

Good unit tests are incredibly useful for critical paths but overdoing it often isn't worth the effort. That being said, any code that fails more than once isn't fixed until it has a passing test.

Quick iterations are one of keys of good engineering process. The quicker you can get feedback from stakeholders the better your product will be. It also ensures engineering effort is focused on the right thing.
