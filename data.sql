CREATE TABLE artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    -- Các thông tin khác như ảnh đại diện, tiểu sử có thể thêm sau
    -- image_url VARCHAR(255),
    -- bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- Thời lượng bài hát tính bằng giây
    audio_url VARCHAR(512) NOT NULL, -- URL file nhạc trên Firebase/S3
    cover_art_url VARCHAR(512), -- URL ảnh bìa trên Firebase/S3
    release_date DATE, -- Ngày phát hành
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE song_artists (
    song_id INT NOT NULL,
    artist_id INT NOT NULL,
    PRIMARY KEY (song_id, artist_id), -- Khóa chính ghép
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Luôn lưu mật khẩu đã được băm (hashed)
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user', -- Phân quyền người dùng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL, -- Playlist này thuộc về ai
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE playlist_songs (
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

-- CHỈ DÙNG NẾU MUỐN BẮT ĐẦU NHANH NHẤT CÓ THỂ
CREATE TABLE songs_mvp (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_name VARCHAR(255) NOT NULL, -- Tên nghệ sĩ lưu dạng text
    duration INT NOT NULL,
    audio_url VARCHAR(512) NOT NULL,
    cover_art_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_mvp (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin') NOT NULL DEFAULT 'admin' -- Ban đầu chỉ có admin
);

INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', '$2b$12$K9vN1nCkHxj2yEZhXqZroOBQfD2MIeZPZTDR0cN8Q6Xy4u7hUXAFe', 'admin');
