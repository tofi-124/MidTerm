INSERT INTO users (name, email, password)
VALUES
('Eva Stanley', 'eva@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', 'lu@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'dom@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO URLs (title, url, description, topic, user_id)
VALUES
('GitHub Page -1 ', 'https://github.com/', 'My projects', 'IT', 1),
('GitHub Page - 2', 'https://github.com/', 'My projects', 'IT', 1),
('GitHub Page - 3', 'https://github.com/', 'My projects', 'IT', 1);


INSERT INTO url_ratings (rating, comment, user_id, url_id)
VALUES
('5', 'Do not forget to commit', 1, 1),
('5', 'Do not forget to commit', 1, 1),
('5', 'Do not forget to commit', 1, 1);

