// @flow
import * as React from 'react';
import styles from './Posts.css';

export default props => {
  return (
    <div className={'item ' + styles.profile__post}>
      <div className={'ui tiny image ' + styles.profile__img_wrapper}>
        <img
          className={'book_thumbnail ' + styles.profile__img}
          src={props.post.thumbnail}
        />
      </div>
      <div className="content">
        <div className="header">{props.post.title}</div>
        <div>{props.post.thoughts.substring(0, 100) + '...'}</div>
        <a href={`/books/${props.post._id}`}>read more</a>
      </div>
    </div>
  );
};