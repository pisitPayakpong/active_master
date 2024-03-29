<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    protected $table = 'bills';

    protected $fillable = [
      'machine_id',
      'user_id',
      'datetime',
      'path',
  ];
}
