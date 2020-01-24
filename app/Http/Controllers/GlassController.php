<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Response\FractalResponse;
use App\Http\Traits\TraitsHelper;

use App\Library\QueryHelper;
use App\Models\Glass;
use App\Transformer\GlassTransformer;

use Carbon\Carbon;
use DB;

class GlassController extends Controller
{
    use TraitsHelper;
    const LIMIT_PER_PAGE = 10;
    const PAGE = 1;

    const MAPPED_COLUMN_WITH_PARAM = [
        'id' => 'glass.id',
        'sn' => 'sn',
        'user' => 'glass_user',
        'price' => 'value',
        'date' => 'create_time',
        'create_time' => 'date',
        'o3_usage' => 'o3_usage',
        'h2_usage' => 'h2_usage'
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
        
        // warring heavy query
        $queryCreateTime = DB::raw(
            "IF(machine.type = 'NAMM', glass.create_time, glass.start_datetime) as create_time"
        );

        $queryO3 = DB::raw(
            "IF(machine.type = 'NAMM', TIMESTAMPDIFF(SECOND, STR_TO_DATE(start_rinse, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(end_rinse, '%Y-%m-%dT%H:%i:%sZ')), TIMESTAMPDIFF(SECOND,start_datetime, stop_datetime)) AS o3_usage"
        );

        $queryH2 = DB::raw(
            "TIMESTAMPDIFF(SECOND, STR_TO_DATE(start_fill, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(end_fill, '%Y-%m-%dT%H:%i:%sZ')) AS h2_usage"
        );

        $glass = Glass::select(
            '*',
            'glass.id',
            'machine.id as machine_id',
            'machine.user as machine_user',
            'glass.user as glass_user',
            $queryCreateTime,
            $queryO3,
            $queryH2
        )->leftJoin('machine', 'glass.machineID', '=', 'machine.machineID');

        if (isset($params['sort'])) {
            $query = QueryHelper::getSort($params['sort'], self::MAPPED_COLUMN_WITH_PARAM);

            if (!empty($query)) {
                $glass->orderByRaw($query);
            } else {
                $glass->orderBy('glass.id', 'desc');
            }
        } else {
            $glass->orderBy('glass.id', 'desc');
        }

        $glass = $glass->paginate($limit, $column, null, $page);

        return $this->fractal->collection($glass, new GlassTransformer());
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

    public function calculateTotalUsage()
    {
        $query = DB::raw(
            "SELECT count(*) AS glass_count, SUM(TB.time_usage) as sum_time_usage, SUM(TB.o3_usage) as sum_o3_usage, SUM(TB.h2_usage) as sum_h2_usage, SUM(TB.pirce) as sum_price
            FROM (SELECT  G.id
            ,TIMESTAMPDIFF(SECOND, STR_TO_DATE(create_time, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(finish_time, '%Y-%m-%dT%H:%i:%sZ')) AS time_usage
            ,TIMESTAMPDIFF(SECOND, STR_TO_DATE(start_rinse, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(end_rinse, '%Y-%m-%dT%H:%i:%sZ')) AS o3_usage
            ,TIMESTAMPDIFF(SECOND, STR_TO_DATE(start_fill, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(end_fill, '%Y-%m-%dT%H:%i:%sZ')) AS h2_usage,
            value as pirce
            FROM glass as G
            WHERE create_time <> '' AND finish_time <> '' 
            AND start_rinse <> '' AND end_rinse <> ''
            AND start_fill <> '' AND end_fill <> ''
            ) as TB"
        );

        $result = DB::select($query);
        $result = array_get($result, '0');

        return response()->json(['data' => [
                'glass' => $result->glass_count,
                'o3' => $result->sum_o3_usage,
                'h2' => $result->sum_h2_usage,
                'price' => $result->sum_price
            ]
        ]);
    }

    public function getH2()
    {
        $query = DB::raw("SELECT  G.id
        ,TIMESTAMPDIFF(SECOND, STR_TO_DATE(start_fill, '%Y-%m-%dT%H:%i:%sZ'), STR_TO_DATE(end_fill, '%Y-%m-%dT%H:%i:%sZ')) AS h2_usage,
        DATE_FORMAT( G.end_fill, '%Y-%m-%d') as datetime
        FROM glass as G
        WHERE create_time <> '' AND finish_time <> ''
        AND start_rinse <> '' AND end_rinse <> ''
        AND start_fill <> '' AND end_fill <> ''
        ");

        $result = DB::select($query);

        return collect($result)->map(function ($row) {
            $row->datetime = $this->transformDateToDateTime($row->datetime);
            return $row;
        })->groupBy('datetime');
    }

    public function removeStdClass($result)
    {
        return json_decode(json_encode(array_get($result, '0')), true);
    }
}
