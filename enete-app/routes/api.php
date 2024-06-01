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

Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'user-dockuments', 'namespace' => 'App\Http\Controllers\User\Profile\Dockument'], function($router){
    /**
     * Get Dokuments
     * kien Type (Get Dokuments) type = 'delete' (Get Deleted Dokuments)
     */
    Route::get('/', 'IndexController');
    
    /**
     * Download Documents
     */
    Route::get('/download/{id}', 'DownloadController');

    /**
     * Download Documents
     */
    Route::get('/restore/{id}', 'RestoreController')->where('id', '[0-9]+');

    /**
     * Softdelete Dokument
     */
    Route::delete('/{id}', 'DeleteController');
});

// user-profiele-employee
Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'user-profile', 'namespace' => 'App\Http\Controllers\User\Profile\Employee'], function($router){
    
    /**
     * Get Employees
     * kien Type (Get Employees) type = 'parent' (Get Parent Employees)
     */
    Route::get('/employees/{type?}', 'IndexController')
        ->where('type', '[A-Za-z]+')
        ->middleware('transform.boolean');

    /**
     * Get Detailed Employee
     */
    Route::get('/employees/{profileId}', 'ShowController')
        ->where('profileId', '[0-9]+');

    /**
     * Create Employee
     */
    Route::post('/employees', 'StoreController')->middleware('transform.boolean');

    /**
     * Update Employee
     */
    Route::patch('/employees/{profileId}', 'UpdateController')
        ->where('profileId', '[0-9]+')
        ->middleware('transform.boolean');
});

// user-profiele-admin
Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'user-profile', 'namespace' => 'App\Http\Controllers\User\Profile\Admin'], function($router){
    Route::get('/admins', 'IndexController')->middleware('transform.boolean');
    Route::post('/admins', 'StoreController')->middleware('transform.boolean');
    Route::get('/admins/{profileId}', 'ShowController');
    Route::patch('/admins/{profileId}', 'UpdateController')->middleware('transform.boolean');
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


Route::group(['middleware' => ['jwt.auth'], 'prefix' => 'products'], function ($router) {
    
    // $router->get('/tariffs', 'App\Http\Controllers\Tariff\TariffIndexController')->name('tariffs.index'); 'middleware' => ['jwt.auth'], 
    // $router->get('/tariffs/{tariffId}', 'App\Http\Controllers\Tariff\TariffShowController')->name('tariffs.show');
   
    $router->group(['prefix' => 'tariff-groups'], function ($router) {
        $router->get('/', 'App\Http\Controllers\Tariff\Group\TariffGroupIndexController')->name('tariff-groups.index');
        $router->get('/{groupId}/tariffs', 'App\Http\Controllers\Tariff\Group\TariffByGroupController')->name('tariff-groups.tariffs');
        $router->get('/{groupId}/providers', 'App\Http\Controllers\Tariff\Group\ProviderByGroupController')->name('tariff-groups.providers');
        $router->get('/{groupId}/attributes', 'App\Http\Controllers\Tariff\Group\AttributeByGroupController')->name('tariff-groups.attributes');
    });

    $router->group(['prefix' => 'tariff-statuses'], function ($router) {
        $router->get('/', 'App\Http\Controllers\Tariff\TariffStatus\IndexController')->name('tariff-statuses.index');
    });

    $router->group(['prefix' => 'tariff-providers'], function ($router) {
        $router->get('/', 'App\Http\Controllers\Tariff\TariffProvider\IndexController')->name('tariff-providers.index');
    });

    $router->group(['prefix' => 'tariff-network-operators'], function ($router) {
        $router->get('/', 'App\Http\Controllers\Tariff\TariffNetworkOperator\IndexController')->name('tariff-network-operators.index');
    });

    // $router->get('/hardware', 'App\Http\Controllers\Hardware\HardwareIndexController')->name('hardware.index');
    // $router->get('/hardware/{hardwareId}', 'App\Http\Controllers\Hardware\HardwareShowController')->name('hardware.show');

    // $router->group(['prefix' => 'hardware-groups'], function ($router) {
    //     $router->get('/', 'App\Http\Controllers\Hardware\Group\HardwareGroupIndexController')->name('hardware-groups.index');
    //     $router->get('/{groupId}/hardware', 'App\Http\Controllers\Hardware\Group\HardwareByGroupController')->name('hardware-groups.hardware');
    // });
});

Route::post('/email/verify/{hash}', 'App\Http\Controllers\User\VerificationController');