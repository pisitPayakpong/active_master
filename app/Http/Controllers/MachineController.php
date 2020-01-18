<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Response\FractalResponse;

use App\Library\QueryHelper;
use App\Models\Machine;
use App\Models\User;
use App\Models\ShopMachine;
use App\Models\Bill;
use App\Models\BillMachine;
use App\Transformer\MachineTransformer;
use App\Transformer\OptionTransformer;
use App\Http\Traits\TraitsHelper;

use Carbon\Carbon;
use Validator;
use DB;

class MachineController extends Controller
{
    use TraitsHelper;

    const LIMIT_PER_PAGE = 10;
    const PAGE = 1;

    const MAPPED_COLUMN_WITH_PARAM = [
        'sn'  => 'sn',
        'status' => 'status',
        'machineId'  => 'machineID',
        'machineID'  => 'machineId',
        'dateTime' => 'stamp',
    ];

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

        $machine = Machine::with('bills')->select('*', 'machine.id as id')
                            ->join('shop_machine', 'shop_machine.machine_id', '=', 'machine.id')
                            ->where('shop_machine.shop_id', $params['shopId']);

        if (isset($params['type'])) {
            $types = isset($params['type']) ? explode(",", $params['type']) : [];
            $machine->whereIn('type', $types);
        }

        if (isset($params['sort'])) {
            $query = QueryHelper::getSort($params['sort'], self::MAPPED_COLUMN_WITH_PARAM);

            if (!empty($query)) {
                $machine->orderByRaw($query);
            } else {
                $machine->orderBy('machine.id', 'desc');
            }
        } else {
            $machine->orderBy('machine.id', 'desc');
        }

        $machine = $machine->paginate($limit, $column, null, $page);

        return $this->fractal->collection($machine, new MachineTransformer());
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
            'shopId' => 'required',
            'sn' => 'required',
            'type' => 'required',
            'machineID' => 'required',
            'status' => 'required',
            'lat' => 'required',
            'lng' => 'required',
        ], [
            'shopId.required' => 'Shop Id is required.',
            'sn.required' => 'Name is required.',
            'type.required' => 'Name is required.',
            'machineID.required' => 'Name is required.',
            'status.required' => 'Name is required.',
            'lat.required' => 'lat is required.',
            'lng.required' => 'lng is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $params['user_id'] = $userId;
        $params['user'] = User::find($userId)->name;

        $machine = Machine::create($params);

        ShopMachine::create([
            'shop_id' => $params['shopId'],
            'machine_id' => $machine->id
        ]);

        return $this->fractal->item($machine, new MachineTransformer());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $machine = Machine::findOrFail($id);

        return ['data' => $machine];
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
            'shopId' => 'required',
            'sn' => 'required',
            'type' => 'required',
            'machineID' => 'required',
            'status' => 'required',
            'lat' => 'required',
            'lng' => 'required',
        ], [
            'shopId.required' => 'Shop Id is required.',
            'sn.required' => 'sn is required.',
            'type.required' => 'type is required.',
            'machineID.required' => 'machineID is required.',
            'status.required' => 'status is required.',
            'lat.required' => 'lat is required.',
            'lng.required' => 'lng is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $machine = Machine::findOrFail($id);

        $machine->sn = $params['sn'];
        $machine->type = $params['type'];
        $machine->machineID = $params['machineID'];
        $machine->status = $params['status'];
        $machine->lat = $params['lat'];
        $machine->lng = $params['lng'];
        $machine->save();

        $shopMachine = ShopMachine::where('machine_id', $id)->first();

        $shopMachine->shop_id = $params['shopId'];
        $shopMachine->save();

        return $this->fractal->item($machine, new MachineTransformer());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $shopMachine = ShopMachine::where('machine_id', $id)->delete();
        $machine = Machine::destroy($id);

        return $this->responseRequestSuccess('Delete Sucesss');
    }

    public function getOptions(Request $request)
    {
        $types = Machine::select('type as text', 'type as value')
                        ->groupBy('type')
                        ->get();

        return $this->fractal->collection($types, new OptionTransformer());
    }

    public function uploadFile(Request $request)
    {
        $userId = auth()->user();
        $errors = Validator::make($request->all(), [
            'machine_id' => 'required',
            'folder' => 'required',
            'file' => 'required|file|max:4000'
        ], [
            'machine_id.required' => 'Machine ID is required.',
            'file.required' => 'File is required.',
        ])->errors();

        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        if (!$request->hasFile('file') || !$request->file('file')->isValid()) {
            return $this->responseRequestError($errors->first(), 404);
        }

        $machine_id = $request->machine_id;
        $folder = $request->folder;
        $file = $request->file('file');
        $ext = $file->extension();
        $name = str_random(20).'.'.$ext ;
        $path = Storage::disk('public')->putFileAs(
            $folder,
            $file,
            $name
        );

        $bill = new Bill;
        $bill->machine_id = $machine_id;
        $bill->user_id = $userId;
        $bill->datetime = $this->transformDateToDateTime();
        $bill->path = $path;
        $bill->save();

        $billMachine = new BillMachine;
        $billMachine->bill_id = $bill->id;
        $billMachine->machine_id = $machine_id;
        $billMachine->save();

        return response()->json(['data' => ['url' => $path]]);
    }

    public function extendExpire(Request $request, $machineId)
    {
        $userId = auth()->user();
        $errors = Validator::make($request->all(), [
            'machine_id' => 'required',
        ], [
            'machine_id.required' => 'Machine ID is required.',
        ])->errors();

        $user = User::findOrFail($userId);
        
        if ($user->role !== User::ROLE_ADMIN) {
            return $this->responseRequestError("Unauthorized", 403);
        }

        $machine = Machine::findOrFail($machineId);

        $expireDate = new Carbon;
        if (!is_null($machine->expire_date)) {
            $expireDate = new Carbon($machine->expire_date);
            $expireDate = $expireDate->addDays(29);
        }

        $machine->expire_date = $this->transformDateToDateTime($machine->expire_date);
        $machine->save();

        return $this->fractal->item($machine, new MachineTransformer());
    }
}
