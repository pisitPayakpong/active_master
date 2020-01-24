<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Response\FractalResponse;

use App\Library\ReportEngine\ReportEngineFactory;
use App\Library\QueryHelper;
use App\Models\Report;
use App\Models\User;
use App\Transformer\ReportTransformer;
use App\Http\Traits\TraitsHelper;

use Validator;
use PDF;

class ReportController extends Controller
{
    use TraitsHelper;
    const LIMIT_PER_PAGE = 10;
    const PAGE = 1;
    
    const MAPPED_COLUMN_WITH_PARAM = [
        'id' => 'id',
        'type' => 'type',
        'datetime' => 'datetime',
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
        $userId = auth()->user();
        $user = User::findOrFail($userId);
                    
        $report = Report::select($column);

        if (isset($params['sort'])) {
            $query = QueryHelper::getSort($params['sort'], self::MAPPED_COLUMN_WITH_PARAM);

            if (!empty($query)) {
                $report->orderByRaw($query);
            } else {
                $report->orderBy('id', 'desc');
            }
        } else {
            $report->orderBy('id', 'desc');
        }

        $report = $report->paginate($limit, $column, null, $page);
        return $this->fractal->collection($report, new ReportTransformer);
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

    public function downloadPdf(Request $request)
    {
        $params = $request->all();
        $errors = Validator::make($params, [
            'id' => 'required',
        ], [
            'id.required' => 'ID is required.',

        ])->errors();


        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $report = Report::findOrFail($params['id']);

        // This  $data array will be passed to our PDF blade
        $data = [
          'title' => "$report->id Type $report->type",
          'heading' => "Hello from $report->datetime",
          'content' => "$report->type"
        ];
        
        $filename = $report->id.'_'.$report->type.'_'.$report->datetime;
        $pdf = PDF::loadView('reports.pdf_view', $data);
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"'
        ];

        return response($pdf->download('pdf_view.reports'), 200, $headers);
    }


    public function downloadPdfV2(Request $request)
    {
        $params = $request->all();
        $errors = Validator::make($params, [
            'id' => 'required',
        ], [
            'id.required' => 'ID is required.',

        ])->errors();


        if ($errors->isNotEmpty()) {
            return $this->responseRequestError($errors->first(), 422);
        }

        $report = Report::findOrFail($params['id']);
        $reportEngine = new ReportEngineFactory();
        $reportEngine = $reportEngine->create($report);

        return $reportEngine->getReport($report);
    }
}
