<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class GetServicesTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_get_services_successfully(): void
    {
        $response = $this->get('/api/services');

        Log::info('Response Test Get Services:',[$response]);

        $response->assertStatus(200)->assertJsonStructure([
            'message',
            'services'
        ]);
    }
}
