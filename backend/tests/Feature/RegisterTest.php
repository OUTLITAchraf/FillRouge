<?php

namespace Tests\Feature;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_user_can_register_successfully(): void
    {
        Event::fake();

        Role::create(['name' => 'client']);
        Role::create(['name' => 'provider']);
        Role::create(['name' => 'admin']);

        $data = [
            'name' => 'Khalid Provider',
            'email' => 'khalid@gmail.com',
            'address' => '123 Avenue Mohammed V, Rabat',
            'phone' => '0600800000',
            'status' => 'approved',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'provider',
        ];

        $response = $this->postJson('/api/register', $data);

        Log::info('Response Test Register:', [$response]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'name', 'email', 'status', 'phone'],
                'token'
            ]);
    }
}
