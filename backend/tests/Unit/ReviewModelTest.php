<?php

namespace Tests\Unit;

use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Tests\TestCase;

class ReviewModelTest extends TestCase
{
    
    public function test_review_belongs_to_service(): void
    {
        $review = Review::factory()->create();
        $this->assertInstanceOf(Service::class, $review->service);
        $this->assertNotNull($review->service_id);
    }
    
    public function test_review_belongs_to_client(): void
    {
        $review = Review::factory()->create();
        $this->assertInstanceOf(User::class, $review->client);
        $this->assertNotNull($review->client_id);
    }
}
