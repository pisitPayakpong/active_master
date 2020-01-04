<?php

namespace App\Library;

use Illuminate\Support\Facades\Storage;

use Carbon\Carbon;

class Image
{
    public static function uploadImage($file, $folder, $filename = null)
    {
        $dateTime = Carbon::now()->format('YmdHis');
        $name = $filename ?? $file->getClientOriginalName();
        $ext = $file->getClientOriginalExtension();
        $filename = "{$name}_{$dateTime}.{$ext}";
        $path = Storage::disk('public')->putFile("images/$folder/$filename", $file);

        return  $path;
    }
}
