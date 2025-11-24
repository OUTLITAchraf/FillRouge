<?php

namespace Tests\Unit;

use App\Models\Service;
use PHPUnit\Framework\TestCase;

class ServiceModelFillableTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_service_model_fillable(): void
    {
        $service = new Service();
        $expectedFillable = ['title', 'description', 'price', 'status', 'image', 'category_id', 'city_id', 'provider_id'];
        $this->assertEquals($expectedFillable, $service->getFillable(), 'The fillable attributes of Service model are not correct');
    }
}
