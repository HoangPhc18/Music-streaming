from django.contrib import admin
from .models import Profile, Artist, Genre, Album, Song, Playlist, PlaylistSong, Favorite, PlayHistory

# Register your models here.
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'bio', 'date_of_birth', 'created_at')
    search_fields = ('user__username', 'user__email')

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_date', 'created_at')
    list_filter = ('artist', 'release_date')
    search_fields = ('title', 'artist__name')

@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'genre', 'duration', 'release_date')
    list_filter = ('artist', 'album', 'genre', 'release_date')
    search_fields = ('title', 'artist__name', 'album__title')

class PlaylistSongInline(admin.TabularInline):
    model = PlaylistSong
    extra = 1

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'is_public', 'created_at')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'user__username')
    inlines = [PlaylistSongInline]

@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'song__title')

@admin.register(PlayHistory)
class PlayHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'song', 'played_at')
    list_filter = ('played_at',)
    search_fields = ('user__username', 'song__title')
    date_hierarchy = 'played_at'
