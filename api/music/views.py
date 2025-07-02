from django.shortcuts import render, get_object_or_404
from rest_framework import generics, viewsets, filters, parsers
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .models import Profile, Artist, Genre, Album, Song, Playlist, PlaylistSong, Favorite, PlayHistory
from .serializers import (
    RegisterSerializer, UserProfileSerializer, GenreSerializer, ArtistSerializer,
    ArtistDetailSerializer, AlbumSerializer, AlbumDetailSerializer, SongSerializer,
    SongDetailSerializer, PlaylistSerializer, PlaylistDetailSerializer,
    FavoriteSerializer, PlayHistorySerializer, PlaylistSongSerializer
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, parser_classes
from django.db.models import Q
import os
from django.http import FileResponse, Http404
from django.conf import settings
import uuid
from datetime import datetime

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': serializer.data,
            'message': 'Người dùng đã được đăng ký thành công',
        }, status=status.HTTP_201_CREATED)

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'email': user.email
        })

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Delete the user's token to logout
        request.user.auth_token.delete()
        return Response({"message": "Đăng xuất thành công"}, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request):
        user = request.user
        if not user.check_password(request.data.get('old_password')):
            return Response({'error': 'Mật khẩu cũ không chính xác'}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get('new_password') != request.data.get('confirm_password'):
            return Response({'error': 'Mật khẩu mới không khớp'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(request.data.get('new_password'))
        user.save()
        return Response({'message': 'Mật khẩu đã được thay đổi thành công'}, status=status.HTTP_200_OK)

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        genre = self.get_object()
        songs = Song.objects.filter(genre=genre)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

class ArtistViewSet(viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ArtistDetailSerializer
        return ArtistSerializer
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        artist = self.get_object()
        songs = Song.objects.filter(artist=artist)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def albums(self, request, pk=None):
        artist = self.get_object()
        albums = Album.objects.filter(artist=artist)
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'artist__name']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AlbumDetailSerializer
        return AlbumSerializer
    
    @action(detail=True, methods=['get'])
    def songs(self, request, pk=None):
        album = self.get_object()
        songs = Song.objects.filter(album=album)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)

class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'artist__name', 'album__title']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SongDetailSerializer
        return SongSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context
    
    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser], parser_classes=[parsers.MultiPartParser, parsers.FormParser])
    def upload(self, request):
        """
        Upload a new song file and create a song record
        """
        try:
            # Get form data
            title = request.data.get('title')
            artist_id = request.data.get('artist_id')
            album_id = request.data.get('album_id')
            genre_id = request.data.get('genre_id')
            release_date = request.data.get('release_date')
            is_featured = request.data.get('is_featured', 'false').lower() == 'true'
            is_public = request.data.get('is_public', 'true').lower() == 'true'
            music_file = request.FILES.get('file')
            
            # Validate required fields
            if not title or not artist_id or not genre_id or not music_file:
                return Response({
                    'error': 'Missing required fields: title, artist_id, genre_id, file'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            valid_extensions = ['.mp3', '.wav', '.ogg', '.flac']
            ext = os.path.splitext(music_file.name)[1].lower()
            if ext not in valid_extensions:
                return Response({
                    'error': f'Invalid file type. Allowed types: {", ".join(valid_extensions)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file size (max 20MB)
            max_size = 20 * 1024 * 1024  # 20MB
            if music_file.size > max_size:
                return Response({
                    'error': 'File too large. Maximum size is 20MB.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if artist exists
            try:
                artist = Artist.objects.get(pk=artist_id)
            except Artist.DoesNotExist:
                return Response({
                    'error': 'Artist not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if album exists (if provided)
            album = None
            if album_id:
                try:
                    album = Album.objects.get(pk=album_id)
                except Album.DoesNotExist:
                    return Response({
                        'error': 'Album not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if genre exists
            try:
                genre = Genre.objects.get(pk=genre_id)
            except Genre.DoesNotExist:
                return Response({
                    'error': 'Genre not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Create directory for uploads if it doesn't exist
            upload_dir = os.path.join(settings.MEDIA_ROOT, 'music')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generate unique filename
            filename = f"{uuid.uuid4()}{ext}"
            file_path = os.path.join('music', filename)
            full_path = os.path.join(settings.MEDIA_ROOT, file_path)
            
            # Save file to disk
            with open(full_path, 'wb+') as destination:
                for chunk in music_file.chunks():
                    destination.write(chunk)
            
            # Get audio duration (would use a library like mutagen in production)
            # For now, we'll use a placeholder
            duration = 180  # 3 minutes in seconds
            
            # Create song record
            song = Song.objects.create(
                title=title,
                artist=artist,
                album=album,
                genre=genre,
                file_path=file_path,
                duration=duration,
                release_date=release_date or datetime.now().date()
            )
            
            # Return response
            serializer = SongDetailSerializer(song, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['get'])
    def stream(self, request, pk=None):
        song = self.get_object()
        try:
            file_path = os.path.join(settings.MEDIA_ROOT, song.file_path)
            response = FileResponse(open(file_path, 'rb'))
            
            # Log play history if user is authenticated
            if request.user.is_authenticated:
                PlayHistory.objects.create(user=request.user, song=song)
                
            return response
        except FileNotFoundError:
            raise Http404("Song file not found")
    
    @action(detail=True, methods=['get'])
    def play_url(self, request, pk=None):
        song = self.get_object()
        url = request.build_absolute_uri(f'/api/songs/{pk}/stream/')
        
        # Log play history if user is authenticated
        if request.user.is_authenticated:
            PlayHistory.objects.create(user=request.user, song=song)
        
        return Response({'url': url})
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            songs = Song.objects.filter(
                Q(title__icontains=query) |
                Q(artist__name__icontains=query) |
                Q(album__title__icontains=query)
            )
            serializer = self.get_serializer(songs, many=True)
            return Response(serializer.data)
        return Response([])

class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Return user's playlists and public playlists from other users
        return Playlist.objects.filter(Q(user=user) | Q(is_public=True))
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PlaylistDetailSerializer
        return PlaylistSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        playlist = self.get_object()
        if playlist.user != request.user:
            return Response({'error': 'Bạn không có quyền chỉnh sửa playlist này'}, 
                           status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        playlist = self.get_object()
        if playlist.user != request.user:
            return Response({'error': 'Bạn không có quyền xóa playlist này'}, 
                           status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def songs(self, request, pk=None):
        playlist = self.get_object()
        
        # Check if user owns the playlist
        if playlist.user != request.user:
            return Response({'error': 'Bạn không có quyền chỉnh sửa playlist này'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        song_id = request.data.get('song_id')
        if not song_id:
            return Response({'error': 'song_id là bắt buộc'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            song = Song.objects.get(pk=song_id)
        except Song.DoesNotExist:
            return Response({'error': 'Bài hát không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get the highest order value
        last_order = PlaylistSong.objects.filter(playlist=playlist).order_by('-order').first()
        order = (last_order.order + 1) if last_order else 0
        
        # Check if song already exists in playlist
        if PlaylistSong.objects.filter(playlist=playlist, song=song).exists():
            return Response({'error': 'Bài hát đã có trong playlist'}, status=status.HTTP_400_BAD_REQUEST)
        
        playlist_song = PlaylistSong.objects.create(playlist=playlist, song=song, order=order)
        serializer = PlaylistSongSerializer(playlist_song)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], url_path='songs/(?P<song_id>[^/.]+)')
    def remove_song(self, request, pk=None, song_id=None):
        playlist = self.get_object()
        
        # Check if user owns the playlist
        if playlist.user != request.user:
            return Response({'error': 'Bạn không có quyền chỉnh sửa playlist này'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        try:
            playlist_song = PlaylistSong.objects.get(playlist=playlist, song_id=song_id)
            playlist_song.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PlaylistSong.DoesNotExist:
            return Response({'error': 'Bài hát không có trong playlist'}, status=status.HTTP_404_NOT_FOUND)

class UserPlaylistsView(generics.ListAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user)

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        song_id = request.data.get('song_id')
        if not song_id:
            return Response({'error': 'song_id là bắt buộc'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            song = Song.objects.get(pk=song_id)
        except Song.DoesNotExist:
            return Response({'error': 'Bài hát không tồn tại'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if song is already favorited
        if Favorite.objects.filter(user=request.user, song=song).exists():
            return Response({'error': 'Bài hát đã được thêm vào yêu thích'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite = Favorite.objects.create(user=request.user, song=song)
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        favorite = self.get_object()
        if favorite.user != request.user:
            return Response({'error': 'Bạn không có quyền xóa mục yêu thích này'}, 
                           status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

class PlayHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlayHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return PlayHistory.objects.filter(user=self.request.user) 