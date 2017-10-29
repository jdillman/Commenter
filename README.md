# Example React/Redux Commenting Component

*Interview discussion project, not a real product*

This was done as a way to demonstrate building a medium complexity system as a Frontend Engineer using React and Redux using an agile process.

## Product Ask ##

We want comments on our product pages. This will help engagement and allow our users to discuss the product with their friends!

## Design ##

Meet with product team to discuss acceptance criteria. Create tasks and start high level estimating. Discuss what expectations are for MVP and reduce scope where necessary.

Once you've ensured mockups and acceptance criteria tell the same story start planning how to deliver the product. Ensure your tasks are ranked well and the priority has been set (i.e don't waste 3 days building a complex delete and report comment menu if nobody cares about that for v1).

## State and Component Design ##

Using the mockups and acceptance criteria as a guide I build a quick prototype version of the Comment component.
```
export default class Comments extends React.PureComponent {
  render() {
    return (
      <div className="comments">
      { 
        this.props.comments.map((comment) => (
          <div className="comment"
            <img src={comment.avatar} />
            <span>{author}</span>
            <p>{comment}</p>
          </div>
        ))
      }
      </div>
    );
  }
}
```
This helps identify what belongs in the redux store and how to best structure the data. 

In this particular instance another team will be building the backend component so I stub as much data as I can to keep myself unblocked and moving forward. 
```
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
I then start to build the redux store by looking at what actions are required and how to best structure the comment data.

* Fetch all comments for a productId
* Sortable by date
* Add your own comment
* Delete your comment

Comment Store
```
{
  byProductId: {
    prd123: {
      order: ['cid123'],
      byId: {
        cid123: { ... },
      },
    },
  },
}
```

Comment Structure
```
{
  avatar: <string>,
  name: <string>,
  text: <string>,
  created: <timestamp>,
}
```
The fake store has a single product `prd123` with a single comment `cid123`. I've structured the store with separate `order` and `byId` fields to allow easier sorting via a transformComments function. If you're using typeScript or flow you'll want to ensure your data is properly typed here as well.

After I've built enough of the store I go back and hook it up to my component.
```
import { getComments } from 'CommentsSt'
export default class Comments extends React.PureComponent {
  componentDidMount() {
    this.props.getComments(this.props.feedId);
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
    comments: state.comments.order.map(id =>
      Object.assign({}, commentsByFeed.byId[id])
    ),
  }
}

export default connect(mapStateToProps, { getComments })(Comments);
```

And since we'll be dealing with an API we'll need a middleware for handling actions with side effects
```
import { COMMENTS_REQUEST, commentsAvailable } from 'modules/CommentsModule';

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

function fetchComments(productId) {
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

At this point I add enough CSS and JS to try and have a working demo to show to other stakeholders. Also, getting feedback early helps shake out UX issues that may not have been captured in a static mockup.

Assuming the demo shows we're on the right path I add tests to the critical paths, start on the real CSS and start breaking out my prototype component into manageable chunks.

# Links to example code #
*Finished Comment store* [CommentsStore](https://github.com/jdillman/example/blob/master/CommentsStore.js)

*Finished Comments middleware* [CommentsMiddleware](https://github.com/jdillman/example/blob/master/CommentsStore.js)

*Finished Comments components* [CommentsComponents](https://github.com/jdillman/example/blob/master/CommentsComponents.jsx)

## Other considerations ##

Always assume you'll want to AB test or otherwise feature flag components, besides just being a good idea it'll force you to keep your integration footprint small.

Good unit tests are incredibly useful for critical paths but overdoing it often isn't worth the effort. That being said, any code that fails more than once isn't fixed until it has a passing test.

Quick iterations are one of keys of good engineering process. The quicker you can get feedback from stakeholders the better your product will be. It also ensures engineering effort is focused on the right thing.
