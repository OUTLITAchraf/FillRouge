<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\City;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ServiceCreateTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_create_service_successfully(): void
    {

        Mail::fake();
        Event::fake();

        $provider = User::find(2);
        $city = City::factory()->create();
        $category = Category::factory()->create();

        $image = UploadedFile::fake()->image('service.jpg');
        
        $service = [
            'title' => 'test title 2',
            'description' => 'test description 2',
            'price' => 670.00,
            'category_id' => $category->id,
            'city_id' => $city->id,
            'image' => $image
        ];
        $response = $this->actingAs($provider)->postJson('/api/create-service', $service);

        Log::info('Response Test Create Service:', [$response]);

        $response->assertStatus(201);
    }
}
