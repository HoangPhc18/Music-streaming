from django.shortcuts import render, get_object_or_404
from rest_framework import generics, viewsets, filters
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
from rest_framework.decorators import action
from django.db.models import Q
import os
from django.http import FileResponse, Http404
from django.conf import settings

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