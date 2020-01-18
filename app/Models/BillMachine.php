<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillMachine extends Model
{
    protected $table = 'bill_machine';

    protected $fillable = [
        'shop_id', 'machine_id'
    ];
}
