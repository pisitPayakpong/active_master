<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopMachine extends Model
{
    protected $table = 'shop_machine';

    protected $fillable = [
      'shop_id', 'machine_id'
  ];
}
