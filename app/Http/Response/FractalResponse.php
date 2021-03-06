<?php

namespace App\Http\Response;

use League\Fractal\Manager;
use League\Fractal\Resource\Item;
use League\Fractal\Resource\Collection;
use League\Fractal\TransformerAbstract;
use League\Fractal\Resource\ResourceInterface;
use League\Fractal\Serializer\SerializerAbstract;
use League\Fractal\Pagination\IlluminatePaginatorAdapter;
use Illuminate\Http\Request;

class FractalResponse
{
    /**
    * @var Manager
    */
    private $manager;

    /**
    * @var SerializerAbstract
    */
    private $serializer;

    public function __construct(Manager $manager, SerializerAbstract $serializer)
    {
        $this->manager = $manager;
        $this->serializer = $serializer;
        $this->manager->setSerializer($serializer);
    }

    public function item($data, TransformerAbstract $transformer, $resourceKey = null)
    {
        return $this->createDataArray(
            new Item($data, $transformer, $resourceKey)
        );
    }

    public function collection($data, TransformerAbstract $transformer, $resourceKey = null)
    {
        if ($data instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            return $this->pagination($data, $transformer, $resourceKey);
        }

        return $this->createDataArray(
            new Collection($data, $transformer, $resourceKey)
        );
    }

    public function pagination($data, TransformerAbstract $transformer, $resourceKey = null)
    {
        $collection = new Collection($data, $transformer, $resourceKey);

        return $this->createDataArray(
            $collection->setPaginator(new IlluminatePaginatorAdapter($data))
        );
    }

    private function createDataArray(ResourceInterface $resource)
    {
        return $this->manager->createData($resource)->toArray();
    }
}
