<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

use Validator;

class FileController extends Controller
{
    public function create(Request $request)
    {
        $errors = Validator::make($request->all(), [
            'folder' => 'required',
            'file' => 'required|file|max:2000'
        ], [
            'file.required' => 'File is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        if (!$request->hasFile('file') || !$request->file('file')->isValid()) {
            return $this->responseRequestError($errors->first(), 404);
        }

        $folder = $request->folder ?? 'bills';
        $file = $request->file('file');
        $ext = $file->extension();
        $name = str_random(20).'.'.$ext ;
        $path = Storage::disk('public')->putFileAs(
            $folder,
            $file,
            $name
        );

        return response()->json(['data' => ['url' => $path]]);
    }

    protected function responseRequestSuccess($ret)
    {
        return response()->json(['status' => 'success', 'data' => $ret], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
