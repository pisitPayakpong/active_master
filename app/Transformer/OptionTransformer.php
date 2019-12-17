<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;
use App\Http\Traits\TraitsHelper;

class OptionTransformer extends TransformerAbstract
{
    use TraitsHelper;
  
    public function transform($data)
    {
        return [
          'text' => $data->text,
          'value'  => $data->value,
        ];
    }
}
