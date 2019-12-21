<?php

namespace App\Observers;

use App\Models\Shop;
use App\Models\UserShop;

class ShopObserver
{
    /**
     * Handle the shop "created" event.
     *
     * @param  App\Models\Shop  $shop
     * @return void
     */
    public function created(Shop $shop)
    {
        UserShop::create([
            'user_id' => auth()->user(),
            'shop_id' => $shop->id
        ]);
    }

    /**
     * Handle the shop "updated" event.
     *
     * @param  App\Models\Shop  $shop
     * @return void
     */
    public function updated(Shop $shop)
    {
        //
    }

    /**
     * Handle the shop "deleted" event.
     *
     * @param  App\Models\Shop  $shop
     * @return void
     */
    public function deleted(Shop $shop)
    {
        $userShop = UserShop::where('shop_id', $shop->id)->delete();
    }

    /**
     * Handle the shop "restored" event.
     *
     * @param  App\Models\Shop  $shop
     * @return void
     */
    public function restored(Shop $shop)
    {
        //
    }

    /**
     * Handle the shop "force deleted" event.
     *
     * @param  App\Models\Shop  $shop
     * @return void
     */
    public function forceDeleted(Shop $shop)
    {
        //
    }
}
