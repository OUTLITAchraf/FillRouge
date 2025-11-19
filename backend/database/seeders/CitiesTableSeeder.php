<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            'Casablanca',
            'Rabat',
            'Fès',
            'Marrakech',
            'Tanger',
            'Agadir',
            'Meknès',
            'Oujda',
            'Kenitra',
            'Tetouan',
            'Safi',
            'Mohammedia',
            'El Jadida',
            'Béni Mellal',
            'Nador',
            'Taza',
            'Khouribga',
            'Settat',
            'Larache',
            'Ksar El Kebir',
            'Dakhla',
            'Laayoune',
            'Errachidia',
            'Ouarzazate',
            'Tan-Tan',
            'Tiznit',
            'Chefchaouen',
            'Al Hoceima',
            'Guelmim',
            'Taourirt',
            'Berkane'
        ];

        foreach ($cities as $city) {
            City::create(['name' => $city]);
        }
    }
}
