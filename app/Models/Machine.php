<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    protected $table = 'machine';

    protected $fillable = [
        'sn', 'type', 'status', 'user_id',
        'lat', 'lng', 'machineID', 'user',
        'ip', 'cmd', 'stamp', 'sync',
        'hos_status', 'prog_version', 'debug', 'address',
        'duration', 'expire_date'
    ];

    public function bills()
    {
        return $this->belongsToMany('App\Models\Bill');
    }
}
