<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Response\FractalResponse;

use App\Library\QueryHelper;
use App\Models\Machine;
use App\Transformer\MachineTransformer;
use App\Transformer\OptionTransformer;

use DB;

class MachineController extends Controller
{
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
        
        $machine = Machine::select('*');

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
        //
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

    public function getOptions(Request $request)
    {
        $types = Machine::select('type as text', 'type as value')
                        ->groupBy('type')
                        ->get();

        return $this->fractal->collection($types, new OptionTransformer());
    }
}
