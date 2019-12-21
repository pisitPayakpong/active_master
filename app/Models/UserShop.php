<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserShop extends Model
{
    protected $table = 'user_shop';

    protected $fillable = [
      'user_id', 'shop_id'
  ];
}
