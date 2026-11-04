from django.urls import path
from accounts import views as UserViews
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import StockPredictionView


urlpatterns = [
    path('register/',UserViews.RegisterView.as_view(), name='register'),

    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('protectedview/', UserViews.ProtectedView.as_view(), name='protected_view'),
    
    # API endpoints for stock prediction
    path('predict/', StockPredictionView.as_view(), name='stock_prediction'),
]