from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', db_column='user_id')
    bio = models.TextField(max_length=500, blank=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'music_profile'

    def __str__(self):
        return f"{self.user.username}'s profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Artist(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'music_artist'

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    class Meta:
        db_table = 'music_genre'
    
    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='albums', db_column='artist_id')
    cover_image = models.CharField(max_length=255, blank=True, null=True)
    release_date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'music_album'
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='songs', db_column='artist_id')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='songs', null=True, blank=True, db_column='album_id')
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True, related_name='songs', db_column='genre_id')
    file_path = models.CharField(max_length=255)
    duration = models.IntegerField(help_text="Duration in seconds")
    cover_image = models.CharField(max_length=255, blank=True, null=True)
    release_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'music_song'
    
    def __str__(self):
        return f"{self.title} - {self.artist.name}"

class Playlist(models.Model):
    title = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists', db_column='user_id')
    description = models.TextField(blank=True)
    cover_image = models.CharField(max_length=255, blank=True, null=True)
    songs = models.ManyToManyField(Song, related_name='playlists', through='PlaylistSong')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'music_playlist'
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, db_column='playlist_id')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, db_column='song_id')
    added_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'music_playlistsong'
        ordering = ['order']
        unique_together = ['playlist', 'song']

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites', db_column='user_id')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='favorited_by', db_column='song_id')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'music_favorite'
        unique_together = ['user', 'song']
        
    def __str__(self):
        return f"{self.user.username} - {self.song.title}"

class PlayHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='play_history', db_column='user_id')
    song = models.ForeignKey(Song, on_delete=models.CASCADE, related_name='play_history', db_column='song_id')
    played_at = models.DateTimeField()
    
    class Meta:
        db_table = 'music_playhistory'
        ordering = ['-played_at']
        
    def __str__(self):
        return f"{self.user.username} - {self.song.title} - {self.played_at}"