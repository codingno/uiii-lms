/* Replace with your SQL commands */
CREATE TABLE topic (
  id INT NOT NULL AUTO_INCREMENT,
  topic_id INT NULL,
  activity VARCHAR(45) NULL,
  attachment VARCHAR(45) NULL,
  createdAt DATETIME NULL DEFAULT NOW(),
  createdBy INT NULL,
  updatedAt DATETIME NULL,
  updatedBy INT NULL
  PRIMARY KEY (id));