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

// user-profiele-employee
Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'user-profile', 'namespace' => 'App\Http\Controllers\User\Profile\Employee'], function($router){
    Route::get('/employees', 'IndexController')->middleware('transform.boolean');
    Route::post('/employees', 'StoreController')->middleware('transform.boolean');
    Route::get('/employees/{profileId}', 'ShowController');
    Route::patch('/employees/{profileId}', 'UpdateController')->middleware('transform.boolean');
});

// user-profiele-admin
Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'user-profile', 'namespace' => 'App\Http\Controllers\User\Profile\Admin'], function($router){
    Route::get('/admins', 'IndexController')->middleware('transform.boolean');
    // Route::post('/admin', 'StoreController')->middleware('transform.boolean');
    Route::get('/admins/{profileId}', 'ShowController');
    // Route::patch('/admin/{profileId}', 'UpdateController')->middleware('transform.boolean');
});

// user-profiele-statuses
// Route::group([ 'middleware' => 'auth:api', 'namespace' => 'App\Http\Controllers\User\Profile\Status'], function($router){
//     Route::get('/user/statuses', 'IndexController');
// });

// user-profiele-employee-statuses
Route::group(['middleware' => ['jwt.auth'], 'namespace' => 'App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Status'], function($router){
    Route::get('/user-profile/employee/statuses', 'IndexController');
});

// user-profiele-employee-careers
Route::group(['middleware' => ['jwt.auth'], 'namespace' => 'App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Career'], function($router){
    Route::get('/user-profile/employee/careers', 'IndexController');
});

// user-profiele-employee-categories
Route::group(['middleware' => ['jwt.auth'], 'namespace' => 'App\Http\Controllers\User\Profile\Employee\EmployeeDetails\Categorie'], function($router){
    Route::get('/user-profile/employee/categories', 'IndexController');
});

// Route::group(['namespace' => 'App\Http\Controllers\User\User'], function($router){
//     Route::post('/user', 'StoreController');
// });


Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'auth', 'namespace' => 'App\Http\Controllers\Auth'], function ($router) {
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');
});

Route::group(['prefix' => 'auth', 'namespace' => 'App\Http\Controllers\Auth'], function ($router) {
    Route::post('login', 'AuthController@login');
    Route::post('refresh', 'AuthController@refresh');
});

Route::post('/email/verify/{hash}', 'App\Http\Controllers\User\VerificationController');