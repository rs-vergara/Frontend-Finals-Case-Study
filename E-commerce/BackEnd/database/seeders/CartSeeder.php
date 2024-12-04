<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run()
    {
        // Get the regular user
        $user = User::where('email', 'user@example.com')->first(); // Make sure the regular user exists
        
        // Check if the user exists
        if ($user) {
            // Get a few products to add to the cart
            $products = Product::take(5)->get(); // Take 5 random products for this example
            
            // Loop through the products and add them to the user's cart
            foreach ($products as $product) {
                Cart::create([
                    'user_id' => $user->id,         // Link cart to the regular user
                    'product_id' => $product->id,   // Link to the specific product
                    'quantity' => rand(1, 3),       // Random quantity between 1 and 3
                ]);
            }
        } else {
            echo "User not found.\n";
        }
    }
}
