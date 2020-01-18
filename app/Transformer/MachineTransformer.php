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
          'id' => $machine->id,
          'tag' => $tag,
          'sn'  => $machine->sn,
          'type' => $machine->type,
          'status' => $machine->status,
          'machineId'  => $machine->machineID,
          'dateTime' => $this->transformDateToDateTime($machine->stamp),
          'lat' => $machine->lat,
          'lng' => $machine->lng,
          'expire_date' => $machine->expire_date,
          'bills' => $machine->bills ?? []
        ];
    }
}
