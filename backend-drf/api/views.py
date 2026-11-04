import datetime as dt
from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import StockPredictionSerializer
from rest_framework import status
from rest_framework.response import Response
import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score


class StockPredictionView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            # fetch the data from yfinance
            now = dt.datetime.now()
            start = dt.datetime(now.year-10, now.month, now.day)
            end = now
            df = yf.download(ticker, start=start, end=end)
            if df.empty:
                return Response({'error': "No data found for the given ticker." }, status=status.HTTP_404_NOT_FOUND)
            df.reset_index()
            
            #generate basic plot
            plt.switch_backend('AGG')  # Use a non-interactive backend for matplotlib
            plt.figure(figsize=(10, 5))
            plt.plot(df.Close, label='Close Price')
            plt.xlabel('Date')
            plt.ylabel('Close Price')
            plt.title(f'{ticker} Stock Closing Price')
            plt.legend()
            # Save the plot to a file
            plot_img_path = f'{ticker}_plot.png'
            plotted_img = save_plot(plot_img_path)
            
            # 100 Days moving average
            df['MA_100'] = df.Close.rolling(100).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(10,5))
            plt.plot(df.Close, label='Close Price');
            plt.plot(df['MA_100'], 'r', label='100-Day MA');
            plt.title(f'{ticker} Stock Price with 100-Day Moving Average');
            plt.xlabel('Date');
            plt.ylabel('Price');
            plt.legend();
            plot_img_path = f'{ticker}_plot_100_dma.png'
            plotted_100_dma = save_plot(plot_img_path)
            
            # 200 days moving average
            df['MA_200'] = df.Close.rolling(200).mean()
            plt.switch_backend('AGG')
            plt.figure(figsize=(10,5));
            plt.plot(df.Close, label='Close Price');
            plt.plot(df['MA_200'], 'r', label='200-Day MA');
            plt.title(f'{ticker} Stock Price with 200-Day Moving Average');
            plt.xlabel('Days');
            plt.ylabel('Prices');
            plt.legend();
            plot_img_path = f'{ticker}_plot_200_dma.png'
            plotted_200_dma = save_plot(plot_img_path)
            
            #Splitting data into training and testing data
            data_training = pd.DataFrame(df.Close[0:int(len(df)*0.7)]) # 70% of training
            data_testing = pd.DataFrame(df.Close[int(len(df)*0.7):int(len(df))]) # 30% of testing

            #Scaling down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))
            
            #Load ML Model
            model = load_model('lstm_trained_model.keras')
            
            #Preparing test data
            past_100_days= data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.fit_transform(final_df)
            x_test =[]
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i,0])
            x_test, y_test = np.array(x_test), np.array(y_test)
            
            #Making predictions
            y_predicted = model.predict(x_test)
            
            #Rescaling back to original form
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            y_tests = scaler.inverse_transform(y_test.reshape(-1,1)).flatten()
            
            print('Predicted:', y_predicted)
            print('Actual:', y_tests)
            
            #plotting the final prediction graph
            plt.switch_backend('AGG')
            plt.figure(figsize=(10,5))
            plt.plot(y_tests, 'b', label = 'Original Price');
            plt.plot(y_predicted, 'r', label = 'Predicted Price');
            plt.title(f'Final Prediction Graph for {ticker} Stock Price');
            plt.xlabel('Days');
            plt.ylabel('Prices');
            plt.legend()
            plot_img_path = f'{ticker}_final_prediction.png'
            plotted_final_prediction = save_plot(plot_img_path)
            
            #Model Evaluation
            # 1. Mean Squared Error (MSE)
            mse = mean_squared_error(y_tests, y_predicted)
            
            # 2. Mean Absolute Error (MAE)
            mae = mean_absolute_error(y_tests, y_predicted)
            
            # 3. Root Mean Squared Error (RMSE)
            rmse = np.sqrt(mse)
            
            # 4. R-squared (R2)
            r2 = r2_score(y_tests, y_predicted)

            return Response({'status': 'success', 
                             'plotted_img': plotted_img, 
                             'plotted_100_dma': plotted_100_dma,
                             'plotted_200_dma': plotted_200_dma,
                             'plotted_final_prediction': plotted_final_prediction,
                             'mse': mse,
                             'mae': mae,
                             'rmse': rmse,
                             'r2': r2
                             })
            
            
            
            