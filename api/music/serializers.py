from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import Profile, Artist, Genre, Album, Song, Playlist, PlaylistSong, Favorite, PlayHistory

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Mật khẩu không khớp."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('bio', 'profile_picture', 'date_of_birth')

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'profile')
        read_only_fields = ('id', 'username', 'email')
        
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile
        
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        
        profile.bio = profile_data.get('bio', profile.bio)
        profile.profile_picture = profile_data.get('profile_picture', profile.profile_picture)
        profile.date_of_birth = profile_data.get('date_of_birth', profile.date_of_birth)
        profile.save()
        
        return instance

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'description')

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ('id', 'name', 'bio', 'image', 'created_at')

class ArtistDetailSerializer(serializers.ModelSerializer):
    albums_count = serializers.SerializerMethodField()
    songs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Artist
        fields = ('id', 'name', 'bio', 'image', 'created_at', 'albums_count', 'songs_count')
    
    def get_albums_count(self, obj):
        return obj.albums.count()
    
    def get_songs_count(self, obj):
        return obj.songs.count()

class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.ReadOnlyField(source='artist.name')
    
    class Meta:
        model = Album
        fields = ('id', 'title', 'artist', 'artist_name', 'cover_image', 'release_date', 'description')

class AlbumDetailSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    songs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Album
        fields = ('id', 'title', 'artist', 'cover_image', 'release_date', 'description', 'songs_count')
    
    def get_songs_count(self, obj):
        return obj.songs.count()

class SongSerializer(serializers.ModelSerializer):
    artist_name = serializers.ReadOnlyField(source='artist.name')
    album_title = serializers.ReadOnlyField(source='album.title')
    genre_name = serializers.ReadOnlyField(source='genre.name')
    
    class Meta:
        model = Song
        fields = ('id', 'title', 'artist', 'artist_name', 'album', 'album_title', 
                  'genre', 'genre_name', 'duration', 'cover_image', 'release_date')

class SongDetailSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    album = AlbumSerializer(read_only=True)
    genre = GenreSerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField()
    
    class Meta:
        model = Song
        fields = ('id', 'title', 'artist', 'album', 'genre', 'duration', 
                  'cover_image', 'release_date', 'is_favorite')
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Favorite.objects.filter(user=request.user, song=obj).exists()
        return False

class PlaylistSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    
    class Meta:
        model = PlaylistSong
        fields = ('id', 'song', 'order', 'added_at')

class PlaylistSerializer(serializers.ModelSerializer):
    songs_count = serializers.SerializerMethodField()
    user_username = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Playlist
        fields = ('id', 'title', 'user', 'user_username', 'description', 
                  'cover_image', 'is_public', 'songs_count', 'created_at')
        read_only_fields = ('user',)
    
    def get_songs_count(self, obj):
        return obj.songs.count()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PlaylistDetailSerializer(serializers.ModelSerializer):
    songs = PlaylistSongSerializer(source='playlistsong_set', many=True, read_only=True)
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Playlist
        fields = ('id', 'title', 'user', 'description', 'cover_image', 
                  'is_public', 'songs', 'created_at', 'updated_at')

class FavoriteSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ('id', 'song', 'created_at')
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PlayHistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)
    
    class Meta:
        model = PlayHistory
        fields = ('id', 'song', 'played_at')
        read_only_fields = ('user',)
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)