<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\City;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class ServiceDataTypeTest extends TestCase
{
    /**
     * A basic unit test example.
     */
    public function test_service_attribute_data_type(): void
    {

        $service = Service::find(1);
        $this->assertIsString($service->title);
        $this->assertIsFloat($service->price);
        $this->assertIsInt($service->provider_id);
    }
}
