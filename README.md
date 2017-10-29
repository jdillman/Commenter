# Example React Commenting system

* Interview discussion project, not a real product *

This was done as a way to demonstrate building a medium complexity system in React and Redux. I'll attempt to go through the full design and build to give a reasonable expectation of my abilities. (This will focus mostly on the FE engineering side of the things)

## Product Ask ##

We want comments on our product pages. This will help engagement and allow our users to discuss the product with their friends!

## Phase 1 Design ##

Meet with product team to discuss acceptance criteria. Create tasks and start high level estimating. Discuss what expectations are for MVP and reduce scope where necessary.

Once you've ensured mockups and acceptance criteria tell the same story start planning how to deliver the product. Ensure your tasks are ranked well and the priority has been set (i.e don't waste 3 days building a complex delete and report comment menu if nobody cares about that for v1).

## Phase 2 Data Requirements ##

In this particular instance another team will be building the backend component so I stub as much data as I can at the beginning to keep myself unblocked and moving forward. It will be important to stay synced with them so as soon as they lock down the APIs I can just plug it in without skipping a beat.

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

## Phase 3 UI State ##

Using the mockups and acceptance criteria as a guide I start the Redux store  design. I identifiy the following actions.

* Fetch all comments for a productId
* Sortable by date
* Add your own comment
* Delete your comment

Comment structure
```
{
  avatar: <string>,
  name: <string>,
  text: <string>,
  created: <timestamp>,
}
```

[CommentsStore](https://github.com/jdillman/example/blob/master/CommentsStore.js)
