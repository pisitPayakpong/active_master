<?php

namespace App\Library;

class QueryHelper
{
    public static function getSort($data, $columnsMapped)
    {
        $columns = explode(",", $data);

        $columns = collect($columns)->filter(function ($column) use ($columnsMapped) {
            if ($column[0] === '-') {
                return !empty($column) && array_key_exists(substr($column, 1, strlen($column)), $columnsMapped);
            } else {
                return !empty($column) && array_key_exists(substr($column, 0, strlen($column)), $columnsMapped);
            }
        });

        $columns = $columns->map(function ($column) use ($columnsMapped) {
            if ($column[0] === '-') {
                return self::getColumnWithOutParam(substr($column, 1, strlen($column)), $columnsMapped) . ' desc';
            } else {
                return self::getColumnWithOutParam(substr($column, 0, strlen($column)), $columnsMapped) . ' asc';
            }
        });

        return $columns->join(',');
    }

    public static function getColumnWithOutParam($columnWithOut, $columns)
    {
        $data = collect($columns)->filter(function ($value, $key) use ($columnWithOut) {
            return $columnWithOut === $key;
        })->first();

        return $data;
    }

    public static function appendOptionalWhere($query, $optionalKeys, $params, $optionalKeyArray = [])
    {
        foreach ($optionalKeys as $pKey) {
            $pValue = $params[$pKey] ?? null;

            $query->when($pValue, function ($query, $pValue) use ($pKey, $optionalKeyArray) {
                if (in_array($pKey, $optionalKeyArray)) {
                    $pValue = explode(',', $pValue);
                    return $query->whereIn($pKey, $pValue);
                }

                return $query->where($pKey, $pValue);
            });
        }

        return $query;
    }

    public static function appendUpdate($query, $updatedKeys, $params)
    {
        foreach ($updatedKeys as $uKey) {
            if (isset($params[$uKey])) {
                $query->{$uKey} = $params[$uKey];
            }
        }

        return $query;
    }

    public static function appendOptionalWhereOr($query, $columns, $value = null)
    {
        $query->where(function ($subQuery) use ($columns, $value) {
            foreach ($columns as $column) {
                if (!empty($value)) {
                    $subQuery= $subQuery->orWhere($column, 'like', "%$value%");
                }
            }
        });
        
        return $query;
    }
}
