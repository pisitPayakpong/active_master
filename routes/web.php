<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();


//Route for normal user
Route::group(['middleware' => ['auth']], function () {

    // home
    Route::get('/home', 'HomeController@index')->name('home');
    Route::get('/', function () {
        return redirect('/home');
    });
    
    Route::get('/main', 'LayoutController@index');

    // dashboard
    Route::get('/dashboard', 'LayoutController@index');
    
    // list user
    Route::get('/user', 'LayoutController@index');
    
    // list water
    Route::get('/water', 'LayoutController@index');
    
    // logout
    Route::get('/logout', 'Auth\LoginController@logout');

    // shop
    Route::get('/shop', 'LayoutController@index');

    // machine
    Route::get('/machine', 'LayoutController@index');

    // glass
    Route::get('/glass', 'LayoutController@index');

    // report
    Route::get('/report', 'LayoutController@index');

    // profile
    Route::get('/profile/{id}', 'LayoutController@index');
});

//Route for admin
Route::group(['prefix' => 'admin'], function () {
    Route::group(['middleware' => ['admin']], function () {
        Route::get('/dashboard', 'admin\AdminController@index');
    });
});
