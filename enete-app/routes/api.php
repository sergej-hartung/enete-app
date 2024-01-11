<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/test', function(Request $request){
    dd($request);
    dd($request->all());
});


//Route::post('/user-profiles', 'App\Http\Controllers\User\Profile\StoreController');
Route::group(['namespace' => 'App\Http\Controllers\User\Profile'], function($router){
    Route::get('/user-profiles', 'IndexController');
    Route::post('/user-profiles', 'StoreController');
    Route::get('/user-profiles/{profileId}', 'ShowController');
});

Route::group(['namespace' => 'App\Http\Controllers\User\User'], function($router){
    Route::post('/user', 'StoreController');
});


Route::group(['middleware' => 'api', 'prefix' => 'auth', 'namespace' => 'App\Http\Controllers\Auth'], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
});

Route::post('/email/verify/{hash}', 'App\Http\Controllers\User\VerificationController');