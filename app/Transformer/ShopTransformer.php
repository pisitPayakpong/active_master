<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;

class ShopTransformer extends TransformerAbstract
{
    protected $userName;

    public function setUserName($userName)
    {
        $this->userName = $userName;
    }

    public function transform($shop)
    {
        return [
          'id'    => $shop->id,
          'name'  => $shop->name,
          'lat'  => $shop->lat,
          'lng'  => $shop->lng,
          'user_name' => $this->userName
        ];
    }
}
