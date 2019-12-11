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
        return redirect('/login');
    });
    Route::get('/main', function () {
        return view('main');
    });
    
    // dashboard
    Route::get('/dashboard', function () {
        return view('main');
    });
    
    // list user
    Route::get('/user', function () {
        return view('main');
    });
    
    // list water
    Route::get('/water', function () {
        return view('main');
    });
    
    // logout
    Route::get('/logout', 'Auth\LoginController@logout');
});
//Route for admin
Route::group(['prefix' => 'admin'], function () {
    Route::group(['middleware' => ['admin']], function () {
        Route::get('/dashboard', 'admin\AdminController@index');
    });
});
