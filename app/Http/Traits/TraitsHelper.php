<?php
namespace App\Http\Traits;

use Carbon\Carbon;

trait TraitsHelper
{
    public function transformDateToDateTime($dateTime = null)
    {
        $dateTime = is_null($dateTime) ? new Carbon() : new Carbon($dateTime);
        return $dateTime->format('Y-m-d H:i:s');
    }

    public function responseRequestSuccess($ret)
    {
        return response()->json(['status' => 'success', 'data' => $ret], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    public function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
