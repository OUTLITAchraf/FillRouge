<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'cleaning', 'display_name' => 'Cleaning'],
            ['name' => 'plumbing', 'display_name' => 'Plumbing'],
            ['name' => 'electricity', 'display_name' => 'Electricity'],
            ['name' => 'painting', 'display_name' => 'Painting'],
            ['name' => 'carpentry', 'display_name' => 'Carpentry'],
            ['name' => 'gardening', 'display_name' => 'Gardening'],
            ['name' => 'moving', 'display_name' => 'Moving'],
            ['name' => 'appliance_repair', 'display_name' => 'Appliance Repair'],
            ['name' => 'babysitting', 'display_name' => 'Babysitting'],
            ['name' => 'tutoring', 'display_name' => 'Tutoring'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
