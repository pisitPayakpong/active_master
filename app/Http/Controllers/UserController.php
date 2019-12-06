<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Response\FractalResponse;
use App\Models\User;
use App\Transformer\UserTransformer;
use App\Library\JwtLibrary;
use DB;
use Validator;

class UserController extends Controller
{
    const LIMIT_PER_PAGE = 10;
    const PAGE = 1;

    public function __construct(FractalResponse $fractal)
    {
        $this->fractal = $fractal;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        \Log::info('$request->user : '.print_r($request->user(), true));
        $params = $request->all();

        $limit = $params['limit'] ?? self::LIMIT_PER_PAGE;
        $page = $params['page'] ?? self::PAGE;
        $column = '*';

        $users = User::select('*');

        if (isset($params['role'])) {
            $roles = isset($params['role']) ? explode(",", $params['role']) : [];
            $users->whereIn('role', $roles);
        }

        if (isset($params['sortField']) && isset($params['sortOrder'])) {
            $users->orderBy($params['sortField'], $params['sortOrder']);
        }

        $users = $users->paginate($limit, $column, null, $page);

        return $this->fractal->collection($users, new UserTransformer());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return ['data' => $user];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)
            ->first();

        if (!empty($user) && Hash::check($request->password, $user->password)) {
            $token = JwtLibrary::jwt($user);
            $user["api_token"] = $token;
            return $this->responseRequestSuccess($user);
        } else {
            return $this->responseRequestError("Username or password is incorrect");
        }
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
