<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

use App\Http\Controllers\Controller;
use App\Http\Response\FractalResponse;

use App\Models\User;
use App\Transformer\UserTransformer;
use App\Transformer\OptionTransformer;

use App\Library\JwtLibrary;
use App\Library\Image;

use Validator;
use DB;

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
        $params = $request->all();
        $errors = Validator::make($params, [
            'email' => ['email','required' , Rule::unique('users')->where(function ($query) use ($params) {
                return $query->where('email', $params['email']);
            })
        ],
            'password' => 'required',
            'name' => 'required',
            'address' => 'required',
            'province' => 'required',
            'tel' => 'required',
        ], [
            'email.required' => 'Email is required.',
            'email.email' => 'Invalid email address.',
            'email.unique' => 'This email is already in use.',
            'password.required' => 'Password is required.',
            'name.required' => 'Name is required.',
            'role_type.required' => 'Role Type is required.',
            'address.required' => 'Address is required.',
            'province.required' => 'Province is required.',
            'tel.required' => 'Tel is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $params['password'] = Hash::make($params['password']);
        $user = User::create($params);

        return $this->fractal->item($user, new UserTransformer());
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
        $params = $request->all();
        $errors = Validator::make($params, [
            'email' => 'required',
            'name' => 'required',
            'role' => 'required',
            'address' => 'required',
            'province' => 'required',
            'tel' => 'required',
        ], [
            'email.required' => 'Email is required.',
            'email.email' => 'Invalid email address.',
            'name.required' => 'Name is required.',
            'role.required' => 'Role is required.',
            'address.required' => 'Address is required.',
            'province.required' => 'Province is required.',
            'tel.required' => 'Tel is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $user = User::findOrFail($id);

        $user->name = $params['name'];
        $user->email = $params['email'];
        $user->role = $params['role'];
        $user->address = $params['address'];
        $user->province = $params['province'];
        $user->tel = $params['tel'];
        $user->image = $params['image'] ?? null;
        $user->save();

        return $this->fractal->item($user, new UserTransformer());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::destroy($id);

        return $this->responseRequestSuccess('Delete Sucesss');
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

    public function updatePassword(Request $request, $id)
    {
        $params = $request->all();
        $errors = Validator::make($params, [
            'password' => 'required',
        ], [
            'password.required' => 'Password is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $user = User::findOrFail($id);
        $user->password = Hash::make($params['password']);
        $user->save();
        
        return $this->responseRequestSuccess($user);
    }

    public function getOptions(Request $request)
    {
        $users = User::select('id as value', 'name as text')->get();

        return $this->fractal->collection($users, new OptionTransformer());
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
