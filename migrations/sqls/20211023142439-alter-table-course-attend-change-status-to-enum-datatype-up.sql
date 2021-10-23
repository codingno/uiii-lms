/* Replace with your SQL commands */
ALTER TABLE `u1556075_ulms`.`course_attend` 
CHANGE COLUMN `status` `status` ENUM('Alpha', 'Attend', 'Late', 'Attend & Active') NOT NULL DEFAULT 'Attend' ;