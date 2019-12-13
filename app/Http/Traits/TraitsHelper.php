<?php
namespace App\Http\Traits;

use Carbon\Carbon;

trait TraitsHelper
{
    public function transformDateToDateTime($dateTime)
    {
        $dateTime = new Carbon($dateTime);
        return $dateTime->format('Y-m-d H:i:s');
    }
}
