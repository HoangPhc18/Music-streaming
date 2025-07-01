from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, UserProfileView, LogoutView, ChangePasswordView,
    GenreViewSet, ArtistViewSet, AlbumViewSet, SongViewSet, PlaylistViewSet,
    UserPlaylistsView, FavoriteViewSet, PlayHistoryViewSet
)

router = DefaultRouter()
router.register(r'genres', GenreViewSet)
router.register(r'artists', ArtistViewSet)
router.register(r'albums', AlbumViewSet)
router.register(r'songs', SongViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'history', PlayHistoryViewSet, basename='history')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # User profile
    path('users/profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/playlists/', UserPlaylistsView.as_view(), name='user_playlists'),
    
    # Include all router URLs
    path('', include(router.urls)),
] 