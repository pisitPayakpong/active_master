<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Response\FractalResponse;

use App\Library\QueryHelper;
use App\Models\User;
use App\Models\Shop;
use App\Models\UserShop;
use App\Transformer\ShopTransformer;
use App\Transformer\OptionTransformer;
use App\Http\Traits\TraitsHelper;
use Validator;

class ShopController extends Controller
{
    use TraitsHelper;

    const LIMIT_PER_PAGE = 10;
    const PAGE = 1;

    const MAPPED_COLUMN_WITH_PARAM = [
        'id' => 'shops.id',
        'user_name' => 'user_name',
        'name' => 'shops.name',
    ];

    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function __construct(FractalResponse $fractal)
    {
        $this->fractal = $fractal;
        // $this->middleware('auth');
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
        $userId = auth()->user();
        $user = User::findOrFail($userId);
                    
        if ($user->role == User::ROLE_ADMIN) {
            $shop = Shop::select('*');
        } else {
            $shop = Shop::select('*', 'users.name as user_name', 'shops.name', 'shops.id')
            ->join('user_shop', 'user_shop.shop_id', '=', 'shops.id')
            ->join('users', 'users.id', '=', 'user_shop.user_id')
            ->where('users.id', $userId);
        }


        $transformer = new ShopTransformer();
        $transformer->setUserName($user->name);

        if (isset($params['sort'])) {
            $query = QueryHelper::getSort($params['sort'], self::MAPPED_COLUMN_WITH_PARAM);

            if (!empty($query)) {
                $shop->orderByRaw($query);
            } else {
                $shop->orderBy('shops.id', 'desc');
            }
        } else {
            $shop->orderBy('shops.id', 'desc');
        }

        $shop = $shop->paginate($limit, $column, null, $page);
        return $this->fractal->collection($shop, $transformer);
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
        $userId = auth()->user();

        $params = $request->all();
        $errors = Validator::make($params, [
            'name' => 'required',
            'lat' => 'required',
            'lng' => 'required',
        ], [
            'name.required' => 'Name is required.',
            'lat.required' => 'lat is required.',
            'lng.required' => 'lng is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $shop = Shop::create($params);

        $transformer = new ShopTransformer();
        $user = User::findOrFail($userId);
        $transformer->setUserName($user->name);

        if (isset($params['users']) && $user->role == User::ROLE_ADMIN) {
            $userIds = explode(',', $params['users']);
            
            $shopUserIds = UserShop::where('shop_id', $shop->id)->delete();
            $data = collect($userIds)->map(function ($userId) use ($shop) {
                return [
                    "shop_id" => $shop->id,
                    "user_id" => $userId,
                ];
            })->toArray();

            UserShop::insert($data);
        }

        return $this->fractal->item($shop, $transformer);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $shop = Shop::with('users')->where('id', $id)->first();
        $shop->userIds = $shop->users->pluck('id')->toArray();

        return ['data' => $shop];
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
        $userId = auth()->user();
        $params = $request->all();
        $errors = Validator::make($params, [
            'name' => 'required',
            'lat' => 'required',
            'lng' => 'required',
        ], [
            'name.required' => 'Name is required.',
            'lat.required' => 'lat is required.',
            'lng.required' => 'lng is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $shop = Shop::findOrFail($id);

        $shop->name = $params['name'];
        $shop->lat = $params['lat'];
        $shop->lng = $params['lng'];
        $shop->save();

        $user = User::findOrFail($userId);

        if (isset($params['users']) && $user->role == User::ROLE_ADMIN) {
            $userIds = explode(',', $params['users']);
            
            $shopUserIds = UserShop::where('shop_id', $id)->delete();
            $data = collect($userIds)->map(function ($userId) use ($id) {
                return [
                    "shop_id" => $id,
                    "user_id" => $userId,
                ];
            })->toArray();

            UserShop::insert($data);
        }

        return $this->fractal->item($shop, new ShopTransformer());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $shop = Shop::destroy($id);

        return $this->responseRequestSuccess('Delete Sucesss');
    }


    public function getOptions(Request $request)
    {
        $userId = auth()->user();
        $shops = Shop::select('shops.name as text', 'shops.id as value')
                        ->join('user_shop', 'user_shop.shop_id', '=', 'shops.id')
                        ->where('user_shop.user_id', $userId)
                        ->get();

        return $this->fractal->collection($shops, new OptionTransformer());
    }
}
