<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;
use App\Http\Traits\TraitsHelper;
use App\Models\Glass;

class GlassTransformer extends TransformerAbstract
{
    use TraitsHelper;

    public function transform(Glass $glass)
    {
        $image = trim($glass->glass_user).".jpg";
      
        return [
          'id'    => $glass->id,
          'sn'  => $glass->sn,
          'image' => $image,
          'user'  => $glass->glass_user,
          'date' => $this->transformDateToDateTime($glass->create_time),
          'o3_usage' => $glass->o3_usage,
          'h2_usage' => $glass->h2_usage,
          'price' => $glass->value
        ];
    }
}
