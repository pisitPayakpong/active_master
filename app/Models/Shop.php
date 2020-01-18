<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    protected $table = 'shops';

    protected $fillable = [
      'name', 'lat', 'lng'
  ];

    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'user_shop');
    }
}
