<?php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/ascending', [ProductController::class, 'AscendingByPrice'])->name('products.ascending');
    Route::get('products/descending', [ProductController::class, 'DescendingByPrice'])->name('products.descending');
    Route::get('products/category/{category}', [ProductController::class, 'ProductsByCategory'])->name('products.byCategory');
    Route::get('products/categories', [ProductController::class, 'getCategories'])->name('products.categories');
    Route::get('products/search', [ProductController::class, 'search'])->name('products.search');

    // Cart routes
    Route::post('cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::get('cart', [CartController::class, 'viewCart'])->name('cart.view');
    Route::put('cart/{cartId}', [CartController::class, 'updateCart'])->name('cart.update');
    Route::post('cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

    // Admin-specific routes
    Route::post('product', [ProductController::class, 'store'])->name('product.store');
    Route::put('product/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('product/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::get('product/{product}', [ProductController::class, 'show'])->name('product.show'); // Added GET route

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user.profile');
});
