<?php

namespace App\Library\ReportEngine;

use App\Library\ReportEngine\GlassReportEngine;

class ReportEngineFactory
{
    const REPORT_TYPE_GLASS = 'glass';

    public static function create($report)
    {
        $type = $report->type;

        switch ($type) {
        case ReportEngineFactory::REPORT_TYPE_GLASS:
          return new GlassReportEngine($report);

        default:
          return new GlassReportEngine($report);
      }
    }
}
