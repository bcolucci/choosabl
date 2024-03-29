
CREATE DATABASE IF NOT EXISTS choosabl_test_71670;

USE choosabl_test_71670;

DROP TABLE IF EXISTS profiles;
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50),
  gender VARCHAR(10),
  birthday VARCHAR(50),
  referrer VARCHAR(50),
  votes INTEGER NOT NULL,
  updatedAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL
);

DROP TABLE IF EXISTS votes;
CREATE TABLE IF NOT EXISTS votes (
  battle VARCHAR(50) NOT NULL,
  user VARCHAR(50) NOT NULL,
  voteFor INTEGER NOT NULL,
  createdAt DATETIME NOT NULL,
  INDEX (battle),
  INDEX (user),
  PRIMARY KEY (battle, user)
);

DROP TABLE IF EXISTS photos;
CREATE TABLE IF NOT EXISTS photos (
  id VARCHAR(50) PRIMARY KEY,
  user VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  customName VARCHAR(255),
  path VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL,
  size INTEGER  NOT NULL,
  updatedAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  INDEX (user)
);

DROP TABLE IF EXISTS battles;
CREATE TABLE IF NOT EXISTS battles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  user VARCHAR (50) NOT NULL,
  photo1 VARCHAR (50) NOT NULL,
  photo2 VARCHAR (50) NOT NULL,
  active BOOL NOT NULL,
  isPro BOOL NOT NULL,
  publishedAt DATETIME,
  updatedAt DATETIME NOT NULL,
  createdAt DATETIME NOT NULL,
  INDEX (user),
  INDEX (photo1),
  INDEX (photo2)
);

DROP TABLE IF EXISTS invitations;
CREATE TABLE IF NOT EXISTS invitations (
  id VARCHAR(50) PRIMARY KEY,
  user VARCHAR (50) NOT NULL,
  invited VARCHAR (50) NOT NULL,
  message VARCHAR (300),
  createdAt DATETIME NOT NULL,
  INDEX (user),
  INDEX (invited)
);
