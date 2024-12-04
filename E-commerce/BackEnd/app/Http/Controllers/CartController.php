<?php

namespace App\Http\Controllers;

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api'); // Ensure only authenticated users can access cart actions
    }

    // Add product to cart
    public function addToCart(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Find the product
        $product = Product::find($request->product_id);

        // Check if there is enough stock
        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock available'], 400);
        }

        // Check if the product already exists in the cart
        $cart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($cart) {
            // If product already in cart, increment the quantity
            $cart->quantity += $request->quantity;
            $cart->save();
        } else {
            // If product is not in the cart, create a new entry
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Product added to cart', 'cart' => $cart], 200);
    }

    // View cart
    public function viewCart(Request $request)
    {
        // Retrieve the cart items for the current user
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        // Calculate the total price
        $total = $cartItems->reduce(function ($carry, $item) {
            return $carry + ($item->product->price * $item->quantity);
        }, 0);

        return response()->json(['cart' => $cartItems, 'total_price' => $total], 200);
    }

    // Update cart item quantity
    public function updateCart(Request $request, $cartId)
    {
        // Validate the request data
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Find the cart item
        $cart = Cart::find($cartId);

        // Check if the cart item exists and belongs to the current user
        if (!$cart || $cart->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        // Find the associated product
        $product = $cart->product;

        // Check if there is enough stock for the updated quantity
        if ($product->quantity < $request->quantity) {
            return response()->json(['message' => 'Insufficient stock available'], 400);
        }

        // Update the cart item with the new quantity
        $cart->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Cart updated successfully', 'cart' => $cart], 200);
    }

    // Checkout cart
    public function checkout(Request $request)
    {
        // Retrieve the cart items for the current user
        $cartItems = Cart::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        $total = 0;

        // Begin a database transaction to ensure consistency
        \DB::beginTransaction();

        try {
            // Check stock for each item and process the checkout
            foreach ($cartItems as $item) {
                $product = $item->product;

                // Check if there is enough stock
                if ($product->quantity < $item->quantity) {
                    return response()->json(['message' => "Insufficient stock for product: {$product->name}"], 400);
                }

                // Update the product stock
                $product->update(['quantity' => $product->quantity - $item->quantity]);

                // Calculate the total price
                $total += $product->price * $item->quantity;
            }

            // Commit the transaction
            \DB::commit();

            // Clear the cart after successful checkout
            Cart::where('user_id', $request->user()->id)->delete();

            return response()->json(['message' => 'Checkout successful', 'total_price' => $total], 200);
        } catch (\Exception $e) {
            // Rollback the transaction if any error occurs
            \DB::rollBack();
            return response()->json(['message' => 'An error occurred during checkout. Please try again.'], 500);
        }
    }
}
