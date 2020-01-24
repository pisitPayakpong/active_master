<?php

namespace App\Transformer;

use League\Fractal\TransformerAbstract;
use App\Models\Report;

class ReportTransformer extends TransformerAbstract
{
    public function transform(Report $report)
    {
        return [
          'id'    => $report->id,
          'type'  => $report->type,
          'datetime'  => $report->datetime,
        ];
    }
}
