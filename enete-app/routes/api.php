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

Route::patch('/test', function(Request $request){
    //dd($request);
    dd($request->all());
});

// user-profiele
Route::group(['namespace' => 'App\Http\Controllers\User\Profile'], function($router){
    Route::get('/user-profiles', 'IndexController');
    Route::post('/user-profiles', 'StoreController')->middleware('transform.boolean');
    Route::get('/user-profiles/{profileId}', 'ShowController');
    Route::patch('/user-profiles/{profileId}', 'UpdateController')->middleware('transform.boolean');
});

// user-profiele-statuses
Route::group(['namespace' => 'App\Http\Controllers\User\Profile\Status'], function($router){
    Route::get('/user-profile/statuses', 'IndexController');
});

// user-profiele-careers
Route::group(['namespace' => 'App\Http\Controllers\User\Profile\Career'], function($router){
    Route::get('/user-profile/careers', 'IndexController');
});

// user-profiele-categories
Route::group(['namespace' => 'App\Http\Controllers\User\Profile\Categorie'], function($router){
    Route::get('/user-profile/categories', 'IndexController');
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