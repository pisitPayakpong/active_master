<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;
use App\Http\Traits\TraitsHelper;
use App\Models\Machine;

class MachineTransformer extends TransformerAbstract
{
    use TraitsHelper;
  
    public function transform(Machine $machine)
    {
        $tag = trim($machine->sn).".jpg";
      
        return [
          'tag' => $tag,
          'sn'  => $machine->sn,
          'status' => $machine->status,
          'machineId'  => $machine->machineID,
          'dateTime' => $this->transformDateToDateTime($machine->stamp),
        ];
    }
}
