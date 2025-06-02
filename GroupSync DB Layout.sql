CREATE DATABASE groupsync;
USE groupsync;

CREATE TABLE user(
    userID char(255) PRIMARY KEY,
    email char(255) UNIQUE NOT NULL,
    displayName char(255) NOT NULL,
    passwordHash char(64) NOT NULL,
    salt char(32) NOT NULL,
    description text,
    pronouns char(255),
    birthday char(255),
    phoneNumber char(20)
);

CREATE TABLE gp(
    groupID INT(11) AUTO_INCREMENT PRIMARY KEY,
    groupName char(255) NOT NULL,
    groupDesc char(255),
    groupOwner char(255) NOT NULL,
CONSTRAINT FK_Group_Owner 
        FOREIGN KEY (groupOwner) REFERENCES user (userID)
);


CREATE TABLE task( 
    taskID INT(11) AUTO_INCREMENT PRIMARY KEY, 
    taskName char(255) NOT NULL,
    taskDesc char(255),
    creationDate DATETIME NOT NULL DEFAULT current_timestamp, 
    dueDate DATETIME DEFAULT CURRENT_TIMESTAMP, 
    completed BOOLEAN DEFAULT FALSE,
    taskAuthor char(255) NOT NULL,
    CONSTRAINT FK_Task_Author
        FOREIGN KEY (taskAuthor) REFERENCES user (userID)
);

CREATE TABLE groupTasks(
    groupTaskID INT(11) AUTO_INCREMENT PRIMARY KEY,
    groupTaskGroup INT(11),
    groupTaskTask INT(11),
    CONSTRAINT FK_GroupTasksTask FOREIGN KEY (groupTaskTask) REFERENCES task(taskID),
    CONSTRAINT FK_GroupTasksGroup FOREIGN KEY (groupTaskGroup) REFERENCES gp(groupID)
);

CREATE TABLE groupUsers(
    userGroupID INT(11) AUTO_INCREMENT PRIMARY KEY,
    userGroupUser char(255) NOT NULL,
    userGroupGroup INT(11) NOT NULL,
    CONSTRAINT FK_GroupUserUser FOREIGN KEY (userGroupUser) REFERENCES user(userID),
    CONSTRAINT FK_GroupUserGroup FOREIGN KEY (userGroupGroup) REFERENCES gp(groupID)
);
