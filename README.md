# Example React/Redux Commenting Component

* Interview discussion project, not a real product.

This was done as a way to demonstrate building a medium complexity system in React and Redux. I'll attempt to go through the full design and build to give a reasonable expectation of my abilities. (This will focus mostly on the FE engineering side of the things)

## Product Ask ##

We want comments on our product pages. This will help engagement and allow our users to discuss the product with their friends!

## Design ##

Meet with product team to discuss acceptance criteria. Create tasks and start high level estimating. Discuss what expectations are for MVP and reduce scope where necessary.

Once you've ensured mockups and acceptance criteria tell the same story start planning how to deliver the product. Ensure your tasks are ranked well and the priority has been set (i.e don't waste 3 days building a complex delete and report comment menu if nobody cares about that for v1).

## Data Requirements ##

In this particular instance another team will be building the backend component so I stub as much data as I can to keep myself unblocked and moving forward.

```
// TODO plug in real API
fetchComments(userId, productId) {
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

## UI State ##

Using the mockups and acceptance criteria as a guide I start the Redux store  design. I identifiy the following actions and comment structure needed 

* Fetch all comments for a productId
* Sortable by date
* Add your own comment
* Delete your comment

Comment Structure
```
{
  avatar: <string>,
  name: <string>,
  text: <string>,
  created: <timestamp>,
}
```

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

The fake store has a single product ('prd123') with a single comment ('cid123'). I've structured the store with separate `order` and `byId` fields to allow easier sorting.

`Finished Redux Comment store using the [Ducks](https://github.com/erikras/ducks-modular-redux) pattern`
[CommentsStore](https://github.com/jdillman/example/blob/master/CommentsStore.js)

And since we'll be dealing with an API we'll need a middleware for handling actions with side effects

[CommentsMiddleware](https://github.com/jdillman/example/blob/master/CommentsStore.js)

## Components ##

## Tests/Deploy ##

Using a coverage tool ensure you're not missing edge cases but focus first on adding tests to critical paths.
