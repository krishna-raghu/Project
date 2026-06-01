CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE projects(
    project_id SERIAL PRIMARY KEY,
    project_name VARCHAR(255),
    owner_id INT REFERENCES users(user_id),
    project_password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE project_members(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    project_id INT REFERENCES projects(project_id),
    role VARCHAR(20)
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema='public';

ALTER TABLE users
ALTER COLUMN username SET NOT NULL;

ALTER TABLE users
ALTER COLUMN email SET NOT NULL;

ALTER TABLE users
ALTER COLUMN password_hash SET NOT NULL;

ALTER TABLE projects
ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE projects
ALTER COLUMN project_name SET NOT NULL;

ALTER TABLE project_members
ADD CONSTRAINT unique_member
UNIQUE(user_id, project_id);

INSERT INTO users(username,email,password_hash)
VALUES('xyz','xyz@gmail.com','hashedpassword');

SELECT * FROM users;

ALTER TABLE users
ADD COLUMN full_name VARCHAR(150);
