<?php

namespace App\Library\ReportEngine;

use App\Library\ReportEngine\GlassReportEngine;

use App\Models\Report;
use App\Models\Glass;

use DB;
use PDF;

class GlassReportEngine
{
    const LIMIT_QUERY = 20;

    public static function getReport($report)
    {
        $glass = GlassReportEngine::getGlass();
        $col = [ 'sn', 'user', 'value', 'o3_usage', 'h2_usage'];

        $data = [
          'title' => "Report $report->type",
          'content' => [
            'col' => $col,
            'row' => $glass
          ],
        ];
        
        $filename = $report->id.'_'.$report->type.'_'.$report->datetime;
        $pdf = PDF::loadView('reports.pdf_view', $data);
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"'
        ];

        return response($pdf->download('pdf_view.reports'), 200, $headers);
    }

    public static function getGlass()
    {
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
        )->leftJoin('machine', 'glass.machineID', '=', 'machine.machineID')
        ->orderBy('glass.id', 'desc')
        ->take(GlassReportEngine::LIMIT_QUERY)
        ->get();

        return $glass;
    }
}
