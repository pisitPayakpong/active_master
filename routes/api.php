<?php

use Illuminate\Http\Request;

// use Intervention\Image\ImageManagerStatic as Image;

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
            Route::get('/as_options', 'UserController@getOptions');
            Route::get('/{id}', 'UserController@show');
            Route::put('/{id}', 'UserController@update');
            Route::delete('/{id}', 'UserController@destroy');

            Route::put('/password/{id}', 'UserController@updatePassword');
        });
    
        // glass
        Route::prefix('glass')->group(function () {
            Route::get('/', 'GlassController@index');
            Route::get('/total_usage', 'GlassController@calculateTotalUsage');
            Route::get('/h2', 'GlassController@getH2');
        });
    
        // machine
        Route::prefix('machine')->group(function () {
            Route::get('/', 'MachineController@index');
            Route::post('/', 'MachineController@store');
            Route::post('/bill', 'MachineController@uploadFile');
            Route::get('/as_options', 'MachineController@getOptions');
            Route::get('/{id}', 'MachineController@show');
            Route::put('/{id}', 'MachineController@update');
            Route::delete('/{id}', 'MachineController@destroy');
            Route::put('/{id}/expire', 'MachineController@extendExpire');
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

        // Report
        Route::prefix('report')->group(function () {
            Route::get('/', 'ReportController@index');
            Route::get('/downloadPdf', 'ReportController@downloadPdfV2')->name('report.downloadPdf');
        });

        // Province
        Route::prefix('province')->group(function () {
            Route::get('/as_options', 'ProvinceController@getOptions');
        });

        // Image
        Route::prefix('image')->group(function () {
            Route::post('/', 'ImageController@create');
        });

        // File
        Route::prefix('file')->group(function () {
            Route::post('/', 'FileController@create');
        });
    });
});

Route::prefix('internal')->group(function () {
    Route::prefix('migrate_member')->group(function () {
        Route::get('/', 'MigrateMemberController@index');
    });
});
