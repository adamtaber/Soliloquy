CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4 (),
  displayname VARCHAR ( 50 ) NOT NULL,
  username VARCHAR ( 25 ) UNIQUE NOT NULL,
  email VARCHAR ( 255 ) UNIQUE NOT NULL,
  password VARCHAR ( 255 ) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE UNIQUE INDEX email_case_insensitive ON users(LOWER(email));
CREATE UNIQUE INDEX username_case_insensitive ON users(LOWER(username));

CREATE TABLE user_followers (
  user_id uuid NOT NULL,
  follower_id uuid NOT NULL,
  PRIMARY KEY (user_id, follower_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (follower_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT user_and_follower_different
    CHECK (user_id != follower_id)
);

CREATE TABLE messages (
  message_id uuid DEFAULT uuid_generate_v4 (),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content VARCHAR (500) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (message_id),
  FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT sender_and_receiver_different
    CHECK (sender_id != receiver_id)
);

CREATE TABLE posts (
  post_id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  content VARCHAR (500) NOT NULL,
  image_url TEXT,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX posts_pagination
ON posts (created_on DESC, post_id DESC);

CREATE TABLE comments (
  comment_id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL,
  parent_comment_id uuid,
  content VARCHAR (250) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE
);

CREATE TABLE likes (
  like_id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  post_id uuid,
  comment_id uuid,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (like_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE,
  CONSTRAINT only_post_or_column
    CHECK ((post_id IS NULL) != (comment_id IS NULL)),
  UNIQUE (post_id, user_id),
  UNIQUE (comment_id, user_id)
);

CREATE TABLE bookmarks (
  bookmark_id uuid DEFAULT uuid_generate_v4 (),
  user_id uuid NOT NULL,
  post_id uuid,
  comment_id uuid,
  created_on TIMESTAMP NOT NULL,
  PRIMARY KEY (bookmark_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts (post_id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE,
  CONSTRAINT only_post_or_column
    CHECK ((post_id IS NULL) != (comment_id IS NULL))
);

INSERT INTO users(displayname, username, email, password, created_on)
VALUES ('root', 'root', 'root@root.root', 'password', '2021-06-22 19:10:25-07')