<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:api')->group(function () {
    Route::prefix('test_v1')->group(function () {
        Route::prefix('user')->group(function () {
            Route::get('/', 'UserController@index');
            Route::post('/', 'UserController@store');
            Route::post('/login', 'UserController@login');
            Route::get('/{id}', 'UserController@show');
            Route::put('/{id}', 'UserController@update');
            Route::delete('/{id}', 'UserController@destroy');
        });
    
        // glass
        Route::prefix('glass')->group(function () {
            Route::get('/', 'GlassController@index');
            Route::get('/total_usage', 'GlassController@calculateTotalUsage');
        });
    
        // machine
        Route::prefix('machine')->group(function () {
            Route::get('/', 'MachineController@index');
            Route::post('/', 'MachineController@store');
            Route::get('/as_options', 'MachineController@getOptions');
            Route::get('/{id}', 'MachineController@show');
            Route::put('/{id}', 'MachineController@update');
            Route::delete('/{id}', 'MachineController@destroy');
        });
    
        // Shop
        Route::prefix('shop')->group(function () {
            Route::get('/', 'ShopController@index');
            Route::post('/', 'ShopController@store');
            Route::get('/as_options', 'ShopController@getOptions');
            Route::get('/{id}', 'ShopController@show');
            Route::put('/{id}', 'ShopController@update');
            Route::delete('/{id}', 'ShopController@destroy');
        });
    });
});

Route::prefix('internal')->group(function () {
    Route::prefix('migrate_member')->group(function () {
        Route::get('/', 'MigrateMemberController@index');
    });
});
