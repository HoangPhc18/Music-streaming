-- Tạo bảng nghệ sĩ
CREATE TABLE artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image_url VARCHAR(512),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng bài hát
CREATE TABLE songs (
    song_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration INT NOT NULL, -- Thời lượng bài hát tính bằng giây
    audio_url VARCHAR(512) NOT NULL, -- URL file nhạc
    cover_art_url VARCHAR(512), -- URL ảnh bìa
    release_date DATE, -- Ngày phát hành
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng kết nối nhiều-nhiều giữa bài hát và nghệ sĩ
CREATE TABLE song_artists (
    song_id INT NOT NULL,
    artist_id INT NOT NULL,
    PRIMARY KEY (song_id, artist_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE
);

-- Tạo bảng người dùng
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng playlist
CREATE TABLE playlists (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bảng kết nối nhiều-nhiều giữa playlist và bài hát
CREATE TABLE playlist_songs (
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

-- Tạo bảng album
CREATE TABLE albums (
    album_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INT,
    release_date DATE,
    cover_art_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE SET NULL
);

-- Bảng kết nối nhiều-nhiều giữa bài hát và album
CREATE TABLE album_songs (
    album_id INT NOT NULL,
    song_id INT NOT NULL,
    track_number INT,
    PRIMARY KEY (album_id, song_id),
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE
);

-- Tạo bảng thể loại nhạc
CREATE TABLE genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- Bảng kết nối nhiều-nhiều giữa bài hát và thể loại
CREATE TABLE song_genres (
    song_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (song_id, genre_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON DELETE CASCADE
);

-- Dữ liệu mẫu cho bảng artists
INSERT INTO artists (name, image_url, bio) VALUES 
('Sơn Tùng M-TP', 'https://storage.example.com/artists/son-tung-mtp.jpg', 'Ca sĩ, nhạc sĩ, nhà sản xuất âm nhạc nổi tiếng Việt Nam'),
('Bích Phương', 'https://storage.example.com/artists/bich-phuong.jpg', 'Nữ ca sĩ Việt Nam với nhiều hit được yêu thích'),
('Đen Vâu', 'https://storage.example.com/artists/den-vau.jpg', 'Rapper hàng đầu Việt Nam với phong cách độc đáo'),
('Hoàng Thùy Linh', 'https://storage.example.com/artists/hoang-thuy-linh.jpg', 'Ca sĩ, diễn viên đa tài của showbiz Việt'),
('Vũ', 'https://storage.example.com/artists/vu.jpg', 'Ca sĩ, nhạc sĩ trẻ với những bản tình ca đầy cảm xúc');

-- Dữ liệu mẫu cho bảng genres
INSERT INTO genres (name, description) VALUES 
('Pop', 'Nhạc pop Việt Nam'),
('Rap', 'Nhạc rap/hip-hop Việt Nam'),
('Ballad', 'Nhạc ballad/tình cảm'),
('R&B', 'Nhạc R&B Việt Nam'),
('EDM', 'Nhạc điện tử/dance');

-- Dữ liệu mẫu cho bảng songs
INSERT INTO songs (title, duration, audio_url, cover_art_url, release_date) VALUES 
('Chúng Ta Của Hiện Tại', 289, 'https://storage.example.com/songs/chung-ta-cua-hien-tai.mp3', 'https://storage.example.com/covers/chung-ta-cua-hien-tai.jpg', '2020-12-20'),
('Bùa Yêu', 225, 'https://storage.example.com/songs/bua-yeu.mp3', 'https://storage.example.com/covers/bua-yeu.jpg', '2018-05-08'),
('Đi Về Nhà', 246, 'https://storage.example.com/songs/di-ve-nha.mp3', 'https://storage.example.com/covers/di-ve-nha.jpg', '2019-12-22'),
('Để Mị Nói Cho Mà Nghe', 203, 'https://storage.example.com/songs/de-mi-noi-cho-ma-nghe.mp3', 'https://storage.example.com/covers/de-mi-noi-cho-ma-nghe.jpg', '2019-03-22'),
('Lạ Lùng', 267, 'https://storage.example.com/songs/la-lung.mp3', 'https://storage.example.com/covers/la-lung.jpg', '2015-09-12');

-- Kết nối bài hát với nghệ sĩ
INSERT INTO song_artists (song_id, artist_id) VALUES 
(1, 1), -- Chúng Ta Của Hiện Tại - Sơn Tùng M-TP
(2, 2), -- Bùa Yêu - Bích Phương
(3, 3), -- Đi Về Nhà - Đen Vâu
(4, 4), -- Để Mị Nói Cho Mà Nghe - Hoàng Thùy Linh
(5, 5); -- Lạ Lùng - Vũ

-- Kết nối bài hát với thể loại
INSERT INTO song_genres (song_id, genre_id) VALUES 
(1, 1), -- Chúng Ta Của Hiện Tại - Pop
(2, 1), -- Bùa Yêu - Pop
(2, 4), -- Bùa Yêu - R&B
(3, 2), -- Đi Về Nhà - Rap
(3, 3), -- Đi Về Nhà - Ballad
(4, 1), -- Để Mị Nói Cho Mà Nghe - Pop
(4, 5), -- Để Mị Nói Cho Mà Nghe - EDM
(5, 3); -- Lạ Lùng - Ballad

-- Dữ liệu mẫu cho bảng albums
INSERT INTO albums (title, artist_id, release_date, cover_art_url) VALUES 
('Chúng Ta', 1, '2020-12-20', 'https://storage.example.com/albums/chung-ta.jpg'),
('Dramatic', 2, '2019-08-20', 'https://storage.example.com/albums/dramatic.jpg'),
('Hoàng', 4, '2019-03-22', 'https://storage.example.com/albums/hoang.jpg'),
('Vũ.', 5, '2018-11-01', 'https://storage.example.com/albums/vu.jpg');

-- Kết nối bài hát với album
INSERT INTO album_songs (album_id, song_id, track_number) VALUES 
(1, 1, 1), -- Chúng Ta Của Hiện Tại trong album Chúng Ta
(2, 2, 3), -- Bùa Yêu trong album Dramatic
(3, 4, 1), -- Để Mị Nói Cho Mà Nghe trong album Hoàng
(4, 5, 2); -- Lạ Lùng trong album Vũ.

-- Dữ liệu mẫu cho bảng users
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@example.com', '$2b$12$K9vN1nCkHxj2yEZhXqZroOBQfD2MIeZPZTDR0cN8Q6Xy4u7hUXAFe', 'admin'),
('user1', 'user1@example.com', '$2b$12$K9vN1nCkHxj2yEZhXqZroOBQfD2MIeZPZTDR0cN8Q6Xy4u7hUXAFe', 'user'),
('user2', 'user2@example.com', '$2b$12$K9vN1nCkHxj2yEZhXqZroOBQfD2MIeZPZTDR0cN8Q6Xy4u7hUXAFe', 'user');

-- Dữ liệu mẫu cho bảng playlists
INSERT INTO playlists (name, user_id) VALUES 
('Nhạc Yêu Thích', 2),
('Nhạc Chill', 2),
('Workout Music', 3);

-- Kết nối playlist với bài hát
INSERT INTO playlist_songs (playlist_id, song_id) VALUES 
(1, 1), -- Chúng Ta Của Hiện Tại trong playlist Nhạc Yêu Thích
(1, 5), -- Lạ Lùng trong playlist Nhạc Yêu Thích
(2, 3), -- Đi Về Nhà trong playlist Nhạc Chill
(2, 5), -- Lạ Lùng trong playlist Nhạc Chill
(3, 2), -- Bùa Yêu trong playlist Workout Music
(3, 4); -- Để Mị Nói Cho Mà Nghe trong playlist Workout Music