<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Shop;
use App\Observers\ShopObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Shop::observe(ShopObserver::class);
    }
}
