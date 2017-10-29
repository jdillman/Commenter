import React from 'react';
import classnames from 'classnames';
import { FormattedMessage as Str } from 'react-intl';
import { getUrl } from 'conf/urls.js';
import DecoratedString from 'components/shared/DecoratedString';
import EditMenu from 'components/shared/EditMenu';

export function Comment(props) {
  const comment = props.comment;
  const { name, avatar } = comment.author;
  const profileUrl = getUrl(USERS_PROFILE, name);
  return (
    <div className="comment">
      <div className="avatar-container">
        <a href={profileUrl}>
          <img className="avatar" alt={name} src={avatar} />
        </a>
      </div>
      <p>
        <a href={profileUrl} className="author">{name}</a>
        <DecoratedString string={comment.body} tags={comment.tags} />
      </p>
    </div>
  );
}

export function NoCommentsCta(props) {
  return (
    <div className="no-comments-cta">
      <div className="icon-none" />
      <p><Str id="NO_COMMENT_CTA" /></p>
    </div>
  );
}

export default class CommentList extends React.PureComponent {
  scrollToBottom = () => {
    if (this.scrollRef) {
      this.scrollRef.scrollTop = this.scrollRef.scrollHeight;
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.comments.length !== this.props.comments.length) {
      this.scrollToBottom();
    }
  }

  renderList(userId, comments) {
    return (
      <ul className="comment-list">
        {
          comments.map(comment => {
            const itemClass = comment.isNew ? 'new' : '';
            const authorId = comment.author && comment.author.id;
            return (
              <li className={itemClass} key={comment.id}>
                <Comment comment={comment} />
                <EditCommentMenu
                  commentId={comment.id}
                  myComment={(userId === authorId)}
                />
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    const { comments, inviting, showInvite, userId } = this.props;
    const hasComments = (comments && comments.length);

    const mainClass = classnames('main-section', {
      'has-comments': hasComments,
      inviting,
    });

    const content = (!hasComments)
      ? <NoCommentsCta invite={showInvite} />
      : this.renderList(userId, comments);

    return (
      <div ref={(node) => { this.scrollRef = node; }} className={mainClass}>
        {content}
      </div>
    );
  }
}
