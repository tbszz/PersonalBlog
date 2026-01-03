-- User Table
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    role VARCHAR(20) DEFAULT 'visitor',
    profile_json LONGTEXT,
    enabled BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Article Table
CREATE TABLE IF NOT EXISTS blog_article (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    summary VARCHAR(500),
    cover_image VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft',
    publish_time DATETIME,
    scheduled_publish_time DATETIME,
    schedule_enabled BOOLEAN DEFAULT FALSE,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    author_id BIGINT,
    author_name VARCHAR(50),
    is_top BOOLEAN DEFAULT FALSE,
    is_recommend BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Item Table
CREATE TABLE IF NOT EXISTS gallery_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL COMMENT 'image or video',
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    description VARCHAR(255),
    width INT,
    height INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Comment Table
CREATE TABLE IF NOT EXISTS blog_comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    article_id BIGINT NOT NULL,
    user_id BIGINT,
    content TEXT NOT NULL,
    parent_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES blog_article(id) ON DELETE CASCADE
);

-- User Interaction (Like/Collect)
CREATE TABLE IF NOT EXISTS user_interaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL COMMENT 'like or collect',
    target_type VARCHAR(20) NOT NULL COMMENT 'article or gallery',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert Admin User (password: 123456)
INSERT INTO sys_user (username, password, nickname, role) 
SELECT 'admin', '$2a$10$ko0QIrsP4JI01lpnVlpbxO95FXIVxa0ABOD26KNK/Up6dpJGTNyre', 'Admin', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM sys_user WHERE username = 'admin');
