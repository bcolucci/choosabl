CREATE TABLE profiles (
  id STRING(50) NOT NULL,
  email STRING(255),
  username STRING(50),
  gender STRING(10),
  birthday STRING(50),
  referrer STRING(50),
  votes INT64 NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL
) PRIMARY KEY (id)
CREATE NULL_FILTERED INDEX user_by_email ON profiles (email)

CREATE TABLE votes (
  battle STRING(50) NOT NULL,
  user STRING(50) NOT NULL,
  voteFor INT64 NOT NULL,
  createdAt TIMESTAMP NOT NULL
) PRIMARY KEY (battle, user)
CREATE INDEX battle_votes ON votes (battle)
CREATE INDEX user_votes ON votes (user)

CREATE TABLE photos (
  id STRING(50) NOT NULL,
  user STRING(50) NOT NULL,
  name STRING(255) NOT NULL,
  customName STRING(255),
  path STRING(255) NOT NULL,
  type STRING(20) NOT NULL,
  size INT64 NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL
) PRIMARY KEY (id)
CREATE INDEX user_photos ON photos (user)

CREATE TABLE battles (
  id STRING(50) NOT NULL,
  name STRING(50) NOT NULL,
  user STRING(50) NOT NULL,
  photo1 STRING(50) NOT NULL,
  photo2 STRING(50) NOT NULL,
  active BOOL NOT NULL,
  isPro BOOL NOT NULL,
  publishedAt TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP NOT NULL
) PRIMARY KEY (id)
CREATE INDEX user_battles ON battles (user)
CREATE INDEX photo1_battles ON battles (photo1)
CREATE INDEX photo2_battles ON battles (photo2)

CREATE TABLE invitations (
  id STRING(50) NOT NULL,
  user STRING(50) NOT NULL,
  invited STRING(50) NOT NULL,
  message STRING(300),
  createdAt TIMESTAMP NOT NULL
) PRIMARY KEY (id)
CREATE INDEX user_invitations ON invitations (user)
CREATE INDEX invited_user_invitations ON invitations (invited)
